import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Normalize API Error structure based on backend envelope
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export const normalizeApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data) {
      if (typeof data === 'string') {
        return { message: data };
      }
      if (data.message) {
        return { message: data.message, code: data.code, details: data.details };
      }
      if (data.error) {
        return {
          message: typeof data.error === 'string' ? data.error : (data.error.message || 'An unexpected error occurred.'),
          code: data.error.code,
          details: data.error.details,
        };
      }
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        return {
          message: data.errors.map((e: any) => e.msg || e.message).filter(Boolean).join(', ') || 'Validation error',
          details: data.errors,
        };
      }
    }
    return { message: error.message || 'Network error occurred.' };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: 'An unknown error occurred.' };
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true, // sends the HttpOnly session cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach tenant ID or bearer token if present
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('access_token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const tenantId = localStorage.getItem('tenant_id');
  if (tenantId && !config.headers['X-Tenant-ID']) {
    config.headers['X-Tenant-ID'] = tenantId;
  }

  return config;
});

// Response interceptor: silent token refresh and error handling
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!originalRequest) {
      return Promise.reject(normalizeApiError(error));
    }

    const isAuthRoute =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/signup') ||
      originalRequest.url?.includes('/auth/logout');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(normalizeApiError(err)));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/auth/refresh');
        processQueue();
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr);
        localStorage.removeItem('access_token');
        localStorage.removeItem('tenant_id');
        // Only redirect if not already on login/auth page
        if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/signup')) {
          window.location.href = '/login';
        }
        return Promise.reject(normalizeApiError(refreshErr));
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 403) {
      // Do not redirect if already on /403
      if (window.location.pathname !== '/403') {
        window.location.href = '/403';
      }
    }

    return Promise.reject(normalizeApiError(error));
  }
);

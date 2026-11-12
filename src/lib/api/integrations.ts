import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
});

// Interceptor to add Tenant ID and Auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  const tenantId = localStorage.getItem('tenant_id'); // From Multi-tenant architecture
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (tenantId) {
    config.headers['X-Tenant-ID'] = tenantId;
  }
  return config;
});

/**
 * 7. Integration Requirements
 */

export const IntegrationsAPI = {
  // WhatsApp Business API
  sendWhatsAppMessage: async (payload: { phone: string; template: string; params: any }) => {
    return api.post('/integrations/whatsapp/send', payload);
  },

  // Payment Gateway (Razorpay/Stripe)
  createPaymentIntent: async (payload: { amount: number; currency: string; purpose: string; studentId: string }) => {
    return api.post('/integrations/payments/intent', payload);
  },
  
  verifyPayment: async (transactionId: string) => {
    return api.get(`/integrations/payments/verify/${transactionId}`);
  },

  // Biometric / RFID Devices
  syncAttendanceLog: async (deviceId: string, since: string) => {
    return api.get(`/integrations/attendance/sync`, { params: { deviceId, since } });
  },

  // GPS / Vehicle Tracking (Poll current location)
  getVehicleLocation: async (vehicleId: string) => {
    return api.get(`/integrations/gps/location/${vehicleId}`);
  },

  // Google Classroom Sync
  syncGoogleClassroom: async (classId: string) => {
    return api.post(`/integrations/google-classroom/sync/${classId}`);
  },

  // Zoom / MS Teams Meetings
  scheduleVirtualMeeting: async (payload: { title: string; startTime: string; duration: number; platform: 'zoom' | 'teams' }) => {
    return api.post(`/integrations/meetings/schedule`, payload);
  },
};

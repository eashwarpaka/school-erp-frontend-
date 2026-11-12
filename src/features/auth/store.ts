import { create } from 'zustand';

export interface BackendUser {
  id: string;
  email: string;
  role: string;
  roles: string[];
  firstName?: string;
  lastName?: string;
  fullName?: string;
  avatarUrl?: string | null;
  tenantId: string;
}

export interface BackendSchool {
  code: string;
  tenantId: string;
  name: string;
}

export interface Session {
  orgcode: number;
  branchCode?: number;
  userScd: string;
  roles: string[];
  accessCodes: number[];
  id?: string;
  email?: string;
  fullName?: string;
  tenantId?: string;
}

interface AuthState {
  user: BackendUser | null;
  school: BackendSchool | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  setUserSession: (user: BackendUser | null, school?: BackendSchool | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  school: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,

  setSession: (session) =>
    set({
      session,
      isAuthenticated: !!session,
      isLoading: false,
    }),

  setUserSession: (user, school = null) => {
    if (!user) {
      set({ user: null, school: null, session: null, isAuthenticated: false, isLoading: false });
      return;
    }

    const roles = Array.isArray(user.roles) && user.roles.length > 0
      ? user.roles
      : [user.role || 'school_admin'];

    const session: Session = {
      orgcode: Number(user.tenantId) || 1,
      branchCode: 1,
      userScd: user.email || user.fullName || 'User',
      roles,
      accessCodes: [1, 2, 3, 101, 102, 103],
      id: String(user.id),
      email: user.email,
      fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      tenantId: String(user.tenantId),
    };

    if (user.tenantId) {
      localStorage.setItem('tenant_id', String(user.tenantId));
    }

    set({
      user,
      school,
      session,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    localStorage.removeItem('access_token');
    localStorage.removeItem('tenant_id');
    set({
      user: null,
      school: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));

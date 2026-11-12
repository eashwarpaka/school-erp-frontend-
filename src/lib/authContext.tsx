import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Role } from './permissions';

interface AuthContextType {
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  tenantId: string | null;
  setTenantId: (tenantId: string | null) => void;
  mfaVerified: boolean;
  setMfaVerified: (status: boolean) => void;
  mfaRequired: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [activeRole, setActiveRole] = useState<Role>('super_admin');
  const [tenantId, setTenantId] = useState<string | null>('default-tenant');
  const [mfaVerified, setMfaVerified] = useState<boolean>(false);

  // Define roles that require MFA according to requirements
  const mfaRequiredRoles: Role[] = ['super_admin', 'school_admin', 'accountant', 'hr_manager'];
  const mfaRequired = mfaRequiredRoles.includes(activeRole);

  return (
    <AuthContext.Provider value={{ 
      activeRole, 
      setActiveRole,
      tenantId,
      setTenantId,
      mfaVerified,
      setMfaVerified,
      mfaRequired
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store';
import { Loader2 } from 'lucide-react';

interface RoleGateProps {
  requiredAccessCode?: number;
  requiredRoles?: string[];
}

export const RoleGate: React.FC<React.PropsWithChildren<RoleGateProps>> = ({
  children,
  requiredAccessCode,
  requiredRoles,
}) => {
  const { session, isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Verifying authentication…</p>
      </div>
    );
  }

  if (!isAuthenticated || !session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check required access code
  if (requiredAccessCode && !session.accessCodes.includes(requiredAccessCode)) {
    return <Navigate to="/403" replace />;
  }

  // Check required roles (at least one matching)
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRole = session.roles.some((role) => requiredRoles.includes(role));
    if (!hasRole) {
      return <Navigate to="/403" replace />;
    }
  }

  return <>{children ? children : <Outlet />}</>;
};

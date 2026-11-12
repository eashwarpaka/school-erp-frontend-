import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { AuthProvider } from './lib/authContext';
import { AppProviders } from './app/providers';
import { useAuthStore } from './features/auth/store';
import { api } from './lib/axios';
import './styles/index.css';

function AppRoot() {
  const setUserSession = useAuthStore((s) => s.setUserSession);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    // Attempt session hydration on startup from HttpOnly cookie or stored token
    api
      .get('/auth/me')
      .then((res) => {
        if (res.data?.success && res.data.user) {
          setUserSession(res.data.user, res.data.school);
        } else {
          logout();
        }
      })
      .catch(() => {
        logout();
      });
  }, [setUserSession, logout]);

  return (
    <AuthProvider>
      <AppProviders>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </AppProviders>
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>
);

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// ============================================================
// Tenant Context — Multi-tenant SaaS School Branding
// ============================================================

export interface SchoolBranding {
  schoolName: string;
  schoolCode: string;
  logoUrl?: string;
  primaryColor: string;       // CSS hex / HSL
  secondaryColor: string;
  tagline?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  timezone: string;
  currency: string;
  currencySymbol: string;
  locale: string;
  academicYearPattern: 'April-March' | 'June-May' | 'September-August' | 'January-December';
  enabledModules: string[];   // Which modules the school has licensed
}

export interface TenantContextValue {
  tenant: SchoolBranding | null;
  isLoading: boolean;
  setTenant: (tenant: SchoolBranding) => void;
  isModuleEnabled: (module: string) => boolean;
}

// ────────────────────────────────────────────────────────────
// Default Branding (fallback while loading or for dev)
// ────────────────────────────────────────────────────────────
export const DEFAULT_BRANDING: SchoolBranding = {
  schoolName: 'Smart School ERP',
  schoolCode: 'DEMO',
  primaryColor: '#f59e0b',      // amber-500
  secondaryColor: '#1e293b',    // slate-800
  tagline: 'Empowering Education Through Technology',
  timezone: 'Asia/Kolkata',
  currency: 'INR',
  currencySymbol: '₹',
  locale: 'en-IN',
  academicYearPattern: 'April-March',
  enabledModules: [
    'dashboard', 'school_admin', 'students', 'parents',
    'academics', 'exams', 'timetable', 'hr', 'payroll',
    'attendance', 'admissions', 'finance', 'communication',
    'transport', 'library', 'inventory', 'hostel',
    'reports', 'ai_hub', 'security', 'audit_log',
  ],
};

// ────────────────────────────────────────────────────────────
// Context
// ────────────────────────────────────────────────────────────
const TenantContext = createContext<TenantContextValue>({
  tenant: DEFAULT_BRANDING,
  isLoading: false,
  setTenant: () => {},
  isModuleEnabled: () => true,
});

// ────────────────────────────────────────────────────────────
// Provider
// ────────────────────────────────────────────────────────────
interface TenantProviderProps {
  children: ReactNode;
}

/**
 * Resolves the tenant from:
 * 1. Subdomain (e.g., stmary.schoolerp.com → schoolCode = 'stmary')
 * 2. localStorage cache (TTL: 1 hour)
 * 3. API fetch /api/tenant/resolve?code={schoolCode}
 * 4. Falls back to DEFAULT_BRANDING for dev/demo
 */
export function TenantProvider({ children }: TenantProviderProps) {
  const [tenant, setTenantState] = useState<SchoolBranding | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resolveTenant = async () => {
      try {
        // Step 1: Detect school code from subdomain
        const hostname = window.location.hostname;
        const parts = hostname.split('.');
        const schoolCode = parts.length >= 3 ? parts[0].toUpperCase() : null;

        // Step 2: Check localStorage cache (1 hour TTL)
        const cacheKey = `tenant_${schoolCode ?? 'DEFAULT'}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { data, expiry } = JSON.parse(cached);
          if (Date.now() < expiry) {
            setTenantState(data);
            setIsLoading(false);
            applyBrandingToDOM(data);
            return;
          }
        }

        // Step 3: In production, fetch from API
        // const response = await fetch(`/api/tenant/resolve?code=${schoolCode}`);
        // const data = await response.json();

        // Step 4: Fallback to default branding (development / demo)
        const resolved = {
          ...DEFAULT_BRANDING,
          ...(schoolCode && schoolCode !== 'LOCALHOST' && schoolCode !== 'WWW'
            ? { schoolCode }
            : {}),
        };

        // Cache for 1 hour
        localStorage.setItem(cacheKey, JSON.stringify({
          data: resolved,
          expiry: Date.now() + 60 * 60 * 1000,
        }));

        setTenantState(resolved);
        applyBrandingToDOM(resolved);
      } catch (error) {
        console.warn('[TenantProvider] Failed to resolve tenant, using default:', error);
        setTenantState(DEFAULT_BRANDING);
        applyBrandingToDOM(DEFAULT_BRANDING);
      } finally {
        setIsLoading(false);
      }
    };

    resolveTenant();
  }, []);

  const setTenant = (newTenant: SchoolBranding) => {
    setTenantState(newTenant);
    applyBrandingToDOM(newTenant);
  };

  const isModuleEnabled = (module: string): boolean => {
    if (!tenant) return true; // Allow all during loading
    return tenant.enabledModules.includes(module);
  };

  return (
    <TenantContext.Provider value={{ tenant, isLoading, setTenant, isModuleEnabled }}>
      {children}
    </TenantContext.Provider>
  );
}

// ────────────────────────────────────────────────────────────
// DOM Branding Application
// ────────────────────────────────────────────────────────────
function applyBrandingToDOM(branding: SchoolBranding) {
  const root = document.documentElement;

  // Apply CSS custom properties for dynamic theming
  root.style.setProperty('--tenant-primary', branding.primaryColor);
  root.style.setProperty('--tenant-secondary', branding.secondaryColor);

  // Update page title
  document.title = `${branding.schoolName} — ERP`;

  // Update favicon if provided
  if (branding.logoUrl) {
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon) favicon.href = branding.logoUrl;
  }
}

// ────────────────────────────────────────────────────────────
// Hook
// ────────────────────────────────────────────────────────────
export function useTenant(): TenantContextValue {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used within a TenantProvider');
  return ctx;
}

/**
 * Format a currency amount using the tenant's locale and currency.
 */
export function useCurrencyFormatter() {
  const { tenant } = useTenant();
  return (amount: number): string => {
    const locale = tenant?.locale ?? 'en-IN';
    const currency = tenant?.currency ?? 'INR';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };
}

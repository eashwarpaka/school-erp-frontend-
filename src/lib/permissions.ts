// ============================================================
// Enterprise RBAC Permission Matrix
// Smart School ERP — Role × Module × Action definitions
// ============================================================

export type Role = 
  | 'super_admin'     // SaaS platform owner (cross-tenant)
  | 'school_admin'    // School principal / management
  | 'accountant'      // Finance officer
  | 'hr_manager'      // HR department
  | 'teacher'         // Teaching staff
  | 'librarian'       // Library staff
  | 'hostel_warden'   // Hostel warden
  | 'transport_manager' // Transport coordinator
  | 'parent'          // Parent / guardian
  | 'student';        // Student

export type Module =
  | 'dashboard'
  | 'school_admin'
  | 'students'
  | 'parents'
  | 'academics'
  | 'exams'
  | 'timetable'
  | 'hr'
  | 'payroll'
  | 'attendance'
  | 'admissions'
  | 'finance'
  | 'communication'
  | 'transport'
  | 'library'
  | 'inventory'
  | 'hostel'
  | 'reports'
  | 'ai_hub'
  | 'agents'
  | 'security'
  | 'audit_log';

export type Action = 'view' | 'create' | 'edit' | 'delete' | 'export' | 'approve';

export type PermissionSet = Partial<Record<Action, boolean>>;
export type ModulePermissions = Partial<Record<Module, PermissionSet>>;
export type PermissionMatrix = Record<Role, ModulePermissions>;

// ────────────────────────────────────────────────────────────
// Permission Matrix Definition
// ────────────────────────────────────────────────────────────
export const PERMISSION_MATRIX: PermissionMatrix = {
  super_admin: {
    dashboard: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    school_admin: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    students: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    parents: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    academics: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    exams: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    timetable: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    hr: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    payroll: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    attendance: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    admissions: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    finance: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    communication: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    transport: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    library: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    inventory: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    hostel: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    reports: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    ai_hub: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    security: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    audit_log: { view: true, export: true },
  },
  school_admin: {
    dashboard: { view: true, export: true },
    school_admin: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    students: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    parents: { view: true, create: true, edit: true, delete: true, export: true },
    academics: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    exams: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    timetable: { view: true, create: true, edit: true, delete: true, export: true },
    hr: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    payroll: { view: true, approve: true, export: true },
    attendance: { view: true, edit: true, export: true, approve: true },
    admissions: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    finance: { view: true, create: true, edit: true, export: true, approve: true },
    communication: { view: true, create: true, edit: true, delete: true, export: true },
    transport: { view: true, create: true, edit: true, delete: true, export: true },
    library: { view: true, create: true, edit: true, delete: true, export: true },
    inventory: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    hostel: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    reports: { view: true, export: true },
    ai_hub: { view: true, create: true },
    security: { view: true, create: true, edit: true, delete: true },
    audit_log: { view: true, export: true },
  },
  accountant: {
    dashboard: { view: true },
    students: { view: true },
    finance: { view: true, create: true, edit: true, export: true },
    payroll: { view: true, create: true, edit: true, export: true },
    reports: { view: true, export: true },
    communication: { view: true },
    inventory: { view: true, create: true, edit: true },
    ai_hub: { view: true },
  },
  hr_manager: {
    dashboard: { view: true },
    hr: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    payroll: { view: true, create: true, edit: true, export: true, approve: true },
    attendance: { view: true, create: true, edit: true, export: true, approve: true },
    students: { view: true },
    communication: { view: true, create: true },
    reports: { view: true, export: true },
    ai_hub: { view: true },
  },
  teacher: {
    dashboard: { view: true },
    students: { view: true },
    parents: { view: true },
    academics: { view: true, create: true, edit: true },
    exams: { view: true, create: true, edit: true },
    timetable: { view: true },
    attendance: { view: true, create: true, edit: true },
    communication: { view: true, create: true },
    library: { view: true },
    reports: { view: true },
    ai_hub: { view: true, create: true },
  },
  librarian: {
    dashboard: { view: true },
    library: { view: true, create: true, edit: true, delete: true, export: true },
    students: { view: true },
    reports: { view: true },
  },
  hostel_warden: {
    dashboard: { view: true },
    hostel: { view: true, create: true, edit: true, delete: true, export: true },
    students: { view: true },
    communication: { view: true, create: true },
    reports: { view: true },
  },
  transport_manager: {
    dashboard: { view: true },
    transport: { view: true, create: true, edit: true, delete: true, export: true },
    students: { view: true },
    reports: { view: true },
    communication: { view: true, create: true },
  },
  parent: {
    dashboard: { view: true },
    students: { view: true },
    academics: { view: true },
    exams: { view: true },
    timetable: { view: true },
    attendance: { view: true },
    finance: { view: true },
    communication: { view: true, create: true },
    transport: { view: true },
    library: { view: true },
    reports: { view: true },
  },
  student: {
    dashboard: { view: true },
    academics: { view: true },
    exams: { view: true },
    timetable: { view: true },
    attendance: { view: true },
    communication: { view: true },
    library: { view: true },
  },
};

// ────────────────────────────────────────────────────────────
// Permission Check Helpers
// ────────────────────────────────────────────────────────────

/**
 * Check if a role has a specific action permission for a module.
 */
export function hasPermission(
  roles: Role[],
  module: Module,
  action: Action
): boolean {
  return roles.some(role => {
    const modulePerms = PERMISSION_MATRIX[role]?.[module];
    return modulePerms?.[action] === true;
  });
}

/**
 * Get all permitted actions for a role on a module.
 */
export function getModulePermissions(
  roles: Role[],
  module: Module
): PermissionSet {
  const merged: PermissionSet = {};
  for (const role of roles) {
    const perms = PERMISSION_MATRIX[role]?.[module] ?? {};
    for (const [action, allowed] of Object.entries(perms) as [Action, boolean][]) {
      if (allowed) merged[action] = true;
    }
  }
  return merged;
}

/**
 * Get the list of all modules a set of roles can access (view permission).
 */
export function getAccessibleModules(roles: Role[]): Module[] {
  const moduleSet = new Set<Module>();
  for (const role of roles) {
    const rolePerms = PERMISSION_MATRIX[role] ?? {};
    for (const [module, perms] of Object.entries(rolePerms) as [Module, PermissionSet][]) {
      if (perms.view) moduleSet.add(module);
    }
  }
  return Array.from(moduleSet);
}

/**
 * Map legacy string roles from the auth store to typed Role enum.
 * Handles the orgcode-based session from the existing auth store.
 */
export function resolveRoles(sessionRoles: string[]): Role[] {
  const roleMap: Record<string, Role> = {
    admin: 'school_admin',
    school_admin: 'school_admin',
    super_admin: 'super_admin',
    teacher: 'teacher',
    accountant: 'accountant',
    hr: 'hr_manager',
    hr_manager: 'hr_manager',
    librarian: 'librarian',
    warden: 'hostel_warden',
    hostel_warden: 'hostel_warden',
    transport: 'transport_manager',
    transport_manager: 'transport_manager',
    parent: 'parent',
    student: 'student',
  };

  const resolved = sessionRoles
    .map(r => roleMap[r.toLowerCase()])
    .filter((r): r is Role => !!r);

  // Default to school_admin if no recognized roles (preserves existing behavior)
  return resolved.length > 0 ? resolved : ['school_admin'];
}

// ────────────────────────────────────────────────────────────
// Role Display Metadata
// ────────────────────────────────────────────────────────────
export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Administrator',
  school_admin: 'School Administrator',
  accountant: 'Accountant',
  hr_manager: 'HR Manager',
  teacher: 'Teacher',
  librarian: 'Librarian',
  hostel_warden: 'Hostel Warden',
  transport_manager: 'Transport Manager',
  parent: 'Parent / Guardian',
  student: 'Student',
};

export const ROLE_COLORS: Record<Role, string> = {
  super_admin: 'bg-purple-100 text-purple-700',
  school_admin: 'bg-amber-100 text-amber-700',
  accountant: 'bg-green-100 text-green-700',
  hr_manager: 'bg-blue-100 text-blue-700',
  teacher: 'bg-cyan-100 text-cyan-700',
  librarian: 'bg-rose-100 text-rose-700',
  hostel_warden: 'bg-orange-100 text-orange-700',
  transport_manager: 'bg-teal-100 text-teal-700',
  parent: 'bg-indigo-100 text-indigo-700',
  student: 'bg-slate-100 text-slate-700',
};

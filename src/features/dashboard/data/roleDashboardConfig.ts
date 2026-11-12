// ============================================================
// Role Dashboard Configuration
// Per-role KPIs, chart data, activities & quick-actions
// Demo-quality data for client/investor presentations
// ============================================================

import {
  Building2, Activity, Ticket, DollarSign,
  Users, GraduationCap, Coins, BookOpen,
  Briefcase, CalendarDays, ClipboardList, Banknote,
  Clock, FileEdit, Trophy, TrendingUp,
  BookOpenCheck, AlertCircle, CheckCircle,
  Bus, Navigation, Home, AlertTriangle,
  Baby, CreditCard, Bell, Target, Award,
  BarChart3, FileText, Fingerprint, Star,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Role } from '../../../lib/permissions';

// ── Types ────────────────────────────────────────────────────
export interface KpiCard {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  detail?: string;
}

export interface ChartDataPoint {
  name: string;
  primary: number;
  secondary?: number;
  tertiary?: number;
}

export interface ActivityItem {
  id: number;
  text: string;
  time: string;
  type: 'success' | 'warning' | 'info' | 'danger';
}

export interface QuickAction {
  label: string;
  path: string;
  variant: 'primary' | 'secondary';
  icon: LucideIcon;
}

export interface ScheduleItem {
  time: string;
  title: string;
  subtitle: string;
  color: string;  // Tailwind color class e.g. 'bg-blue-500'
}

export interface SummaryStatItem {
  label: string;
  value: number;
  color: string;  // hex color for donut segment
}

export interface RoleDashboardConfig {
  role: Role;
  dashboardTitle: string;
  sidebarLabel: string;
  subtitle: string;
  accentColor: string;       // Tailwind color token e.g. 'amber'
  kpis: KpiCard[];
  chartTitle: string;
  chartPrimaryLabel: string;
  chartSecondaryLabel?: string;
  chartData: ChartDataPoint[];
  activities: ActivityItem[];
  quickActions: QuickAction[];
  todaySchedule: ScheduleItem[];
  summaryStats: SummaryStatItem[];
}

// ── Shared chart months ───────────────────────────────────────
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

// ============================================================
// PER-ROLE CONFIGS
// ============================================================

const superAdminConfig: RoleDashboardConfig = {
  role: 'super_admin',
  dashboardTitle: 'Platform Overview',
  sidebarLabel: 'Platform Overview',
  subtitle: 'Cross-tenant SaaS metrics & platform health in real-time.',
  accentColor: 'indigo',
  kpis: [
    { title: 'Active Tenants',   value: '42',      trend: '+3 this month', trendUp: true,  icon: Building2,  iconColor: 'text-indigo-600', iconBg: 'bg-indigo-100' },
    { title: 'Platform MRR',     value: '$24,500',  trend: '+12% vs last',  trendUp: true,  icon: DollarSign, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100' },
    { title: 'System Uptime',    value: '99.99%',   trend: 'Last 30 days',  trendUp: true,  icon: Activity,   iconColor: 'text-blue-600', iconBg: 'bg-blue-100' },
    { title: 'Open Tickets',     value: '18',       trend: '-5 resolved',   trendUp: true,  icon: Ticket,     iconColor: 'text-amber-600', iconBg: 'bg-amber-100' },
  ],
  chartTitle: 'Platform MRR Growth',
  chartPrimaryLabel: 'MRR ($)',
  chartSecondaryLabel: 'Tenants',
  chartData: MONTHS.map((m, i) => ({
    name: m,
    primary: 14000 + i * 1400 + Math.round(Math.random() * 600),
    secondary: 30 + i * 2,
  })),
  activities: [
    { id: 1, text: 'Greenwood Academy onboarded — licence activated.', time: '10 min ago', type: 'success' },
    { id: 2, text: 'API rate limit warning on tenant #37 (Sunrise School).', time: '45 min ago', type: 'warning' },
    { id: 3, text: 'Monthly invoice sent to 42 tenants.', time: '2 hours ago', type: 'info' },
    { id: 4, text: 'DB backup completed — 100% integrity verified.', time: '4 hours ago', type: 'success' },
    { id: 5, text: 'Security patch v2.4.1 deployed across all tenants.', time: '8 hours ago', type: 'info' },
  ],
  quickActions: [
    { label: 'SaaS Console',     path: '/admin/saas-console', variant: 'primary',   icon: Building2 },
    { label: 'Integration Hub',  path: '/admin/integrations', variant: 'secondary', icon: Activity },
    { label: 'Audit Log',        path: '/admin/audit-log',    variant: 'secondary', icon: ClipboardList },
    { label: 'AI Hub',           path: '/ai',                 variant: 'secondary', icon: Star },
  ],
  todaySchedule: [
    { time: '09:00 AM', title: 'Platform Health Review', subtitle: 'Engineering Standup', color: 'bg-indigo-500' },
    { time: '11:00 AM', title: 'Tenant Onboarding Call', subtitle: 'Greenwood Academy', color: 'bg-emerald-500' },
    { time: '02:00 PM', title: 'Security Audit Review', subtitle: 'Q3 Compliance Check', color: 'bg-amber-500' },
    { time: '04:00 PM', title: 'Billing Reconciliation', subtitle: 'Monthly Close-out', color: 'bg-blue-500' },
  ],
  summaryStats: [
    { label: 'Active', value: 38, color: '#6366f1' },
    { label: 'Trial', value: 4, color: '#a5b4fc' },
    { label: 'Churned', value: 2, color: '#f87171' },
    { label: 'Pending', value: 3, color: '#fbbf24' },
  ],
};

const schoolAdminConfig: RoleDashboardConfig = {
  role: 'school_admin',
  dashboardTitle: 'School Overview',
  sidebarLabel: 'School Overview',
  subtitle: 'Complete visibility across academics, finance, HR and operations.',
  accentColor: 'amber',
  kpis: [
    { title: 'Total Students',   value: '1,245',    trend: '+5% this term', trendUp: true,  icon: Users,          iconColor: 'text-amber-600',   iconBg: 'bg-amber-100' },
    { title: 'Teaching Staff',   value: '84',        trend: '+2 this month', trendUp: true,  icon: GraduationCap,  iconColor: 'text-blue-600',    iconBg: 'bg-blue-100' },
    { title: 'Term Revenue',     value: '$1,24,500', trend: '-2% vs target', trendUp: false, icon: Coins,          iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100' },
    { title: 'Active Classes',   value: '42',        trend: 'Stable',        trendUp: true,  icon: BookOpen,       iconColor: 'text-purple-600',  iconBg: 'bg-purple-100' },
  ],
  chartTitle: 'Revenue vs Expenses',
  chartPrimaryLabel: 'Revenue ($)',
  chartSecondaryLabel: 'Expenses ($)',
  chartData: [
    { name: 'Jan', primary: 4000, secondary: 2400 },
    { name: 'Feb', primary: 3000, secondary: 1800 },
    { name: 'Mar', primary: 5200, secondary: 3800 },
    { name: 'Apr', primary: 4780, secondary: 3200 },
    { name: 'May', primary: 5890, secondary: 4100 },
    { name: 'Jun', primary: 4390, secondary: 3500 },
    { name: 'Jul', primary: 6490, secondary: 4300 },
    { name: 'Aug', primary: 5800, secondary: 3900 },
    { name: 'Sep', primary: 7100, secondary: 4600 },
  ],
  activities: [
    { id: 1, text: 'New admission recorded — Emma Wilson, Grade 10.',       time: '1 hour ago',  type: 'success' },
    { id: 2, text: 'Term 1 fee collected — $850 from Raj Patel.',           time: '3 hours ago', type: 'info' },
    { id: 3, text: 'Staff meeting scheduled for Friday 3:00 PM.',           time: '5 hours ago', type: 'info' },
    { id: 4, text: '3 students flagged for low attendance (<75%).',         time: '6 hours ago', type: 'warning' },
    { id: 5, text: 'Library inventory audit completed — 0 discrepancies.', time: 'Yesterday',   type: 'success' },
  ],
  quickActions: [
    { label: 'Add Student',     path: '/students/register', variant: 'primary',   icon: Users },
    { label: 'View Admissions', path: '/admissions',        variant: 'secondary', icon: GraduationCap },
    { label: 'Fee Dashboard',   path: '/finance',           variant: 'secondary', icon: Coins },
    { label: 'Staff Directory', path: '/hr/staff',          variant: 'secondary', icon: Briefcase },
  ],
  todaySchedule: [
    { time: '08:30 AM', title: 'Morning Assembly', subtitle: 'Main Auditorium', color: 'bg-amber-500' },
    { time: '10:00 AM', title: 'Staff Meeting', subtitle: 'Conference Room A', color: 'bg-blue-500' },
    { time: '01:00 PM', title: 'Parent-Teacher Conf.', subtitle: 'Grade 10 Parents', color: 'bg-emerald-500' },
    { time: '03:30 PM', title: 'Board Review', subtitle: 'Monthly Governance', color: 'bg-purple-500' },
  ],
  summaryStats: [
    { label: 'Boys', value: 680, color: '#3b82f6' },
    { label: 'Girls', value: 565, color: '#f472b6' },
    { label: 'Day Scholar', value: 1045, color: '#f59e0b' },
    { label: 'Boarder', value: 200, color: '#10b981' },
  ],
};

const accountantConfig: RoleDashboardConfig = {
  role: 'accountant',
  dashboardTitle: 'Finance Overview',
  sidebarLabel: 'Finance Overview',
  subtitle: 'Collections, dues, payroll and financial health at a glance.',
  accentColor: 'emerald',
  kpis: [
    { title: 'Daily Collections', value: '$4,250',    trend: '+18% vs yesterday', trendUp: true,  icon: Coins,      iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100' },
    { title: 'Overdue Accounts',  value: '12',        trend: '3 critical',        trendUp: false, icon: AlertCircle,iconColor: 'text-red-600',     iconBg: 'bg-red-100' },
    { title: 'Term Collection %', value: '78%',       trend: '+5% this week',     trendUp: true,  icon: TrendingUp, iconColor: 'text-blue-600',    iconBg: 'bg-blue-100' },
    { title: 'Payroll Pending',   value: '$38,200',   trend: 'Approval needed',   trendUp: false, icon: Banknote,   iconColor: 'text-amber-600',   iconBg: 'bg-amber-100' },
  ],
  chartTitle: 'Monthly Fee Collections',
  chartPrimaryLabel: 'Collected ($)',
  chartSecondaryLabel: 'Overdue ($)',
  chartData: [
    { name: 'Jan', primary: 18000, secondary: 3200 },
    { name: 'Feb', primary: 21000, secondary: 2800 },
    { name: 'Mar', primary: 19500, secondary: 4100 },
    { name: 'Apr', primary: 23000, secondary: 2400 },
    { name: 'May', primary: 25500, secondary: 1900 },
    { name: 'Jun', primary: 22000, secondary: 3300 },
    { name: 'Jul', primary: 28000, secondary: 1500 },
    { name: 'Aug', primary: 26500, secondary: 2100 },
    { name: 'Sep', primary: 30000, secondary: 1200 },
  ],
  activities: [
    { id: 1, text: 'Payment of $1,200 received from Priya Kumar — Term 2.',   time: '20 min ago',  type: 'success' },
    { id: 2, text: 'Overdue notice sent to 12 accounts via SMS.',              time: '1 hour ago',  type: 'info' },
    { id: 3, text: 'Payroll run for October — awaiting principal approval.',   time: '3 hours ago', type: 'warning' },
    { id: 4, text: 'Fee structure for Term 3 published.',                      time: '6 hours ago', type: 'info' },
    { id: 5, text: 'Scholarship discount applied — 8 students, Grade 9-12.',  time: 'Yesterday',   type: 'success' },
  ],
  quickActions: [
    { label: 'Record Payment',   path: '/finance/record-payment', variant: 'primary',   icon: CreditCard },
    { label: 'Student Fees',     path: '/finance/student-fees',   variant: 'secondary', icon: Coins },
    { label: 'Fee Structures',   path: '/finance/structures',     variant: 'secondary', icon: FileText },
    { label: 'Payroll',          path: '/hr/payroll',             variant: 'secondary', icon: Banknote },
  ],
  todaySchedule: [
    { time: '09:00 AM', title: 'Pending Approvals', subtitle: '12 fee waivers to review', color: 'bg-emerald-500' },
    { time: '11:00 AM', title: 'Payroll Processing', subtitle: 'October salary run', color: 'bg-blue-500' },
    { time: '02:00 PM', title: 'Vendor Payments', subtitle: 'Lab equipment invoice', color: 'bg-amber-500' },
    { time: '04:00 PM', title: 'Finance Committee', subtitle: 'Q3 budget review', color: 'bg-purple-500' },
  ],
  summaryStats: [
    { label: 'Collected', value: 78, color: '#10b981' },
    { label: 'Pending', value: 14, color: '#fbbf24' },
    { label: 'Overdue', value: 5, color: '#f87171' },
    { label: 'Waived', value: 3, color: '#94a3b8' },
  ],
};

const hrManagerConfig: RoleDashboardConfig = {
  role: 'hr_manager',
  dashboardTitle: 'HR Overview',
  sidebarLabel: 'HR Overview',
  subtitle: 'Staff performance, leave requests and attendance metrics.',
  accentColor: 'blue',
  kpis: [
    { title: 'Total Staff',       value: '128',   trend: '+4 this term',      trendUp: true,  icon: Briefcase,    iconColor: 'text-blue-600',    iconBg: 'bg-blue-100' },
    { title: 'Leave Requests',    value: '7',      trend: '3 pending review',  trendUp: false, icon: CalendarDays, iconColor: 'text-amber-600',   iconBg: 'bg-amber-100' },
    { title: 'Staff Attendance',  value: '96.2%',  trend: '+0.8% this week',   trendUp: true,  icon: Fingerprint,  iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100' },
    { title: 'Open Positions',    value: '3',      trend: 'Hiring in progress',trendUp: false, icon: Users,        iconColor: 'text-purple-600',  iconBg: 'bg-purple-100' },
  ],
  chartTitle: 'Staff Attendance Rate (Weekly)',
  chartPrimaryLabel: 'Attendance %',
  chartData: [
    { name: 'Mon', primary: 97 },
    { name: 'Tue', primary: 95 },
    { name: 'Wed', primary: 98 },
    { name: 'Thu', primary: 94 },
    { name: 'Fri', primary: 92 },
    { name: 'Mon', primary: 96 },
    { name: 'Tue', primary: 97 },
    { name: 'Wed', primary: 98 },
    { name: 'Thu', primary: 95 },
  ],
  activities: [
    { id: 1, text: 'Leave approved — Mr. Thompson, Sick Leave (2 days).',     time: '30 min ago',  type: 'success' },
    { id: 2, text: 'Late arrival logged — Mrs. Patel, 09:24 AM.',             time: '2 hours ago', type: 'warning' },
    { id: 3, text: 'New hire onboarding — David Lee, Science Teacher.',       time: '4 hours ago', type: 'info' },
    { id: 4, text: 'Payroll for 128 staff processed successfully.',           time: '1 day ago',   type: 'success' },
    { id: 5, text: '3 staff members due for annual performance review.',      time: 'Yesterday',   type: 'warning' },
  ],
  quickActions: [
    { label: 'Approve Leave',    path: '/hr/leave',      variant: 'primary',   icon: CalendarDays },
    { label: 'Staff Directory',  path: '/hr/staff',      variant: 'secondary', icon: Briefcase },
    { label: 'Staff Attendance', path: '/hr/attendance', variant: 'secondary', icon: Fingerprint },
    { label: 'Run Payroll',      path: '/hr/payroll',    variant: 'secondary', icon: Banknote },
  ],
  todaySchedule: [
    { time: '09:00 AM', title: 'Leave Approvals', subtitle: '7 requests pending', color: 'bg-blue-500' },
    { time: '10:30 AM', title: 'Interview — Science Dept.', subtitle: 'Candidate: Sarah Parker', color: 'bg-emerald-500' },
    { time: '01:00 PM', title: 'Performance Reviews', subtitle: 'Math Department (5 staff)', color: 'bg-amber-500' },
    { time: '03:30 PM', title: 'Payroll Finalization', subtitle: 'October salary sheets', color: 'bg-purple-500' },
  ],
  summaryStats: [
    { label: 'Present', value: 123, color: '#10b981' },
    { label: 'On Leave', value: 3, color: '#fbbf24' },
    { label: 'Absent', value: 1, color: '#f87171' },
    { label: 'WFH', value: 1, color: '#6366f1' },
  ],
};

const teacherConfig: RoleDashboardConfig = {
  role: 'teacher',
  dashboardTitle: 'My Teaching Hub',
  sidebarLabel: 'My Teaching Hub',
  subtitle: 'Your classes, pending grades, and student performance today.',
  accentColor: 'amber',
  kpis: [
    { title: 'My Students',      value: '145',  trend: 'Across 4 classes',   trendUp: true,  icon: Users,        iconColor: 'text-blue-600',    iconBg: 'bg-blue-50' },
    { title: 'Classes Today',    value: '4',    trend: '2 remaining',         trendUp: true,  icon: BookOpen,     iconColor: 'text-amber-600',   iconBg: 'bg-amber-50' },
    { title: 'Pending Grades',   value: '28',   trend: 'Due today',           trendUp: false, icon: ClipboardList,iconColor: 'text-rose-600',    iconBg: 'bg-rose-50' },
    { title: 'Avg Attendance',   value: '94%',  trend: 'Above school avg',    trendUp: true,  icon: TrendingUp,   iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
  ],
  chartTitle: 'Class Attendance This Week',
  chartPrimaryLabel: 'Present',
  chartSecondaryLabel: 'Absent',
  chartData: [
    { name: 'Mon', primary: 30, secondary: 2 },
    { name: 'Tue', primary: 28, secondary: 4 },
    { name: 'Wed', primary: 31, secondary: 1 },
    { name: 'Thu', primary: 27, secondary: 5 },
    { name: 'Fri', primary: 29, secondary: 3 },
  ],
  activities: [
    { id: 1, text: 'Assignment submitted — Physics Lab Report (28/32 students).', time: '20 min ago',  type: 'success' },
    { id: 2, text: 'Exam marks entry pending — Mathematics Mid-term.',            time: '1 hour ago',  type: 'warning' },
    { id: 3, text: 'Parent meeting request — John Doe\'s parents, Thursday.',      time: '3 hours ago', type: 'info' },
    { id: 4, text: 'Live classroom scheduled for tomorrow 2 PM — Grade 12.',      time: '5 hours ago', type: 'info' },
    { id: 5, text: 'Timetable updated — Thursday slot moved to Room 204.',        time: 'Yesterday',   type: 'warning' },
  ],
  quickActions: [
    { label: 'Mark Attendance',    path: '/academics/absentees',  variant: 'primary',   icon: ClipboardList },
    { label: 'Add Assignment',     path: '/academics/assignments', variant: 'primary',   icon: FileEdit },
    { label: 'Timetable',          path: '/academics/timetable',   variant: 'secondary', icon: Clock },
    { label: 'Live Classroom',     path: '/lms/live-class',        variant: 'secondary', icon: Trophy },
  ],
  todaySchedule: [
    { time: '08:00 AM', title: 'Grade 10-A Physics', subtitle: 'Room 302 — Optics', color: 'bg-blue-500' },
    { time: '09:30 AM', title: 'Grade 11-B Chemistry', subtitle: 'Lab 2 — Titration', color: 'bg-emerald-500' },
    { time: '11:00 AM', title: 'Grade 9-A Physics', subtitle: 'Room 204 — Mechanics', color: 'bg-amber-500' },
    { time: '02:00 PM', title: 'Grade 12 Revision', subtitle: 'Room 302 — Board Prep', color: 'bg-purple-500' },
  ],
  summaryStats: [
    { label: 'Submitted', value: 28, color: '#10b981' },
    { label: 'Pending', value: 4, color: '#fbbf24' },
    { label: 'Late', value: 2, color: '#f87171' },
    { label: 'Not Started', value: 6, color: '#94a3b8' },
  ],
};

const librarianConfig: RoleDashboardConfig = {
  role: 'librarian',
  dashboardTitle: 'Library Overview',
  sidebarLabel: 'Library Overview',
  subtitle: 'Circulation, inventory status and overdue management.',
  accentColor: 'rose',
  kpis: [
    { title: 'Books Issued Today', value: '45',    trend: '+8 vs yesterday',    trendUp: true,  icon: BookOpen,      iconColor: 'text-indigo-600', iconBg: 'bg-indigo-100' },
    { title: 'Overdue Books',      value: '18',    trend: '5 >14 days',         trendUp: false, icon: AlertCircle,   iconColor: 'text-rose-600',   iconBg: 'bg-rose-100' },
    { title: 'Fine Collections',   value: '$12.50',trend: 'Today',              trendUp: true,  icon: Coins,         iconColor: 'text-emerald-600',iconBg: 'bg-emerald-100' },
    { title: 'Total Inventory',    value: '8,420', trend: '12 new arrivals',    trendUp: true,  icon: BookOpenCheck, iconColor: 'text-blue-600',   iconBg: 'bg-blue-100' },
  ],
  chartTitle: 'Book Circulation (Monthly)',
  chartPrimaryLabel: 'Issued',
  chartSecondaryLabel: 'Returned',
  chartData: MONTHS.map((m, i) => ({
    name: m,
    primary: 280 + i * 15 + Math.round(Math.random() * 30),
    secondary: 260 + i * 14 + Math.round(Math.random() * 20),
  })),
  activities: [
    { id: 1, text: 'Book returned — "Sapiens" by Aditya Sharma (2 days late).', time: '15 min ago',  type: 'warning' },
    { id: 2, text: '12 new NCERT textbooks added to inventory.',                 time: '1 hour ago',  type: 'success' },
    { id: 3, text: 'Overdue reminder SMS sent to 18 students.',                  time: '3 hours ago', type: 'info' },
    { id: 4, text: 'Book issued — "To Kill a Mockingbird" to Grade 11-A.',       time: '4 hours ago', type: 'info' },
    { id: 5, text: 'Monthly inventory reconciliation completed.',                time: 'Yesterday',   type: 'success' },
  ],
  quickActions: [
    { label: 'Issue Book',      path: '/operations/library', variant: 'primary',   icon: BookOpen },
    { label: 'View Overdue',    path: '/operations/library', variant: 'secondary', icon: AlertCircle },
    { label: 'Manage Inventory',path: '/operations/library', variant: 'secondary', icon: BookOpenCheck },
    { label: 'Student List',    path: '/students',           variant: 'secondary', icon: Users },
  ],
  todaySchedule: [
    { time: '08:30 AM', title: 'Open Library', subtitle: 'Daily check-in & returns', color: 'bg-rose-500' },
    { time: '10:00 AM', title: 'Grade 8 Library Hour', subtitle: 'Fiction Reading', color: 'bg-blue-500' },
    { time: '01:00 PM', title: 'New Arrivals Processing', subtitle: '12 NCERT books', color: 'bg-emerald-500' },
    { time: '03:30 PM', title: 'Overdue Follow-up', subtitle: '18 SMS reminders', color: 'bg-amber-500' },
  ],
  summaryStats: [
    { label: 'Available', value: 7800, color: '#6366f1' },
    { label: 'Issued', value: 580, color: '#f43f5e' },
    { label: 'Overdue', value: 18, color: '#fbbf24' },
    { label: 'Reserved', value: 22, color: '#10b981' },
  ],
};

const hostelWardenConfig: RoleDashboardConfig = {
  role: 'hostel_warden',
  dashboardTitle: 'Hostel Overview',
  sidebarLabel: 'Hostel Overview',
  subtitle: 'Occupancy, incidents, meals and resident check-ins today.',
  accentColor: 'orange',
  kpis: [
    { title: 'Occupancy',       value: '88%',  trend: '176/200 beds filled',  trendUp: true,  icon: Home,         iconColor: 'text-blue-600',   iconBg: 'bg-blue-100' },
    { title: 'Open Incidents',  value: '1',    trend: 'Created today',         trendUp: false, icon: AlertCircle,  iconColor: 'text-rose-600',   iconBg: 'bg-rose-100' },
    { title: 'Visitors Today',  value: '14',   trend: '+3 vs yesterday',       trendUp: true,  icon: Users,        iconColor: 'text-indigo-600', iconBg: 'bg-indigo-100' },
    { title: 'Check-ins Today', value: '28',   trend: 'After school hours',    trendUp: true,  icon: CheckCircle,  iconColor: 'text-emerald-600',iconBg: 'bg-emerald-100' },
  ],
  chartTitle: 'Occupancy Rate (Monthly)',
  chartPrimaryLabel: 'Occupancy %',
  chartData: MONTHS.map((m, i) => ({
    name: m,
    primary: 75 + i * 2 + Math.round(Math.random() * 5),
  })),
  activities: [
    { id: 1, text: 'Incident logged — Room 14B water leakage reported.',       time: '30 min ago',  type: 'danger' },
    { id: 2, text: 'Check-in completed — 28 students returned from school.',   time: '2 hours ago', type: 'success' },
    { id: 3, text: 'Visitor entry — Mr. & Mrs. Kumar for Ananya Kumar (D-4).', time: '3 hours ago', type: 'info' },
    { id: 4, text: 'Dinner meal plan updated for next week.',                   time: '5 hours ago', type: 'info' },
    { id: 5, text: 'Maintenance request resolved — A-block washroom repaired.', time: 'Yesterday',  type: 'success' },
  ],
  quickActions: [
    { label: 'Hostel Management', path: '/operations/hostel',          variant: 'primary',   icon: Home },
    { label: 'Log Incident',       path: '/operations/hostel',          variant: 'secondary', icon: AlertCircle },
    { label: 'Noticeboard',        path: '/communication/noticeboard',  variant: 'secondary', icon: Bell },
    { label: 'Student List',       path: '/students',                   variant: 'secondary', icon: Users },
  ],
  todaySchedule: [
    { time: '06:00 AM', title: 'Morning Roll Call', subtitle: 'All blocks', color: 'bg-orange-500' },
    { time: '08:00 AM', title: 'Breakfast Supervision', subtitle: 'Dining Hall A', color: 'bg-blue-500' },
    { time: '04:00 PM', title: 'Study Hour Begins', subtitle: 'A & B Block', color: 'bg-emerald-500' },
    { time: '09:00 PM', title: 'Lights-Out Check', subtitle: 'All dormitories', color: 'bg-purple-500' },
  ],
  summaryStats: [
    { label: 'Occupied', value: 176, color: '#3b82f6' },
    { label: 'Vacant', value: 24, color: '#94a3b8' },
    { label: 'Maintenance', value: 3, color: '#fbbf24' },
    { label: 'Reserved', value: 5, color: '#10b981' },
  ],
};

const transportManagerConfig: RoleDashboardConfig = {
  role: 'transport_manager',
  dashboardTitle: 'Fleet Overview',
  sidebarLabel: 'Fleet Overview',
  subtitle: 'Live fleet status, routes, on-time performance and alerts.',
  accentColor: 'teal',
  kpis: [
    { title: 'Active Trips',        value: '8',    trend: '3 completed today',  trendUp: true,  icon: Bus,           iconColor: 'text-teal-600',   iconBg: 'bg-teal-100' },
    { title: 'On-Time Rate',        value: '92%',  trend: '+3% this week',      trendUp: true,  icon: CheckCircle,   iconColor: 'text-emerald-600',iconBg: 'bg-emerald-100' },
    { title: 'Maintenance Alerts',  value: '2',    trend: 'Bus #4, Bus #9',     trendUp: false, icon: AlertTriangle, iconColor: 'text-amber-600',  iconBg: 'bg-amber-100' },
    { title: 'Students Covered',    value: '380',  trend: 'Across 12 routes',   trendUp: true,  icon: Users,         iconColor: 'text-blue-600',   iconBg: 'bg-blue-100' },
  ],
  chartTitle: 'Fleet On-Time Performance',
  chartPrimaryLabel: 'On-Time %',
  chartSecondaryLabel: 'Delayed Trips',
  chartData: MONTHS.map((m, i) => ({
    name: m,
    primary: 85 + Math.round(Math.random() * 10),
    secondary: 1 + Math.round(Math.random() * 3),
  })),
  activities: [
    { id: 1, text: 'Bus #3 arrived 8 mins late — Route 7 (downtown).',         time: '20 min ago',  type: 'warning' },
    { id: 2, text: 'Afternoon pickup completed — 190 students, 0 incidents.',   time: '2 hours ago', type: 'success' },
    { id: 3, text: 'Maintenance alert — Bus #4 brake inspection overdue.',      time: '3 hours ago', type: 'danger' },
    { id: 4, text: 'New route added — Route 13 (North Extension Colony).',      time: '5 hours ago', type: 'info' },
    { id: 5, text: 'Parent tracked Bus #7 via GPS — 12 live sessions active.',  time: 'Yesterday',   type: 'info' },
  ],
  quickActions: [
    { label: 'Live GPS Tracker',  path: '/transport/gps-tracker', variant: 'primary',   icon: Navigation },
    { label: 'Fleet Dashboard',   path: '/transport',             variant: 'secondary', icon: Bus },
    { label: 'Noticeboard',       path: '/communication/noticeboard', variant: 'secondary', icon: Bell },
    { label: 'Reports',           path: '/reports',               variant: 'secondary', icon: BarChart3 },
  ],
  todaySchedule: [
    { time: '06:30 AM', title: 'Morning Pickup — Route 1-6', subtitle: '6 buses dispatched', color: 'bg-teal-500' },
    { time: '07:30 AM', title: 'Morning Pickup — Route 7-12', subtitle: '6 buses dispatched', color: 'bg-blue-500' },
    { time: '02:30 PM', title: 'Afternoon Drop — Route 1-6', subtitle: 'Departure from school', color: 'bg-emerald-500' },
    { time: '03:30 PM', title: 'Afternoon Drop — Route 7-12', subtitle: 'Departure from school', color: 'bg-amber-500' },
  ],
  summaryStats: [
    { label: 'On Route', value: 8, color: '#14b8a6' },
    { label: 'Completed', value: 3, color: '#10b981' },
    { label: 'Delayed', value: 1, color: '#fbbf24' },
    { label: 'In Garage', value: 4, color: '#94a3b8' },
  ],
};

const parentConfig: RoleDashboardConfig = {
  role: 'parent',
  dashboardTitle: "My Child's Overview",
  sidebarLabel: "My Child's Overview",
  subtitle: "Stay informed about your child's academics, fees, and school updates.",
  accentColor: 'indigo',
  kpis: [
    { title: "Child's Attendance", value: '94%',    trend: 'Present 42/45 days', trendUp: true,  icon: Fingerprint,  iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100' },
    { title: 'Upcoming Exam',      value: 'Oct 28', trend: 'Mathematics Final',   trendUp: true,  icon: FileEdit,     iconColor: 'text-blue-600',    iconBg: 'bg-blue-100' },
    { title: 'Fee Due',            value: '$450',   trend: 'Term 2 — overdue',    trendUp: false, icon: CreditCard,   iconColor: 'text-red-600',     iconBg: 'bg-red-100' },
    { title: 'Bus ETA',            value: '4:15 PM',trend: 'Arriving at Stop A',  trendUp: true,  icon: Bus,          iconColor: 'text-purple-600',  iconBg: 'bg-purple-100' },
  ],
  chartTitle: "Child's Monthly Attendance",
  chartPrimaryLabel: 'Present Days',
  chartSecondaryLabel: 'Absent Days',
  chartData: [
    { name: 'Jun', primary: 22, secondary: 2 },
    { name: 'Jul', primary: 21, secondary: 3 },
    { name: 'Aug', primary: 23, secondary: 1 },
    { name: 'Sep', primary: 20, secondary: 4 },
    { name: 'Oct', primary: 18, secondary: 2 },
  ],
  activities: [
    { id: 1, text: 'Report card published — Term 1 results available.',             time: '1 hour ago',  type: 'success' },
    { id: 2, text: 'Assignment submitted — Algebra Worksheet (Mathematics).',       time: '3 hours ago', type: 'info' },
    { id: 3, text: 'Absence recorded — Oct 14 (submitted sick note).',             time: '1 day ago',   type: 'warning' },
    { id: 4, text: 'School notice — Parent-Teacher meeting on Oct 28 at 10 AM.',   time: '2 days ago',  type: 'info' },
    { id: 5, text: 'Fee reminder — Term 2 payment due by Oct 31.',                 time: '3 days ago',  type: 'danger' },
  ],
  quickActions: [
    { label: 'Pay Fee Now',       path: '/finance/pay-online',         variant: 'primary',   icon: CreditCard },
    { label: 'Track Bus',         path: '/transport/gps-tracker',      variant: 'secondary', icon: Navigation },
    { label: 'View Report Card',  path: '/academics/report-cards',     variant: 'secondary', icon: FileText },
    { label: 'Message Teacher',   path: '/communication/messages',     variant: 'secondary', icon: Bell },
  ],
  todaySchedule: [
    { time: '08:00 AM', title: 'School Starts', subtitle: 'Bus pickup at 7:15 AM', color: 'bg-indigo-500' },
    { time: '10:00 AM', title: 'Parent-Teacher Meeting', subtitle: 'Mrs. Johnson — Room 201', color: 'bg-emerald-500' },
    { time: '02:30 PM', title: 'Bus Drop-off', subtitle: 'Route 7 — ETA 3:15 PM', color: 'bg-amber-500' },
    { time: '04:00 PM', title: 'Tuition Class', subtitle: 'Mathematics — Online', color: 'bg-purple-500' },
  ],
  summaryStats: [
    { label: 'Attendance', value: 94, color: '#10b981' },
    { label: 'Absent', value: 6, color: '#f87171' },
    { label: 'Assignments Done', value: 85, color: '#6366f1' },
    { label: 'Pending', value: 15, color: '#fbbf24' },
  ],
};

const studentConfig: RoleDashboardConfig = {
  role: 'student',
  dashboardTitle: 'My Learning Hub',
  sidebarLabel: 'My Learning Hub',
  subtitle: 'Your classes, assignments, grades and learning progress.',
  accentColor: 'violet',
  kpis: [
    { title: 'My Attendance',   value: '94%',   trend: 'Present 42/45 days',  trendUp: true,  icon: Fingerprint,  iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
    { title: 'Pending HW',      value: '3',     trend: 'Due this week',        trendUp: false, icon: ClipboardList,iconColor: 'text-amber-600',   iconBg: 'bg-amber-50' },
    { title: 'Current Grade',   value: 'B+',    trend: 'Avg 78% this term',    trendUp: true,  icon: Award,        iconColor: 'text-purple-600',  iconBg: 'bg-purple-50' },
    { title: 'Next Class',      value: 'Physics',trend: 'In 15 mins — Rm 302', trendUp: true,  icon: Clock,        iconColor: 'text-blue-600',    iconBg: 'bg-blue-50' },
  ],
  chartTitle: 'My Subject Performance',
  chartPrimaryLabel: 'Score %',
  chartData: [
    { name: 'Math',    primary: 82 },
    { name: 'Physics', primary: 75 },
    { name: 'Chemistry',primary: 88 },
    { name: 'English', primary: 91 },
    { name: 'History', primary: 70 },
    { name: 'Bio',     primary: 85 },
  ],
  activities: [
    { id: 1, text: 'Assignment graded — "Algebra Worksheet" scored 18/20.',          time: '1 hour ago',  type: 'success' },
    { id: 2, text: 'New assignment posted — Physics Lab Report (due Friday).',       time: '3 hours ago', type: 'warning' },
    { id: 3, text: 'Exam schedule released — Mid-term starts October 28.',           time: '5 hours ago', type: 'info' },
    { id: 4, text: 'Class ranking updated — you are #8 out of 32 students.',         time: 'Yesterday',   type: 'info' },
    { id: 5, text: 'Live class recording available — Chemistry (yesterday\'s session).', time: '2 days ago', type: 'success' },
  ],
  quickActions: [
    { label: 'My Courses',        path: '/lms',                    variant: 'primary',   icon: GraduationCap },
    { label: 'View Timetable',    path: '/academics/timetable',    variant: 'secondary', icon: Clock },
    { label: 'Assignments',       path: '/academics/assignments',  variant: 'secondary', icon: ClipboardList },
    { label: 'Report Card',       path: '/academics/report-cards', variant: 'secondary', icon: Target },
  ],
  todaySchedule: [
    { time: '08:00 AM', title: 'Mathematics', subtitle: 'Room 301 — Mrs. Johnson', color: 'bg-violet-500' },
    { time: '09:30 AM', title: 'Physics', subtitle: 'Room 302 — Mr. Kumar', color: 'bg-blue-500' },
    { time: '11:00 AM', title: 'English Literature', subtitle: 'Room 105 — Ms. Davis', color: 'bg-emerald-500' },
    { time: '02:00 PM', title: 'Chemistry Lab', subtitle: 'Lab 2 — Dr. Patel', color: 'bg-amber-500' },
  ],
  summaryStats: [
    { label: 'Completed', value: 12, color: '#10b981' },
    { label: 'In Progress', value: 3, color: '#6366f1' },
    { label: 'Pending', value: 2, color: '#fbbf24' },
    { label: 'Overdue', value: 1, color: '#f87171' },
  ],
};

// ── Master export map ─────────────────────────────────────────
export const ROLE_DASHBOARD_CONFIG: Record<Role, RoleDashboardConfig> = {
  super_admin:       superAdminConfig,
  school_admin:      schoolAdminConfig,
  accountant:        accountantConfig,
  hr_manager:        hrManagerConfig,
  teacher:           teacherConfig,
  librarian:         librarianConfig,
  hostel_warden:     hostelWardenConfig,
  transport_manager: transportManagerConfig,
  parent:            parentConfig,
  student:           studentConfig,
};

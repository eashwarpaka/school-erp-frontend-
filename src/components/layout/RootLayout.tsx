import { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../../features/auth/store';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import {
  Menu, X, CalendarDays, BookOpen, GraduationCap,
  Users, UserSquare2, Tags, FileText,
  Coins, ReceiptText, ChevronRight, LogOut,
  ClipboardList, UserMinus, Trophy, Bell, Briefcase,
  Clock, FileEdit, MessageSquare, Megaphone, BarChart3, Library,
  Target, ListChecks, PieChart, LineChart, TrendingUp, CreditCard,
  Bus, UserCheck, Banknote, Navigation, Smartphone, Package, Home, Wand2, Star, ChevronDown, Check,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { ROLE_LABELS, Role } from '../../lib/permissions';
import { AIChatbotWidget } from '../ui/AIChatbotWidget';
import { MfaVerification } from '../../features/auth/components/MfaVerification';

export const RootLayout = () => {
  const { logout } = useAuthStore();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { activeRole, setActiveRole, mfaRequired, mfaVerified, setMfaVerified } = useAuth();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Assignment Posted', description: 'Mathematics Grade 10 - Algebra', time: '2 minutes ago', isRead: false },
    { id: 2, title: 'Fee Payment Received', description: 'Term 1 fee paid for John Doe', time: '1 hour ago', isRead: false },
    { id: 3, title: 'System Update', description: 'New rankings module is now live!', time: 'Yesterday', isRead: false },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on route change for mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // ── Role-based Navigation Configuration ────────────────────
  const getNavSections = (role: typeof activeRole) => {
    switch (role) {
      // ── Super Administrator ─────────────────────────────────
      // Full access to every section
      case 'super_admin':
        return [
          {
            title: 'DASHBOARD',
            items: [
              { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            ],
          },
          {
            title: 'SYSTEM ADMIN',
            items: [
              { name: 'Academic Years',   path: '/admin/academic-years',       icon: CalendarDays },
              { name: 'Terms',            path: '/admin/terms',                icon: BookOpen },
              { name: 'Class Masters',    path: '/admin/class-masters',        icon: GraduationCap },
              { name: 'Year Offerings',   path: '/admin/class-year-offerings', icon: Tags },
              { name: 'Curriculum Setup', path: '/admin/curriculum',           icon: Library },
              { name: 'Sections',         path: '/admin/sections',             icon: Users },
              { name: 'Enrollment',       path: '/admin/enrollment',           icon: UserSquare2 },
              { name: 'Promotion',        path: '/admin/promotion',            icon: GraduationCap },
              { name: 'ID Cards',         path: '/admin/id-cards',             icon: CreditCard },
              { name: 'Audit Log',        path: '/admin/audit-log',            icon: ClipboardList },
            ],
          },
          {
            title: 'HR & STAFF',
            items: [
              { name: 'Staff Directory',  path: '/hr/staff',      icon: Briefcase },
              { name: 'Leave Management', path: '/hr/leave',      icon: CalendarDays },
              { name: 'Staff Attendance', path: '/hr/attendance', icon: ClipboardList },
              { name: 'Payroll',          path: '/hr/payroll',    icon: Banknote },
            ],
          },
          {
            title: 'STUDENTS & PARENTS',
            items: [
              { name: 'Students',          path: '/students',         icon: Users },
              { name: 'Parent / Guardian', path: '/students/parents', icon: UserSquare2 },
            ],
          },
          {
            title: 'ADMISSIONS',
            items: [
              { name: 'Admissions Board', path: '/admissions', icon: UserCheck },
            ],
          },
          {
            title: 'ACADEMICS',
            items: [
              { name: 'AI Timetable',      path: '/academics/ai-timetable',     icon: Wand2 },
              { name: 'Timetable Grid',    path: '/academics/timetable',        icon: Clock },
              { name: 'Assignments',       path: '/academics/assignments',      icon: ClipboardList },
              { name: 'Exams',             path: '/academics/exams',            icon: FileEdit },
              { name: 'Absentees',         path: '/academics/absentees',        icon: UserMinus },
              { name: 'Rankings',          path: '/academics/rankings',         icon: Trophy },
              { name: 'Report Cards',      path: '/academics/report-cards',     icon: FileText },
              { name: 'Learning Outcomes', path: '/academics/learning-outcomes',icon: Target },
              { name: 'Electives',         path: '/academics/electives',        icon: ListChecks },
              { name: 'Analytics',         path: '/academics/analytics',        icon: BarChart3 },
            ],
          },
          {
            title: 'COMMUNICATION',
            items: [
              { name: 'Omnichannel Hub', path: '/communication/omnichannel', icon: Smartphone },
              { name: 'Noticeboard',     path: '/communication/noticeboard', icon: Megaphone },
              { name: 'Messages',        path: '/communication/messages',    icon: MessageSquare },
            ],
          },
          {
            title: 'FINANCE & ACCOUNTS',
            items: [
              { name: 'Fee Dashboard',   path: '/finance',                icon: Coins },
              { name: 'Record Payment',  path: '/finance/record-payment', icon: ReceiptText },
              { name: 'Fee Categories',  path: '/finance/categories',     icon: Tags },
              { name: 'Fee Structures',  path: '/finance/structures',     icon: FileText },
              { name: 'Student Fees',    path: '/finance/student-fees',   icon: Coins },
            ],
          },
          {
            title: 'TRANSPORT',
            items: [
              { name: 'Transport & Fleet',  path: '/transport',              icon: Bus },
              { name: 'Live GPS Tracker',   path: '/transport/gps-tracker',  icon: Navigation },
            ],
          },
          {
            title: 'OPERATIONS & FACILITIES',
            items: [
              { name: 'Library',        path: '/operations/library',   icon: BookOpen },
              { name: 'Inventory & PO', path: '/operations/inventory', icon: Package },
              { name: 'Hostel',         path: '/operations/hostel',    icon: Home },
            ],
          },
          {
            title: 'CERTIFICATES',
            items: [
              { name: 'Certificate Generator', path: '/certificates', icon: Star },
            ],
          },
          {
            title: 'PORTALS',
            items: [
              { name: 'Parent Portal',  path: '/portal/parent',  icon: Users },
              { name: 'Student Portal', path: '/portal/student', icon: GraduationCap },
            ],
          },
          {
            title: 'REPORT ANALYSIS',
            items: [
              { name: 'Overview',            path: '/reports',             icon: PieChart },
              { name: 'Student Reports',     path: '/reports/student',     icon: Users },
              { name: 'Attendance Reports',  path: '/reports/attendance',  icon: CalendarDays },
              { name: 'Financial Reports',   path: '/reports/financial',   icon: LineChart },
              { name: 'Performance',         path: '/reports/performance', icon: TrendingUp },
            ],
          },
        ];

      // ── School Administrator ────────────────────────────────
      case 'school_admin':
        return [
          {
            title: 'DASHBOARD',
            items: [
              { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            ],
          },
          {
            title: 'SYSTEM ADMIN',
            items: [
              { name: 'Academic Years',   path: '/admin/academic-years',       icon: CalendarDays },
              { name: 'Terms',            path: '/admin/terms',                icon: BookOpen },
              { name: 'Class Masters',    path: '/admin/class-masters',        icon: GraduationCap },
              { name: 'Year Offerings',   path: '/admin/class-year-offerings', icon: Tags },
              { name: 'Curriculum Setup', path: '/admin/curriculum',           icon: Library },
              { name: 'Sections',         path: '/admin/sections',             icon: Users },
              { name: 'Enrollment',       path: '/admin/enrollment',           icon: UserSquare2 },
              { name: 'Promotion',        path: '/admin/promotion',            icon: GraduationCap },
              { name: 'ID Cards',         path: '/admin/id-cards',             icon: CreditCard },
              { name: 'Audit Log',        path: '/admin/audit-log',            icon: ClipboardList },
            ],
          },
          {
            title: 'HR & STAFF',
            items: [
              { name: 'Staff Directory',  path: '/hr/staff',      icon: Briefcase },
              { name: 'Leave Management', path: '/hr/leave',      icon: CalendarDays },
              { name: 'Staff Attendance', path: '/hr/attendance', icon: ClipboardList },
              { name: 'Payroll',          path: '/hr/payroll',    icon: Banknote },
            ],
          },
          {
            title: 'STUDENTS & PARENTS',
            items: [
              { name: 'Students',          path: '/students',         icon: Users },
              { name: 'Parent / Guardian', path: '/students/parents', icon: UserSquare2 },
            ],
          },
          {
            title: 'ADMISSIONS',
            items: [
              { name: 'Admissions Board', path: '/admissions', icon: UserCheck },
            ],
          },
          {
            title: 'ACADEMICS',
            items: [
              { name: 'AI Timetable',      path: '/academics/ai-timetable',     icon: Wand2 },
              { name: 'Timetable Grid',    path: '/academics/timetable',        icon: Clock },
              { name: 'Assignments',       path: '/academics/assignments',      icon: ClipboardList },
              { name: 'Exams',             path: '/academics/exams',            icon: FileEdit },
              { name: 'Absentees',         path: '/academics/absentees',        icon: UserMinus },
              { name: 'Rankings',          path: '/academics/rankings',         icon: Trophy },
              { name: 'Report Cards',      path: '/academics/report-cards',     icon: FileText },
              { name: 'Learning Outcomes', path: '/academics/learning-outcomes',icon: Target },
              { name: 'Electives',         path: '/academics/electives',        icon: ListChecks },
              { name: 'Analytics',         path: '/academics/analytics',        icon: BarChart3 },
            ],
          },
          {
            title: 'COMMUNICATION',
            items: [
              { name: 'Omnichannel Hub', path: '/communication/omnichannel', icon: Smartphone },
              { name: 'Noticeboard',     path: '/communication/noticeboard', icon: Megaphone },
              { name: 'Messages',        path: '/communication/messages',    icon: MessageSquare },
            ],
          },
          {
            title: 'FINANCE & ACCOUNTS',
            items: [
              { name: 'Fee Dashboard',  path: '/finance',                icon: Coins },
              { name: 'Record Payment', path: '/finance/record-payment', icon: ReceiptText },
              { name: 'Fee Categories', path: '/finance/categories',     icon: Tags },
              { name: 'Fee Structures', path: '/finance/structures',     icon: FileText },
              { name: 'Student Fees',   path: '/finance/student-fees',   icon: Coins },
            ],
          },
          {
            title: 'TRANSPORT',
            items: [
              { name: 'Transport & Fleet', path: '/transport',             icon: Bus },
              { name: 'Live GPS Tracker',  path: '/transport/gps-tracker', icon: Navigation },
            ],
          },
          {
            title: 'OPERATIONS & FACILITIES',
            items: [
              { name: 'Library',        path: '/operations/library',   icon: BookOpen },
              { name: 'Inventory & PO', path: '/operations/inventory', icon: Package },
              { name: 'Hostel',         path: '/operations/hostel',    icon: Home },
            ],
          },
          {
            title: 'CERTIFICATES',
            items: [
              { name: 'Certificate Generator', path: '/certificates', icon: Star },
            ],
          },
          {
            title: 'PORTALS',
            items: [
              { name: 'Parent Portal',  path: '/portal/parent',  icon: Users },
              { name: 'Student Portal', path: '/portal/student', icon: GraduationCap },
            ],
          },
          {
            title: 'REPORT ANALYSIS',
            items: [
              { name: 'Overview',           path: '/reports',             icon: PieChart },
              { name: 'Student Reports',    path: '/reports/student',     icon: Users },
              { name: 'Attendance Reports', path: '/reports/attendance',  icon: CalendarDays },
              { name: 'Financial Reports',  path: '/reports/financial',   icon: LineChart },
              { name: 'Performance',        path: '/reports/performance', icon: TrendingUp },
            ],
          },
        ];

      // ── Accountant ─────────────────────────────────────────
      case 'accountant':
        return [
          {
            title: 'DASHBOARD',
            items: [
              { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            ],
          },
          {
            title: 'FINANCE & ACCOUNTS',
            items: [
              { name: 'Fee Dashboard',   path: '/finance',                icon: Coins },
              { name: 'Pay Fees Online', path: '/finance/pay-online',     icon: CreditCard },
              { name: 'Record Payment',  path: '/finance/record-payment', icon: ReceiptText },
              { name: 'Fee Categories',  path: '/finance/categories',     icon: Tags },
              { name: 'Fee Structures',  path: '/finance/structures',     icon: FileText },
              { name: 'Student Fees',    path: '/finance/student-fees',   icon: Coins },
            ],
          },
          {
            title: 'HR & STAFF',
            items: [
              { name: 'Payroll', path: '/hr/payroll', icon: Banknote },
            ],
          },
          {
            title: 'STUDENTS & PARENTS',
            items: [
              { name: 'Students', path: '/students', icon: Users },
            ],
          },
          {
            title: 'OPERATIONS & FACILITIES',
            items: [
              { name: 'Inventory & PO', path: '/operations/inventory', icon: Package },
            ],
          },
          {
            title: 'COMMUNICATION',
            items: [
              { name: 'Messages', path: '/communication/messages', icon: MessageSquare },
            ],
          },
          {
            title: 'REPORT ANALYSIS',
            items: [
              { name: 'Overview',          path: '/reports',           icon: PieChart },
              { name: 'Financial Reports', path: '/reports/financial', icon: LineChart },
            ],
          },
        ];

      // ── HR Manager ─────────────────────────────────────────
      case 'hr_manager':
        return [
          {
            title: 'DASHBOARD',
            items: [
              { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            ],
          },
          {
            title: 'HR & STAFF',
            items: [
              { name: 'Staff Directory',  path: '/hr/staff',      icon: Briefcase },
              { name: 'Leave Management', path: '/hr/leave',      icon: CalendarDays },
              { name: 'Staff Attendance', path: '/hr/attendance', icon: ClipboardList },
              { name: 'Payroll',          path: '/hr/payroll',    icon: Banknote },
            ],
          },
          {
            title: 'STUDENTS & PARENTS',
            items: [
              { name: 'Students', path: '/students', icon: Users },
            ],
          },
          {
            title: 'COMMUNICATION',
            items: [
              { name: 'Noticeboard', path: '/communication/noticeboard', icon: Megaphone },
              { name: 'Messages',    path: '/communication/messages',    icon: MessageSquare },
            ],
          },
          {
            title: 'REPORT ANALYSIS',
            items: [
              { name: 'Overview',           path: '/reports',            icon: PieChart },
              { name: 'Attendance Reports', path: '/reports/attendance', icon: CalendarDays },
            ],
          },
        ];

      // ── Teacher ────────────────────────────────────────────
      case 'teacher':
        return [
          {
            title: 'DASHBOARD',
            items: [
              { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            ],
          },
          {
            title: 'ACADEMICS',
            items: [
              { name: 'Timetable Grid',    path: '/academics/timetable',        icon: Clock },
              { name: 'Assignments',       path: '/academics/assignments',      icon: ClipboardList },
              { name: 'Exams',             path: '/academics/exams',            icon: FileEdit },
              { name: 'Absentees',         path: '/academics/absentees',        icon: UserMinus },
              { name: 'Rankings',          path: '/academics/rankings',         icon: Trophy },
              { name: 'Report Cards',      path: '/academics/report-cards',     icon: FileText },
              { name: 'Learning Outcomes', path: '/academics/learning-outcomes',icon: Target },
              { name: 'Electives',         path: '/academics/electives',        icon: ListChecks },
            ],
          },
          {
            title: 'STUDENTS & PARENTS',
            items: [
              { name: 'Students',          path: '/students',         icon: Users },
              { name: 'Parent / Guardian', path: '/students/parents', icon: UserSquare2 },
            ],
          },
          {
            title: 'COMMUNICATION',
            items: [
              { name: 'Noticeboard', path: '/communication/noticeboard', icon: Megaphone },
              { name: 'Messages',    path: '/communication/messages',    icon: MessageSquare },
            ],
          },
          {
            title: 'OPERATIONS & FACILITIES',
            items: [
              { name: 'Library', path: '/operations/library', icon: BookOpen },
            ],
          },
          {
            title: 'REPORT ANALYSIS',
            items: [
              { name: 'Overview',        path: '/reports',         icon: PieChart },
              { name: 'Student Reports', path: '/reports/student', icon: Users },
            ],
          },
        ];

      // ── Librarian ──────────────────────────────────────────
      case 'librarian':
        return [
          {
            title: 'DASHBOARD',
            items: [
              { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            ],
          },
          {
            title: 'OPERATIONS & FACILITIES',
            items: [
              { name: 'Library Management', path: '/operations/library', icon: BookOpen },
            ],
          },
          {
            title: 'STUDENTS & PARENTS',
            items: [
              { name: 'Students', path: '/students', icon: Users },
            ],
          },
          {
            title: 'REPORT ANALYSIS',
            items: [
              { name: 'Overview', path: '/reports', icon: PieChart },
            ],
          },
        ];

      // ── Hostel Warden ──────────────────────────────────────
      case 'hostel_warden':
        return [
          {
            title: 'DASHBOARD',
            items: [
              { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            ],
          },
          {
            title: 'OPERATIONS & FACILITIES',
            items: [
              { name: 'Hostel', path: '/operations/hostel', icon: Home },
            ],
          },
          {
            title: 'STUDENTS & PARENTS',
            items: [
              { name: 'Students', path: '/students', icon: Users },
            ],
          },
          {
            title: 'COMMUNICATION',
            items: [
              { name: 'Noticeboard', path: '/communication/noticeboard', icon: Megaphone },
              { name: 'Messages',    path: '/communication/messages',    icon: MessageSquare },
            ],
          },
          {
            title: 'REPORT ANALYSIS',
            items: [
              { name: 'Overview', path: '/reports', icon: PieChart },
            ],
          },
        ];

      // ── Transport Manager ──────────────────────────────────
      case 'transport_manager':
        return [
          {
            title: 'DASHBOARD',
            items: [
              { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            ],
          },
          {
            title: 'TRANSPORT',
            items: [
              { name: 'Transport & Fleet', path: '/transport',             icon: Bus },
              { name: 'Live GPS Tracker',  path: '/transport/gps-tracker', icon: Navigation },
            ],
          },
          {
            title: 'STUDENTS & PARENTS',
            items: [
              { name: 'Students', path: '/students', icon: Users },
            ],
          },
          {
            title: 'COMMUNICATION',
            items: [
              { name: 'Noticeboard', path: '/communication/noticeboard', icon: Megaphone },
              { name: 'Messages',    path: '/communication/messages',    icon: MessageSquare },
            ],
          },
          {
            title: 'REPORT ANALYSIS',
            items: [
              { name: 'Overview', path: '/reports', icon: PieChart },
            ],
          },
        ];

      // ── Parent / Guardian ──────────────────────────────────
      case 'parent':
        return [
          {
            title: 'DASHBOARD',
            items: [
              { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            ],
          },
          {
            title: 'PORTALS',
            items: [
              { name: 'Parent Portal', path: '/portal/parent', icon: Users },
            ],
          },
          {
            title: 'ACADEMICS',
            items: [
              { name: 'Timetable',    path: '/academics/timetable',    icon: Clock },
              { name: 'Exams',        path: '/academics/exams',        icon: FileEdit },
              { name: 'Report Cards', path: '/academics/report-cards', icon: FileText },
            ],
          },
          {
            title: 'FINANCE & ACCOUNTS',
            items: [
              { name: 'Fee Overview',    path: '/finance',            icon: Coins },
              { name: 'Pay Fees Online', path: '/finance/pay-online', icon: CreditCard },
            ],
          },
          {
            title: 'TRANSPORT',
            items: [
              { name: 'Live GPS Tracker', path: '/transport/gps-tracker', icon: Navigation },
            ],
          },
          {
            title: 'OPERATIONS & FACILITIES',
            items: [
              { name: 'Library', path: '/operations/library', icon: BookOpen },
            ],
          },
          {
            title: 'COMMUNICATION',
            items: [
              { name: 'Noticeboard', path: '/communication/noticeboard', icon: Megaphone },
              { name: 'Messages',    path: '/communication/messages',    icon: MessageSquare },
            ],
          },
          {
            title: 'REPORT ANALYSIS',
            items: [
              { name: 'Student Reports', path: '/reports/student', icon: Users },
            ],
          },
        ];

      // ── Student ────────────────────────────────────────────
      case 'student':
        return [
          {
            title: 'DASHBOARD',
            items: [
              { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            ],
          },
          {
            title: 'PORTALS',
            items: [
              { name: 'Student Portal', path: '/portal/student', icon: GraduationCap },
            ],
          },
          {
            title: 'ACADEMICS',
            items: [
              { name: 'Timetable',    path: '/academics/timetable',    icon: Clock },
              { name: 'Assignments',  path: '/academics/assignments',  icon: ClipboardList },
              { name: 'Exams',        path: '/academics/exams',        icon: FileEdit },
              { name: 'Rankings',     path: '/academics/rankings',     icon: Trophy },
              { name: 'Report Cards', path: '/academics/report-cards', icon: FileText },
            ],
          },
          {
            title: 'OPERATIONS & FACILITIES',
            items: [
              { name: 'Library', path: '/operations/library', icon: BookOpen },
            ],
          },
        ];

      default:
        return [];
    }
  };

  const navSections = getNavSections(activeRole);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans print:h-auto print:overflow-visible print:bg-white" style={{ fontFamily: 'Lexend Deca, system-ui, sans-serif' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#334155',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            borderRadius: '0.75rem',
            border: '1px solid #f1f5f9',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: '#f59e0b', // amber-500
              secondary: '#fff',
            },
            style: {
              borderLeft: '4px solid #f59e0b',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            style: {
              borderLeft: '4px solid #ef4444',
            },
          },
        }}
      />

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <AIChatbotWidget />

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isSidebarOpen ? 240 : (isMobile ? 0 : 64),
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={clsx(
          "flex-shrink-0 flex flex-col h-full bg-white border-r border-slate-200 z-50 overflow-hidden print:hidden",
          isMobile ? "fixed top-0 left-0 shadow-2xl" : "relative shadow-none"
        )}
      >
        {/* Sidebar Header (Mobile Logo Area) */}
        <div className={clsx(
          "h-[64px] flex items-center border-b border-slate-100 flex-shrink-0 transition-all duration-300",
          isSidebarOpen ? "px-4" : "px-0 justify-center"
        )}>
          <motion.div
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.4, type: "spring" }}
            className={clsx(
              "w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-md flex-shrink-0",
              isSidebarOpen ? "mr-3" : "mx-auto"
            )}
          >
            <span className="text-white text-xs font-bold">SMS</span>
          </motion.div>

          <div className={clsx(
            "text-slate-800 text-base font-semibold tracking-tight uppercase whitespace-nowrap transition-all duration-300",
            !isSidebarOpen && "opacity-0 w-0 hidden"
          )}>
            School System
          </div>

          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="ml-auto p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors mr-4"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 custom-scrollbar overflow-x-hidden">
          {navSections.map((section, idx) => (
            <div key={section.title} className={clsx("mb-4", idx > 0 && "mt-2")}>
              {isSidebarOpen ? (
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 px-4 whitespace-nowrap">
                  {section.title}
                </div>
              ) : (
                <div className="w-full flex justify-center mb-2">
                  <div className="w-6 h-px bg-slate-200"></div>
                </div>
              )}

              <ul className="space-y-0.5 px-2">
                {section.items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={['/reports', '/transport', '/finance'].includes(item.path)}
                      title={!isSidebarOpen ? item.name : undefined}
                      className={({ isActive }) => {
                        const isActuallyActive = isActive && !(item.path === '/students' && location.pathname.startsWith('/students/parents'));
                        return clsx(
                          'flex items-center rounded-xl text-[13px] font-medium transition-all duration-300 relative group',
                          isSidebarOpen ? 'px-3 py-2 gap-4' : 'justify-center p-3 mx-auto w-10 h-10',
                          isActuallyActive
                            ? 'text-amber-700 bg-amber-50 shadow-sm'
                            : 'text-slate-600 hover:bg-slate-100/70 hover:text-amber-600'
                        );
                      }}
                    >
                      {({ isActive }) => {
                        const isActuallyActive = isActive && !(item.path === '/students' && location.pathname.startsWith('/students/parents'));
                        return (
                          <>
                            <item.icon
                              size={18}
                              className={clsx(
                                "transition-transform duration-300 group-hover:scale-110 flex-shrink-0",
                                isActuallyActive ? "text-amber-600" : "text-slate-400 group-hover:text-amber-500"
                              )}
                            />

                            <div className={clsx(
                              "flex-1 whitespace-nowrap transition-all duration-300 overflow-hidden pl-2",
                              isSidebarOpen ? "opacity-100 max-w-full" : "opacity-0 max-w-0 hidden"
                            )}>
                              {item.name}
                            </div>

                            {isActuallyActive && (
                              <motion.div
                                layoutId="activeTab"
                                className={clsx(
                                  "absolute left-0 bg-amber-500",
                                  isSidebarOpen ? "top-0 bottom-0 w-1 rounded-r-full" : "top-2 bottom-2 w-1 rounded-full left-0"
                                )}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              />
                            )}

                            {isSidebarOpen && (
                              <ChevronRight
                                size={14}
                                className={clsx(
                                  "opacity-0 -translate-x-2 transition-all duration-300 flex-shrink-0",
                                  isActuallyActive ? "opacity-100 translate-x-0 text-amber-500" : "group-hover:opacity-50 group-hover:translate-x-0"
                                )}
                              />
                            )}
                          </>
                        )
                      }}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User / Footer Area */}
        <div className="p-2 border-t border-slate-100">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            title={!isSidebarOpen ? "Sign Out" : undefined}
            className={clsx(
              "flex items-center text-[15px] font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors group",
              isSidebarOpen ? "px-2 py-2 gap-4 w-full" : "justify-center p-3 mx-auto w-8 h-8"
            )}
          >
            <LogOut size={18} className="text-slate-400 group-hover:text-red-500 transition-colors flex-shrink-0" />
            <div className={clsx(
              "whitespace-nowrap transition-all duration-300 overflow-hidden pl-2",
              isSidebarOpen ? "opacity-100 max-w-full" : "opacity-0 max-w-0 hidden"
            )}>
              Sign Out
            </div>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden print:overflow-visible print:h-auto print:block">

        {/* Top Header */}
        <header className="h-[64px] bg-white/80 backdrop-blur-md flex items-center justify-between px-4 z-30 shadow-sm border-b border-slate-200/50 sticky top-0 print:hidden">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 -ml-1.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <Menu size={18} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Persona Switcher */}
            <div className="relative z-50">
              <button 
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                  {activeRole.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-slate-700 hidden sm:block">
                  {ROLE_LABELS[activeRole]}
                </span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              <AnimatePresence>
                {showPersonaMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden"
                  >
                    <div className="p-3 border-b border-slate-50 bg-slate-50">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Switch Persona</div>
                      <div className="text-xs text-slate-600">Simulate RBAC views</div>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto p-1">
                      {(Object.keys(ROLE_LABELS) as Role[]).map(role => (
                        <button
                          key={role}
                          onClick={() => { setActiveRole(role); setShowPersonaMenu(false); }}
                          className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-slate-50 transition-colors text-left"
                        >
                          <span className={clsx("font-medium", activeRole === role ? "text-indigo-600" : "text-slate-700")}>
                            {ROLE_LABELS[role]}
                          </span>
                          {activeRole === role && <Check size={14} className="text-indigo-600" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors relative"
              >
                <Bell size={20} className="text-slate-500 hover:text-amber-600 transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <h3 className="font-medium text-slate-800">Notifications</h3>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-xs text-amber-600 font-medium hover:text-amber-700">Mark all read</button>
                      )}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${notification.isRead ? 'opacity-70' : 'bg-amber-50/10'}`}
                            onClick={() => {
                              if (!notification.isRead) {
                                setNotifications(notifications.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
                              }
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div className={`text-sm font-medium ${notification.isRead ? 'text-slate-600' : 'text-slate-800'}`}>
                                {notification.title}
                              </div>
                              {!notification.isRead && (
                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5"></div>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">{notification.description}</div>
                            <div className="text-[10px] text-slate-400 mt-2">{notification.time}</div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-slate-500 text-sm">
                          No notifications
                        </div>
                      )}
                    </div>
                    <div className="p-3 border-t border-slate-100 text-center bg-slate-50">
                      <Link
                        to="/communication/notifications"
                        onClick={() => setShowNotifications(false)}
                        className="text-sm font-medium text-amber-600 hover:text-amber-700 block w-full py-1"
                      >
                        View All Notifications
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/profile" className="flex items-center gap-3 group hover:bg-slate-100 p-1.5 pr-3 rounded-full transition-colors">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-slate-700 group-hover:text-amber-700 transition-colors">Admin User</div>
                <div className="text-xs text-slate-500 font-medium">System Administrator</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-white shadow-sm flex items-center justify-center text-amber-700 text-xs font-medium group-hover:bg-amber-200 transition-colors">
                AU
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 bg-slate-50 custom-scrollbar relative print:overflow-visible print:p-0 print:h-auto print:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setShowLogoutConfirm(false)}
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden m-4"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-red-100/80 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                  <LogOut className="w-8 h-8 text-red-600 ml-1" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Sign Out</h3>
                <p className="text-slate-500 mb-6 text-sm">
                  Are you sure you want to sign out of your account?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-800 font-semibold transition-colors"
                  >
                    No, Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowLogoutConfirm(false);
                      logout();
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl text-white bg-red-600 hover:bg-red-700 font-semibold transition-colors shadow-sm shadow-red-600/20"
                  >
                    Yes, Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MFA Overlay */}
      {mfaRequired && !mfaVerified && (
        <div className="fixed inset-0 z-[200]">
          <MfaVerification onVerified={() => setMfaVerified(true)} />
        </div>
      )}
    </div>
  );
};

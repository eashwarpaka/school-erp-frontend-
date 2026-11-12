import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RoleGate } from '../components/auth/RoleGate';
import { RootLayout } from '../components/layout/RootLayout';

// ── Loading Fallback ───────────────────────────────────────
const PageLoader = () => (
  <div className="flex items-center justify-center h-full min-h-[300px]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" style={{ borderWidth: 3 }} />
      <div className="text-sm text-slate-400 font-medium">Loading module…</div>
    </div>
  </div>
);

const wrap = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}><Component /></Suspense>
);

// ── Auth (eager — critical path) ──────────────────────────
import { AuthLayout } from '../features/auth/components/AuthLayout';
import { Login } from '../features/auth/components/Login';
import { Signup } from '../features/auth/components/Signup';
import { ForgotPassword } from '../features/auth/components/ForgotPassword';
import { VerifyOTP } from '../features/auth/components/VerifyOTP';
import { ResetPassword } from '../features/auth/components/ResetPassword';

// ── Core Layout (eager) ───────────────────────────────────

// ── Lazy: School Admin ────────────────────────────────────
const AcademicYears    = lazy(() => import('../features/admin/components/AcademicYears').then(m => ({ default: m.AcademicYears })));
const NewAcademicYear  = lazy(() => import('../features/admin/components/academic-years/NewAcademicYear').then(m => ({ default: m.NewAcademicYear })));
const EditAcademicYear = lazy(() => import('../features/admin/components/academic-years/EditAcademicYear').then(m => ({ default: m.EditAcademicYear })));
const TermsList        = lazy(() => import('../features/admin/components/terms/TermsList').then(m => ({ default: m.TermsList })));
const EditTerm         = lazy(() => import('../features/admin/components/terms/EditTerm').then(m => ({ default: m.EditTerm })));
const NewTerm          = lazy(() => import('../features/admin/components/terms/NewTerm').then(m => ({ default: m.NewTerm })));
const ClassesList      = lazy(() => import('../features/admin/components/classes/ClassesList').then(m => ({ default: m.ClassesList })));
const NewClass         = lazy(() => import('../features/admin/components/classes/NewClass').then(m => ({ default: m.NewClass })));
const EditClass        = lazy(() => import('../features/admin/components/classes/EditClass').then(m => ({ default: m.EditClass })));
const ClassMasterList  = lazy(() => import('../features/admin/components/classes/ClassMasterList').then(m => ({ default: m.ClassMasterList })));
const ClassYearOfferings = lazy(() => import('../features/admin/components/classes/ClassYearOfferings').then(m => ({ default: m.ClassYearOfferings })));
const SectionsList     = lazy(() => import('../features/admin/components/sections/SectionsList').then(m => ({ default: m.SectionsList })));
const CurriculumManager = lazy(() => import('../features/admin/components/curriculum/CurriculumManager').then(m => ({ default: m.CurriculumManager })));
const EnrollmentManager = lazy(() => import('../features/admin/components/enrollment/EnrollmentManager').then(m => ({ default: m.EnrollmentManager })));
const PromotionEngine  = lazy(() => import('../features/admin/components/promotion/PromotionEngine').then(m => ({ default: m.PromotionEngine })));
const AuditLog         = lazy(() => import('../features/admin/components/audit/AuditLog').then(m => ({ default: m.AuditLog })));
const IDCardManager    = lazy(() => import('../features/id-cards/components/IDCardManager').then(m => ({ default: m.IDCardManager })));

// ── Lazy: Students ────────────────────────────────────────
const StudentRegistry        = lazy(() => import('../features/students/components/StudentRegistry').then(m => ({ default: m.StudentRegistry })));
const RegisterStudent        = lazy(() => import('../features/students/components/RegisterStudent').then(m => ({ default: m.RegisterStudent })));
const EnrollStudent          = lazy(() => import('../features/students/components/EnrollStudent').then(m => ({ default: m.EnrollStudent })));
const EditStudent            = lazy(() => import('../features/students/components/EditStudent').then(m => ({ default: m.EditStudent })));
const ParentGuardianManagement = lazy(() => import('../features/students/components/ParentGuardianManagement').then(m => ({ default: m.ParentGuardianManagement })));

// ── Lazy: Academics ───────────────────────────────────────
const Timetable  = lazy(() => import('../features/academics/components/Timetable').then(m => ({ default: m.Timetable })));
const AITimetableGenerator = lazy(() => import('../features/academics/components/AITimetableGenerator').then(m => ({ default: m.AITimetableGenerator })));
const Assignments     = lazy(() => import('../features/academics/components/Assignments').then(m => ({ default: m.Assignments })));
const Absentees       = lazy(() => import('../features/academics/components/Absentees').then(m => ({ default: m.Absentees })));
const Rankings        = lazy(() => import('../features/academics/components/Rankings').then(m => ({ default: m.Rankings })));
const Exams           = lazy(() => import('../features/academics/components/Exams').then(m => ({ default: m.Exams })));
const ReportCards     = lazy(() => import('../features/academics/components/ReportCards').then(m => ({ default: m.ReportCards })));
const Analytics       = lazy(() => import('../features/academics/components/Analytics').then(m => ({ default: m.Analytics })));
const Electives       = lazy(() => import('../features/academics/components/Electives').then(m => ({ default: m.Electives })));
const LearningOutcomes = lazy(() => import('../features/academics/components/LearningOutcomes').then(m => ({ default: m.LearningOutcomes })));

// ── Lazy: HR ──────────────────────────────────────────────
const StaffDirectory    = lazy(() => import('../features/hr/components/StaffDirectory').then(m => ({ default: m.StaffDirectory })));
const LeaveManagement   = lazy(() => import('../features/hr/components/LeaveManagement').then(m => ({ default: m.LeaveManagement })));
const StaffAttendance   = lazy(() => import('../features/hr/components/StaffAttendance').then(m => ({ default: m.StaffAttendance })));
const PayrollDashboard  = lazy(() => import('../features/hr/components/PayrollDashboard').then(m => ({ default: m.PayrollDashboard })));

// ── Lazy: Dashboards ──────────────────────────────────────
const RoleDashboard     = lazy(() => import('../features/dashboard/components/RoleDashboard').then(m => ({ default: m.RoleDashboard })));
// Legacy dashboard components kept for direct-link compatibility
const AdminDashboard    = lazy(() => import('../features/dashboard/components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const TeacherDashboard  = lazy(() => import('../features/dashboard/components/TeacherDashboard').then(m => ({ default: m.TeacherDashboard })));

// ── Lazy: Communication ───────────────────────────────────
const OmnichannelHub    = lazy(() => import('../features/communication/components/OmnichannelHub').then(m => ({ default: m.OmnichannelHub })));
const Noticeboard       = lazy(() => import('../features/communication/components/Noticeboard').then(m => ({ default: m.Noticeboard })));
const Messages          = lazy(() => import('../features/communication/components/Messages').then(m => ({ default: m.Messages })));
const NotificationsList = lazy(() => import('../features/communication/components/NotificationsList').then(m => ({ default: m.NotificationsList })));

// ── Lazy: Finance ─────────────────────────────────────────
const FeeInvoiceScreen  = lazy(() => import('../features/finance/components/FeeInvoiceScreen').then(m => ({ default: m.FeeInvoiceScreen })));
const FeeCategories     = lazy(() => import('../features/finance/components/FeeCategories').then(m => ({ default: m.FeeCategories })));
const FeeStructuresList = lazy(() => import('../features/finance/components/FeeStructuresList').then(m => ({ default: m.FeeStructuresList })));
const FeeStructureSetup = lazy(() => import('../features/finance/components/FeeStructureSetup').then(m => ({ default: m.FeeStructureSetup })));
const StudentFees       = lazy(() => import('../features/finance/components/StudentFees').then(m => ({ default: m.StudentFees })));
const RecordPayment     = lazy(() => import('../features/finance/components/RecordPayment').then(m => ({ default: m.RecordPayment })));
const FeeReceipt        = lazy(() => import('../features/finance/components/FeeReceipt').then(m => ({ default: m.FeeReceipt })));
const OnlinePaymentScreen = lazy(() => import('../features/finance/components/OnlinePaymentScreen').then(m => ({ default: m.OnlinePaymentScreen })));

// ── Lazy: Reports ─────────────────────────────────────────
const ReportsDashboard      = lazy(() => import('../features/reports/components/ReportsDashboard').then(m => ({ default: m.ReportsDashboard })));
const StudentReports        = lazy(() => import('../features/reports/components/StudentReports').then(m => ({ default: m.StudentReports })));
const AttendanceReports     = lazy(() => import('../features/reports/components/AttendanceReports').then(m => ({ default: m.AttendanceReports })));
const FinancialReports      = lazy(() => import('../features/reports/components/FinancialReports').then(m => ({ default: m.FinancialReports })));
const PerformanceAnalytics  = lazy(() => import('../features/reports/components/PerformanceAnalytics').then(m => ({ default: m.PerformanceAnalytics })));

// ── Lazy: Profile ─────────────────────────────────────────
const MyProfile = lazy(() => import('../features/profile/components/MyProfile').then(m => ({ default: m.MyProfile })));

// ────────────────────────────────────────────────────────────
// Phase 2+ NEW MODULES (lazy-loaded)
// ────────────────────────────────────────────────────────────

// Admissions
const AdmissionsBoard = lazy(() => import('../features/admissions/components/AdmissionsBoard').then(m => ({ default: m.AdmissionsBoard })));

// Transport
const TransportDashboard = lazy(() => import('../features/transport/components/TransportDashboard').then(m => ({ default: m.TransportDashboard })));

// Attendance (Hardware Integrated)
const LiveAttendanceDashboard = lazy(() => import('../features/attendance/components/LiveAttendanceDashboard').then(m => ({ default: m.LiveAttendanceDashboard })));
const AIAttendanceAnalytics = lazy(() => import('../features/attendance/components/AIAttendanceAnalytics').then(m => ({ default: m.AIAttendanceAnalytics })));

// Library (Expanded)
const LibraryManagement = lazy(() => import('../features/library/components/LibraryManagement').then(m => ({ default: m.LibraryManagement })));

// Inventory (Expanded)
const InventoryManagement = lazy(() => import('../features/inventory/components/InventoryManagement').then(m => ({ default: m.InventoryManagement })));

// Hostel (Expanded)
const HostelManagement = lazy(() => import('../features/hostel/components/HostelManagement').then(m => ({ default: m.HostelManagement })));

// SaaS Admin (Phase 2)
const SuperAdminConsole = lazy(() => import('../features/admin/components/SuperAdminConsole').then(m => ({ default: m.SuperAdminConsole })));
const IntegrationMarketplace = lazy(() => import('../features/admin/components/IntegrationMarketplace').then(m => ({ default: m.IntegrationMarketplace })));

// AI Hub
const AIDashboard = lazy(() => import('../features/ai/components/AIDashboard').then(m => ({ default: m.AIDashboard })));

// ── Agents: Astra-Powered Education Layer ────────────────
const TeacherAgentDashboard = lazy(() => import('../features/agents/teacher/components/TeacherAgentDashboard').then(m => ({ default: m.TeacherAgentDashboard })));
const LiveTeachingCanvas    = lazy(() => import('../features/agents/teacher/components/LiveTeachingCanvas').then(m => ({ default: m.LiveTeachingCanvas })));
const StudentAgentControlPanel = lazy(() => import('../features/agents/teacher/components/StudentAgentControlPanel').then(m => ({ default: m.StudentAgentControlPanel })));
const StudentAgentPortal    = lazy(() => import('../features/agents/student/components/StudentAgentPortal').then(m => ({ default: m.StudentAgentPortal })));

// ── LMS & Online Classes ──────────────────────────────────
const LMSDashboard = lazy(() => import('../features/lms/components/LMSDashboard').then(m => ({ default: m.LMSDashboard })));
const CourseBuilder = lazy(() => import('../features/lms/components/CourseBuilder').then(m => ({ default: m.CourseBuilder })));
const LiveClassroom = lazy(() => import('../features/lms/components/LiveClassroom').then(m => ({ default: m.LiveClassroom })));
const AssessmentEngine = lazy(() => import('../features/lms/components/AssessmentEngine').then(m => ({ default: m.AssessmentEngine })));

// ── Certificate Generator ─────────────────────────────────
const CertificatesDashboard = lazy(() => import('../features/certificates/components/CertificatesDashboard').then(m => ({ default: m.CertificatesDashboard })));

// ── Parent & Student Portal ───────────────────────────────
const ParentPortal = lazy(() => import('../features/portal/components/ParentPortal').then(m => ({ default: m.ParentPortal })));
const StudentPortal = lazy(() => import('../features/portal/components/StudentPortal').then(m => ({ default: m.StudentPortal })));

// ── Live GPS Tracker ──────────────────────────────────────
const LiveGPSTracker = lazy(() => import('../features/transport/components/LiveGPSTracker').then(m => ({ default: m.LiveGPSTracker })));

// ── Error Pages ────────────────────────────────────────────
const Error403Page = () => (
  <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
    <div className="w-20 h-20 rounded-2xl bg-red-100 flex items-center justify-center">
      <span className="text-3xl">🚫</span>
    </div>
    <div className="text-2xl font-bold text-red-600">403 — Access Forbidden</div>
    <div className="text-slate-500">You don't have permission to access this page.</div>
  </div>
);

// ── Router ─────────────────────────────────────────────────
export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login',           element: <Login /> },
      { path: '/signup',          element: <Signup /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/verify-otp',      element: <VerifyOTP /> },
      { path: '/reset-password',  element: <ResetPassword /> },
    ],
  },
  { path: '/403', element: <Error403Page /> },
  {
    path: '/',
    element: <RoleGate />,
    children: [
      {
        element: <RootLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },

          // ── Profile ──────────────────────────────────────
          { path: 'profile', element: wrap(MyProfile) },

          // ── Dashboards ───────────────────────────────────
          // Unified role-aware dashboard (primary entry point)
          { path: 'dashboard', element: wrap(RoleDashboard) },
          // Legacy routes redirect to unified dashboard
          { path: 'dashboard/admin',   element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard/teacher', element: <Navigate to="/dashboard" replace /> },

          // ── School Admin ─────────────────────────────────
          { path: 'admin/academic-years',      element: wrap(AcademicYears) },
          { path: 'admin/academic-years/new',  element: wrap(NewAcademicYear) },
          { path: 'admin/academic-years/edit', element: wrap(EditAcademicYear) },
          { path: 'admin/terms',               element: wrap(TermsList) },
          { path: 'admin/terms/new',           element: wrap(NewTerm) },
          { path: 'admin/terms/edit',          element: wrap(EditTerm) },
          { path: 'admin/class-masters',       element: wrap(ClassMasterList) },
          { path: 'admin/class-year-offerings',element: wrap(ClassYearOfferings) },
          { path: 'admin/curriculum',          element: wrap(CurriculumManager) },
          { path: 'admin/classes',             element: wrap(ClassesList) },
          { path: 'admin/classes/new',         element: wrap(NewClass) },
          { path: 'admin/classes/edit',        element: wrap(EditClass) },
          { path: 'admin/sections',            element: wrap(SectionsList) },
          { path: 'admin/enrollment',          element: wrap(EnrollmentManager) },
          { path: 'admin/promotion',           element: wrap(PromotionEngine) },
          { path: 'admin/audit-log',           element: wrap(AuditLog) },
          { path: 'admin/id-cards',            element: wrap(IDCardManager) },

          // ── HR & Staff ───────────────────────────────────
          { path: 'hr/staff',      element: wrap(StaffDirectory) },
          { path: 'hr/leave',      element: wrap(LeaveManagement) },
          { path: 'hr/attendance', element: wrap(StaffAttendance) },
          { path: 'hr/payroll',    element: wrap(PayrollDashboard) },       // NEW Phase 2B

          // ── Students & Parents ───────────────────────────
          { path: 'students',                 element: wrap(StudentRegistry) },
          { path: 'students/register',        element: wrap(RegisterStudent) },
          { path: 'students/:id/enroll',      element: wrap(EnrollStudent) },
          { path: 'students/:id/edit',        element: wrap(EditStudent) },
          { path: 'students/parents',         element: wrap(ParentGuardianManagement) },

          // ── Admissions ───────────────────────────────────  NEW Phase 2A
          { path: 'admissions',               element: wrap(AdmissionsBoard) },

          // ── Academics ────────────────────────────────────
          { path: 'academics/timetable',        element: wrap(Timetable) },
          { path: 'academics/ai-timetable',     element: wrap(AITimetableGenerator) },
          { path: 'academics/exams',            element: wrap(Exams) },
          { path: 'academics/assignments',      element: wrap(Assignments) },
          { path: 'academics/absentees',        element: wrap(Absentees) },
          { path: 'academics/rankings',         element: wrap(Rankings) },
          { path: 'academics/report-cards',     element: wrap(ReportCards) },
          { path: 'academics/analytics',        element: wrap(Analytics) },
          { path: 'academics/electives',        element: wrap(Electives) },
          { path: 'academics/learning-outcomes',element: wrap(LearningOutcomes) },

          // ── Communication ────────────────────────────────
          { path: 'communication/omnichannel',  element: wrap(OmnichannelHub) },
          { path: 'communication/noticeboard',  element: wrap(Noticeboard) },
          { path: 'communication/messages',     element: wrap(Messages) },
          { path: 'communication/notifications',element: wrap(NotificationsList) },

          // ── Finance ──────────────────────────────────────
          { path: 'finance',                 element: wrap(FeeInvoiceScreen) },
          { path: 'finance/categories',      element: wrap(FeeCategories) },
          { path: 'finance/structures',      element: wrap(FeeStructuresList) },
          { path: 'finance/setup',           element: wrap(FeeStructureSetup) },
          { path: 'finance/structures/new',  element: wrap(FeeStructureSetup) },
          { path: 'finance/student-fees',    element: wrap(StudentFees) },
          { path: 'finance/record-payment',  element: wrap(RecordPayment) },
          { path: 'finance/receipt',         element: wrap(FeeReceipt) },
          { path: 'finance/pay-online',      element: wrap(OnlinePaymentScreen) },

          // ── Transport ────────────────────────────────────  NEW Phase 2C
          { path: 'transport',               element: wrap(TransportDashboard) },

          // ── Attendance ───────────────────────────────────  NEW Phase 1 & 2
          { path: 'attendance/live',         element: wrap(LiveAttendanceDashboard) },
          { path: 'attendance/analytics',    element: wrap(AIAttendanceAnalytics) },

          // ── Operations (Expanded) ────────────────────────
          { path: 'operations/library',      element: wrap(LibraryManagement) },
          { path: 'operations/inventory',    element: wrap(InventoryManagement) },
          { path: 'operations/hostel',       element: wrap(HostelManagement) },

          // ── LMS & Online Classes ──────────────────────────
          { path: 'lms',                     element: wrap(LMSDashboard) },
          { path: 'lms/course-builder',      element: wrap(CourseBuilder) },
          { path: 'lms/live-class',          element: wrap(LiveClassroom) },
          { path: 'lms/assessments',         element: wrap(AssessmentEngine) },

          // ── Certificates ──────────────────────────────────
          { path: 'certificates',            element: wrap(CertificatesDashboard) },

          // ── Parent & Student Portal ───────────────────────
          { path: 'portal/parent',           element: wrap(ParentPortal) },
          { path: 'portal/student',          element: wrap(StudentPortal) },

          // ── Live GPS Tracker ──────────────────────────────
          { path: 'transport/gps-tracker',   element: wrap(LiveGPSTracker) },

          // ── SaaS Layer ────────────────────────────────────
          { path: 'admin/saas-console',      element: wrap(SuperAdminConsole) },
          { path: 'admin/integrations',      element: wrap(IntegrationMarketplace) },

          // ── AI Hub ────────────────────────────────────────
          { path: 'ai',                      element: wrap(AIDashboard) },

          // ── Astra Agentic Layer ───────────────────────────
          { path: 'agents/teacher',               element: wrap(TeacherAgentDashboard) },
          { path: 'agents/teacher/teach',         element: wrap(LiveTeachingCanvas) },
          { path: 'agents/teacher/student-agents', element: wrap(StudentAgentControlPanel) },
          { path: 'agents/student',              element: wrap(StudentAgentPortal) },

          // ── Reports & Analytics ───────────────────────────
          { path: 'reports',              element: wrap(ReportsDashboard) },
          { path: 'reports/student',      element: wrap(StudentReports) },
          { path: 'reports/attendance',   element: wrap(AttendanceReports) },
          { path: 'reports/financial',    element: wrap(FinancialReports) },
          { path: 'reports/performance',  element: wrap(PerformanceAnalytics) },
          
          // ── Catch-all ─────────────────────────────────────
          { path: '*', element: <Navigate to="/dashboard" replace /> },
        ],
      },
    ],
  },
]);

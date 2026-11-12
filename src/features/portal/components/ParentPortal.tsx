import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, CreditCard, Calendar, BookOpen, Clock, Bell,
  FileText, TrendingUp, Award, MessageSquare, Bus,
  CheckCircle, AlertCircle, ChevronRight, Download,
  Star, Users, Heart, Shield, Phone, MapPin, Eye, X, Send
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

// ── Types ──────────────────────────────────────────────────
interface Child {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  section: string;
  rollNo: number;
  attendance: number;
  feeStatus: 'Paid' | 'Pending' | 'Overdue';
  pendingAmount: number;
  lastExamRank: number;
  totalStudents: number;
}

interface FeeItem {
  id: string;
  term: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  paidDate?: string;
}

interface AttendanceDay {
  date: string;
  status: 'Present' | 'Absent' | 'Holiday' | 'Late';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'fee' | 'academic' | 'event' | 'transport' | 'general';
  isRead: boolean;
}

// ── Mock Data ──────────────────────────────────────────────
const CHILDREN: Child[] = [
  { id: 'STU-001', name: 'Arjun Patel', avatar: '👦', grade: 'Grade 10', section: 'A', rollNo: 12, attendance: 94, feeStatus: 'Pending', pendingAmount: 15000, lastExamRank: 5, totalStudents: 45 },
  { id: 'STU-002', name: 'Priya Patel', avatar: '👧', grade: 'Grade 7', section: 'B', rollNo: 8, attendance: 98, feeStatus: 'Paid', pendingAmount: 0, lastExamRank: 2, totalStudents: 42 },
];

const FEE_ITEMS: FeeItem[] = [
  { id: 'FEE-001', term: 'Term 1 Tuition Fee', amount: 25000, dueDate: '2026-06-15', status: 'Paid', paidDate: '2026-06-10' },
  { id: 'FEE-002', term: 'Term 2 Tuition Fee', amount: 25000, dueDate: '2026-09-15', status: 'Overdue' },
  { id: 'FEE-003', term: 'Transport Fee (Q3)', amount: 8000, dueDate: '2026-10-01', status: 'Pending' },
  { id: 'FEE-004', term: 'Annual Activity Fee', amount: 5000, dueDate: '2026-04-01', status: 'Paid', paidDate: '2026-03-28' },
];

const RECENT_ATTENDANCE: AttendanceDay[] = [
  { date: 'Mon, Sep 15', status: 'Present' },
  { date: 'Tue, Sep 16', status: 'Present' },
  { date: 'Wed, Sep 17', status: 'Late' },
  { date: 'Thu, Sep 18', status: 'Present' },
  { date: 'Fri, Sep 19', status: 'Holiday' },
];

const NOTIFICATIONS: Notification[] = [
  { id: 'N-1', title: 'Fee Reminder', message: 'Term 2 tuition fee of ₹25,000 is overdue. Please pay immediately.', time: '2 hours ago', type: 'fee', isRead: false },
  { id: 'N-2', title: 'Mid-Term Results', message: 'Arjun\'s mid-term exam results are now available.', time: '1 day ago', type: 'academic', isRead: false },
  { id: 'N-3', title: 'Annual Day Event', message: 'Annual Day celebration on Sep 25. Students to report at 8:00 AM.', time: '2 days ago', type: 'event', isRead: true },
  { id: 'N-4', title: 'Bus Route Change', message: 'Route 5 morning pickup time changed to 7:15 AM from Sep 20.', time: '3 days ago', type: 'transport', isRead: true },
];

const EXAM_RESULTS = [
  { subject: 'Mathematics', marks: 88, total: 100, grade: 'A+' },
  { subject: 'Science', marks: 76, total: 100, grade: 'A' },
  { subject: 'English', marks: 82, total: 100, grade: 'A' },
  { subject: 'Hindi', marks: 71, total: 100, grade: 'B+' },
  { subject: 'Social Science', marks: 79, total: 100, grade: 'A' },
  { subject: 'Computer Science', marks: 92, total: 100, grade: 'A+' },
];

const statusColors = {
  Present: 'bg-emerald-100 text-emerald-700',
  Absent: 'bg-red-100 text-red-700',
  Holiday: 'bg-blue-100 text-blue-700',
  Late: 'bg-amber-100 text-amber-700',
};

const feeStatusColors = {
  Paid: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-amber-100 text-amber-700',
  Overdue: 'bg-red-100 text-red-700',
};

const notifIcons = {
  fee: CreditCard,
  academic: BookOpen,
  event: Calendar,
  transport: Bus,
  general: Bell,
};

// ── Component ──────────────────────────────────────────────
export const ParentPortal = () => {
  const [selectedChild, setSelectedChild] = useState(CHILDREN[0]);
  const [activeSection, setActiveSection] = useState<'overview' | 'fees' | 'academics' | 'attendance' | 'notifications'>('overview');
  
  // Modals state
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [paymentFee, setPaymentFee] = useState<FeeItem | 'all' | null>(null);
  const [receiptFee, setReceiptFee] = useState<FeeItem | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');

  const handleSendMessage = () => {
    if (!messageText.trim()) return toast.error('Message cannot be empty');
    toast.success('Message sent to teacher successfully!');
    setIsMessageModalOpen(false);
    setMessageText('');
  };

  const handlePayment = () => {
    toast.success('Payment processed successfully!');
    setPaymentFee(null);
  };

  const downloadTextFile = (filename: string, content: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success(`${filename} downloaded successfully!`);
  };

  const handleDownloadReceipt = () => {
    if (!receiptFee) return;
    const content = `PAYMENT RECEIPT\n-----------------------------\nStudent Name: ${selectedChild.name}\nFee Term: ${receiptFee.term}\nAmount: ₹${receiptFee.amount.toLocaleString()}\nDate Paid: ${receiptFee.paidDate || 'N/A'}\n-----------------------------\nSmart School System`;
    downloadTextFile(`${selectedChild.name.replace(' ', '_')}_Receipt.txt`, content);
  };

  const handleDownloadReportCard = () => {
    let content = `ACADEMIC REPORT CARD\n-----------------------------\nSmart School System - Mid-Term 2026-27\n-----------------------------\nStudent Name: ${selectedChild.name}\nGrade/Section: ${selectedChild.grade} - ${selectedChild.section}\nRoll No: ${selectedChild.rollNo}\nAttendance: ${selectedChild.attendance}%\n-----------------------------\nSUBJECT\t\tTOTAL\tOBTAINED\tGRADE\n`;
    EXAM_RESULTS.forEach(r => {
      content += `${r.subject.padEnd(20)}\t${r.total}\t${r.marks}\t\t${r.grade}\n`;
    });
    content += `-----------------------------\nTotal: ${EXAM_RESULTS.reduce((acc, curr) => acc + curr.marks, 0)} / ${EXAM_RESULTS.length * 100}\nPercentage: ${Math.round(EXAM_RESULTS.reduce((s, r) => s + r.marks, 0) / EXAM_RESULTS.length)}%\nOverall Grade: ${Math.round(EXAM_RESULTS.reduce((s, r) => s + r.marks, 0) / EXAM_RESULTS.length) >= 85 ? 'A+' : 'A'}\n`;
    downloadTextFile(`${selectedChild.name.replace(' ', '_')}_ReportCard.txt`, content);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Heart size={26} className="text-rose-500" />
            Parent Portal
          </h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back! Track your children's progress and manage school activities</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMessageModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50"
          >
            <MessageSquare size={15} /> Message Teacher
          </button>
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-rose-200"
          >
            <Download size={15} /> Report Card
          </button>
        </div>
      </div>

      {/* Child Selector */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {CHILDREN.map(child => (
          <motion.button
            key={child.id}
            whileHover={{ y: -2 }}
            onClick={() => setSelectedChild(child)}
            className={clsx(
              'flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all min-w-[220px]',
              selectedChild.id === child.id
                ? 'border-rose-300 bg-rose-50 shadow-sm'
                : 'border-slate-100 bg-white hover:border-slate-200'
            )}
          >
            <span className="text-3xl">{child.avatar}</span>
            <div className="text-left">
              <div className="font-semibold text-slate-800 text-sm">{child.name}</div>
              <div className="text-xs text-slate-500">{child.grade} • Section {child.section}</div>
            </div>
            {child.feeStatus === 'Overdue' && (
              <span className="ml-auto w-2 h-2 rounded-full bg-red-500" />
            )}
          </motion.button>
        ))}
      </div>

      {/* Section Tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 overflow-x-auto">
        {([
          { key: 'overview', label: '📊 Overview' },
          { key: 'fees', label: '💳 Fees' },
          { key: 'academics', label: '📚 Academics' },
          { key: 'attendance', label: '📅 Attendance' },
          { key: 'notifications', label: '🔔 Notifications' },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveSection(tab.key)}
            className={clsx(
              'px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all',
              activeSection === tab.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Quick Stats */}
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Attendance', value: `${selectedChild.attendance}%`, icon: Calendar, color: 'from-emerald-500 to-teal-600', sub: 'This term' },
              { label: 'Exam Rank', value: `#${selectedChild.lastExamRank}`, icon: Award, color: 'from-amber-500 to-orange-600', sub: `of ${selectedChild.totalStudents}` },
              { label: 'Fee Status', value: selectedChild.feeStatus, icon: CreditCard, color: selectedChild.feeStatus === 'Paid' ? 'from-emerald-500 to-teal-600' : 'from-red-500 to-rose-600', sub: selectedChild.pendingAmount > 0 ? `₹${selectedChild.pendingAmount.toLocaleString()} due` : 'All clear' },
              { label: 'Roll Number', value: `#${selectedChild.rollNo}`, icon: Users, color: 'from-blue-500 to-indigo-600', sub: `${selectedChild.grade}-${selectedChild.section}` },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl border border-slate-100 p-4"
              >
                <div className={clsx('w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center mb-3', stat.color)}>
                  <stat.icon size={18} className="text-white" />
                </div>
                <div className="text-lg font-bold text-slate-800">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{stat.sub}</div>
              </motion.div>
            ))}

            {/* Recent Attendance */}
            <div className="col-span-2 md:col-span-4 bg-white rounded-xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 text-sm">This Week's Attendance</h3>
                <button onClick={() => setActiveSection('attendance')} className="text-xs text-indigo-600 hover:underline">View Full Report →</button>
              </div>
              <div className="flex gap-3">
                {RECENT_ATTENDANCE.map(day => (
                  <div key={day.date} className="flex-1 text-center">
                    <div className="text-[11px] text-slate-500 mb-2">{day.date.split(',')[0]}</div>
                    <div className={clsx('py-2 rounded-lg text-xs font-medium', statusColors[day.status])}>
                      {day.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <Bell size={15} className="text-rose-500" /> Recent Updates
              </h3>
              <span className="text-[10px] px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full font-medium">
                {NOTIFICATIONS.filter(n => !n.isRead).length} new
              </span>
            </div>
            <div className="space-y-3">
              {NOTIFICATIONS.map(notif => {
                const Icon = notifIcons[notif.type];
                return (
                  <div
                    key={notif.id}
                    className={clsx(
                      'p-3 rounded-lg cursor-pointer transition-colors',
                      notif.isRead ? 'bg-slate-50 hover:bg-slate-100' : 'bg-rose-50 hover:bg-rose-100'
                    )}
                  >
                    <div className="flex items-start gap-2.5">
                      <Icon size={14} className={notif.isRead ? 'text-slate-400 mt-0.5' : 'text-rose-500 mt-0.5'} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-800">{notif.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{notif.message}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{notif.time}</div>
                      </div>
                      {!notif.isRead && <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 mt-1" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Fees Section */}
      {activeSection === 'fees' && (
        <div className="space-y-4">
          {selectedChild.pendingAmount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <AlertCircle size={24} className="text-red-500" />
                <div>
                  <div className="font-semibold text-red-800">Outstanding Balance: ₹{selectedChild.pendingAmount.toLocaleString()}</div>
                  <div className="text-xs text-red-600 mt-0.5">Please clear pending fees to avoid late charges</div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPaymentFee('all')}
                className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-red-200"
              >
                Pay Now →
              </motion.button>
            </motion.div>
          )}

          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Fee Description</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Due Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {FEE_ITEMS.map(fee => (
                  <tr key={fee.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{fee.term}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">₹{fee.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{fee.dueDate}</td>
                    <td className="px-4 py-3">
                      <span className={clsx('text-[10px] font-medium px-2 py-0.5 rounded-full', feeStatusColors[fee.status])}>{fee.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {fee.status === 'Paid' ? (
                        <button onClick={() => setReceiptFee(fee)} className="text-xs text-indigo-600 hover:underline">Receipt ↓</button>
                      ) : (
                        <button onClick={() => setPaymentFee(fee)} className="text-xs px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Pay Now</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Academics Section */}
      {activeSection === 'academics' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <h3 className="font-semibold text-slate-800 mb-4">Latest Exam Results — Mid-Term 2026</h3>
            <div className="space-y-3">
              {EXAM_RESULTS.map(result => (
                <div key={result.subject} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50">
                  <div className="w-32 text-sm font-medium text-slate-700">{result.subject}</div>
                  <div className="flex-1">
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.marks}%` }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className={clsx(
                          'h-full rounded-full',
                          result.marks >= 85 ? 'bg-emerald-500' : result.marks >= 70 ? 'bg-blue-500' : result.marks >= 50 ? 'bg-amber-500' : 'bg-red-500'
                        )}
                      />
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    <span className="text-sm font-bold text-slate-800">{result.marks}/{result.total}</span>
                  </div>
                  <div className="w-10">
                    <span className={clsx(
                      'text-xs font-bold px-1.5 py-0.5 rounded',
                      result.marks >= 85 ? 'bg-emerald-100 text-emerald-700' : result.marks >= 70 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    )}>
                      {result.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between">
              <span className="text-sm text-slate-600">Overall Average</span>
              <span className="text-lg font-bold text-slate-800">
                {Math.round(EXAM_RESULTS.reduce((s, r) => s + r.marks, 0) / EXAM_RESULTS.length)}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <h3 className="font-semibold text-slate-800 mb-3 text-sm">📝 Pending Assignments</h3>
              {[
                { subject: 'Mathematics', title: 'Quadratic Equations Worksheet', due: 'Sep 20' },
                { subject: 'English', title: 'Essay: My Favorite Book', due: 'Sep 22' },
              ].map((a, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-slate-700">{a.title}</div>
                    <div className="text-xs text-slate-500">{a.subject} • Due: {a.due}</div>
                  </div>
                  <ChevronRight size={14} className="text-slate-300" />
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <h3 className="font-semibold text-slate-800 mb-3 text-sm">🏆 Achievements</h3>
              {[
                { title: 'Science Olympiad Qualifier', date: 'Sep 2026', icon: '🥇' },
                { title: 'Best in Mathematics — Term 1', date: 'Jul 2026', icon: '🏅' },
                { title: 'Perfect Attendance Award', date: 'Jun 2026', icon: '⭐' },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
                  <span className="text-xl">{a.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-slate-700">{a.title}</div>
                    <div className="text-xs text-slate-500">{a.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Attendance Section */}
      {activeSection === 'attendance' && (
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Attendance Summary — September 2026</h3>
            <span className="text-2xl font-bold text-emerald-600">{selectedChild.attendance}%</span>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-6">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center text-[11px] text-slate-500 font-medium py-1">{day}</div>
            ))}
            {Array.from({ length: 30 }, (_, i) => {
              const statuses = ['Present', 'Present', 'Present', 'Present', 'Holiday', 'Absent', 'Present'] as const;
              const s = statuses[i % 7];
              return (
                <div
                  key={i}
                  className={clsx(
                    'aspect-square rounded-lg flex items-center justify-center text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity',
                    s === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                    s === 'Absent' ? 'bg-red-100 text-red-700' :
                    'bg-blue-50 text-blue-500'
                  )}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-100" /> Present</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100" /> Absent</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-50" /> Holiday</span>
          </div>
        </div>
      )}

      {/* Notifications Section */}
      {activeSection === 'notifications' && (
        <div className="space-y-3">
          {NOTIFICATIONS.map(notif => {
            const Icon = notifIcons[notif.type];
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={clsx(
                  'bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md transition-all',
                  notif.isRead ? 'border-slate-100' : 'border-rose-200 bg-rose-50/30'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={clsx(
                    'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                    notif.isRead ? 'bg-slate-100' : 'bg-rose-100'
                  )}>
                    <Icon size={18} className={notif.isRead ? 'text-slate-500' : 'text-rose-600'} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-800">{notif.title}</h4>
                      <span className="text-[10px] text-slate-400">{notif.time}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      {/* Modals */}
      
      {/* Message Teacher Modal */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <MessageSquare size={18} className="text-indigo-500" />
                Message Class Teacher
              </h3>
              <button onClick={() => setIsMessageModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">To</label>
                <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
                  Mr. Sharma (Class Teacher - {selectedChild.grade} {selectedChild.section})
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                />
              </div>
            </div>
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setIsMessageModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                <Send size={15} /> Send Message
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentFee && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <CreditCard size={18} className="text-indigo-500" />
                Fee Payment
              </h3>
              <button onClick={() => setPaymentFee(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 text-center border-b border-slate-100">
              <p className="text-sm text-slate-500 mb-1">Amount to Pay</p>
              <div className="text-3xl font-bold text-slate-800">
                ₹{paymentFee === 'all' ? selectedChild.pendingAmount.toLocaleString() : paymentFee.amount.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                For: {paymentFee === 'all' ? 'All Outstanding Dues' : paymentFee.term}
              </p>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-sm font-medium text-slate-700">Select Payment Method</p>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-indigo-500 bg-indigo-50 rounded-xl">
                  <CreditCard size={24} className="text-indigo-600" />
                  <span className="text-xs font-medium text-indigo-700">Card</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-4 border border-slate-200 hover:border-slate-300 rounded-xl">
                  <span className="font-bold text-slate-600">UPI</span>
                  <span className="text-xs font-medium text-slate-500">Google Pay / PhonePe</span>
                </button>
              </div>
            </div>
            <div className="p-5 bg-slate-50">
              <button
                onClick={handlePayment}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
              >
                Proceed to Pay ₹{paymentFee === 'all' ? selectedChild.pendingAmount.toLocaleString() : paymentFee.amount.toLocaleString()}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Receipt Modal */}
      {receiptFee && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
          >
            <div className="p-6 text-center border-b border-slate-100 relative">
              <button onClick={() => setReceiptFee(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={24} />
              </div>
              <h3 className="font-semibold text-slate-800 text-lg">Payment Receipt</h3>
              <p className="text-sm text-slate-500">{receiptFee.term}</p>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name</span>
                <span className="font-medium text-slate-800">{selectedChild.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date Paid</span>
                <span className="font-medium text-slate-800">{receiptFee.paidDate || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID</span>
                <span className="font-medium text-slate-800">TXN-{Math.floor(Math.random() * 1000000)}</span>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between font-bold text-lg">
                <span className="text-slate-800">Total</span>
                <span className="text-emerald-600">₹{receiptFee.amount.toLocaleString()}</span>
              </div>
            </div>
            <div className="p-4 bg-slate-50 flex gap-3">
              <button
                onClick={handleDownloadReceipt}
                className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 flex justify-center items-center gap-2"
              >
                <Download size={16} /> Download
              </button>
              <button
                onClick={() => setReceiptFee(null)}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Report Card Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Award size={20} className="text-amber-500" />
                Academic Report Card
              </h3>
              <div className="flex items-center gap-2">
                <button onClick={handleDownloadReportCard} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
                  <Download size={18} />
                </button>
                <button onClick={() => setIsReportModalOpen(false)} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">SMART SCHOOL SYSTEM</h2>
                <p className="text-slate-500">Mid-Term Examination 2026-27</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 rounded-xl text-sm">
                <div>
                  <p className="text-slate-500 mb-1">Student Name: <span className="font-semibold text-slate-800">{selectedChild.name}</span></p>
                  <p className="text-slate-500">Roll No: <span className="font-semibold text-slate-800">{selectedChild.rollNo}</span></p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Grade/Section: <span className="font-semibold text-slate-800">{selectedChild.grade} - {selectedChild.section}</span></p>
                  <p className="text-slate-500">Attendance: <span className="font-semibold text-slate-800">{selectedChild.attendance}%</span></p>
                </div>
              </div>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-200 p-2 text-left font-semibold text-slate-700">Subject</th>
                    <th className="border border-slate-200 p-2 text-center font-semibold text-slate-700">Total Marks</th>
                    <th className="border border-slate-200 p-2 text-center font-semibold text-slate-700">Marks Obtained</th>
                    <th className="border border-slate-200 p-2 text-center font-semibold text-slate-700">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {EXAM_RESULTS.map((result, i) => (
                    <tr key={i}>
                      <td className="border border-slate-200 p-2 text-slate-800">{result.subject}</td>
                      <td className="border border-slate-200 p-2 text-center text-slate-600">{result.total}</td>
                      <td className="border border-slate-200 p-2 text-center font-medium text-slate-800">{result.marks}</td>
                      <td className="border border-slate-200 p-2 text-center font-bold text-slate-800">{result.grade}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={2} className="border border-slate-200 p-2 text-right">Total / Percentage:</td>
                    <td className="border border-slate-200 p-2 text-center text-indigo-600">
                      {EXAM_RESULTS.reduce((acc, curr) => acc + curr.marks, 0)} / {Math.round(EXAM_RESULTS.reduce((s, r) => s + r.marks, 0) / EXAM_RESULTS.length)}%
                    </td>
                    <td className="border border-slate-200 p-2 text-center text-indigo-600">
                      {Math.round(EXAM_RESULTS.reduce((s, r) => s + r.marks, 0) / EXAM_RESULTS.length) >= 85 ? 'A+' : 'A'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

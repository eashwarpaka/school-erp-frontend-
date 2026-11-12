import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, Users, TrendingUp, Calendar, Download, Play,
  CheckCircle, AlertCircle, Clock, ChevronDown, ChevronRight,
  FileText, Sliders, CreditCard, Shield, Building2, Eye,
  Printer, RefreshCw, Filter, Search, ArrowUpRight, Banknote,
  Sparkles, User, BarChart3, Info
} from 'lucide-react';
import clsx from 'clsx';

// ── Types ──────────────────────────────────────────────────
type PayrollStatus = 'Pending' | 'Processing' | 'Processed' | 'Paid' | 'On Hold';

interface StaffPayroll {
  id: string;
  name: string;
  empId: string;
  department: string;
  designation: string;
  basic: number;
  hra: number;
  da: number;
  ta: number;
  specialAllowance: number;
  grossSalary: number;
  pf: number;
  esi: number;
  tds: number;
  professionalTax: number;
  totalDeductions: number;
  netSalary: number;
  status: PayrollStatus;
  bankAccount: string;
  ifsc: string;
  workingDays: number;
  presentDays: number;
  lop: number; // Loss of Pay days
}

interface PayrollRun {
  id: string;
  month: string;
  year: number;
  status: 'Draft' | 'Verified' | 'Approved' | 'Disbursed';
  totalStaff: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  processedOn?: string;
  approvedBy?: string;
}

// ── Mock Data ──────────────────────────────────────────────
const STAFF_PAYROLL: StaffPayroll[] = [
  { id: 'EMP-001', name: 'Rajesh Kumar',   empId: 'TCH-001', department: 'Mathematics', designation: 'Senior Teacher',     basic: 45000, hra: 18000, da: 4500, ta: 2000, specialAllowance: 3000, grossSalary: 72500, pf: 5400, esi: 0,   tds: 3200, professionalTax: 200, totalDeductions: 8800, netSalary: 63700, status: 'Processed', bankAccount: '****4521', ifsc: 'SBIN0001234', workingDays: 26, presentDays: 25, lop: 1 },
  { id: 'EMP-002', name: 'Sunitha Rao',    empId: 'TCH-002', department: 'Science',     designation: 'Teacher',            basic: 38000, hra: 15200, da: 3800, ta: 2000, specialAllowance: 2000, grossSalary: 61000, pf: 4560, esi: 0,   tds: 2100, professionalTax: 200, totalDeductions: 6860, netSalary: 54140, status: 'Processed', bankAccount: '****7832', ifsc: 'HDFC0001234', workingDays: 26, presentDays: 26, lop: 0 },
  { id: 'EMP-003', name: 'Pradeep Menon',  empId: 'ADM-001', department: 'Admin',       designation: 'Office Manager',     basic: 32000, hra: 12800, da: 3200, ta: 1500, specialAllowance: 1500, grossSalary: 51000, pf: 3840, esi: 574, tds: 800,  professionalTax: 200, totalDeductions: 5414, netSalary: 45586, status: 'On Hold',   bankAccount: '****3344', ifsc: 'ICICI001234', workingDays: 26, presentDays: 22, lop: 4 },
  { id: 'EMP-004', name: 'Kavitha Srinivas',empId: 'TCH-003', department: 'English',    designation: 'Teacher',            basic: 36000, hra: 14400, da: 3600, ta: 2000, specialAllowance: 2000, grossSalary: 58000, pf: 4320, esi: 0,   tds: 1800, professionalTax: 200, totalDeductions: 6320, netSalary: 51680, status: 'Paid',      bankAccount: '****9987', ifsc: 'AXIS0001234', workingDays: 26, presentDays: 26, lop: 0 },
  { id: 'EMP-005', name: 'Anand Pillai',   empId: 'TCH-004', department: 'Social Studies', designation: 'HOD',            basic: 52000, hra: 20800, da: 5200, ta: 2500, specialAllowance: 4000, grossSalary: 84500, pf: 6240, esi: 0,   tds: 5800, professionalTax: 200, totalDeductions: 12240, netSalary: 72260, status: 'Processed', bankAccount: '****1122', ifsc: 'SBIN0005678', workingDays: 26, presentDays: 26, lop: 0 },
  { id: 'EMP-006', name: 'Meena Krishnan', empId: 'SUP-001', department: 'Support',     designation: 'Peon',               basic: 18000, hra: 7200,  da: 1800, ta: 1000, specialAllowance: 500,  grossSalary: 28500, pf: 2160, esi: 428, tds: 0,    professionalTax: 150, totalDeductions: 2738, netSalary: 25762, status: 'Pending',   bankAccount: '****5566', ifsc: 'PNB00001234', workingDays: 26, presentDays: 24, lop: 2 },
];

const PAYROLL_HISTORY: PayrollRun[] = [
  { id: 'PR-2026-07', month: 'July',  year: 2026, status: 'Disbursed', totalStaff: 42, totalGross: 2850000, totalDeductions: 398000, totalNet: 2452000, processedOn: '2026-07-31', approvedBy: 'Principal Suresh' },
  { id: 'PR-2026-06', month: 'June',  year: 2026, status: 'Disbursed', totalStaff: 42, totalGross: 2850000, totalDeductions: 395000, totalNet: 2455000, processedOn: '2026-06-30', approvedBy: 'Principal Suresh' },
  { id: 'PR-2026-05', month: 'May',   year: 2026, status: 'Disbursed', totalStaff: 40, totalGross: 2720000, totalDeductions: 382000, totalNet: 2338000, processedOn: '2026-05-31', approvedBy: 'Principal Suresh' },
];

const STATUS_STYLES: Record<PayrollStatus, string> = {
  Pending:    'bg-slate-100 text-slate-600',
  Processing: 'bg-blue-100 text-blue-700',
  Processed:  'bg-amber-100 text-amber-700',
  Paid:       'bg-emerald-100 text-emerald-700',
  'On Hold':  'bg-red-100 text-red-700',
};

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

// ── Stat Card ──────────────────────────────────────────────
const KPICard = ({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub?: string; icon: React.ElementType; color: string }) => (
  <motion.div whileHover={{ y: -2 }} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
    <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', color)}>
      <Icon size={22} className="text-white" />
    </div>
    <div className="min-w-0">
      <div className="text-xl font-bold text-slate-800 truncate">{value}</div>
      <div className="text-xs text-slate-500 font-medium">{label}</div>
      {sub && <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>}
    </div>
  </motion.div>
);

// ── Payslip Modal ──────────────────────────────────────────
const PayslipModal = ({ employee, onClose }: { employee: StaffPayroll; onClose: () => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
    <motion.div
      initial={{ scale: 0.95, y: 10 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.95, y: 10 }}
      className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
    >
      {/* Payslip Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold">Smart School ERP</div>
            <div className="text-sm text-slate-300">Salary Slip for July 2026</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Employee ID</div>
            <div className="font-mono font-bold">{employee.empId}</div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Employee Info */}
        <div className="grid grid-cols-3 gap-4 pb-6 border-b border-slate-100 mb-6">
          {[
            { label: 'Name', value: employee.name },
            { label: 'Designation', value: employee.designation },
            { label: 'Department', value: employee.department },
            { label: 'Working Days', value: `${employee.workingDays}` },
            { label: 'Present Days', value: `${employee.presentDays}` },
            { label: 'LOP Days', value: `${employee.lop}` },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-xs text-slate-400 uppercase tracking-wide">{label}</div>
              <div className="font-semibold text-slate-800 text-sm mt-0.5">{value}</div>
            </div>
          ))}
        </div>

        {/* Earnings vs Deductions */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Earnings</h3>
            <div className="space-y-2">
              {[
                { label: 'Basic Salary', value: employee.basic },
                { label: 'HRA', value: employee.hra },
                { label: 'Dearness Allowance', value: employee.da },
                { label: 'Transport Allowance', value: employee.ta },
                { label: 'Special Allowance', value: employee.specialAllowance },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-slate-600">{label}</span>
                  <span className="font-medium text-slate-800">{fmt(value)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-100 text-emerald-700">
                <span>Gross Earnings</span>
                <span>{fmt(employee.grossSalary)}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Deductions</h3>
            <div className="space-y-2">
              {[
                { label: 'Provident Fund (PF)', value: employee.pf },
                { label: 'ESI', value: employee.esi },
                { label: 'TDS (Income Tax)', value: employee.tds },
                { label: 'Professional Tax', value: employee.professionalTax },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-slate-600">{label}</span>
                  <span className="font-medium text-red-600">{fmt(value)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-100 text-red-700">
                <span>Total Deductions</span>
                <span>{fmt(employee.totalDeductions)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Salary */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100 flex items-center justify-between">
          <div>
            <div className="text-sm text-emerald-700 font-medium">Net Salary (Take Home)</div>
            <div className="text-xs text-emerald-600 mt-0.5">Bank: {employee.bankAccount} · IFSC: {employee.ifsc}</div>
          </div>
          <div className="text-2xl font-black text-emerald-700">{fmt(employee.netSalary)}</div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
            <Download size={15} /> Download PDF
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
            <Printer size={15} /> Print
          </button>
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// ── Main Component ─────────────────────────────────────────
export const PayrollDashboard = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<StaffPayroll | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'statutory'>('current');

  const currentMonth = { month: 'August', year: 2026 };
  const totalGross = STAFF_PAYROLL.reduce((s, e) => s + e.grossSalary, 0);
  const totalDeductions = STAFF_PAYROLL.reduce((s, e) => s + e.totalDeductions, 0);
  const totalNet = STAFF_PAYROLL.reduce((s, e) => s + e.netSalary, 0);
  const totalPF = STAFF_PAYROLL.reduce((s, e) => s + e.pf, 0);
  const totalTDS = STAFF_PAYROLL.reduce((s, e) => s + e.tds, 0);

  const filtered = STAFF_PAYROLL.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const runStatus = { Pending: 3, Processed: 2, Paid: 1, 'On Hold': 1 };

  return (
    <div className="flex flex-col gap-5 p-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Payroll Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">{currentMonth.month} {currentMonth.year} · Payroll Run</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <Download size={14} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold shadow-md shadow-emerald-200 hover:from-emerald-600 hover:to-teal-600 transition-all">
            <Play size={14} /> Run Payroll
          </button>
        </div>
      </div>

      {/* Run Status Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Clock size={20} className="text-amber-600" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-amber-800">August 2026 Payroll — Processing in Progress</div>
          <div className="text-xs text-amber-600 mt-0.5">
            {Object.entries(runStatus).map(([k, v]) => `${v} ${k}`).join(' · ')}
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 text-xs font-semibold hover:bg-amber-200 transition-colors">Review</button>
          <button className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors">Approve All</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <KPICard label="Total Staff" value={`${STAFF_PAYROLL.length}`} icon={Users} color="bg-blue-500" sub="Active employees" />
        <KPICard label="Gross Payroll" value={fmt(totalGross)} icon={DollarSign} color="bg-slate-700" />
        <KPICard label="Total Deductions" value={fmt(totalDeductions)} icon={TrendingUp} color="bg-red-500" />
        <KPICard label="Net Disbursement" value={fmt(totalNet)} icon={Banknote} color="bg-emerald-500" />
        <KPICard label="PF Liability" value={fmt(totalPF)} icon={Shield} color="bg-purple-500" sub={`TDS: ${fmt(totalTDS)}`} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {(['current', 'history', 'statutory'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={clsx('px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all', activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>
            {tab === 'current' ? 'Current Month' : tab === 'history' ? 'History' : 'Statutory'}
          </button>
        ))}
      </div>

      {/* Current Month Table */}
      {activeTab === 'current' && (
        <>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search by name, ID, or department…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full max-w-sm pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400" />
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {['Employee', 'Department', 'Days', 'Gross', 'PF', 'ESI', 'TDS', 'Net Salary', 'Status', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(emp => (
                    <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{emp.name}</div>
                            <div className="text-xs text-slate-400">{emp.empId} · {emp.designation}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{emp.department}</td>
                      <td className="px-4 py-3">
                        <div className="text-slate-600">{emp.presentDays}/{emp.workingDays}</div>
                        {emp.lop > 0 && <div className="text-xs text-red-500">LOP: {emp.lop}d</div>}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{fmt(emp.grossSalary)}</td>
                      <td className="px-4 py-3 text-red-600 whitespace-nowrap">{fmt(emp.pf)}</td>
                      <td className="px-4 py-3 text-red-600 whitespace-nowrap">{fmt(emp.esi)}</td>
                      <td className="px-4 py-3 text-red-600 whitespace-nowrap">{fmt(emp.tds)}</td>
                      <td className="px-4 py-3 font-bold text-emerald-700 whitespace-nowrap">{fmt(emp.netSalary)}</td>
                      <td className="px-4 py-3">
                        <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap', STATUS_STYLES[emp.status])}>{emp.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelectedEmployee(emp)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* Footer totals */}
                <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 font-bold text-slate-700 text-sm">Totals ({filtered.length} employees)</td>
                    <td className="px-4 py-3 font-bold text-slate-800">{fmt(filtered.reduce((s, e) => s + e.grossSalary, 0))}</td>
                    <td className="px-4 py-3 font-bold text-red-600">{fmt(filtered.reduce((s, e) => s + e.pf, 0))}</td>
                    <td className="px-4 py-3 font-bold text-red-600">{fmt(filtered.reduce((s, e) => s + e.esi, 0))}</td>
                    <td className="px-4 py-3 font-bold text-red-600">{fmt(filtered.reduce((s, e) => s + e.tds, 0))}</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">{fmt(filtered.reduce((s, e) => s + e.netSalary, 0))}</td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {PAYROLL_HISTORY.map(run => (
            <motion.div key={run.id} whileHover={{ y: -1 }} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Calendar size={20} className="text-slate-600" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{run.month} {run.year}</div>
                    <div className="text-xs text-slate-500">{run.totalStaff} employees · Processed: {run.processedOn}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Gross</div>
                    <div className="font-semibold text-slate-700">{fmt(run.totalGross)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Deductions</div>
                    <div className="font-semibold text-red-600">{fmt(run.totalDeductions)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Net</div>
                    <div className="font-bold text-emerald-700">{fmt(run.totalNet)}</div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">{run.status}</span>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                    <Download size={12} /> Download
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Statutory Tab */}
      {activeTab === 'statutory' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'PF Challan', icon: Shield, color: 'bg-blue-500', amount: totalPF, due: '15 Sep 2026', status: 'Due' },
            { title: 'ESI Returns', icon: Building2, color: 'bg-purple-500', amount: STAFF_PAYROLL.reduce((s, e) => s + e.esi, 0), due: '15 Sep 2026', status: 'Due' },
            { title: 'TDS (Form 24Q)', icon: FileText, color: 'bg-amber-500', amount: totalTDS, due: '31 Oct 2026', status: 'Upcoming' },
          ].map(item => {
            const Icon = item.icon;
            return (
              <motion.div key={item.title} whileHover={{ y: -2 }} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', item.color)}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{item.title}</div>
                    <div className="text-xs text-slate-500">Due: {item.due}</div>
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-800 mb-1">{fmt(item.amount)}</div>
                <div className="flex items-center justify-between">
                  <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium', item.status === 'Due' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700')}>{item.status}</span>
                  <button className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-700 transition-colors">
                    Generate <ArrowUpRight size={12} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Payslip Modal */}
      <AnimatePresence>
        {selectedEmployee && (
          <PayslipModal employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

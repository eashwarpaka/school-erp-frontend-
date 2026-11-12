import { motion } from 'framer-motion';
import {
  Users, Activity, TrendingDown, AlertTriangle, 
  Brain, FileText, ChevronRight, BarChart3, LineChart, ShieldAlert,
  Send, UserX
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface AtRiskStudent {
  id: string;
  name: string;
  grade: string;
  attendanceRate: number;
  riskScore: number;
  aiInsight: string;
}

const AT_RISK_STUDENTS: AtRiskStudent[] = [
  { id: 'STU-1092', name: 'Rohan Patel', grade: 'Grade 9 - A', attendanceRate: 72, riskScore: 88, aiInsight: 'Pattern of Monday/Friday absences. Academic performance dropping by 12%.' },
  { id: 'STU-0421', name: 'Fatima Ali', grade: 'Grade 8 - B', attendanceRate: 81, riskScore: 65, aiInsight: 'Recent spike in tardiness (Late 6 times in 2 weeks). No previous history.' },
  { id: 'STU-2094', name: 'Kwame Boateng', grade: 'Grade 10 - A', attendanceRate: 84, riskScore: 55, aiInsight: 'Missing afternoon sessions primarily. Correlates with PE classes.' },
];

export const AIAttendanceAnalytics = () => {
  const handleAction = (name: string) => {
    toast.success(`Intervention protocol initiated for ${name}`);
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Brain size={24} className="text-emerald-600" />
            AI Attendance Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Predictive modeling for chronic absenteeism and early warning intervention.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Campus Average', value: '94.2%', icon: Activity, color: 'bg-blue-500' },
          { label: 'High Risk Students', value: AT_RISK_STUDENTS.length, icon: ShieldAlert, color: 'bg-red-500', alert: true },
          { label: 'Consecutive Absences', value: 14, icon: UserX, color: 'bg-amber-500' },
          { label: 'AI Insights Generated', value: 42, icon: Brain, color: 'bg-emerald-500' },
        ].map(kpi => (
          <div key={kpi.label} className={clsx('bg-white rounded-2xl border p-5 shadow-sm transition-all', kpi.alert ? 'border-red-300 ring-2 ring-red-500/20' : 'border-slate-100')}>
            <div className="flex items-center justify-between mb-3">
              <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center text-white', kpi.color)}>
                <kpi.icon size={20} />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-800">{kpi.value}</div>
            <div className="text-sm font-medium text-slate-500">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* At-Risk List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-0">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="font-bold text-slate-800">Early Warning System (At-Risk)</h3>
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded uppercase">Action Required</span>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-4">
            {AT_RISK_STUDENTS.map(student => (
              <motion.div key={student.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 group hover:border-emerald-200 transition-all shadow-sm">
                
                <div className="md:w-1/4">
                  <div className="font-bold text-slate-800 text-lg">{student.name}</div>
                  <div className="text-xs text-slate-500 mb-2">{student.id} · {student.grade}</div>
                  
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-xs font-semibold text-slate-600 w-16">Attendance</div>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: `${student.attendanceRate}%` }} />
                    </div>
                    <div className="text-xs font-bold text-slate-800">{student.attendanceRate}%</div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-semibold text-slate-600 w-16">Risk Score</div>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${student.riskScore}%` }} />
                    </div>
                    <div className="text-xs font-bold text-slate-800">{student.riskScore}</div>
                  </div>
                </div>

                <div className="flex-1 bg-emerald-50/50 rounded-lg p-3 border border-emerald-100 relative">
                  <Brain size={16} className="absolute right-3 top-3 text-emerald-400 opacity-50" />
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">AI Behavioral Insight</div>
                  <p className="text-sm text-slate-700 leading-relaxed">{student.aiInsight}</p>
                </div>

                <div className="flex flex-col gap-2 justify-center md:w-32">
                  <button onClick={() => handleAction(student.name)} className="w-full py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5">
                    <Send size={12} /> Contact Parent
                  </button>
                  <button className="w-full py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
                    <FileText size={12} /> View Profile
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Charts Panel Placeholder */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-center items-center text-center">
          <LineChart size={48} className="text-slate-300 mb-4" />
          <h3 className="font-bold text-slate-700 mb-2">School-wide Trends</h3>
          <p className="text-sm text-slate-500 mb-6">Historical attendance data vs AI projected trends for the upcoming month.</p>
          <div className="w-full h-48 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-xs text-slate-400 font-mono">
            [ Predictive Chart Rendered Here ]
          </div>
        </div>

      </div>
    </div>
  );
};

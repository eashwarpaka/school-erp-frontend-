import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Plus, Clock, CheckCircle, AlertCircle, Users,
  Play, Pause, BarChart3, Eye, Edit3, Copy, Trash2,
  Search, Filter, ChevronRight, Settings, Award, Target,
  BookOpen, Brain, Zap, Timer, Lock, Unlock
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

// ── Types ──────────────────────────────────────────────────
type AssessmentType = 'Quiz' | 'Test' | 'Assignment' | 'Practice';
type AssessmentStatus = 'Draft' | 'Published' | 'Active' | 'Completed' | 'Graded';

interface Assessment {
  id: string;
  title: string;
  subject: string;
  grade: string;
  type: AssessmentType;
  status: AssessmentStatus;
  totalQuestions: number;
  totalMarks: number;
  duration: string;
  startDate: string;
  endDate: string;
  attempts: number;
  avgScore: number;
  passRate: number;
  createdBy: string;
}

// ── Mock Data ──────────────────────────────────────────────
const MOCK_ASSESSMENTS: Assessment[] = [
  {
    id: 'ASM-001', title: 'Algebra Fundamentals — Mid-term Quiz',
    subject: 'Mathematics', grade: 'Grade 10', type: 'Quiz', status: 'Completed',
    totalQuestions: 20, totalMarks: 40, duration: '30 min',
    startDate: '2026-09-10', endDate: '2026-09-10',
    attempts: 148, avgScore: 76, passRate: 85, createdBy: 'Dr. Priya Sharma'
  },
  {
    id: 'ASM-002', title: 'Physics — Mechanics Unit Test',
    subject: 'Physics', grade: 'Grade 11', type: 'Test', status: 'Active',
    totalQuestions: 30, totalMarks: 60, duration: '60 min',
    startDate: '2026-09-18', endDate: '2026-09-18',
    attempts: 87, avgScore: 0, passRate: 0, createdBy: 'Prof. Rajesh Kumar'
  },
  {
    id: 'ASM-003', title: 'English — Essay Writing Assignment',
    subject: 'English', grade: 'Grade 9', type: 'Assignment', status: 'Published',
    totalQuestions: 3, totalMarks: 30, duration: 'No limit',
    startDate: '2026-09-19', endDate: '2026-09-25',
    attempts: 0, avgScore: 0, passRate: 0, createdBy: 'Ms. Anita Desai'
  },
  {
    id: 'ASM-004', title: 'Python Practice — Loops & Functions',
    subject: 'Computer Science', grade: 'Grade 11', type: 'Practice', status: 'Published',
    totalQuestions: 15, totalMarks: 30, duration: '45 min',
    startDate: '2026-09-15', endDate: '2026-09-30',
    attempts: 56, avgScore: 82, passRate: 92, createdBy: 'Mr. Arun Patel'
  },
  {
    id: 'ASM-005', title: 'History — Chapter 5 Quiz',
    subject: 'History', grade: 'Grade 8', type: 'Quiz', status: 'Draft',
    totalQuestions: 10, totalMarks: 20, duration: '15 min',
    startDate: '', endDate: '',
    attempts: 0, avgScore: 0, passRate: 0, createdBy: 'Mr. Vikram Singh'
  },
  {
    id: 'ASM-006', title: 'Biology — Cell Division Test',
    subject: 'Biology', grade: 'Grade 12', type: 'Test', status: 'Graded',
    totalQuestions: 25, totalMarks: 50, duration: '45 min',
    startDate: '2026-09-05', endDate: '2026-09-05',
    attempts: 102, avgScore: 71, passRate: 78, createdBy: 'Dr. Meera Nair'
  },
];

const typeConfig: Record<AssessmentType, { icon: typeof FileText; color: string; bg: string }> = {
  Quiz: { icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50' },
  Test: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
  Assignment: { icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  Practice: { icon: Brain, color: 'text-amber-600', bg: 'bg-amber-50' },
};

const statusConfig: Record<AssessmentStatus, { color: string; icon: typeof CheckCircle }> = {
  Draft: { color: 'bg-slate-100 text-slate-600', icon: Edit3 },
  Published: { color: 'bg-blue-100 text-blue-700', icon: Eye },
  Active: { color: 'bg-emerald-100 text-emerald-700', icon: Play },
  Completed: { color: 'bg-amber-100 text-amber-700', icon: CheckCircle },
  Graded: { color: 'bg-purple-100 text-purple-700', icon: Award },
};

// ── Component ──────────────────────────────────────────────
export const AssessmentEngine = () => {
  const [assessments] = useState<Assessment[]>(MOCK_ASSESSMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | AssessmentType>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = assessments.filter(a => {
    if (typeFilter !== 'all' && a.type !== typeFilter) return false;
    return a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           a.subject.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const stats = {
    total: assessments.length,
    active: assessments.filter(a => a.status === 'Active').length,
    pendingGrading: assessments.filter(a => a.status === 'Completed').length,
    avgPassRate: Math.round(
      assessments.filter(a => a.passRate > 0).reduce((s, a) => s + a.passRate, 0) /
      (assessments.filter(a => a.passRate > 0).length || 1)
    ),
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Target size={26} className="text-purple-600" />
            Assessment Engine
          </h1>
          <p className="text-sm text-slate-500 mt-1">Create, publish, and grade online assessments</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium text-sm shadow-lg shadow-purple-200"
        >
          <Plus size={16} /> Create Assessment
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Assessments', value: stats.total, icon: FileText, color: 'from-blue-500 to-indigo-600' },
          { label: 'Live Now', value: stats.active, icon: Play, color: 'from-emerald-500 to-teal-600' },
          { label: 'Pending Grading', value: stats.pendingGrading, icon: Clock, color: 'from-amber-500 to-orange-600' },
          { label: 'Avg Pass Rate', value: `${stats.avgPassRate}%`, icon: Award, color: 'from-purple-500 to-pink-600' },
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
            <div className="text-xl font-bold text-slate-800">{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white rounded-xl border border-slate-100 p-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search assessments..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
          />
        </div>
        <div className="flex bg-slate-100 rounded-lg p-0.5">
          {(['all', 'Quiz', 'Test', 'Assignment', 'Practice'] as const).map(f => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={clsx(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-all',
                typeFilter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {f === 'all' ? 'All Types' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Assessment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((assessment, i) => {
            const typeInfo = typeConfig[assessment.type];
            const statusInfo = statusConfig[assessment.status];
            return (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -2 }}
                className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => toast.success(`Opening "${assessment.title}"`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', typeInfo.bg)}>
                      <typeInfo.icon size={18} className={typeInfo.color} />
                    </div>
                    <div>
                      <span className={clsx('text-[10px] font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1', statusInfo.color)}>
                        <statusInfo.icon size={10} /> {assessment.status}
                      </span>
                      <h3 className="font-semibold text-sm text-slate-800 mt-1 group-hover:text-purple-600 transition-colors">
                        {assessment.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3 text-xs text-slate-500">
                  <span>{assessment.subject}</span>
                  <span className="text-slate-300">•</span>
                  <span>{assessment.grade}</span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1"><Timer size={11} /> {assessment.duration}</span>
                </div>

                <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm font-bold text-slate-800">{assessment.totalQuestions}</div>
                    <div className="text-[10px] text-slate-500">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-slate-800">{assessment.totalMarks}</div>
                    <div className="text-[10px] text-slate-500">Total Marks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-slate-800">{assessment.attempts}</div>
                    <div className="text-[10px] text-slate-500">Attempts</div>
                  </div>
                </div>

                {assessment.avgScore > 0 && (
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-slate-500">
                        Avg: <span className="font-semibold text-slate-800">{assessment.avgScore}%</span>
                      </div>
                      <div className="text-xs text-slate-500">
                        Pass: <span className={clsx('font-semibold', assessment.passRate >= 80 ? 'text-emerald-600' : 'text-amber-600')}>
                          {assessment.passRate}%
                        </span>
                      </div>
                    </div>
                    <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={clsx('h-full rounded-full', assessment.passRate >= 80 ? 'bg-emerald-500' : 'bg-amber-500')}
                        style={{ width: `${assessment.passRate}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400">
                  <span>By {assessment.createdBy}</span>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:text-indigo-600" onClick={e => { e.stopPropagation(); toast.success('Duplicated'); }}><Copy size={13} /></button>
                    <button className="p-1 hover:text-indigo-600" onClick={e => { e.stopPropagation(); toast.success('Edit mode'); }}><Edit3 size={13} /></button>
                    <button className="p-1 hover:text-red-500" onClick={e => { e.stopPropagation(); toast.success('Deleted'); }}><Trash2 size={13} /></button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Create Assessment Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-slate-800 mb-4">Create New Assessment</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" placeholder="e.g., Chapter 3 — Unit Quiz" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                    <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200">
                      <option>Quiz</option>
                      <option>Test</option>
                      <option>Assignment</option>
                      <option>Practice</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                    <input className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" placeholder="e.g., 30 min" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                    <input className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" placeholder="e.g., Mathematics" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Grade</label>
                    <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200">
                      {Array.from({ length: 12 }, (_, i) => <option key={i}>Grade {i + 1}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-xl">
                  <Brain size={16} className="text-purple-600" />
                  <div>
                    <div className="text-sm font-medium text-purple-800">AI Question Generator</div>
                    <div className="text-[11px] text-purple-600">Auto-generate questions from your course content</div>
                  </div>
                  <button className="ml-auto px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-medium">Try</button>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { setShowCreateModal(false); toast.success('Assessment created!'); }}
                  className="px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700"
                >
                  Create Assessment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

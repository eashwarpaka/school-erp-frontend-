import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Clock, Calendar, Award, FileText, Download,
  Play, CheckCircle, Target, TrendingUp, MessageSquare,
  ChevronRight, Star, Bell, GraduationCap, Layers,
  ClipboardList, Users, BarChart3, Zap, Trophy, Brain,
  X, UploadCloud, Video, Mic, Monitor, MicOff
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

// ── Types ──────────────────────────────────────────────────
interface TimetableSlot {
  time: string;
  subject: string;
  teacher: string;
  room: string;
  type: 'class' | 'break' | 'lab' | 'sports';
}

interface PendingTask {
  id: string;
  title: string;
  subject: string;
  type: 'Assignment' | 'Quiz' | 'Project';
  dueDate: string;
  isSubmitted: boolean;
  marks?: number;
  totalMarks?: number;
}

interface CourseProgress {
  courseId: string;
  title: string;
  subject: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  nextLesson: string;
}

// ── Mock Data ──────────────────────────────────────────────
const TODAY_TIMETABLE: TimetableSlot[] = [
  { time: '8:00 - 8:45', subject: 'Mathematics', teacher: 'Dr. Priya Sharma', room: 'Room 201', type: 'class' },
  { time: '8:45 - 9:30', subject: 'Physics', teacher: 'Prof. Rajesh Kumar', room: 'Room 305', type: 'class' },
  { time: '9:30 - 9:45', subject: 'Short Break', teacher: '', room: '', type: 'break' },
  { time: '9:45 - 10:30', subject: 'Chemistry Lab', teacher: 'Dr. Meera Nair', room: 'Lab 2', type: 'lab' },
  { time: '10:30 - 11:15', subject: 'English', teacher: 'Ms. Anita Desai', room: 'Room 201', type: 'class' },
  { time: '11:15 - 12:00', subject: 'Computer Science', teacher: 'Mr. Arun Patel', room: 'CS Lab', type: 'lab' },
  { time: '12:00 - 12:45', subject: 'Lunch Break', teacher: '', room: '', type: 'break' },
  { time: '12:45 - 1:30', subject: 'Hindi', teacher: 'Mrs. Sunita Verma', room: 'Room 201', type: 'class' },
  { time: '1:30 - 2:15', subject: 'Physical Education', teacher: 'Mr. Ravi', room: 'Sports Ground', type: 'sports' },
];

const PENDING_TASKS: PendingTask[] = [
  { id: 'T-1', title: 'Quadratic Equations Worksheet', subject: 'Mathematics', type: 'Assignment', dueDate: 'Sep 20, 2026', isSubmitted: false },
  { id: 'T-2', title: 'Essay: My Favorite Book', subject: 'English', type: 'Assignment', dueDate: 'Sep 22, 2026', isSubmitted: false },
  { id: 'T-3', title: 'Newton\'s Laws Quiz', subject: 'Physics', type: 'Quiz', dueDate: 'Sep 19, 2026', isSubmitted: false },
  { id: 'T-4', title: 'Python — File Handling', subject: 'Computer Science', type: 'Assignment', dueDate: 'Sep 25, 2026', isSubmitted: false },
  { id: 'T-5', title: 'Algebra Mid-Term Quiz', subject: 'Mathematics', type: 'Quiz', dueDate: 'Sep 10, 2026', isSubmitted: true, marks: 38, totalMarks: 40 },
  { id: 'T-6', title: 'Cell Biology Report', subject: 'Biology', type: 'Project', dueDate: 'Sep 8, 2026', isSubmitted: true, marks: 42, totalMarks: 50 },
];

const COURSE_PROGRESS: CourseProgress[] = [
  { courseId: 'CRS-001', title: 'Mathematics — Algebra & Geometry', subject: 'Mathematics', progress: 62, totalLessons: 42, completedLessons: 26, nextLesson: 'Polynomials — Introduction' },
  { courseId: 'CRS-002', title: 'Physics — Mechanics', subject: 'Physics', progress: 30, totalLessons: 56, completedLessons: 17, nextLesson: 'Circular Motion' },
  { courseId: 'CRS-004', title: 'Python Programming', subject: 'Computer Science', progress: 58, totalLessons: 64, completedLessons: 37, nextLesson: 'File Handling Basics' },
  { courseId: 'CRS-006', title: 'Indian Freedom Movement', subject: 'History', progress: 80, totalLessons: 25, completedLessons: 20, nextLesson: 'Post-Independence Era' },
];

const slotColors = {
  class: 'border-l-indigo-500 bg-indigo-50/30',
  break: 'border-l-slate-300 bg-slate-50/50',
  lab: 'border-l-emerald-500 bg-emerald-50/30',
  sports: 'border-l-amber-500 bg-amber-50/30',
};

const taskTypeColors = {
  Assignment: 'bg-blue-100 text-blue-700',
  Quiz: 'bg-purple-100 text-purple-700',
  Project: 'bg-emerald-100 text-emerald-700',
};

// ── Component ──────────────────────────────────────────────
export const StudentPortal = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'timetable' | 'courses' | 'tasks' | 'results'>('overview');
  
  // Modal states
  const [isLiveClassOpen, setIsLiveClassOpen] = useState(false);
  const [submissionTask, setSubmissionTask] = useState<PendingTask | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const pendingCount = PENDING_TASKS.filter(t => !t.isSubmitted).length;

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

  const handleDownloadReportCard = () => {
    const EXAM_RESULTS = [
      { subject: 'Mathematics', marks: 88, total: 100 },
      { subject: 'Physics', marks: 76, total: 100 },
      { subject: 'Chemistry', marks: 82, total: 100 },
      { subject: 'English', marks: 85, total: 100 },
      { subject: 'Computer Science', marks: 92, total: 100 },
      { subject: 'Hindi', marks: 71, total: 100 },
    ];
    let content = `ACADEMIC REPORT CARD\n-----------------------------\nSmart School System - Mid-Term 2026-27\n-----------------------------\nStudent Name: Arjun Patel\nOverall Grade: 82.3% (A)\nClass Rank: #5\n-----------------------------\nSUBJECT\t\tTOTAL\tOBTAINED\n`;
    EXAM_RESULTS.forEach(r => {
      content += `${r.subject.padEnd(20)}\t${r.total}\t${r.marks}\n`;
    });
    downloadTextFile(`Arjun_Patel_ReportCard.txt`, content);
  };

  const handleSubmitAssignment = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          toast.success('Assignment submitted successfully!');
          setTimeout(() => {
            setSubmissionTask(null);
            setUploadProgress(0);
          }, 500);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <GraduationCap size={28} className="text-indigo-600" />
            Student Portal
          </h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back, <strong>Arjun Patel</strong>! Here's your academic dashboard.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsLiveClassOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-red-200"
          >
            <Play size={15} /> Join Live Class
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 overflow-x-auto">
        {([
          { key: 'overview', label: '📊 Overview' },
          { key: 'timetable', label: '📅 Today\'s Schedule' },
          { key: 'courses', label: '📚 My Courses' },
          { key: 'tasks', label: '📝 Tasks & Assignments' },
          { key: 'results', label: '🏆 Results' },
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
            {tab.key === 'tasks' && pendingCount > 0 && (
              <span className="ml-1.5 text-[10px] px-1.5 py-0.5 bg-red-500 text-white rounded-full">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeSection === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Stats */}
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Attendance', value: '94%', icon: Calendar, color: 'from-emerald-500 to-teal-600' },
              { label: 'GPA', value: '3.8', icon: Star, color: 'from-amber-500 to-orange-600' },
              { label: 'Rank', value: '#5', icon: Trophy, color: 'from-purple-500 to-pink-600' },
              { label: 'Pending Tasks', value: pendingCount.toString(), icon: ClipboardList, color: 'from-red-500 to-rose-600' },
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

            {/* Next Class */}
            <div className="col-span-2 md:col-span-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <Clock size={24} className="text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-xs text-indigo-600 font-medium">Next Class</div>
                    <div className="text-lg font-bold text-slate-800">Mathematics — 8:00 AM</div>
                    <div className="text-sm text-slate-500">Dr. Priya Sharma • Room 201</div>
                  </div>
                </div>
                <button
                  onClick={() => setIsLiveClassOpen(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Join →
                </button>
              </div>
            </div>

            {/* Quick Course Progress */}
            <div className="col-span-2 md:col-span-4 bg-white rounded-xl border border-slate-100 p-5">
              <h3 className="font-semibold text-slate-800 text-sm mb-4">Course Progress</h3>
              <div className="space-y-3">
                {COURSE_PROGRESS.slice(0, 3).map(course => (
                  <div key={course.courseId} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-medium text-slate-700 truncate">{course.subject}</div>
                    <div className="flex-1">
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ delay: 0.3, duration: 0.8 }}
                          className={clsx(
                            'h-full rounded-full',
                            course.progress >= 75 ? 'bg-emerald-500' : course.progress >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                          )}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-800 w-12 text-right">{course.progress}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2 mb-4">
              <ClipboardList size={15} className="text-indigo-600" /> Upcoming Deadlines
            </h3>
            <div className="space-y-3">
              {PENDING_TASKS.filter(t => !t.isSubmitted).map(task => (
                <div key={task.id} className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-medium text-slate-700">{task.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={clsx('text-[10px] font-medium px-1.5 py-0.5 rounded-full', taskTypeColors[task.type])}>{task.type}</span>
                        <span className="text-[11px] text-slate-500">{task.subject}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
                    <Clock size={11} /> Due: {task.dueDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Today's Timetable */}
      {activeSection === 'timetable' && (
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Today's Schedule — Thursday, Sep 18</h3>
          <div className="space-y-2">
            {TODAY_TIMETABLE.map((slot, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={clsx(
                  'flex items-center gap-4 p-4 rounded-xl border-l-4 transition-all hover:shadow-sm',
                  slotColors[slot.type]
                )}
              >
                <div className="w-28 flex-shrink-0">
                  <span className="text-sm font-mono font-medium text-slate-700">{slot.time}</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-800 text-sm">{slot.subject}</div>
                  {slot.teacher && (
                    <div className="text-xs text-slate-500 mt-0.5">{slot.teacher} • {slot.room}</div>
                  )}
                </div>
                {slot.type === 'class' && (
                  <button
                    onClick={() => setIsLiveClassOpen(true)}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Join
                  </button>
                )}
                {slot.type === 'lab' && (
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">Lab</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Courses */}
      {activeSection === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COURSE_PROGRESS.map((course, i) => (
            <motion.div
              key={course.courseId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }}
              className="bg-white rounded-xl border border-slate-100 p-5 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => toast.success(`Opening "${course.title}"`)}
            >
              <h3 className="font-semibold text-slate-800 text-sm">{course.title}</h3>
              <div className="text-xs text-slate-500 mt-1">{course.subject}</div>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-500">{course.completedLessons}/{course.totalLessons} lessons</span>
                  <span className="text-sm font-bold text-indigo-600">{course.progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">
                <Play size={12} className="text-indigo-600" />
                Next: <span className="font-medium text-slate-700">{course.nextLesson}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Tasks */}
      {activeSection === 'tasks' && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 bg-amber-50 rounded-xl border border-amber-200 p-4 text-center">
              <div className="text-2xl font-bold text-amber-700">{pendingCount}</div>
              <div className="text-xs text-amber-600">Pending</div>
            </div>
            <div className="flex-1 bg-emerald-50 rounded-xl border border-emerald-200 p-4 text-center">
              <div className="text-2xl font-bold text-emerald-700">{PENDING_TASKS.filter(t => t.isSubmitted).length}</div>
              <div className="text-xs text-emerald-600">Submitted</div>
            </div>
          </div>

          {PENDING_TASKS.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={clsx(
                'bg-white rounded-xl border p-4 hover:shadow-md transition-all',
                task.isSubmitted ? 'border-emerald-100' : 'border-slate-100'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={clsx(
                    'w-8 h-8 rounded-lg flex items-center justify-center mt-0.5',
                    task.isSubmitted ? 'bg-emerald-100' : 'bg-slate-100'
                  )}>
                    {task.isSubmitted ? <CheckCircle size={16} className="text-emerald-600" /> : <ClipboardList size={16} className="text-slate-500" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-800">{task.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={clsx('text-[10px] font-medium px-2 py-0.5 rounded-full', taskTypeColors[task.type])}>{task.type}</span>
                      <span className="text-xs text-slate-500">{task.subject}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1"><Clock size={10} /> {task.dueDate}</span>
                    </div>
                    {task.isSubmitted && task.marks !== undefined && (
                      <div className="mt-2 text-xs text-emerald-600 font-medium">
                        Score: {task.marks}/{task.totalMarks} ({Math.round((task.marks / task.totalMarks!) * 100)}%)
                      </div>
                    )}
                  </div>
                </div>
                {!task.isSubmitted && (
                  <button
                    onClick={() => setSubmissionTask(task)}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Submit
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Results */}
      {activeSection === 'results' && (
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Exam Results — Mid-Term 2026</h3>
            <button onClick={handleDownloadReportCard} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
              <Download size={12} /> Download Report Card
            </button>
          </div>
          <div className="space-y-3">
            {[
              { subject: 'Mathematics', marks: 88, total: 100 },
              { subject: 'Physics', marks: 76, total: 100 },
              { subject: 'Chemistry', marks: 82, total: 100 },
              { subject: 'English', marks: 85, total: 100 },
              { subject: 'Computer Science', marks: 92, total: 100 },
              { subject: 'Hindi', marks: 71, total: 100 },
            ].map(result => (
              <div key={result.subject} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50">
                <div className="w-36 text-sm font-medium text-slate-700">{result.subject}</div>
                <div className="flex-1">
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.marks}%` }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                      className={clsx(
                        'h-full rounded-full',
                        result.marks >= 85 ? 'bg-emerald-500' : result.marks >= 70 ? 'bg-blue-500' : 'bg-amber-500'
                      )}
                    />
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-800 w-20 text-right">{result.marks}/{result.total}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-indigo-600">82.3%</div>
              <div className="text-xs text-slate-500">Overall</div>
            </div>
            <div>
              <div className="text-lg font-bold text-amber-600">#5</div>
              <div className="text-xs text-slate-500">Class Rank</div>
            </div>
            <div>
              <div className="text-lg font-bold text-emerald-600">A</div>
              <div className="text-xs text-slate-500">Grade</div>
            </div>
          </div>
        </div>
      )}
      {/* Live Class Modal */}
      {isLiveClassOpen && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl aspect-video overflow-hidden shadow-2xl flex flex-col relative"
          >
            {/* Header */}
            <div className="p-4 bg-slate-800/50 flex items-center justify-between absolute top-0 left-0 right-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <h3 className="font-semibold text-white">Mathematics — Algebra & Geometry</h3>
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-md">Dr. Priya Sharma</span>
              </div>
              <button onClick={() => setIsLiveClassOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            {/* Video Area (Simulated) */}
            <div className="flex-1 bg-slate-900 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-4xl text-white font-light border-2 border-slate-700">
                  PS
                </div>
                <p className="text-slate-400 text-sm">Dr. Priya Sharma is presenting...</p>
                <div className="mt-8 border border-slate-700 rounded-xl p-8 bg-slate-800 max-w-md mx-auto">
                   <h4 className="text-white text-lg mb-2">Quadratic Equations</h4>
                   <p className="text-slate-400 text-sm font-mono">ax² + bx + c = 0</p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="p-4 bg-slate-800/90 flex items-center justify-center gap-4 absolute bottom-0 left-0 right-0">
              <button className="p-3 bg-slate-700 hover:bg-slate-600 rounded-full text-white transition-colors">
                <MicOff size={20} />
              </button>
              <button className="p-3 bg-slate-700 hover:bg-slate-600 rounded-full text-white transition-colors">
                <Video size={20} />
              </button>
              <button className="p-3 bg-slate-700 hover:bg-slate-600 rounded-full text-white transition-colors">
                <Monitor size={20} />
              </button>
              <button onClick={() => setIsLiveClassOpen(false)} className="px-6 py-2.5 bg-red-500 hover:bg-red-600 rounded-full text-white font-medium ml-4 transition-colors shadow-lg shadow-red-500/20">
                Leave Class
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Assignment Submission Modal */}
      {submissionTask && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <UploadCloud size={20} className="text-indigo-500" />
                Submit Assignment
              </h3>
              <button onClick={() => setSubmissionTask(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-slate-800">{submissionTask.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{submissionTask.subject} • Due: {submissionTask.dueDate}</p>
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer mb-4">
                <UploadCloud size={32} className="text-slate-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-700">Click to upload or drag & drop</p>
                <p className="text-xs text-slate-500 mt-1">PDF, DOCX, or Images (max. 10MB)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Add a comment (optional)</label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Type your comment here..."
                />
              </div>

              {uploadProgress > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setSubmissionTask(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                disabled={uploadProgress > 0}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAssignment}
                disabled={uploadProgress > 0}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {uploadProgress > 0 ? (
                   <span className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</span>
                ) : 'Submit Work'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

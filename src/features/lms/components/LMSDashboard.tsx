import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Play, Clock, Users, TrendingUp, Award,
  Plus, Search, Filter, ChevronRight, Star, BarChart3,
  Video, FileText, CheckCircle, AlertCircle, Layers,
  GraduationCap, Calendar, Zap, Eye
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

// ── Types ──────────────────────────────────────────────────
type CourseStatus = 'Published' | 'Draft' | 'Archived';
type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

interface Course {
  id: string;
  title: string;
  subject: string;
  grade: string;
  instructor: string;
  thumbnail: string;
  status: CourseStatus;
  difficulty: DifficultyLevel;
  totalModules: number;
  completedModules: number;
  totalLessons: number;
  enrolledStudents: number;
  rating: number;
  duration: string;
  lastUpdated: string;
  progress: number;
  tags: string[];
}

interface LMSStats {
  totalCourses: number;
  activeStudents: number;
  completionRate: number;
  avgRating: number;
  liveClasses: number;
  pendingAssessments: number;
}

// ── Mock Data ──────────────────────────────────────────────
const MOCK_COURSES: Course[] = [
  {
    id: 'CRS-001', title: 'Mathematics Fundamentals — Algebra & Geometry',
    subject: 'Mathematics', grade: 'Grade 10', instructor: 'Dr. Priya Sharma',
    thumbnail: '📐', status: 'Published', difficulty: 'Intermediate',
    totalModules: 8, completedModules: 5, totalLessons: 42, enrolledStudents: 156,
    rating: 4.8, duration: '24h 30m', lastUpdated: '2026-09-15',
    progress: 62, tags: ['CBSE', 'Core']
  },
  {
    id: 'CRS-002', title: 'Physics — Mechanics & Thermodynamics',
    subject: 'Physics', grade: 'Grade 11', instructor: 'Prof. Rajesh Kumar',
    thumbnail: '⚛️', status: 'Published', difficulty: 'Advanced',
    totalModules: 10, completedModules: 3, totalLessons: 56, enrolledStudents: 124,
    rating: 4.6, duration: '32h 15m', lastUpdated: '2026-09-10',
    progress: 30, tags: ['CBSE', 'Science']
  },
  {
    id: 'CRS-003', title: 'English Literature — Shakespeare & Modern Poetry',
    subject: 'English', grade: 'Grade 9', instructor: 'Ms. Anita Desai',
    thumbnail: '📚', status: 'Published', difficulty: 'Beginner',
    totalModules: 6, completedModules: 6, totalLessons: 30, enrolledStudents: 189,
    rating: 4.9, duration: '18h 45m', lastUpdated: '2026-09-12',
    progress: 100, tags: ['CBSE', 'Language']
  },
  {
    id: 'CRS-004', title: 'Computer Science — Python Programming',
    subject: 'Computer Science', grade: 'Grade 11', instructor: 'Mr. Arun Patel',
    thumbnail: '💻', status: 'Published', difficulty: 'Intermediate',
    totalModules: 12, completedModules: 7, totalLessons: 64, enrolledStudents: 98,
    rating: 4.7, duration: '40h 00m', lastUpdated: '2026-09-14',
    progress: 58, tags: ['CBSE', 'Elective']
  },
  {
    id: 'CRS-005', title: 'Biology — Cell Biology & Genetics',
    subject: 'Biology', grade: 'Grade 12', instructor: 'Dr. Meera Nair',
    thumbnail: '🧬', status: 'Draft', difficulty: 'Advanced',
    totalModules: 9, completedModules: 0, totalLessons: 48, enrolledStudents: 0,
    rating: 0, duration: '28h 30m', lastUpdated: '2026-09-16',
    progress: 0, tags: ['CBSE', 'Science']
  },
  {
    id: 'CRS-006', title: 'History — Indian Freedom Movement',
    subject: 'History', grade: 'Grade 8', instructor: 'Mr. Vikram Singh',
    thumbnail: '🏛️', status: 'Published', difficulty: 'Beginner',
    totalModules: 5, completedModules: 4, totalLessons: 25, enrolledStudents: 210,
    rating: 4.5, duration: '15h 00m', lastUpdated: '2026-09-08',
    progress: 80, tags: ['CBSE', 'Social Science']
  },
];

const STATS: LMSStats = {
  totalCourses: 24,
  activeStudents: 1245,
  completionRate: 68,
  avgRating: 4.6,
  liveClasses: 3,
  pendingAssessments: 12,
};

const difficultyColor: Record<DifficultyLevel, string> = {
  Beginner: 'bg-emerald-100 text-emerald-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Advanced: 'bg-red-100 text-red-700',
};

const statusColor: Record<CourseStatus, string> = {
  Published: 'bg-emerald-100 text-emerald-700',
  Draft: 'bg-slate-100 text-slate-600',
  Archived: 'bg-red-100 text-red-600',
};

// ── Component ──────────────────────────────────────────────
export const LMSDashboard = () => {
  const [courses] = useState<Course[]>(MOCK_COURSES);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | CourseStatus>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredCourses = courses.filter(c => {
    if (activeFilter !== 'all' && c.status !== activeFilter) return false;
    return c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
           c.instructor.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const statCards = [
    { label: 'Total Courses', value: STATS.totalCourses, icon: BookOpen, color: 'from-blue-500 to-indigo-600', change: '+4 this month' },
    { label: 'Active Learners', value: STATS.activeStudents.toLocaleString(), icon: Users, color: 'from-emerald-500 to-teal-600', change: '+89 this week' },
    { label: 'Completion Rate', value: `${STATS.completionRate}%`, icon: TrendingUp, color: 'from-amber-500 to-orange-600', change: '+5% vs last term' },
    { label: 'Avg. Rating', value: STATS.avgRating.toFixed(1), icon: Star, color: 'from-purple-500 to-pink-600', change: '⭐ Excellent' },
    { label: 'Live Classes Now', value: STATS.liveClasses, icon: Video, color: 'from-red-500 to-rose-600', change: 'In progress' },
    { label: 'Pending Assessments', value: STATS.pendingAssessments, icon: FileText, color: 'from-cyan-500 to-blue-600', change: 'Needs grading' },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <GraduationCap size={28} className="text-indigo-600" />
            LMS & Online Classes
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage courses, virtual classrooms, and student learning progress</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toast.success('Navigating to Course Builder...')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium text-sm shadow-lg shadow-indigo-200 hover:shadow-xl transition-shadow"
          >
            <Plus size={16} /> Create Course
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toast.success('Starting a live class...')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-medium text-sm shadow-lg shadow-red-200"
          >
            <Video size={16} /> Go Live
          </motion.button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all group"
          >
            <div className={clsx('w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center mb-3', stat.color)}>
              <stat.icon size={18} className="text-white" />
            </div>
            <div className="text-xl font-bold text-slate-800">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
            <div className="text-[10px] text-slate-400 mt-1">{stat.change}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Access Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-5 cursor-pointer"
          onClick={() => toast.success('Opening Content Library...')}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Layers size={20} className="text-indigo-600" />
            </div>
            <div>
              <div className="font-semibold text-slate-800">Content Library</div>
              <div className="text-xs text-slate-500">342 resources uploaded</div>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <span className="text-[10px] px-2 py-0.5 bg-white/80 rounded-full text-slate-600">128 Videos</span>
            <span className="text-[10px] px-2 py-0.5 bg-white/80 rounded-full text-slate-600">94 PDFs</span>
            <span className="text-[10px] px-2 py-0.5 bg-white/80 rounded-full text-slate-600">120 PPTs</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-100 p-5 cursor-pointer"
          onClick={() => toast.success('Opening Live Classes...')}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <Video size={20} className="text-red-600" />
            </div>
            <div>
              <div className="font-semibold text-slate-800">Live Classes</div>
              <div className="text-xs text-slate-500">{STATS.liveClasses} classes in progress</div>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <span className="text-[10px] px-2 py-0.5 bg-white/80 rounded-full text-red-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Physics — Grade 11
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-white/80 rounded-full text-red-600">+2 more</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-100 p-5 cursor-pointer"
          onClick={() => toast.success('Opening Assessment Engine...')}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <FileText size={20} className="text-amber-600" />
            </div>
            <div>
              <div className="font-semibold text-slate-800">Assessments</div>
              <div className="text-xs text-slate-500">{STATS.pendingAssessments} pending grading</div>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <span className="text-[10px] px-2 py-0.5 bg-white/80 rounded-full text-slate-600">8 Quizzes</span>
            <span className="text-[10px] px-2 py-0.5 bg-white/80 rounded-full text-slate-600">4 Tests</span>
          </div>
        </motion.div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white rounded-xl border border-slate-100 p-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses, subjects, instructors..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
            />
          </div>
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            {(['all', 'Published', 'Draft', 'Archived'] as const).map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={clsx(
                  'px-3 py-1.5 text-xs font-medium rounded-md transition-all',
                  activeFilter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                )}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={clsx('p-2 rounded-lg transition-all', viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400')}
          >
            <Layers size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={clsx('p-2 rounded-lg transition-all', viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400')}
          >
            <BarChart3 size={16} />
          </button>
        </div>
      </div>

      {/* Course Grid */}
      <div className={clsx(
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'flex flex-col gap-3'
      )}>
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
              className={clsx(
                'bg-white rounded-xl border border-slate-100 overflow-hidden cursor-pointer group',
                viewMode === 'list' && 'flex items-center'
              )}
              onClick={() => toast.success(`Opening "${course.title}"...`)}
            >
              {/* Thumbnail */}
              <div className={clsx(
                'bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center relative',
                viewMode === 'grid' ? 'h-36' : 'w-24 h-24 flex-shrink-0'
              )}>
                <span className={viewMode === 'grid' ? 'text-5xl' : 'text-3xl'}>{course.thumbnail}</span>
                {course.status === 'Published' && course.progress > 0 && viewMode === 'grid' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                      className={clsx(
                        'h-full rounded-r-full',
                        course.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                      )}
                    />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={clsx('text-[10px] font-medium px-2 py-0.5 rounded-full', statusColor[course.status])}>
                    {course.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-slate-500">{course.instructor}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">{course.grade}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <span className={clsx('text-[10px] font-medium px-2 py-0.5 rounded-full', difficultyColor[course.difficulty])}>
                    {course.difficulty}
                  </span>
                  {course.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{tag}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Layers size={12} /> {course.totalModules} modules</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {course.rating > 0 && (
                      <span className="flex items-center gap-0.5 text-xs font-medium text-amber-600">
                        <Star size={12} fill="currentColor" /> {course.rating}
                      </span>
                    )}
                    <span className="flex items-center gap-0.5 text-xs text-slate-500">
                      <Users size={12} /> {course.enrolledStudents}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium">No courses found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

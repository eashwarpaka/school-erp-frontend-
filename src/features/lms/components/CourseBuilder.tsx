import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, GripVertical, ChevronDown, ChevronUp,
  Video, FileText, Image, Link2, Save, Eye, ArrowLeft,
  Settings, Upload, Clock, Users, BookOpen, Layers,
  CheckCircle, PenTool, Wand2, Copy
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

// ── Types ──────────────────────────────────────────────────
interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'quiz' | 'assignment' | 'live';
  duration: string;
  isPublished: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  isExpanded: boolean;
}

interface CourseSettings {
  title: string;
  subject: string;
  grade: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  thumbnail: string;
  enrollmentLimit: number;
  isPublished: boolean;
}

// ── Mock Data ──────────────────────────────────────────────
const INITIAL_MODULES: Module[] = [
  {
    id: 'mod-1',
    title: 'Module 1 — Introduction to Algebra',
    description: 'Fundamentals of algebraic expressions and equations',
    isExpanded: true,
    lessons: [
      { id: 'l-1', title: 'What is Algebra? (Video)', type: 'video', duration: '12:30', isPublished: true },
      { id: 'l-2', title: 'Variables & Constants', type: 'pdf', duration: '8 pages', isPublished: true },
      { id: 'l-3', title: 'Practice Quiz — Basics', type: 'quiz', duration: '10 questions', isPublished: true },
    ],
  },
  {
    id: 'mod-2',
    title: 'Module 2 — Linear Equations',
    description: 'Solving one-variable and two-variable linear equations',
    isExpanded: false,
    lessons: [
      { id: 'l-4', title: 'One-Variable Equations', type: 'video', duration: '18:45', isPublished: true },
      { id: 'l-5', title: 'Graphing Linear Equations', type: 'video', duration: '22:10', isPublished: false },
      { id: 'l-6', title: 'Word Problems Assignment', type: 'assignment', duration: '5 problems', isPublished: false },
    ],
  },
  {
    id: 'mod-3',
    title: 'Module 3 — Polynomials',
    description: 'Polynomial expressions, addition, subtraction, and multiplication',
    isExpanded: false,
    lessons: [
      { id: 'l-7', title: 'Introduction to Polynomials', type: 'video', duration: '15:00', isPublished: false },
      { id: 'l-8', title: 'Live Doubt Session', type: 'live', duration: '45 min', isPublished: false },
    ],
  },
];

const lessonTypeIcon: Record<string, { icon: typeof Video; color: string }> = {
  video: { icon: Video, color: 'text-blue-500 bg-blue-50' },
  pdf: { icon: FileText, color: 'text-orange-500 bg-orange-50' },
  quiz: { icon: PenTool, color: 'text-purple-500 bg-purple-50' },
  assignment: { icon: BookOpen, color: 'text-emerald-500 bg-emerald-50' },
  live: { icon: Video, color: 'text-red-500 bg-red-50' },
};

// ── Component ──────────────────────────────────────────────
export const CourseBuilder = () => {
  const [modules, setModules] = useState<Module[]>(INITIAL_MODULES);
  const [activeTab, setActiveTab] = useState<'content' | 'settings' | 'preview'>('content');
  const [settings, setSettings] = useState<CourseSettings>({
    title: 'Mathematics Fundamentals — Algebra & Geometry',
    subject: 'Mathematics',
    grade: 'Grade 10',
    difficulty: 'Intermediate',
    description: 'A comprehensive course covering algebraic fundamentals, linear equations, polynomials, and geometric concepts. Designed for Grade 10 CBSE students.',
    thumbnail: '📐',
    enrollmentLimit: 200,
    isPublished: false,
  });

  const toggleModule = (id: string) => {
    setModules(prev => prev.map(m =>
      m.id === id ? { ...m, isExpanded: !m.isExpanded } : m
    ));
  };

  const addModule = () => {
    const newId = `mod-${Date.now()}`;
    setModules(prev => [...prev, {
      id: newId,
      title: `Module ${prev.length + 1} — New Module`,
      description: 'Add a description...',
      lessons: [],
      isExpanded: true,
    }]);
    toast.success('New module added');
  };

  const addLesson = (moduleId: string, type: Lesson['type']) => {
    setModules(prev => prev.map(m => {
      if (m.id !== moduleId) return m;
      const newLesson: Lesson = {
        id: `l-${Date.now()}`,
        title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Lesson`,
        type,
        duration: type === 'video' ? '00:00' : type === 'quiz' ? '0 questions' : '—',
        isPublished: false,
      };
      return { ...m, lessons: [...m.lessons, newLesson], isExpanded: true };
    }));
    toast.success(`${type} lesson added`);
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules(prev => prev.map(m =>
      m.id === moduleId ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) } : m
    ));
    toast.success('Lesson removed');
  };

  const removeModule = (moduleId: string) => {
    setModules(prev => prev.filter(m => m.id !== moduleId));
    toast.success('Module removed');
  };

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const publishedLessons = modules.reduce((sum, m) => sum + m.lessons.filter(l => l.isPublished).length, 0);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            onClick={() => toast.success('Back to courses')}
          >
            <ArrowLeft size={18} />
          </motion.button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Course Builder</h1>
            <p className="text-sm text-slate-500">{settings.title}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => toast.success('Course saved as draft')}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <Save size={15} /> Save Draft
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toast.success('Course published successfully!')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-200"
          >
            <CheckCircle size={15} /> Publish Course
          </motion.button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Course Completion</span>
          <span className="text-sm text-slate-500">{publishedLessons}/{totalLessons} lessons ready</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: totalLessons > 0 ? `${(publishedLessons / totalLessons) * 100}%` : '0%' }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
          />
        </div>
        <div className="flex items-center gap-6 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><Layers size={12} /> {modules.length} Modules</span>
          <span className="flex items-center gap-1"><BookOpen size={12} /> {totalLessons} Lessons</span>
          <span className="flex items-center gap-1"><Users size={12} /> {settings.enrollmentLimit} Max enrollment</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 w-fit">
        {(['content', 'settings', 'preview'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'px-5 py-2 text-sm font-medium rounded-lg capitalize transition-all',
              activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            )}
          >
            {tab === 'content' && <Layers size={14} className="inline mr-1.5" />}
            {tab === 'settings' && <Settings size={14} className="inline mr-1.5" />}
            {tab === 'preview' && <Eye size={14} className="inline mr-1.5" />}
            {tab}
          </button>
        ))}
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {modules.map((mod, mi) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: mi * 0.05 }}
                className="bg-white rounded-xl border border-slate-100 overflow-hidden"
              >
                {/* Module Header */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => toggleModule(mod.id)}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical size={16} className="text-slate-300 cursor-grab" />
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                      {mi + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">{mod.title}</div>
                      <div className="text-xs text-slate-500">{mod.lessons.length} lessons • {mod.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={e => { e.stopPropagation(); removeModule(mod.id); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                    {mod.isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </div>
                </div>

                {/* Lessons */}
                <AnimatePresence>
                  {mod.isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-100"
                    >
                      <div className="p-3 space-y-2">
                        {mod.lessons.map(lesson => {
                          const typeInfo = lessonTypeIcon[lesson.type];
                          return (
                            <motion.div
                              key={lesson.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <GripVertical size={14} className="text-slate-300 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center', typeInfo.color)}>
                                  <typeInfo.icon size={14} />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-slate-700">{lesson.title}</div>
                                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                                    <span className="capitalize">{lesson.type}</span>
                                    <span>•</span>
                                    <span>{lesson.duration}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {lesson.isPublished ? (
                                  <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full font-medium">Ready</span>
                                ) : (
                                  <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full font-medium">Draft</span>
                                )}
                                <button
                                  onClick={() => removeLesson(mod.id, lesson.id)}
                                  className="p-1 rounded text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}

                        {/* Add Lesson Buttons */}
                        <div className="flex items-center gap-2 pt-2">
                          <span className="text-xs text-slate-400 mr-1">Add:</span>
                          {(['video', 'pdf', 'quiz', 'assignment', 'live'] as const).map(type => {
                            const info = lessonTypeIcon[type];
                            return (
                              <button
                                key={type}
                                onClick={() => addLesson(mod.id, type)}
                                className={clsx(
                                  'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border border-dashed border-slate-200 hover:border-slate-300 transition-colors capitalize',
                                  info.color
                                )}
                              >
                                <Plus size={11} /> {type}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Module */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={addModule}
            className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition-all text-sm font-medium"
          >
            <Plus size={16} /> Add New Module
          </motion.button>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Course Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Course Title</label>
              <input
                type="text"
                value={settings.title}
                onChange={e => setSettings(s => ({ ...s, title: e.target.value }))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
              <input
                type="text"
                value={settings.subject}
                onChange={e => setSettings(s => ({ ...s, subject: e.target.value }))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Grade</label>
              <select
                value={settings.grade}
                onChange={e => setSettings(s => ({ ...s, grade: e.target.value }))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={`Grade ${i + 1}`}>Grade {i + 1}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Difficulty Level</label>
              <select
                value={settings.difficulty}
                onChange={e => setSettings(s => ({ ...s, difficulty: e.target.value as any }))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea
                rows={4}
                value={settings.description}
                onChange={e => setSettings(s => ({ ...s, description: e.target.value }))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Max Enrollment</label>
              <input
                type="number"
                value={settings.enrollmentLimit}
                onChange={e => setSettings(s => ({ ...s, enrollmentLimit: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <div className="bg-white rounded-xl border border-slate-100 p-8 text-center">
          <Eye size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">Course Preview</h3>
          <p className="text-sm text-slate-500 mt-1">Preview how students will see this course before publishing</p>
          <button
            onClick={() => toast.success('Opening preview in new tab...')}
            className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Open Full Preview
          </button>
        </div>
      )}
    </div>
  );
};

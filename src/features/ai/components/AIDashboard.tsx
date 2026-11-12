import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Brain, FileText, Clock, MessageSquare, BarChart3,
  Wand2, ChevronRight, ChevronLeft, Star, TrendingUp, Users, AlertCircle,
  CheckCircle, Copy, RefreshCw, ThumbsUp, ThumbsDown, Send,
  BookOpen, Calendar, DollarSign, Zap, ArrowRight, Play,
  Lightbulb, Target, Activity, Shield
} from 'lucide-react';
import clsx from 'clsx';

// ── Types ──────────────────────────────────────────────────
interface AIFeature {
  id: string;
  title: string;
  description: string;
  module: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  tags: string[];
  status: 'Live' | 'Beta' | 'Coming Soon';
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isTyping?: boolean;
}

// ── AI Feature Catalog ─────────────────────────────────────
const AI_FEATURES: AIFeature[] = [
  {
    id: 'report-narrative',
    title: 'AI Report Card Narratives',
    description: 'Generate personalized, teacher-quality narrative comments for each student\'s report card based on their performance data, attendance, and behavior records.',
    module: 'Academics', icon: FileText, color: 'text-blue-600', gradient: 'from-blue-500 to-indigo-600',
    tags: ['NLP', 'Report Cards', 'Teacher Tools'], status: 'Live',
  },
  {
    id: 'timetable-optimizer',
    title: 'AI Timetable Optimizer',
    description: 'Constraint-satisfaction solver that generates conflict-free, optimized timetables — respecting teacher availability, room capacity, subject distribution, and pedagogical best practices.',
    module: 'Academics', icon: Calendar, color: 'text-purple-600', gradient: 'from-purple-500 to-violet-600',
    tags: ['Optimization', 'Scheduling', 'Admin Tools'], status: 'Beta',
  },
  {
    id: 'question-bank',
    title: 'AI Question Bank Generator',
    description: 'Generate chapter-wise exam questions at Bloom\'s Taxonomy levels (Remember, Understand, Apply, Analyze, Evaluate, Create) from syllabus topics.',
    module: 'Exams', icon: BookOpen, color: 'text-amber-600', gradient: 'from-amber-500 to-orange-500',
    tags: ["Bloom's Taxonomy", 'Exam Prep', 'Teacher Tools'], status: 'Live',
  },
  {
    id: 'attendance-analytics',
    title: 'AI Attendance Analytics',
    description: 'Predict chronic absenteeism risk using attendance patterns, academic performance correlation, and family factors. Suggest targeted interventions.',
    module: 'Attendance', icon: Users, color: 'text-emerald-600', gradient: 'from-emerald-500 to-teal-500',
    tags: ['Predictive', 'Attendance', 'Early Warning'], status: 'Live',
  },
  {
    id: 'fee-predictor',
    title: 'AI Fee Default Predictor',
    description: 'Machine learning model that identifies students at risk of fee default 30-60 days in advance, enabling proactive outreach and payment plan arrangements.',
    module: 'Finance', icon: DollarSign, color: 'text-green-600', gradient: 'from-green-500 to-emerald-600',
    tags: ['ML', 'Finance', 'Risk Management'], status: 'Live',
  },
  {
    id: 'admission-scoring',
    title: 'AI Admission Screening',
    description: 'Score and shortlist admission applications using configurable rubrics — academic track record, extracurriculars, interview performance, and fit assessment.',
    module: 'Admissions', icon: Star, color: 'text-yellow-600', gradient: 'from-yellow-400 to-amber-500',
    tags: ['ML', 'Admissions', 'Shortlisting'], status: 'Live',
  },
  {
    id: 'chatbot',
    title: 'School AI Chatbot',
    description: 'Conversational AI assistant for parents, students, and staff. Answers queries about fee status, schedules, exam results, bus tracking, and school policies.',
    module: 'Global', icon: MessageSquare, color: 'text-cyan-600', gradient: 'from-cyan-500 to-blue-500',
    tags: ['Chatbot', 'NLP', 'Parent Engagement'], status: 'Beta',
  },
  {
    id: 'nl-query',
    title: 'Natural Language BI Queries',
    description: 'Ask questions in plain English and get instant insights — "Show top 10 absentees in Grade 8 this month" or "Compare term 1 vs term 2 revenue".',
    module: 'Reports', icon: BarChart3, color: 'text-rose-600', gradient: 'from-rose-500 to-pink-600',
    tags: ['NLP', 'BI', 'Analytics'], status: 'Beta',
  },
  {
    id: 'announcement-drafter',
    title: 'AI Announcement Drafter',
    description: 'Transform bullet-point notes into polished, professional school circulars, WhatsApp messages, or email announcements in seconds.',
    module: 'Communication', icon: Wand2, color: 'text-violet-600', gradient: 'from-violet-500 to-purple-600',
    tags: ['NLP', 'Communication', 'Admin Tools'], status: 'Live',
  },
  {
    id: 'payroll-audit',
    title: 'AI Payroll Audit',
    description: 'Automatically flag anomalies in salary processing — unusual deductions, outlier salaries, duplicate entries, and statutory compliance risks.',
    module: 'HR & Payroll', icon: Shield, color: 'text-slate-600', gradient: 'from-slate-500 to-slate-700',
    tags: ['Audit', 'Payroll', 'Compliance'], status: 'Coming Soon',
  },
];

// ── Demo: Report Card Narrative Generator ─────────────────
const ReportNarrativeDemo = () => {
  const [generated, setGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const SAMPLE_STUDENT = { name: 'Arjun Sharma', grade: 'Grade 8', subject: 'Mathematics', marks: 87, attendance: 94, rank: 3, behavior: 'Excellent' };

  const NARRATIVE = `Arjun has demonstrated commendable dedication and intellectual curiosity throughout this academic term. In Mathematics, he achieved a score of 87%, ranking 3rd in class — a testament to his strong analytical thinking and consistent study habits. His attendance record of 94% reflects a responsible attitude toward his academics.

Arjun excels particularly in problem-solving and algebraic reasoning. He approaches complex problems methodically and often helps peers during collaborative activities. However, there is room for growth in geometry and data interpretation, where he should focus additional practice.

His classroom behavior has been exemplary — attentive, participative, and respectful. With continued effort and targeted practice in his weaker areas, Arjun is well on track to achieve outstanding results in the upcoming examinations. We are proud of his progress and encourage him to maintain this momentum.`;

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerated(false);
    setTimeout(() => { setIsGenerating(false); setGenerated(true); }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(NARRATIVE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(SAMPLE_STUDENT).map(([key, val]) => (
          <div key={key} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="text-xs text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
            <div className="font-semibold text-slate-800 text-sm mt-0.5">{val}</div>
          </div>
        ))}
      </div>

      <button onClick={handleGenerate} disabled={isGenerating} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-md shadow-blue-200 hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-60">
        {isGenerating ? <><RefreshCw size={16} className="animate-spin" /> Generating…</> : <><Sparkles size={16} /> Generate AI Narrative</>}
      </button>

      <AnimatePresence>
        {generated && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-blue-600" />
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">AI Generated Narrative</span>
              <button onClick={handleCopy} className="ml-auto flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
                {copied ? <CheckCircle size={12} /> : <Copy size={12} />} {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{NARRATIVE}</p>
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-blue-100">
              <span className="text-xs text-slate-500">Was this helpful?</span>
              <button className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors text-xs"><ThumbsUp size={12} /> Yes</button>
              <button className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-50 text-red-500 transition-colors text-xs"><ThumbsDown size={12} /> No</button>
              <button className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors">
                <CheckCircle size={12} /> Accept & Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Demo: NL Query Interface ───────────────────────────────
const NLQueryDemo = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! I\'m your School AI Assistant. Ask me anything about student data, attendance, financials, or performance — in plain English!', timestamp: '3:00 PM' },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const SAMPLE_QUERIES = [
    'Show top 10 absentees in Grade 8 this month',
    'Compare fee collection: Term 1 vs Term 2',
    'Which teachers have the highest student pass rates?',
    'List students with 3+ failed subjects',
  ];

  const RESPONSES: Record<string, string> = {
    default: `📊 Here's what I found:\n\n Based on the current data, I'm identifying the relevant records and generating an analysis. In a live deployment, this would query the database and return a formatted table or chart.\n\n💡 *Note: Connect your production API endpoint to enable real data queries.*`,
  };

  const handleSend = (query: string = input) => {
    if (!query.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: query, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      setMessages(prev => [...prev, { role: 'assistant', content: RESPONSES.default, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1800);
  };

  return (
    <div className="flex flex-col h-[320px]">
      <div className="flex-1 overflow-y-auto space-y-3 mb-3">
        {messages.map((msg, i) => (
          <div key={i} className={clsx('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={clsx('max-w-[80%] px-3 py-2.5 rounded-2xl text-sm', msg.role === 'user' ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-tr-sm' : 'bg-slate-100 text-slate-700 rounded-tl-sm')}>
              {msg.content.split('\n').map((line, j) => <p key={j}>{line || <br />}</p>)}
              <div className={clsx('text-[10px] mt-1', msg.role === 'user' ? 'text-white/70' : 'text-slate-400')}>{msg.timestamp}</div>
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1"><span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} /><span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} /><span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} /></div>
            </div>
          </div>
        )}
      </div>

      {/* Sample queries */}
      <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
        {SAMPLE_QUERIES.slice(0, 2).map(q => (
          <button key={q} onClick={() => handleSend(q)} className="flex-shrink-0 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-100 rounded-lg text-xs font-medium hover:bg-rose-100 transition-colors">
            {q}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Ask anything about your school data…" className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30" />
        <button onClick={() => handleSend()} className="px-3 py-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-colors"><Send size={14} /></button>
      </div>
    </div>
  );
};

// ── Feature Card ───────────────────────────────────────────
const FeatureCard = ({ feature, onSelect, isSelected }: { feature: AIFeature; onSelect: (f: AIFeature) => void; isSelected: boolean }) => {
  const Icon = feature.icon;
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 12px 30px -8px rgba(0,0,0,0.12)' }}
      onClick={() => onSelect(feature)}
      className={clsx(
        'bg-white rounded-2xl border p-4 cursor-pointer shadow-sm transition-all',
        isSelected ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-100 hover:border-slate-200'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={clsx('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center', feature.gradient)}>
          <Icon size={18} className="text-white" />
        </div>
        <span className={clsx('text-[10px] px-2 py-0.5 rounded-full font-semibold border',
          feature.status === 'Live' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
          feature.status === 'Beta' ? 'bg-amber-50 text-amber-700 border-amber-200' :
          'bg-slate-50 text-slate-500 border-slate-200'
        )}>{feature.status}</span>
      </div>
      <div className="font-semibold text-slate-800 text-sm mb-1">{feature.title}</div>
      <div className="text-xs text-slate-500 line-clamp-2 mb-3">{feature.description}</div>
      <div className="flex items-center justify-between">
        <div className="flex gap-1 flex-wrap">
          {feature.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-medium">{tag}</span>
          ))}
        </div>
        <ChevronRight size={14} className={clsx('transition-colors', isSelected ? 'text-amber-500' : 'text-slate-300')} />
      </div>
    </motion.div>
  );
};

// ── Main Component ─────────────────────────────────────────
export const AIDashboard = () => {
  const [selectedFeature, setSelectedFeature] = useState<AIFeature>(AI_FEATURES[0]);
  const [filter, setFilter] = useState<'All' | 'Live' | 'Beta' | 'Coming Soon'>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3;

  const filtered = AI_FEATURES.filter(f => filter === 'All' || f.status === filter);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedFeatures = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleFilterChange = (f: 'All' | 'Live' | 'Beta' | 'Coming Soon') => {
    setFilter(f);
    setCurrentPage(1);
  };

  const liveCount = AI_FEATURES.filter(f => f.status === 'Live').length;
  const betaCount = AI_FEATURES.filter(f => f.status === 'Beta').length;

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Brain size={16} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">AI Intelligence Hub</h1>
          </div>
          <p className="text-sm text-slate-500">Powered by Gemini AI — embedded across every module</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-emerald-700">{liveCount} Features Live</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl">
            <Zap size={12} className="text-amber-600" />
            <span className="text-xs font-semibold text-amber-700">{betaCount} In Beta</span>
          </div>
        </div>
      </div>

      {/* Highlight Banner */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-48 opacity-10">
          <Brain size={180} className="absolute -right-8 top-1/2 -translate-y-1/2" />
        </div>
        <div className="relative">
          <div className="text-xs font-semibold uppercase tracking-wider text-violet-200 mb-2">2026 Market Differentiator</div>
          <div className="text-xl font-bold mb-1">AI-first School ERP Platform</div>
          <div className="text-sm text-violet-200 max-w-lg">10 AI features embedded across Academics, Admissions, Finance, HR, Attendance, and Communication modules — all governed by human-in-the-loop review.</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {(['All', 'Live', 'Beta', 'Coming Soon'] as const).map(f => (
          <button key={f} onClick={() => handleFilterChange(f)} className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-all', filter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>
            {f}
          </button>
        ))}
      </div>

      {/* Split: Feature Grid + Demo */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Feature Grid & Pagination */}
        <div className="lg:col-span-2 flex flex-col gap-3 content-start">
          <div className="grid grid-cols-1 gap-3">
            {paginatedFeatures.map(f => (
              <FeatureCard key={f.id} feature={f} onSelect={setSelectedFeature} isSelected={selectedFeature.id === f.id} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-2xl shadow-sm mt-1">
              <div className="text-xs text-slate-500 font-medium">
                Page <span className="font-semibold text-slate-800">{currentPage}</span> of <span className="font-semibold text-slate-800">{totalPages}</span> ({filtered.length} features)
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition"
                  title="Previous Page"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={clsx(
                      'w-7 h-7 rounded-lg text-xs font-semibold transition',
                      currentPage === page
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    )}
                  >
                    {page}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition"
                  title="Next Page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Demo Panel */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFeature.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              {/* Feature Header */}
              <div className={clsx('bg-gradient-to-r p-5 text-white', selectedFeature.gradient)}>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <selectedFeature.icon size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">{selectedFeature.title}</div>
                    <div className="text-white/80 text-sm mt-0.5">{selectedFeature.module} Module</div>
                  </div>
                  <span className={clsx('ml-auto text-xs px-2 py-0.5 rounded-full font-semibold border',
                    selectedFeature.status === 'Live' ? 'bg-white/20 text-white border-white/30' :
                    selectedFeature.status === 'Beta' ? 'bg-white/10 text-white/80 border-white/20' :
                    'bg-white/10 text-white/60 border-white/10'
                  )}>{selectedFeature.status}</span>
                </div>
                <p className="text-white/80 text-sm mt-3 leading-relaxed">{selectedFeature.description}</p>
                <div className="flex gap-2 mt-3">
                  {selectedFeature.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-white/20 rounded-full text-white/90">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Demo */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Play size={14} className="text-slate-500" />
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Interactive Demo</span>
                </div>
                {selectedFeature.id === 'report-narrative' && <ReportNarrativeDemo />}
                {selectedFeature.id === 'nl-query' && <NLQueryDemo />}
                {selectedFeature.id === 'chatbot' && <NLQueryDemo />}
                {!['report-narrative', 'nl-query', 'chatbot'].includes(selectedFeature.id) && (
                  <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-100">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center mx-auto mb-4">
                      <selectedFeature.icon size={28} className="text-slate-500" />
                    </div>
                    <div className="font-semibold text-slate-700 mb-2">{selectedFeature.title}</div>
                    <div className="text-sm text-slate-500 mb-4">Interactive demo for this feature will be available once the {selectedFeature.module} module is fully connected to the AI API endpoint.</div>
                    <button className="px-4 py-2 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors flex items-center gap-2 mx-auto">
                      <Lightbulb size={14} /> Configure AI Integration <ArrowRight size={13} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

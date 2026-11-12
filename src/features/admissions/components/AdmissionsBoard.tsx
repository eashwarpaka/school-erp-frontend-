import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserCheck, FileText, Calendar, Award, X, Plus,
  Search, Filter, ChevronRight, Clock, Star, Phone, Mail,
  MapPin, GraduationCap, TrendingUp, Eye, Edit2, Trash2,
  CheckCircle, AlertCircle, XCircle, Sparkles, BarChart3,
  ArrowRight, Download, Upload, RefreshCw, Bot
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { AdmissionAssistant } from './AdmissionAssistant';
import { ApplicationForm } from './ApplicationForm';
import { DocumentVerification } from './DocumentVerification';
import { OfferLetterGenerator } from './OfferLetterGenerator';

// ── Types ──────────────────────────────────────────────────
type StageId = 'inquiry' | 'applied' | 'screened' | 'interview' | 'offered' | 'enrolled' | 'rejected';

interface Applicant {
  id: string;
  name: string;
  grade: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  parentName: string;
  phone: string;
  email: string;
  source: string;
  stage: StageId;
  aiScore?: number;
  aiRemark?: string;
  appliedDate: string;
  lastUpdated: string;
  priority: 'High' | 'Medium' | 'Low';
  documents: string[];
  notes?: string;
}

const STAGES: { id: StageId; label: string; color: string; bg: string; icon: React.ElementType }[] = [
  { id: 'inquiry',   label: 'Inquiry',   color: 'text-slate-600',   bg: 'bg-slate-100',   icon: Phone },
  { id: 'applied',   label: 'Applied',   color: 'text-blue-600',    bg: 'bg-blue-50',     icon: FileText },
  { id: 'screened',  label: 'Screened',  color: 'text-purple-600',  bg: 'bg-purple-50',   icon: Sparkles },
  { id: 'interview', label: 'Interview', color: 'text-amber-600',   bg: 'bg-amber-50',    icon: Calendar },
  { id: 'offered',   label: 'Offered',   color: 'text-emerald-600', bg: 'bg-emerald-50',  icon: Award },
  { id: 'enrolled',  label: 'Enrolled',  color: 'text-green-700',   bg: 'bg-green-50',    icon: CheckCircle },
  { id: 'rejected',  label: 'Rejected',  color: 'text-red-600',     bg: 'bg-red-50',      icon: XCircle },
];

const SOURCES = ['Website', 'Referral', 'Walk-in', 'School Fair', 'Social Media', 'WhatsApp', 'Google Ads'];
const PRIORITY_COLORS = { High: 'bg-red-100 text-red-700', Medium: 'bg-amber-100 text-amber-700', Low: 'bg-green-100 text-green-700' };

// ── Mock Data ─────────────────────────────────────────────
const INITIAL_APPLICANTS: Applicant[] = [
  { id: 'ADM-2026-001', name: 'Arjun Sharma',    grade: 'Grade 6', dob: '2014-03-15', gender: 'Male',   parentName: 'Ramesh Sharma',   phone: '+91 98765 43210', email: 'ramesh@email.com',  source: 'Website',      stage: 'offered',   aiScore: 91, aiRemark: 'Excellent academic record; strong extracurricular profile.',    appliedDate: '2026-06-10', lastUpdated: '2026-07-28', priority: 'High',   documents: ['birth_cert', 'report_card', 'id_proof'] },
  { id: 'ADM-2026-002', name: 'Priya Nair',      grade: 'Grade 9', dob: '2011-07-22', gender: 'Female', parentName: 'Suresh Nair',     phone: '+91 87654 32109', email: 'suresh@email.com',  source: 'Referral',     stage: 'interview', aiScore: 85, aiRemark: 'Good academics; leadership potential noted.',                   appliedDate: '2026-06-15', lastUpdated: '2026-07-30', priority: 'High',   documents: ['birth_cert', 'report_card'] },
  { id: 'ADM-2026-003', name: 'Rohan Patel',     grade: 'Grade 3', dob: '2017-11-08', gender: 'Male',   parentName: 'Vijay Patel',     phone: '+91 76543 21098', email: 'vijay@email.com',   source: 'Walk-in',      stage: 'screened',  aiScore: 72, aiRemark: 'Average scores; recommend additional assessment.',             appliedDate: '2026-06-20', lastUpdated: '2026-07-25', priority: 'Medium', documents: ['birth_cert'] },
  { id: 'ADM-2026-004', name: 'Ananya Reddy',    grade: 'Grade 1', dob: '2019-05-14', gender: 'Female', parentName: 'Krishna Reddy',   phone: '+91 65432 10987', email: 'krishna@email.com', source: 'School Fair',  stage: 'applied',   aiScore: 78, aiRemark: 'Age-appropriate development; enthusiastic learner.',           appliedDate: '2026-07-01', lastUpdated: '2026-07-29', priority: 'Medium', documents: ['birth_cert', 'id_proof'] },
  { id: 'ADM-2026-005', name: 'Dev Malhotra',    grade: 'Grade 6', dob: '2014-09-30', gender: 'Male',   parentName: 'Amit Malhotra',   phone: '+91 54321 09876', email: 'amit@email.com',    source: 'Social Media', stage: 'inquiry',                                                                                        appliedDate: '2026-07-05', lastUpdated: '2026-07-31', priority: 'Low',    documents: [] },
  { id: 'ADM-2026-006', name: 'Sneha Iyer',      grade: 'Grade 8', dob: '2012-01-19', gender: 'Female', parentName: 'Rajan Iyer',      phone: '+91 43210 98765', email: 'rajan@email.com',   source: 'WhatsApp',     stage: 'enrolled',  aiScore: 94, aiRemark: 'Top performer; exceptional merit scholarship candidate.',        appliedDate: '2026-05-28', lastUpdated: '2026-07-15', priority: 'High',   documents: ['birth_cert', 'report_card', 'id_proof', 'tc'] },
  { id: 'ADM-2026-007', name: 'Karan Singh',     grade: 'Grade 11', dob: '2009-06-25', gender: 'Male',  parentName: 'Gurpreet Singh',  phone: '+91 32109 87654', email: 'gurp@email.com',    source: 'Google Ads',   stage: 'rejected',  aiScore: 44, aiRemark: 'Does not meet minimum academic criteria for Grade 11.',        appliedDate: '2026-06-30', lastUpdated: '2026-07-20', priority: 'Low',    documents: ['birth_cert'] },
  { id: 'ADM-2026-008', name: 'Meera Krishnan',  grade: 'Grade 4', dob: '2016-12-03', gender: 'Female', parentName: 'Sunil Krishnan',  phone: '+91 21098 76543', email: 'sunil@email.com',   source: 'Referral',     stage: 'applied',   aiScore: 80, aiRemark: 'Solid foundation; creative aptitude test pending.',            appliedDate: '2026-07-08', lastUpdated: '2026-07-31', priority: 'Medium', documents: ['birth_cert', 'report_card'] },
];

// ── Sub-components ─────────────────────────────────────────
const ScoreBadge = ({ score }: { score?: number }) => {
  if (!score) return null;
  const color = score >= 85 ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
    : score >= 70 ? 'text-amber-700 bg-amber-50 border-amber-200'
    : 'text-red-700 bg-red-50 border-red-200';
  return (
    <div className={clsx('flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-bold', color)}>
      <Sparkles size={10} />
      AI: {score}
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color, delta }: { label: string; value: string | number; icon: React.ElementType; color: string; delta?: string }) => (
  <motion.div
    whileHover={{ y: -2, boxShadow: '0 8px 25px -5px rgba(0,0,0,0.1)' }}
    className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-4"
  >
    <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', color)}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <div className="text-xs text-slate-500 font-medium">{label}</div>
      {delta && <div className="text-xs text-emerald-600 font-semibold mt-0.5">{delta}</div>}
    </div>
  </motion.div>
);

// ── Applicant Card ─────────────────────────────────────────
const ApplicantCard = ({
  applicant,
  onClick,
  onStageChange,
}: {
  applicant: Applicant;
  onClick: (a: Applicant) => void;
  onStageChange: (id: string, stage: StageId) => void;
}) => {
  const stageIdx = STAGES.findIndex(s => s.id === applicant.stage);
  const nextStage = stageIdx < STAGES.length - 2 ? STAGES[stageIdx + 1] : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onClick(applicant)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {applicant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-800">{applicant.name}</div>
            <div className="text-xs text-slate-500">{applicant.grade} · {applicant.gender}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <ScoreBadge score={applicant.aiScore} />
          <span className={clsx('text-[10px] px-2 py-0.5 rounded-full font-medium', PRIORITY_COLORS[applicant.priority])}>
            {applicant.priority}
          </span>
        </div>
      </div>

      {/* Parent Info */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
        <Users size={11} />
        <span>{applicant.parentName}</span>
        <span className="text-slate-300">·</span>
        <span>{applicant.source}</span>
      </div>

      {/* AI Remark */}
      {applicant.aiRemark && (
        <div className="text-[11px] text-slate-500 italic bg-slate-50 rounded-lg px-2.5 py-1.5 mb-3 line-clamp-2 border-l-2 border-purple-300">
          {applicant.aiRemark}
        </div>
      )}

      {/* Documents */}
      <div className="flex items-center gap-1 mb-3">
        {applicant.documents.length > 0
          ? <span className="text-xs text-emerald-600 font-medium flex items-center gap-1"><CheckCircle size={11} /> {applicant.documents.length} docs</span>
          : <span className="text-xs text-amber-600 font-medium flex items-center gap-1"><AlertCircle size={11} /> No docs</span>
        }
        <span className="text-slate-300 text-xs ml-auto">{applicant.id}</span>
      </div>

      {/* Action */}
      {nextStage && applicant.stage !== 'rejected' && (
        <button
          onClick={e => { e.stopPropagation(); onStageChange(applicant.id, nextStage.id); }}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-amber-50 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-colors border border-amber-200 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Move to {nextStage.label} <ArrowRight size={11} />
        </button>
      )}
    </motion.div>
  );
};

// ── Detail Drawer ──────────────────────────────────────────
const ApplicantDrawer = ({ applicant, onClose, onStageChange }: { applicant: Applicant; onClose: () => void; onStageChange: (id: string, stage: StageId) => void }) => {
  const stage = STAGES.find(s => s.id === applicant.stage)!;
  const StageIcon = stage.icon;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed right-0 top-0 h-full w-full max-w-[480px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden border-l border-slate-200"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
        <div>
          <h2 className="font-bold text-slate-800 text-lg">{applicant.name}</h2>
          <p className="text-sm text-slate-500">{applicant.id} · {applicant.grade}</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
          <X size={18} className="text-slate-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Current Stage */}
        <div className={clsx('flex items-center gap-3 p-4 rounded-2xl border', stage.bg)}>
          <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', stage.bg, 'border', stage.color.replace('text-', 'border-'))}>
            <StageIcon size={18} className={stage.color} />
          </div>
          <div>
            <div className="text-xs text-slate-500">Current Stage</div>
            <div className={clsx('font-bold text-base', stage.color)}>{stage.label}</div>
          </div>
          <div className="ml-auto text-xs text-slate-400">Updated {applicant.lastUpdated}</div>
        </div>

        {/* AI Screening */}
        {applicant.aiScore && (
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-100">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-purple-600" />
              <span className="font-semibold text-purple-800 text-sm">AI Screening Result</span>
              <span className={clsx(
                'ml-auto text-lg font-black',
                applicant.aiScore >= 85 ? 'text-emerald-600' : applicant.aiScore >= 70 ? 'text-amber-600' : 'text-red-600'
              )}>{applicant.aiScore}/100</span>
            </div>
            {/* Score Bar */}
            <div className="w-full h-2 bg-white/60 rounded-full mb-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${applicant.aiScore}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={clsx('h-full rounded-full', applicant.aiScore >= 85 ? 'bg-emerald-500' : applicant.aiScore >= 70 ? 'bg-amber-500' : 'bg-red-500')}
              />
            </div>
            <p className="text-xs text-purple-700 italic">"{applicant.aiRemark}"</p>
          </div>
        )}

        {/* Contact Info */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Contact Details</h3>
          <div className="space-y-2.5">
            {[
              { icon: Users, label: 'Parent / Guardian', value: applicant.parentName },
              { icon: Phone, label: 'Phone', value: applicant.phone },
              { icon: Mail, label: 'Email', value: applicant.email },
              { icon: GraduationCap, label: 'Applying For', value: applicant.grade },
              { icon: TrendingUp, label: 'Lead Source', value: applicant.source },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-slate-500" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</div>
                  <div className="text-sm font-medium text-slate-700">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Documents</h3>
          {applicant.documents.length === 0 ? (
            <div className="text-sm text-slate-400 italic">No documents uploaded yet.</div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {applicant.documents.map(doc => (
                <div key={doc} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <FileText size={14} className="text-emerald-600" />
                  <span className="text-xs text-slate-600 capitalize">{doc.replace('_', ' ')}</span>
                  <CheckCircle size={12} className="text-emerald-500 ml-auto" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stage Pipeline */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Move to Stage</h3>
          <div className="grid grid-cols-2 gap-2">
            {STAGES.filter(s => s.id !== applicant.stage).map(s => {
              const SIcon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => onStageChange(applicant.id, s.id)}
                  className={clsx(
                    'flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all hover:scale-[1.02]',
                    s.bg, s.color, s.color.replace('text-', 'border-').replace('600', '200').replace('700', '200')
                  )}
                >
                  <SIcon size={13} /> {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ── Main Component ─────────────────────────────────────────
export const AdmissionsBoard = () => {
  const [applicants, setApplicants] = useState<Applicant[]>(INITIAL_APPLICANTS);
  const [selected, setSelected] = useState<Applicant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSource, setFilterSource] = useState('All');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [showNewInquiry, setShowNewInquiry] = useState(false);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'application' | 'verification' | 'offer'>('pipeline');

  const filtered = applicants.filter(a =>
    (a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     a.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
     a.id.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterSource === 'All' || a.source === filterSource)
  );

  const handleStageChange = (id: string, newStage: StageId) => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, stage: newStage, lastUpdated: new Date().toISOString().split('T')[0] } : a));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, stage: newStage } : null);
  };

  const handleNewInquirySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    
    // Auto-generate AI score for new lead
    const score = Math.floor(Math.random() * (98 - 65 + 1) + 65);
    const remark = score >= 85 ? 'Strong applicant profile based on early indicators.' : score >= 75 ? 'Average fit. Proceed with standard screening.' : 'Below typical threshold. Flag for manual review.';
    
    const newLead: Applicant = {
      id: `ADM-2026-${Math.floor(Math.random()*1000).toString().padStart(3, '0')}`,
      name,
      grade: fd.get('grade') as string,
      dob: '2015-01-01',
      gender: 'Other',
      parentName: fd.get('parent') as string,
      phone: fd.get('phone') as string,
      email: 'test@email.com',
      source: fd.get('source') as string,
      stage: 'inquiry',
      aiScore: score,
      aiRemark: remark,
      appliedDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      priority: score >= 85 ? 'High' : score >= 75 ? 'Medium' : 'Low',
      documents: []
    };

    setApplicants(prev => [newLead, ...prev]);
    setShowNewInquiry(false);
    
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <Bot className="h-10 w-10 text-purple-500 bg-purple-50 rounded-full p-2" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-bold text-slate-900">AI Assistant: Lead Auto-Scored!</p>
              <p className="mt-1 text-sm text-slate-500">
                {name} was added. AI calculated a preliminary score of <span className="font-bold text-slate-700">{score}/100</span> based on historical conversion data.
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button onClick={() => toast.dismiss(t.id)} className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-slate-600 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500">
            Close
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  // Stats
  const total = applicants.length;
  const enrolled = applicants.filter(a => a.stage === 'enrolled').length;
  const offered = applicants.filter(a => a.stage === 'offered').length;
  const convRate = total > 0 ? Math.round((enrolled / total) * 100) : 0;

  return (
    <div className="flex flex-col h-full gap-4 p-4">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admissions Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">AI-powered admission pipeline — AY 2026–27</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <Download size={14} /> Export
          </button>
          <button onClick={() => setShowNewInquiry(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-md shadow-amber-200">
            <Plus size={15} /> New Inquiry
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Applicants" value={total} icon={Users} color="bg-blue-500" delta="+12 this week" />
        <StatCard label="Offers Extended" value={offered} icon={Award} color="bg-amber-500" />
        <StatCard label="Enrolled" value={enrolled} icon={CheckCircle} color="bg-emerald-500" />
        <StatCard label="Conversion Rate" value={`${convRate}%`} icon={TrendingUp} color="bg-purple-500" delta="↑ 4% vs last year" />
      </div>

      {/* Tabs for Workflows */}
      <div className="flex border-b border-slate-200 mb-2">
        {[
          { id: 'pipeline', label: 'Pipeline' },
          { id: 'application', label: 'Application Form' },
          { id: 'verification', label: 'Document Verification' },
          { id: 'offer', label: 'Offer Generator' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={clsx(
              "px-5 py-3 text-sm font-semibold border-b-2 transition-all",
              activeTab === tab.id 
                ? "border-amber-500 text-amber-600" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'pipeline' && (
        <>
          {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, parent, or ID…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400"
          />
        </div>
        <select
          value={filterSource}
          onChange={e => setFilterSource(e.target.value)}
          className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-slate-600"
        >
          <option value="All">All Sources</option>
          {SOURCES.map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="flex bg-slate-100 rounded-xl p-0.5">
          {(['kanban', 'list'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize', viewMode === mode ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700')}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1 min-h-0">
          {STAGES.map(stage => {
            const stageApplicants = filtered.filter(a => a.stage === stage.id);
            const StageIcon = stage.icon;
            return (
              <div key={stage.id} className="flex-shrink-0 w-[260px] flex flex-col">
                {/* Column Header */}
                <div className={clsx('flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3', stage.bg)}>
                  <StageIcon size={14} className={stage.color} />
                  <span className={clsx('text-xs font-bold uppercase tracking-wider', stage.color)}>{stage.label}</span>
                  <span className={clsx('ml-auto text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center', stage.bg, stage.color, 'border', stage.color.replace('text-','border-').replace('600','300').replace('700','300'))}>
                    {stageApplicants.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                  <AnimatePresence>
                    {stageApplicants.map(a => (
                      <ApplicantCard key={a.id} applicant={a} onClick={setSelected} onStageChange={handleStageChange} />
                    ))}
                  </AnimatePresence>
                  {stageApplicants.length === 0 && (
                    <div className="text-center py-8 text-slate-300 text-xs italic">No applicants</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex-1 flex flex-col">
          <div className="overflow-auto flex-1">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['ID', 'Applicant', 'Grade', 'Parent', 'Source', 'Stage', 'AI Score', 'Priority', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(a => {
                  const s = STAGES.find(st => st.id === a.stage)!;
                  const SIcon = s.icon;
                  return (
                    <tr key={a.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setSelected(a)}>
                      <td className="px-4 py-3 text-xs text-slate-400 font-mono">{a.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {a.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{a.name}</div>
                            <div className="text-xs text-slate-400">{a.gender} · DOB: {a.dob}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{a.grade}</td>
                      <td className="px-4 py-3 text-slate-600">{a.parentName}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">{a.source}</span></td>
                      <td className="px-4 py-3">
                        <span className={clsx('flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium w-fit', s.bg, s.color)}>
                          <SIcon size={11} />{s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3"><ScoreBadge score={a.aiScore} /></td>
                      <td className="px-4 py-3"><span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium', PRIORITY_COLORS[a.priority])}>{a.priority}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={e => { e.stopPropagation(); setSelected(a); }} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"><Eye size={14} /></button>
                          <button onClick={e => e.stopPropagation()} className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors"><Edit2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Drawer Overlay */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40" />
            <ApplicantDrawer applicant={selected} onClose={() => setSelected(null)} onStageChange={handleStageChange} />
          </>
        )}
      </AnimatePresence>
      </>
      )}

      {activeTab === 'application' && (
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <ApplicationForm />
        </div>
      )}
      {activeTab === 'verification' && (
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <DocumentVerification />
        </div>
      )}
      {activeTab === 'offer' && (
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <OfferLetterGenerator />
        </div>
      )}

      <AdmissionAssistant />

      {/* New Inquiry Modal */}
      <AnimatePresence>
        {showNewInquiry && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2"><Plus size={18} className="text-amber-500"/> Capture New Lead</h3>
                  <button onClick={() => setShowNewInquiry(false)} className="text-slate-400 hover:text-slate-600"><X size={18}/></button>
                </div>
                <form onSubmit={handleNewInquirySubmit} className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Student Name</label>
                    <input name="name" required className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-500" placeholder="e.g. John Doe"/>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Applying For Grade</label>
                    <select name="grade" className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-500">
                      <option>Grade 1</option><option>Grade 2</option><option>Grade 6</option><option>Grade 9</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Parent Name</label>
                    <input name="parent" required className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-500" placeholder="e.g. Richard Doe"/>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Phone</label>
                    <input name="phone" required className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-500" placeholder="+1 234 567 890"/>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Source</label>
                    <select name="source" className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-500">
                      {SOURCES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg flex gap-3 mt-4 border border-purple-100">
                    <Bot size={20} className="text-purple-600 flex-shrink-0" />
                    <p className="text-xs text-purple-800">
                      <strong>AI Auto-Scoring enabled.</strong> Upon submission, this lead will be instantly scored based on historical enrollment data and assigned a priority queue.
                    </p>
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <button type="button" onClick={() => setShowNewInquiry(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg">Add Lead</button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

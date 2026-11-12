import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, FileText, CheckCircle, XCircle, AlertTriangle, Eye, Clock, Download } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface VerificationTask {
  id: string;
  applicantName: string;
  grade: string;
  documentType: string;
  submissionDate: string;
  status: 'Pending' | 'Failed_AI' | 'Verified' | 'Rejected';
  aiConfidence: number;
  aiIssue?: string;
}

const INITIAL_TASKS: VerificationTask[] = [
  { id: 'DOC-001', applicantName: 'Rohan Patel', grade: 'Grade 3', documentType: 'Birth Certificate', submissionDate: '2026-07-28', status: 'Failed_AI', aiConfidence: 45, aiIssue: 'Blurry image. Name not clearly visible.' },
  { id: 'DOC-002', applicantName: 'Sneha Iyer', grade: 'Grade 8', documentType: 'Previous Report Card', submissionDate: '2026-07-29', status: 'Pending', aiConfidence: 0, aiIssue: undefined },
  { id: 'DOC-003', applicantName: 'Karan Singh', grade: 'Grade 11', documentType: 'Aadhar Card', submissionDate: '2026-07-29', status: 'Failed_AI', aiConfidence: 60, aiIssue: 'Mismatched date of birth compared to application.' },
  { id: 'DOC-004', applicantName: 'Meera Krishnan', grade: 'Grade 4', documentType: 'Birth Certificate', submissionDate: '2026-07-30', status: 'Verified', aiConfidence: 98, aiIssue: undefined },
];

export const DocumentVerification: React.FC = () => {
  const [tasks, setTasks] = useState<VerificationTask[]>(INITIAL_TASKS);
  const [filter, setFilter] = useState<'All' | 'Failed_AI' | 'Pending'>('Failed_AI');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTaskForView, setSelectedTaskForView] = useState<VerificationTask | null>(null);

  const filteredTasks = tasks.filter(t => {
    const matchesFilter = filter === 'All' ? true : t.status === filter;
    const matchesSearch = t.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: action === 'approve' ? 'Verified' : 'Rejected' };
      }
      return t;
    }));
    toast.success(`Document ${action === 'approve' ? 'verified' : 'rejected'} successfully.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Document Verification Queue</h2>
          <p className="text-slate-500 mt-1">Manual review queue for failed auto-verifications and pending docs.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap gap-4 items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          {['Failed_AI', 'Pending', 'All'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                filter === f
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              )}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search applicant or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={task.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{task.applicantName}</h3>
                  <p className="text-xs text-slate-500">{task.grade} • {task.id}</p>
                </div>
              </div>
              <div className={clsx(
                'px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1',
                task.status === 'Failed_AI' ? 'bg-red-50 text-red-700 border-red-200' :
                task.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                task.status === 'Rejected' ? 'bg-slate-100 text-slate-700 border-slate-300' :
                'bg-amber-50 text-amber-700 border-amber-200'
              )}>
                {task.status === 'Failed_AI' && <AlertTriangle size={12} />}
                {task.status === 'Verified' && <CheckCircle size={12} />}
                {task.status === 'Pending' && <Clock size={12} />}
                {task.status.replace('_', ' ')}
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Document:</span>
                <span className="font-medium text-slate-800">{task.documentType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Submitted:</span>
                <span className="font-medium text-slate-800">{task.submissionDate}</span>
              </div>
              
              {task.status === 'Failed_AI' && (
                <div className="mt-3 bg-red-50/50 border border-red-100 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded">AI Confidence: {task.aiConfidence}%</span>
                  </div>
                  <p className="text-sm text-red-700 font-medium leading-snug">{task.aiIssue}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedTaskForView(task)}
                className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <Eye size={16} /> View Doc
              </button>
              {(task.status === 'Pending' || task.status === 'Failed_AI') && (
                <>
                  <button 
                    onClick={() => handleAction(task.id, 'reject')}
                    className="w-10 flex items-center justify-center border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <XCircle size={18} />
                  </button>
                  <button 
                    onClick={() => handleAction(task.id, 'approve')}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    Approve
                  </button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredTasks.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
          <CheckCircle size={48} className="mx-auto text-emerald-400 mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">All Caught Up!</h3>
          <p className="text-slate-500">No documents pending manual verification in this view.</p>
        </div>
      )}

      {/* Document Viewer Modal */}
      <AnimatePresence>
        {selectedTaskForView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSelectedTaskForView(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Document Viewer</h3>
                  <p className="text-sm text-slate-500">{selectedTaskForView.applicantName} • {selectedTaskForView.documentType}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                    <Download size={18} />
                  </button>
                  <button onClick={() => setSelectedTaskForView(null)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <XCircle size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 p-6 bg-slate-100 overflow-y-auto flex items-center justify-center min-h-[400px]">
                <div className="bg-white p-8 shadow-sm border border-slate-200 max-w-2xl w-full aspect-[1/1.4] flex flex-col items-center justify-center text-center">
                  <FileText size={64} className="text-slate-200 mb-4" />
                  <h4 className="text-xl font-bold text-slate-700 mb-2">{selectedTaskForView.documentType}</h4>
                  <p className="text-slate-500 text-sm max-w-xs mb-8">
                    This is a simulated secure document viewer. In production, this would render a PDF or High-Res Image of the applicant's uploaded file.
                  </p>
                  
                  {selectedTaskForView.status === 'Failed_AI' && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 w-full text-left">
                      <div className="flex items-center gap-2 mb-2 text-red-700 font-bold">
                        <AlertTriangle size={16} /> AI Flagged Issue
                      </div>
                      <p className="text-red-600 text-sm">{selectedTaskForView.aiIssue}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              {(selectedTaskForView.status === 'Pending' || selectedTaskForView.status === 'Failed_AI') && (
                <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3">
                  <button
                    onClick={() => {
                      handleAction(selectedTaskForView.id, 'reject');
                      setSelectedTaskForView(null);
                    }}
                    className="px-6 py-2.5 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors"
                  >
                    Reject Document
                  </button>
                  <button
                    onClick={() => {
                      handleAction(selectedTaskForView.id, 'approve');
                      setSelectedTaskForView(null);
                    }}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <CheckCircle size={18} /> Approve Document
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

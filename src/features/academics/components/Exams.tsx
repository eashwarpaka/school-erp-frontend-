import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileEdit, Plus, Search, Filter, Calendar, FileText, CheckCircle, X, SearchX, ArrowUpDown, Edit, Trash2, ArrowLeft, Check, Percent, Brain, Bot, Download as DownloadIcon } from 'lucide-react';
import { useAcademicStore } from '../../admin/store/academicStore';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { AiDraftReviewer } from '../../ai/components/AiDraftReviewer';
import { AIService } from '../../ai/services/aiService';

export const Exams = () => {
  const [activeTab, setActiveTab] = useState<'exams' | 'patterns' | 'components' | 'marks' | 'ai_generator'>('exams');
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  
  const exams = useAcademicStore(s => s.exams);
  const examPatterns = useAcademicStore(s => s.examPatterns);
  const assessmentComponents = useAcademicStore(s => s.assessmentComponents);
  const terms = useAcademicStore(s => s.terms);
  const subjects = useAcademicStore(s => s.subjects);
  const enrollments = useAcademicStore(s => s.enrollments);
  const sections = useAcademicStore(s => s.sections);
  const marks = useAcademicStore(s => s.marks);
  const saveMarks = useAcademicStore(s => s.saveMarks);
  const results = useAcademicStore(s => s.results);
  const calculateResults = useAcademicStore(s => s.calculateResults);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: string} | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const itemsPerPage = 10;

  const [examForm, setExamForm] = useState({ name: '', examPatternId: '', termId: '', startDate: '', endDate: '', status: 'Draft' as any });
  const [patternForm, setPatternForm] = useState({ name: '', description: '', components: [] as string[] });
  const [componentForm, setComponentForm] = useState({ name: '', type: 'Theory', maxMarks: 100, weightage: 100 });

  const openModal = (item?: any) => {
    setEditingItem(item || null);
    if (activeTab === 'exams') {
      setExamForm(item ? { name: item.name, examPatternId: item.examPatternId, termId: item.termId, startDate: item.startDate, endDate: item.endDate, status: item.status } : { name: '', examPatternId: '', termId: '', startDate: '', endDate: '', status: 'Draft' });
    } else if (activeTab === 'patterns') {
      setPatternForm(item ? { name: item.name, description: item.description, components: item.components } : { name: '', description: '', components: [] });
    } else if (activeTab === 'components') {
      setComponentForm(item ? { name: item.name, type: item.type, maxMarks: item.maxMarks, weightage: item.weightage } : { name: '', type: 'Theory', maxMarks: 100, weightage: 100 });
    }
    setIsCreateModalOpen(true);
  };

  const handleSave = () => {
    const store = useAcademicStore.getState();
    if (activeTab === 'exams') {
      if (!examForm.name || !examForm.examPatternId || !examForm.termId || !examForm.startDate || !examForm.endDate) {
        toast.error('Please fill in all required fields');
        return;
      }
      if (editingItem) store.updateExam(editingItem.id, examForm);
      else store.addExam({ id: `EX-${Date.now()}`, ...examForm } as any);
    } else if (activeTab === 'patterns') {
      if (!patternForm.name || !patternForm.description || patternForm.components.length === 0) {
        toast.error('Please fill in all required fields and select at least one component');
        return;
      }
      if (editingItem) store.updateExamPattern(editingItem.id, patternForm);
      else store.addExamPattern({ id: `EP-${Date.now()}`, ...patternForm });
    } else if (activeTab === 'components') {
      if (!componentForm.name) {
        toast.error('Please fill in all required fields');
        return;
      }
      if (editingItem) store.updateAssessmentComponent(editingItem.id, componentForm as any);
      else store.addAssessmentComponent({ id: `AC-${Date.now()}`, ...componentForm } as any);
    }
    toast.success('Saved successfully');
    setIsCreateModalOpen(false);
  };

  const handleDelete = () => {
    const store = useAcademicStore.getState();
    if (!itemToDelete) return;
    if (itemToDelete.type === 'exams') store.deleteExam(itemToDelete.id);
    if (itemToDelete.type === 'patterns') store.deleteExamPattern(itemToDelete.id);
    if (itemToDelete.type === 'components') store.deleteAssessmentComponent(itemToDelete.id);
    toast.success('Deleted successfully');
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = useMemo(() => {
    let sortableItems: any[] = [];
    
    if (activeTab === 'exams') sortableItems = [...exams];
    if (activeTab === 'patterns') sortableItems = [...examPatterns];
    if (activeTab === 'components') sortableItems = [...assessmentComponents];
    
    if (activeTab === 'exams' && filterStatus !== 'All Status') {
      sortableItems = sortableItems.filter(item => item.status === filterStatus);
    }

    if (searchTerm) {
      sortableItems = sortableItems.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortConfig !== null) {
      sortableItems.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [exams, examPatterns, assessmentComponents, activeTab, searchTerm, sortConfig, filterStatus]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Marks Entry State
  const selectedExam = exams.find(e => e.id === selectedExamId);
  const selectedPattern = examPatterns.find(p => p.id === selectedExam?.examPatternId);
  const patternComponents = assessmentComponents.filter(c => selectedPattern?.components.includes(c.id));
  
  const [marksState, setMarksState] = useState<Record<string, Record<string, string>>>({}); // studentId -> componentId -> marks

  useEffect(() => {
    if (activeTab === 'marks' && selectedExamId) {
      const initialMarks: Record<string, Record<string, string>> = {};
      enrollments.forEach(enr => {
        initialMarks[enr.studentId] = {};
        patternComponents.forEach(comp => {
          const m = marks.find(mx => mx.examId === selectedExamId && mx.studentId === enr.studentId && mx.componentId === comp.id);
          initialMarks[enr.studentId][comp.id] = m ? (m.moderatedMarks ?? m.marksObtained).toString() : '';
        });
      });
      setMarksState(initialMarks);
    }
  }, [activeTab, selectedExamId, enrollments, marks, patternComponents]);

  const handleSaveMarks = () => {
    if (!selectedExamId) return;
    const marksToSave: any[] = [];
    Object.entries(marksState).forEach(([studentId, comps]) => {
      Object.entries(comps).forEach(([componentId, markStr]) => {
        if (markStr.trim() !== '') {
          marksToSave.push({
            id: `ME-${Date.now()}-${studentId}-${componentId}`,
            examId: selectedExamId,
            studentId,
            subjectId: subjects[0]?.id || 'SUB-MATH', // Mock single subject for simplicity in full flow
            componentId,
            marksObtained: parseFloat(markStr),
            isModerated: false
          });
        }
      });
    });
    saveMarks(marksToSave);
    toast.success('Marks saved successfully');
  };

  const handleGenerateResults = () => {
    if (!selectedExamId) return;
    calculateResults(selectedExamId);
    toast.success('Results generated successfully');
  };

  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-normal text-slate-800 tracking-tight">Examinations</h1>
          <p className="text-sm text-slate-500 mt-1">Manage tests, quizzes, and term exams.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-medium text-sm shadow-sm"
            >
              <Filter size={16} />
              Filters
            </button>
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-10 py-2"
                >
                  <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</div>
                  <button onClick={() => { setFilterStatus('All Status'); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-2 text-sm transition-colors ${filterStatus === 'All Status' ? 'bg-amber-50 text-amber-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}>All Status</button>
                  <button onClick={() => { setFilterStatus('Upcoming'); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-2 text-sm transition-colors ${filterStatus === 'Upcoming' ? 'bg-amber-50 text-amber-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}>Upcoming</button>
                  <button onClick={() => { setFilterStatus('Completed'); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-2 text-sm transition-colors ${filterStatus === 'Completed' ? 'bg-amber-50 text-amber-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}>Completed</button>
                  <button onClick={() => { setFilterStatus('Draft'); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-2 text-sm transition-colors ${filterStatus === 'Draft' ? 'bg-amber-50 text-amber-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}>Draft</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {activeTab !== 'ai_generator' && (
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all font-medium text-sm shadow-sm shadow-amber-500/20"
          >
            <Plus size={16} />
            Create {activeTab === 'exams' ? 'Exam' : activeTab === 'patterns' ? 'Pattern' : 'Component'}
          </button>
          )}
        </div>
      </div>

      {activeTab !== 'marks' && (
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => { setActiveTab('exams'); setCurrentPage(1); }}
            className={clsx("px-4 py-2 text-sm font-medium rounded-lg transition-all", activeTab === 'exams' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-600 hover:text-slate-800')}
          >
            Exams
          </button>
          <button
            onClick={() => { setActiveTab('patterns'); setCurrentPage(1); }}
            className={clsx("px-4 py-2 text-sm font-medium rounded-lg transition-all", activeTab === 'patterns' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-600 hover:text-slate-800')}
          >
            Exam Patterns
          </button>
          <button
            onClick={() => { setActiveTab('components'); setCurrentPage(1); }}
            className={clsx("px-4 py-2 text-sm font-medium rounded-lg transition-all", activeTab === 'components' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-600 hover:text-slate-800')}
          >
            Assessment Components
          </button>
          <button
            onClick={() => { setActiveTab('ai_generator'); setCurrentPage(1); }}
            className={clsx("flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all", activeTab === 'ai_generator' ? 'bg-purple-100 text-purple-700 shadow-sm' : 'text-slate-600 hover:text-purple-600')}
          >
            <Brain size={16} /> AI Generator
          </button>
        </div>
      )}

      {activeTab === 'marks' && selectedExam && (
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab('exams')}
            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ArrowLeft size={18} className="text-slate-600" />
          </button>
          <h2 className="text-lg font-semibold text-slate-800">Marks Entry: {selectedExam.name}</h2>
          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold border border-amber-200">{selectedPattern?.name}</span>
        </div>
      )}

      {activeTab === 'exams' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Upcoming Exams</p>
              <p className="text-2xl font-bold text-slate-800">{exams.filter(e => e.status === 'Scheduled').length}</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Completed This Term</p>
              <p className="text-2xl font-bold text-slate-800">{exams.filter(e => e.status === 'Completed').length}</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Drafts</p>
              <p className="text-2xl font-bold text-slate-800">{exams.filter(e => e.status === 'Draft').length}</p>
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === 'ai_generator' && (
        <AIPaperGenerator />
      )}

      {activeTab !== 'marks' && activeTab !== 'ai_generator' ? (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search exams by title or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-500">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-100 p-4 rounded-full mb-4"
            >
              <SearchX size={48} className="text-slate-400" />
            </motion.div>
            <p className="text-lg font-semibold text-slate-700 mb-1">No data found</p>
            <p className="text-sm text-slate-500 text-center max-w-sm">
              We couldn't find any exams matching "{searchTerm}". Try adjusting your search criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th onClick={() => handleSort('name')} className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-2">Name <ArrowUpDown size={14} /></div>
                  </th>
                  {activeTab === 'exams' && (
                    <>
                      <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pattern</th>
                      <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Dates</th>
                      <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    </>
                  )}
                  {activeTab === 'patterns' && (
                    <>
                      <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                      <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Components</th>
                    </>
                  )}
                  {activeTab === 'components' && (
                    <>
                      <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Max Marks</th>
                      <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Weightage</th>
                    </>
                  )}
                  <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentData.map((item, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={item.id} 
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
                          {activeTab === 'components' ? <Percent size={18} /> : <FileEdit size={18} />}
                        </div>
                        <div className="text-sm font-semibold text-slate-800">{item.name}</div>
                      </div>
                    </td>
                    
                    {activeTab === 'exams' && (
                      <>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                            {examPatterns.find(p => p.id === item.examPatternId)?.name || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600 font-medium">
                          {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            item.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-200/50' :
                            item.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' :
                            'bg-slate-100 text-slate-600 border border-slate-200/50'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </>
                    )}

                    {activeTab === 'patterns' && (
                      <>
                        <td className="px-5 py-4 text-sm text-slate-600">{item.description}</td>
                        <td className="px-5 py-4 text-sm text-slate-600 font-medium">{item.components.length} components</td>
                      </>
                    )}

                    {activeTab === 'components' && (
                      <>
                        <td className="px-5 py-4 text-sm text-slate-600">{item.type}</td>
                        <td className="px-5 py-4 text-sm font-medium text-slate-700">{item.maxMarks}</td>
                        <td className="px-5 py-4 text-sm font-medium text-slate-700">{item.weightage}%</td>
                      </>
                    )}

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {activeTab === 'exams' && (
                          <button 
                            onClick={() => { setSelectedExamId(item.id); setActiveTab('marks'); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <FileText size={14} /> Marks
                          </button>
                        )}
                        <button 
                          onClick={() => openModal(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                        >
                          <Edit size={14} /> Edit
                        </button>
                        <button 
                          onClick={() => { setItemToDelete({id: item.id, type: activeTab}); setIsDeleteModalOpen(true); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-sm text-slate-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-50 disabled:cursor-not-allowed font-medium text-slate-600 transition-colors"
              >
                Previous
              </button>
              <div className="flex gap-1 items-center px-2">
                <span className="text-sm font-semibold text-slate-700">{currentPage}</span>
                <span className="text-sm text-slate-400">/ {totalPages}</span>
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-50 disabled:cursor-not-allowed font-medium text-slate-600 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-0">
          <div className="overflow-x-auto flex-1 p-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-4">Student</th>
                  {patternComponents.map(c => (
                    <th key={c.id} className="px-5 py-4">{c.name} ({c.maxMarks})</th>
                  ))}
                  <th className="px-5 py-4 text-center">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enrollments.map(enr => {
                  const r = results.find(res => res.examId === selectedExamId && res.studentId === enr.studentId);
                  return (
                    <tr key={enr.studentId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3 text-sm font-medium text-slate-800">{enr.studentName}</td>
                      {patternComponents.map(c => (
                        <td key={c.id} className="px-5 py-3">
                          <input 
                            type="number"
                            value={marksState[enr.studentId]?.[c.id] || ''}
                            onChange={(e) => setMarksState(prev => ({
                              ...prev,
                              [enr.studentId]: { ...prev[enr.studentId], [c.id]: e.target.value }
                            }))}
                            className="w-20 px-3 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                            max={c.maxMarks}
                            min={0}
                          />
                        </td>
                      ))}
                      <td className="px-5 py-3 text-center">
                        {r ? (
                          <div className="flex flex-col items-center">
                            <span className="font-bold text-slate-800">{r.totalMarks} / {patternComponents.reduce((acc, curr) => acc + curr.maxMarks, 0)}</span>
                            <span className={clsx("text-xs font-bold px-2 py-0.5 rounded-full mt-1", r.grade.startsWith('A') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700')}>{r.grade}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">N/A</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
            <button 
              onClick={handleGenerateResults}
              className="px-4 py-2 bg-white text-slate-700 text-sm font-medium rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              Generate Results
            </button>
            <button 
              onClick={handleSaveMarks}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium rounded-lg shadow-sm hover:from-amber-600 hover:to-amber-700 transition-all flex items-center gap-2"
            >
              <Check size={16} /> Save Marks
            </button>
          </div>
        </div>
      )}

      {/* Create Exam Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h2 className="text-xl font-semibold text-slate-800">{editingItem ? 'Edit' : 'Create New'} {activeTab === 'exams' ? 'Exam' : activeTab === 'patterns' ? 'Pattern' : 'Component'}</h2>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {activeTab === 'exams' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                      <input type="text" value={examForm.name} onChange={e => setExamForm({...examForm, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="e.g. Mid Term Exam" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Term</label>
                        <select value={examForm.termId} onChange={e => setExamForm({...examForm, termId: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                          <option value="">Select Term</option>
                          {terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Pattern</label>
                        <select value={examForm.examPatternId} onChange={e => setExamForm({...examForm, examPatternId: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                          <option value="">Select Pattern</option>
                          {examPatterns.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                        <input type="date" value={examForm.startDate} onChange={e => setExamForm({...examForm, startDate: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                        <input type="date" value={examForm.endDate} onChange={e => setExamForm({...examForm, endDate: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                      <select value={examForm.status} onChange={e => setExamForm({...examForm, status: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                        <option value="Draft">Draft</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                        <option value="Published">Published</option>
                      </select>
                    </div>
                  </>
                )}
                {activeTab === 'patterns' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                      <input type="text" value={patternForm.name} onChange={e => setPatternForm({...patternForm, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="e.g. Standard Theory + Internal" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                      <textarea value={patternForm.description} onChange={e => setPatternForm({...patternForm, description: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500" rows={2}></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Assessment Components</label>
                      <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                        {assessmentComponents.map(c => (
                          <label key={c.id} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer border border-transparent hover:border-slate-200">
                            <input 
                              type="checkbox" 
                              checked={patternForm.components.includes(c.id)}
                              onChange={(e) => {
                                if (e.target.checked) setPatternForm(prev => ({...prev, components: [...prev.components, c.id]}));
                                else setPatternForm(prev => ({...prev, components: prev.components.filter(id => id !== c.id)}));
                              }}
                              className="rounded text-amber-600 focus:ring-amber-500"
                            />
                            <span className="text-sm font-medium text-slate-700">{c.name} <span className="text-xs text-slate-500 ml-1">({c.maxMarks} marks, {c.weightage}%)</span></span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {activeTab === 'components' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                      <input type="text" value={componentForm.name} onChange={e => setComponentForm({...componentForm, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="e.g. Mid Term Exam" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                      <select value={componentForm.type} onChange={e => setComponentForm({...componentForm, type: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                        <option value="Theory">Theory</option>
                        <option value="Internal">Internal</option>
                        <option value="Practical">Practical</option>
                        <option value="Project">Project</option>
                        <option value="Lab">Lab</option>
                        <option value="Viva">Viva</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Max Marks</label>
                        <input type="number" value={componentForm.maxMarks} onChange={e => setComponentForm({...componentForm, maxMarks: parseInt(e.target.value) || 0})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Weightage (%)</label>
                        <input type="number" value={componentForm.weightage} onChange={e => setComponentForm({...componentForm, weightage: parseInt(e.target.value) || 0})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50/50">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl shadow-sm shadow-amber-500/20 transition-all"
                >
                  {editingItem ? 'Update' : 'Save'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={24} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Delete {activeTab === 'exams' ? 'Exam' : activeTab === 'patterns' ? 'Pattern' : 'Component'}?</h3>
                <p className="text-sm text-slate-500">
                  Are you sure you want to delete this? This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 p-6 pt-0">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  No, Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm shadow-rose-500/20 transition-all"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── AI Paper Generator Component ─────────────────────────────
const AIPaperGenerator = () => {
  const [subject, setSubject] = useState('Mathematics');
  const [grade, setGrade] = useState('Grade 10');
  const [difficulty, setDifficulty] = useState('Medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState<any>(null);

  const [draftId, setDraftId] = useState<string | undefined>(undefined);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await AIService.generateDraft({
        featureId: 'question_paper',
        sourceData: { subject, grade, difficulty }
      });
      
      const mockMarkdown = `# ${grade} ${subject} - Mid Term Exam\nTime Allowed: 3 Hours | Maximum Marks: 100\n\n## Section A: Multiple Choice (20 Marks)\n1. Which of the following is a prime number? (a) 4 (b) 9 (c) 11 (d) 15\n2. Solve for x: 2x + 5 = 15. (a) 5 (b) 10 (c) 2 (d) 7\n\n## Section B: Short Answer (30 Marks)\n3. Explain the Pythagorean theorem with a diagram.\n4. Factorize the quadratic equation: x^2 + 5x + 6 = 0.\n\n## Section C: Long Answer (50 Marks)\n5. A train travels 360 km at a uniform speed. If the speed had been 5 km/h more, it would have taken 1 hour less for the same journey. Find the speed of the train.\n6. Prove that the lengths of tangents drawn from an external point to a circle are equal.`;
      
      setGeneratedPaper(mockMarkdown);
      setDraftId(response.draftId);
      toast.success('Question paper drafted successfully!', { icon: <Bot className="text-purple-500" /> });
    } catch (e) {
      toast.error('Failed to generate paper.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async (finalContent: string) => {
    if (draftId) {
      await AIService.publishReviewedDraft(draftId, finalContent, generatedPaper);
    }
    toast.success("Question Paper finalized and published!");
    setGeneratedPaper(null);
    setDraftId(undefined);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Brain className="text-purple-600" /> AI Question Paper Generator
        </h2>
        <p className="text-sm text-slate-500 mt-1">Automatically generate question papers mapped to curriculum standards and difficulty levels.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Subject</label>
          <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-400">
            <option>Mathematics</option><option>Science</option><option>English</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Grade / Class</label>
          <select value={grade} onChange={e => setGrade(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-400">
            <option>Grade 8</option><option>Grade 9</option><option>Grade 10</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Difficulty Level</label>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-400">
            <option>Easy</option><option>Medium</option><option>Hard</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mb-8">
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all font-bold text-sm shadow-md shadow-purple-200 disabled:opacity-70"
        >
          {isGenerating ? <Bot size={18} className="animate-spin" /> : <Brain size={18} />}
          {isGenerating ? 'Generating Paper...' : 'Generate with AI'}
        </button>
      </div>

      <AnimatePresence>
        {generatedPaper && !isGenerating && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <AiDraftReviewer
              draftContent={generatedPaper}
              draftId={draftId}
              sourceDataDetails={`Subject: ${subject}, Grade: ${grade}, Difficulty: ${difficulty}`}
              onPublish={handlePublish}
              onDiscard={() => {
                setGeneratedPaper(null);
                setDraftId(undefined);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

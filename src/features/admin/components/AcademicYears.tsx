import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ChevronDown, ArrowUpDown, SearchX, Edit2, BookOpen, Play, Archive, Lock, Trash2, AlertTriangle, Calendar, Eye, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAcademicStore, AYStatus } from '../store/academicStore';

const ROWS_PER_PAGE = 10;

const statusColors: Record<AYStatus, { bg: string; text: string; border: string; dot: string }> = {
  Draft: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' },
  Active: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  Closing: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  Archived: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', dot: 'bg-purple-400' },
};

const stateOrder: AYStatus[] = ['Draft', 'Active', 'Closing', 'Archived'];
const nextStateLabel: Partial<Record<AYStatus, { label: string; icon: React.ElementType }>> = {
  Draft: { label: 'Activate', icon: Play },
  Active: { label: 'Begin Closing', icon: Lock },
  Closing: { label: 'Archive', icon: Archive },
};

export const AcademicYears = () => {
  const navigate = useNavigate();
  const { academicYears, transitionYearState, deleteAcademicYear, terms } = useAcademicStore();
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ yearId: string; action: AYStatus } | null>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  const statusOptions = ['All', 'Draft', 'Active', 'Closing', 'Archived'];

  const filteredData = useMemo(() => {
    let data = [...academicYears];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter((y) => y.name.toLowerCase().includes(q) || y.id.toLowerCase().includes(q));
    }
    if (statusFilter !== 'All') data = data.filter((y) => y.status === statusFilter);
    if (sortConfig) {
      data.sort((a: any, b: any) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        
        if (sortConfig.key === 'terms') {
          aVal = terms.filter((t) => t.academicYearId === a.id).length;
          bVal = terms.filter((t) => t.academicYearId === b.id).length;
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [academicYears, searchQuery, statusFilter, sortConfig, terms]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ROWS_PER_PAGE));
  const paginatedData = filteredData.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ROWS_PER_PAGE, filteredData.length);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const handleSearch = (val: string) => { setSearchQuery(val); setCurrentPage(1); };
  const handleStatusFilter = (val: string) => { setStatusFilter(val); setCurrentPage(1); setIsStatusOpen(false); };

  const handleTransition = () => {
    if (!confirmModal) return;
    const ok = transitionYearState(confirmModal.yearId, confirmModal.action);
    if (ok) toast.success(`Year transitioned to ${confirmModal.action}`);
    else toast.error('Invalid state transition');
    setConfirmModal(null);
  };

  const handleDelete = () => {
    if (!deleteModal) return;
    deleteAcademicYear(deleteModal);
    toast.success('Draft year deleted');
    setDeleteModal(null);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="w-full p-1 sm:p-2 text-slate-800">
      {/* Breadcrumb */}
      <div className="mb-4">
        <div className="text-sm text-amber-600 mb-1">School Admin <span className="text-slate-400 mx-1">/</span> Academic Years</div>
        <h1 className="text-xl font-normal text-slate-900">Academic Years</h1>
      </div>

      {/* State Machine Pipeline */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-4">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Year Lifecycle Pipeline</div>
        <div className="flex items-center gap-2 flex-wrap">
          {stateOrder.map((state, i) => {
            const count = academicYears.filter((y) => y.status === state).length;
            const colors = statusColors[state];
            return (
              <React.Fragment key={state}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className={clsx('flex items-center gap-2 px-4 py-2 rounded-lg border', colors.bg, colors.border, 'cursor-pointer transition-shadow hover:shadow-md')}
                  onClick={() => handleStatusFilter(statusFilter === state ? 'All' : state)}
                >
                  <div className={clsx('w-2 h-2 rounded-full', colors.dot)} />
                  <span className={clsx('text-sm font-semibold', colors.text)}>{state}</span>
                  <span className={clsx('text-xs font-bold px-1.5 py-0.5 rounded-full', colors.bg, colors.text)}>{count}</span>
                </motion.div>
                {i < stateOrder.length - 1 && (
                  <div className="text-slate-300 text-lg">→</div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <button
          onClick={() => navigate('/admin/academic-years/new')}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all active:scale-95 shadow-sm"
        >
          <Plus size={16} /> New Academic Year
        </button>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search year..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-56"
          />
        </div>
        <div className="relative" onMouseLeave={() => setIsStatusOpen(false)}>
          <button onClick={() => setIsStatusOpen(!isStatusOpen)} className="flex items-center justify-between bg-white border border-slate-200 px-3 py-1.5 rounded-md text-sm text-slate-700 font-medium w-36 transition-all">
            <span>{statusFilter === 'All' ? 'All Status' : statusFilter}</span>
            <ChevronDown size={16} className={clsx('text-slate-500 transition-transform', isStatusOpen && 'rotate-180')} />
          </button>
          <AnimatePresence>
            {isStatusOpen && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden">
                {statusOptions.map((opt) => (
                  <div key={opt} onClick={() => handleStatusFilter(opt)} className={clsx('px-3 py-2 text-sm cursor-pointer transition-colors', statusFilter === opt ? 'bg-amber-50 text-amber-700 font-medium' : 'text-slate-700 hover:bg-slate-50')}>
                    {opt === 'All' ? 'All Status' : opt}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-visible">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-medium text-slate-500 uppercase tracking-wider">
              {[
                { label: 'ID', key: 'id' },
                { label: 'Year Name', key: 'name' },
                { label: 'Term Pattern', key: 'termPattern' },
                { label: 'Start', key: 'startDate' },
                { label: 'End', key: 'endDate' },
                { label: 'Terms', key: 'terms' },
                { label: 'Status', key: 'status' },
              ].map((h) => (
                <th key={h.key} onClick={() => requestSort(h.key)} className="px-4 py-3 cursor-pointer group hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-1">
                    {h.label}
                    <ArrowUpDown className={clsx('w-3 h-3', sortConfig?.key === h.key ? 'text-amber-500' : 'text-slate-300 group-hover:text-slate-500')} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => {
                const colors = statusColors[row.status];
                const next = nextStateLabel[row.status];
                const termCount = terms.filter((t) => t.academicYearId === row.id).length;
                return (
                  <motion.tr key={row.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-bold text-slate-800">{row.id}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-700 font-medium">{row.name}</span>
                        {row.isCurrent && (
                          <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Current</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{row.termPattern}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{row.startDate}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{row.endDate}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{termCount}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border', colors.bg, colors.text, colors.border)}>
                        <span className={clsx('w-1.5 h-1.5 rounded-full', colors.dot)} />
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center justify-center relative" onMouseLeave={() => setOpenActionMenuId(null)}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(openActionMenuId === row.id ? null : row.id);
                          }}
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors focus:outline-none"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <AnimatePresence>
                          {openActionMenuId === row.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -5 }}
                              className="absolute right-8 top-0 z-50 w-36 bg-white rounded-lg shadow-lg border border-slate-200 py-1 overflow-hidden"
                            >
                              {row.status !== 'Archived' && (
                                <button
                                  onClick={() => {
                                    setOpenActionMenuId(null);
                                    navigate('/admin/academic-years/edit');
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2 transition-colors"
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-amber-500" /> Edit
                                </button>
                              )}
                              {row.status === 'Archived' && (
                                <button 
                                  onClick={() => {
                                    setOpenActionMenuId(null);
                                    navigate('/admin/academic-years/edit', { state: { mode: 'view' } });
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5 text-purple-500" /> View
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setOpenActionMenuId(null);
                                  navigate('/admin/terms');
                                }}
                                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2 transition-colors"
                              >
                                <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Terms
                              </button>
                              {next && (
                                <button
                                  onClick={() => {
                                    setOpenActionMenuId(null);
                                    setConfirmModal({ yearId: row.id, action: stateOrder[stateOrder.indexOf(row.status) + 1] });
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2 transition-colors"
                                >
                                  <next.icon className="w-3.5 h-3.5 text-emerald-500" /> {next.label}
                                </button>
                              )}
                              {row.status === 'Draft' && (
                                <button
                                  onClick={() => {
                                    setOpenActionMenuId(null);
                                    setDeleteModal(row.id);
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors border-t border-slate-100"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center">
                    <div className="bg-amber-50 p-4 rounded-full mb-4"><SearchX className="w-8 h-8 text-amber-500" /></div>
                    <p className="text-base font-medium text-slate-900 mb-1">No data found</p>
                    <button onClick={() => { handleSearch(''); handleStatusFilter('All'); }} className="mt-3 text-sm text-amber-600 hover:underline font-medium">Clear filters</button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between sm:flex-row flex-col gap-3">
          <div className="text-[13px] text-slate-500">
            Showing <span className="font-medium text-slate-700">{filteredData.length > 0 ? startIndex : 0}</span> to <span className="font-medium text-slate-700">{endIndex}</span> of <span className="font-medium text-slate-700">{filteredData.length}</span> results
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-2 py-0.5 text-[13px] border border-slate-200 bg-white rounded text-slate-600 hover:bg-slate-50 disabled:opacity-50 flex items-center gap-1 transition-colors">
                <ChevronLeft className="w-3 h-3" /> Previous
              </button>
              {getPageNumbers().map((page, idx) =>
                typeof page === 'string' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 py-0.5 text-[13px] text-slate-400">…</span>
                ) : (
                  <button key={page} onClick={() => setCurrentPage(page)} className={clsx('px-2 py-0.5 text-[13px] border rounded font-medium transition-colors', currentPage === page ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50')}>
                    {page}
                  </button>
                )
              )}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-2 py-0.5 text-[13px] border border-slate-200 bg-white rounded text-slate-600 hover:bg-slate-50 disabled:opacity-50 flex items-center gap-1 transition-colors">
                Next <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* State Transition Confirm Modal */}
      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setConfirmModal(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 m-4">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 text-center mb-2">Confirm State Transition</h3>
              <p className="text-slate-500 text-center text-sm mb-6">
                Transition to <strong className="text-slate-800">{confirmModal.action}</strong>?
                {confirmModal.action === 'Archived' && ' This will make the year read-only.'}
                {confirmModal.action === 'Active' && ' This will set it as the current year.'}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmModal(null)} className="flex-1 px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold transition-colors">Cancel</button>
                <button onClick={handleTransition} className="flex-1 px-4 py-2.5 rounded-xl text-white bg-amber-600 hover:bg-amber-700 font-semibold transition-colors shadow-sm">Confirm</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDeleteModal(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 m-4">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 text-center mb-2">Delete Draft Year?</h3>
              <p className="text-slate-500 text-center text-sm mb-6">This action cannot be undone. Only draft years can be deleted.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteModal(null)} className="flex-1 px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold transition-colors">Cancel</button>
                <button onClick={handleDelete} className="flex-1 px-4 py-2.5 rounded-xl text-white bg-red-600 hover:bg-red-700 font-semibold transition-colors">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

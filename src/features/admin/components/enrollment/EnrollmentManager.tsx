import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { Plus, Search, ArrowUpDown, ChevronDown, ArrowRightLeft, UserMinus, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useAcademicStore, EnrollmentStatus } from '../../store/academicStore';

const ROWS_PER_PAGE = 10;

const statusColors: Record<EnrollmentStatus, string> = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Promoted: 'bg-blue-50 text-blue-700 border-blue-200',
  Retained: 'bg-amber-50 text-amber-700 border-amber-200',
  Graduated: 'bg-purple-50 text-purple-700 border-purple-200',
  TransferredOut: 'bg-slate-100 text-slate-600 border-slate-200',
  Withdrawn: 'bg-red-50 text-red-600 border-red-200',
};

export const EnrollmentManager = () => {
  const { enrollments, sections, classYearOfferings, classMasters, academicYears, addEnrollment, updateEnrollment, transferStudent, selectedYearId } = useAcademicStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sectionFilter, setSectionFilter] = useState('');
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const [showTransfer, setShowTransfer] = useState<string | null>(null);
  const [transferTarget, setTransferTarget] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ studentId: '', studentName: '', sectionId: '', rollNumber: '' });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const getSectionLabel = (secId: string) => { const s = sections.find((x) => x.id === secId); return s?.name || '—'; };
  const getClassLabel = (offeringId: string) => { const o = classYearOfferings.find((x) => x.id === offeringId); const cm = classMasters.find((c) => c.id === o?.classMasterId); return `${cm?.name || '?'}${o?.stream ? ` (${o.stream})` : ''}`; };

  const yearEnrollments = useMemo(() => {
    let data = enrollments.filter((e) => e.academicYearId === selectedYearId);
    if (search) { const q = search.toLowerCase(); data = data.filter((e) => e.studentName.toLowerCase().includes(q) || e.studentId.toLowerCase().includes(q) || e.rollNumber?.toLowerCase().includes(q)); }
    if (statusFilter !== 'All') data = data.filter((e) => e.status === statusFilter);
    if (sectionFilter) data = data.filter((e) => e.sectionId === sectionFilter);
    if (sortConfig) {
      data = [...data].sort((a, b) => {
        let aVal: any, bVal: any;
        switch (sortConfig.key) {
          case 'roll': aVal = a.rollNumber || ''; bVal = b.rollNumber || ''; break;
          case 'student': aVal = a.studentName; bVal = b.studentName; break;
          case 'id': aVal = a.studentId; bVal = b.studentId; break;
          case 'class': aVal = getClassLabel(a.classYearOfferingId); bVal = getClassLabel(b.classYearOfferingId); break;
          case 'section': aVal = getSectionLabel(a.sectionId); bVal = getSectionLabel(b.sectionId); break;
          case 'date': aVal = a.enrollDate; bVal = b.enrollDate; break;
          case 'status': aVal = a.status; bVal = b.status; break;
          default: return 0;
        }
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [enrollments, selectedYearId, search, statusFilter, sectionFilter, sortConfig]);

  const yearOfferings = classYearOfferings.filter((o) => o.academicYearId === selectedYearId);
  const yearSections = sections.filter((s) => yearOfferings.some((o) => o.id === s.classYearOfferingId));

  const totalPages = Math.max(1, Math.ceil(yearEnrollments.length / ROWS_PER_PAGE));
  const paginatedData = yearEnrollments.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ROWS_PER_PAGE, yearEnrollments.length);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => { setSearch(value); setCurrentPage(1); };
  const handleStatusFilter = (value: string) => { setStatusFilter(value); setCurrentPage(1); setIsStatusOpen(false); };
  const handleSectionFilter = (value: string) => { setSectionFilter(value); setCurrentPage(1); setIsSectionOpen(false); };

  const handleTransfer = () => {
    if (!showTransfer || !transferTarget) return;
    transferStudent(showTransfer, transferTarget);
    toast.success('Student transferred to ' + getSectionLabel(transferTarget));
    setShowTransfer(null);
    setTransferTarget('');
  };

  const handleAdd = () => {
    if (!addForm.studentId || !addForm.studentName || !addForm.sectionId) { toast.error('Fill required fields'); return; }
    const sec = sections.find((s) => s.id === addForm.sectionId);
    const offering = classYearOfferings.find((o) => o.id === sec?.classYearOfferingId);
    addEnrollment({ id: `ENR-${Date.now()}`, studentId: addForm.studentId, studentName: addForm.studentName, academicYearId: selectedYearId!, classYearOfferingId: offering?.id || '', sectionId: addForm.sectionId, enrollDate: new Date().toISOString().slice(0, 10), status: 'Active', rollNumber: addForm.rollNumber });
    toast.success('Student enrolled');
    setShowAdd(false);
    setAddForm({ studentId: '', studentName: '', sectionId: '', rollNumber: '' });
  };

  const activeYear = academicYears.find((y) => y.id === selectedYearId);

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
      <div className="flex items-center text-sm text-slate-500 mb-4">
        <NavLink to="/admin/academic-years" className="hover:text-amber-600">School Admin</NavLink>
        <span className="mx-2">/</span><span className="text-slate-700">Enrollment</span>
      </div>
      <h1 className="text-xl font-normal text-slate-900 mb-1">Enrollment Manager — {activeYear?.name || ''}</h1>
      <p className="text-sm text-slate-500 mb-4">Student-Year-Class-Section records — the central join point for the entire system.</p>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
        {(['Active', 'Promoted', 'Retained', 'Graduated', 'TransferredOut', 'Withdrawn'] as EnrollmentStatus[]).map((st) => (
          <motion.div key={st} whileHover={{ scale: 1.03 }} onClick={() => handleStatusFilter(statusFilter === st ? 'All' : st)} className={clsx('p-3 rounded-lg border cursor-pointer transition-shadow hover:shadow-md', statusColors[st])}>
            <div className="text-xs font-bold uppercase tracking-wider">{st === 'TransferredOut' ? 'Transferred' : st}</div>
            <div className="text-xl font-bold mt-1">{enrollments.filter((e) => e.academicYearId === selectedYearId && e.status === st).length}</div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <button onClick={() => setShowAdd(true)} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all active:scale-95 shadow-sm"><UserPlus size={16} /> Enroll Student</button>
        <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="Search student..." value={search} onChange={(e) => handleSearch(e.target.value)} className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-56" /></div>
        {/* Section Filter */}
        <div className="relative" onMouseLeave={() => setIsSectionOpen(false)}>
          <button onClick={() => setIsSectionOpen(!isSectionOpen)} className="flex items-center justify-between bg-white border border-slate-200 px-3 py-1.5 rounded-md text-sm text-slate-700 font-medium w-40">
            <span className="truncate">{sectionFilter ? getSectionLabel(sectionFilter) : 'All Sections'}</span>
            <ChevronDown size={16} className={clsx('text-slate-400 transition-transform', isSectionOpen && 'rotate-180')} />
          </button>
          <AnimatePresence>
            {isSectionOpen && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                <div onClick={() => handleSectionFilter('')} className={clsx('px-3 py-2 text-sm cursor-pointer', !sectionFilter ? 'bg-amber-50 text-amber-700 font-medium' : 'hover:bg-slate-50')}>All Sections</div>
                {yearSections.map((s) => (
                  <div key={s.id} onClick={() => handleSectionFilter(s.id)} className={clsx('px-3 py-2 text-sm cursor-pointer', sectionFilter === s.id ? 'bg-amber-50 text-amber-700 font-medium' : 'hover:bg-slate-50')}>{s.name}</div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead><tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-medium text-slate-500 uppercase tracking-wider">
            {[
              { label: 'Roll #', key: 'roll' },
              { label: 'Student', key: 'student' },
              { label: 'Student ID', key: 'id' },
              { label: 'Class', key: 'class' },
              { label: 'Section', key: 'section' },
              { label: 'Enrolled', key: 'date' },
              { label: 'Status', key: 'status' }
            ].map(h => (
              <th key={h.key} onClick={() => requestSort(h.key)} className="px-4 py-3 cursor-pointer group hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-1">
                  {h.label}
                  <ArrowUpDown className={clsx('w-3 h-3', sortConfig?.key === h.key ? 'text-amber-500' : 'text-slate-300 group-hover:text-slate-500')} />
                </div>
              </th>
            ))}
            <th className="px-4 py-3 text-center">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.map((e, i) => (
              <motion.tr key={e.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-sm font-bold text-slate-800">{e.rollNumber || '—'}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-700">{e.studentName}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{e.studentId}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{getClassLabel(e.classYearOfferingId)}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{getSectionLabel(e.sectionId)}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{e.enrollDate}</td>
                <td className="px-4 py-3 text-sm"><span className={clsx('inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase border', statusColors[e.status])}>{e.status}</span></td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {e.status === 'Active' && (
                      <>
                        <button onClick={() => { setShowTransfer(e.id); setTransferTarget(''); }} className="flex items-center gap-1 px-2 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded hover:bg-indigo-100 text-xs font-medium"><ArrowRightLeft className="w-3 h-3" /> Transfer</button>
                        <button onClick={() => { updateEnrollment(e.id, { status: 'Withdrawn', exitDate: new Date().toISOString().slice(0, 10) }); toast.success('Withdrawn'); }} className="flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 text-red-600 rounded hover:bg-red-100 text-xs font-medium"><UserMinus className="w-3 h-3" /></button>
                      </>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
            {yearEnrollments.length === 0 && <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-500">No enrollments found.</td></tr>}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between sm:flex-row flex-col gap-3">
          <div className="text-[13px] text-slate-500">
            Showing <span className="font-medium text-slate-700">{yearEnrollments.length > 0 ? startIndex : 0}</span> to <span className="font-medium text-slate-700">{endIndex}</span> of <span className="font-medium text-slate-700">{yearEnrollments.length}</span> results
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

      {/* Transfer Modal */}
      <AnimatePresence>
        {showTransfer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowTransfer(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 m-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Transfer Student</h3>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Target Section</label>
                <select value={transferTarget} onChange={(e) => setTransferTarget(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none bg-white">
                  <option value="">Select section...</option>
                  {yearSections.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.enrolled}/{s.capacity})</option>)}
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowTransfer(null)} className="flex-1 px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold">Cancel</button>
                <button onClick={handleTransfer} className="flex-1 px-4 py-2.5 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-sm">Transfer</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Enrollment Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 m-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Enroll Student</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Student ID *</label><input type="text" value={addForm.studentId} onChange={(e) => setAddForm({ ...addForm, studentId: e.target.value })} placeholder="STU-009" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Student Name *</label><input type="text" value={addForm.studentName} onChange={(e) => setAddForm({ ...addForm, studentName: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Section *</label>
                    <select value={addForm.sectionId} onChange={(e) => setAddForm({ ...addForm, sectionId: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none bg-white">
                      <option value="">Select...</option>
                      {yearSections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Roll Number</label><input type="text" value={addForm.rollNumber} onChange={(e) => setAddForm({ ...addForm, rollNumber: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" /></div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAdd(false)} className="flex-1 px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold">Cancel</button>
                <button onClick={handleAdd} className="flex-1 px-4 py-2.5 rounded-xl text-white bg-amber-600 hover:bg-amber-700 font-semibold shadow-sm">Enroll</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

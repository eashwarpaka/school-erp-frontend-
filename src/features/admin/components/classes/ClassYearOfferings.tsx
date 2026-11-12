import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { Plus, Copy, ArrowUpDown, Edit2, Trash2, Search, Layers, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useAcademicStore } from '../../store/academicStore';
import { ConfirmDeleteModal } from '../../../../components/common/ConfirmDeleteModal';

const ROWS_PER_PAGE = 10;

export const ClassYearOfferings = () => {
  const { classYearOfferings, classMasters, academicYears, sections, addOffering, deleteOffering, rollForwardOfferings, getOfferingsByYear, selectedYearId, setSelectedYear } = useAcademicStore();
  const [showRollForward, setShowRollForward] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null; name: string }>({ isOpen: false, id: null, name: '' });
  const [rollFromId, setRollFromId] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ classMasterId: '', stream: '' });
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState(selectedYearId || '');
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const getGradeName = (classMasterId: string) => classMasters.find((c) => c.id === classMasterId)?.name || '—';
  const getYearName = (yearId: string) => academicYears.find((y) => y.id === yearId)?.name || '—';
  const getSectionCount = (offeringId: string) => sections.filter((s) => s.classYearOfferingId === offeringId).length;

  const offerings = useMemo(() => {
    let data = yearFilter ? getOfferingsByYear(yearFilter) : classYearOfferings;
    if (search) data = data.filter((o) => {
      const cm = classMasters.find((c) => c.id === o.classMasterId);
      return cm?.name.toLowerCase().includes(search.toLowerCase()) || o.stream?.toLowerCase().includes(search.toLowerCase());
    });
    if (sortConfig) {
      data = [...data].sort((a, b) => {
        let aVal: any, bVal: any;
        switch (sortConfig.key) {
          case 'id': aVal = a.id; bVal = b.id; break;
          case 'grade': aVal = getGradeName(a.classMasterId); bVal = getGradeName(b.classMasterId); break;
          case 'stream': aVal = a.stream || ''; bVal = b.stream || ''; break;
          case 'year': aVal = getYearName(a.academicYearId); bVal = getYearName(b.academicYearId); break;
          case 'sections': aVal = getSectionCount(a.id); bVal = getSectionCount(b.id); break;
          case 'status': aVal = a.isActive ? 1 : 0; bVal = b.isActive ? 1 : 0; break;
          default: return 0;
        }
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [classYearOfferings, yearFilter, search, classMasters, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(offerings.length / ROWS_PER_PAGE));
  const paginatedOfferings = offerings.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ROWS_PER_PAGE, offerings.length);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const handleRollForward = () => {
    if (!rollFromId || !yearFilter) { toast.error('Select source year'); return; }
    rollForwardOfferings(rollFromId, yearFilter);
    toast.success('Offerings rolled forward');
    setShowRollForward(false);
  };

  const handleAdd = () => {
    if (!addForm.classMasterId || !yearFilter) { toast.error('Select class and year'); return; }
    const cm = classMasters.find((c) => c.id === addForm.classMasterId);
    const id = `CYO-${cm?.shortName || 'X'}${addForm.stream ? `-${addForm.stream}` : ''}-${yearFilter.slice(-4)}`;
    addOffering({ id, classMasterId: addForm.classMasterId, academicYearId: yearFilter, stream: addForm.stream || undefined, isActive: true });
    toast.success('Offering created');
    setShowAddModal(false);
    setAddForm({ classMasterId: '', stream: '' });
  };

  const selectedYear = academicYears.find((y) => y.id === yearFilter);

  // Reset page when filters change
  const handleSearch = (value: string) => { setSearch(value); setCurrentPage(1); };
  const handleYearFilter = (value: string) => { setYearFilter(value); setCurrentPage(1); };

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
        <NavLink to="/admin/academic-years" className="hover:text-amber-600 transition-colors">School Admin</NavLink>
        <span className="mx-2">/</span>
        <span className="text-slate-700">Class-Year Offerings</span>
      </div>
      <h1 className="text-xl font-normal text-slate-900 mb-1">Class-Year Offerings</h1>
      <p className="text-sm text-slate-500 mb-4">Year-scoped instances of class masters — students, sections, and subjects attach here.</p>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <button onClick={() => setShowAddModal(true)} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all active:scale-95 shadow-sm"><Plus size={16} /> Add Offering</button>
        <button onClick={() => setShowRollForward(true)} className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-indigo-100 transition-all"><Copy size={16} /> Roll Forward</button>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search..." value={search} onChange={(e) => handleSearch(e.target.value)} className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-48" />
        </div>
        {/* Year Filter */}
        <div className="relative" onMouseLeave={() => setIsYearOpen(false)}>
          <button onClick={() => setIsYearOpen(!isYearOpen)} className="flex items-center justify-between bg-white border border-slate-200 px-3 py-1.5 rounded-md text-sm text-slate-700 font-medium w-48">
            <span>{selectedYear?.name || 'All Years'}</span>
            <ChevronDown size={16} className={clsx('text-slate-400 transition-transform', isYearOpen && 'rotate-180')} />
          </button>
          <AnimatePresence>
            {isYearOpen && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden">
                <div onClick={() => { handleYearFilter(''); setIsYearOpen(false); }} className={clsx('px-3 py-2 text-sm cursor-pointer', !yearFilter ? 'bg-amber-50 text-amber-700 font-medium' : 'hover:bg-slate-50')}>All Years</div>
                {academicYears.map((y) => (
                  <div key={y.id} onClick={() => { handleYearFilter(y.id); setIsYearOpen(false); }} className={clsx('px-3 py-2 text-sm cursor-pointer', yearFilter === y.id ? 'bg-amber-50 text-amber-700 font-medium' : 'hover:bg-slate-50')}>
                    {y.name} <span className="text-xs text-slate-400">({y.status})</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-medium text-slate-500 uppercase tracking-wider">
              {[
                { label: 'Offering ID', key: 'id' },
                { label: 'Grade', key: 'grade' },
                { label: 'Stream', key: 'stream' },
                { label: 'Academic Year', key: 'year' },
                { label: 'Sections', key: 'sections' },
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
            {paginatedOfferings.map((o, i) => {
              const cm = classMasters.find((c) => c.id === o.classMasterId);
              const yr = academicYears.find((y) => y.id === o.academicYearId);
              const secs = sections.filter((s) => s.classYearOfferingId === o.id);
              return (
                <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-bold text-slate-800">{o.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-700 flex items-center gap-2"><Layers className="w-4 h-4 text-teal-500" /> {cm?.name || '—'}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{o.stream || '—'}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{yr?.name || '—'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-teal-50 text-teal-700 text-xs font-bold">{secs.length} sections</span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold', o.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600')}>{o.isActive ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => setDeleteModal({ isOpen: true, id: o.id, name: `${cm?.name || ''} ${o.stream || ''}`.trim() })} className="flex items-center gap-1 px-2 py-1 mx-auto bg-red-50 border border-red-200 text-red-600 rounded hover:bg-red-100 text-xs font-medium"><Trash2 className="w-3 h-3" /></button>
                  </td>
                </motion.tr>
              );
            })}
            {offerings.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-500">No offerings found. Create one or roll forward from a previous year.</td></tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between sm:flex-row flex-col gap-3">
          <div className="text-[13px] text-slate-500">
            Showing <span className="font-medium text-slate-700">{offerings.length > 0 ? startIndex : 0}</span> to <span className="font-medium text-slate-700">{endIndex}</span> of <span className="font-medium text-slate-700">{offerings.length}</span> results
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

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 m-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Add Class-Year Offering</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Class Master *</label>
                  <select value={addForm.classMasterId} onChange={(e) => setAddForm({ ...addForm, classMasterId: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none bg-white">
                    <option value="">Select Grade...</option>
                    {classMasters.map((cm) => <option key={cm.id} value={cm.id}>{cm.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stream (optional)</label>
                  <input type="text" value={addForm.stream} onChange={(e) => setAddForm({ ...addForm, stream: e.target.value })} placeholder="Science, Commerce, Arts..." className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Academic Year</label>
                  <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-600 font-medium">{selectedYear?.name || 'Select year from filter above'}</div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold">Cancel</button>
                <button onClick={handleAdd} className="flex-1 px-4 py-2.5 rounded-xl text-white bg-amber-600 hover:bg-amber-700 font-semibold shadow-sm">Create</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Roll Forward Modal */}
      <AnimatePresence>
        {showRollForward && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowRollForward(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 m-4">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4"><Copy className="w-7 h-7 text-indigo-600" /></div>
              <h3 className="text-lg font-semibold text-slate-800 text-center mb-2">Roll Forward Offerings</h3>
              <p className="text-sm text-slate-500 text-center mb-4">Copy all class-year offerings from a previous year into {selectedYear?.name || 'the selected year'}.</p>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Source Year</label>
                <select value={rollFromId} onChange={(e) => setRollFromId(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none bg-white">
                  <option value="">Select source...</option>
                  {academicYears.filter((y) => y.id !== yearFilter).map((y) => <option key={y.id} value={y.id}>{y.name}</option>)}
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowRollForward(false)} className="flex-1 px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold">Cancel</button>
                <button onClick={handleRollForward} className="flex-1 px-4 py-2.5 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-sm">Roll Forward</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, name: '' })}
        onConfirm={() => {
          if (deleteModal.id) {
            deleteOffering(deleteModal.id);
            toast.success('Offering deleted');
          }
        }}
        itemName={deleteModal.name}
      />
    </div>
  );
};

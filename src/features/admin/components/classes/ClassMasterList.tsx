import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowUpDown, GraduationCap, Search, ChevronLeft, ChevronRight, SearchX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useAcademicStore, ClassMaster } from '../../store/academicStore';
import { ConfirmDeleteModal } from '../../../../components/common/ConfirmDeleteModal';

const ROWS_PER_PAGE = 10;

const levelColors: Record<string, string> = {
  Primary: 'bg-blue-50 text-blue-700 border-blue-200',
  Middle: 'bg-teal-50 text-teal-700 border-teal-200',
  Secondary: 'bg-violet-50 text-violet-700 border-violet-200',
  SrSecondary: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const ClassMasterList = () => {
  const { classMasters, addClassMaster, updateClassMaster, deleteClassMaster } = useAcademicStore();
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null; name: string }>({ isOpen: false, id: null, name: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<ClassMaster>>({ name: '', shortName: '', sequence: 1, level: 'Primary', isActive: true });
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = classMasters
    .filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.shortName.toLowerCase().includes(search.toLowerCase()))
    .sort((a: any, b: any) => {
      if (!sortConfig) return a.sequence - b.sequence;
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginatedData = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ROWS_PER_PAGE, filtered.length);

  const handleSearch = (value: string) => { setSearch(value); setCurrentPage(1); };

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const openAdd = () => { setEditId(null); setForm({ name: '', shortName: '', sequence: classMasters.length + 1, level: 'Primary', isActive: true }); setShowModal(true); };
  const openEdit = (cm: ClassMaster) => { setEditId(cm.id); setForm(cm); setShowModal(true); };

  const handleSave = () => {
    if (!form.name || !form.shortName) { toast.error('Fill required fields'); return; }
    if (editId) {
      updateClassMaster(editId, form);
      toast.success('Class master updated');
    } else {
      addClassMaster({ id: `CM${Date.now()}`, name: form.name!, shortName: form.shortName!, sequence: form.sequence || 1, level: form.level as any || 'Primary', isActive: form.isActive ?? true });
      toast.success('Class master added');
    }
    setShowModal(false);
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
      <div className="flex items-center text-sm text-slate-500 mb-4">
        <NavLink to="/admin/academic-years" className="hover:text-amber-600 transition-colors">School Admin</NavLink>
        <span className="mx-2">/</span>
        <span className="text-slate-700">Class Masters</span>
      </div>
      <h1 className="text-xl font-normal text-slate-900 mb-1">Class Masters</h1>
      <p className="text-sm text-slate-500 mb-4">Reusable grade templates — these live forever, independent of any academic year.</p>

      {/* Level Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {['Primary', 'Middle', 'Secondary', 'SrSecondary'].map((level) => {
          const count = classMasters.filter((c) => c.level === level).length;
          return (
            <motion.div key={level} whileHover={{ scale: 1.02 }} className={clsx('p-3 rounded-lg border', levelColors[level])}>
              <div className="text-xs font-bold uppercase tracking-wider">{level === 'SrSecondary' ? 'Sr. Secondary' : level}</div>
              <div className="text-2xl font-bold mt-1">{count}</div>
              <div className="text-xs opacity-70">grades</div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <button onClick={openAdd} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all active:scale-95 shadow-sm">
          <Plus size={16} /> Add Grade
        </button>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search grades..." value={search} onChange={(e) => handleSearch(e.target.value)} className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-48" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-medium text-slate-500 uppercase tracking-wider">
              {[{ label: 'Seq', key: 'sequence' }, { label: 'Grade Name', key: 'name' }, { label: 'Short', key: 'shortName' }, { label: 'Level', key: 'level' }, { label: 'Status', key: 'isActive' }].map((h) => (
                <th key={h.key} onClick={() => requestSort(h.key)} className="px-4 py-3 cursor-pointer group hover:bg-slate-100 transition-colors outline-none focus:outline-none select-none">
                  <div className="flex items-center gap-1">{h.label} <ArrowUpDown className={clsx('w-3 h-3', sortConfig?.key === h.key ? 'text-amber-500' : 'text-slate-300 group-hover:text-slate-500')} /></div>
                </th>
              ))}
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.map((cm, i) => (
              <motion.tr key={cm.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-sm font-bold text-slate-800">{cm.sequence}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-700 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-500" /> {cm.name}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{cm.shortName}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={clsx('inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase border', levelColors[cm.level])}>{cm.level === 'SrSecondary' ? 'Sr.Sec' : cm.level}</span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={clsx('inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold', cm.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600')}>{cm.isActive ? 'Active' : 'Inactive'}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button onClick={() => openEdit(cm)} className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded hover:bg-amber-100 text-xs font-medium"><Edit2 className="w-3 h-3" /> Edit</button>
                    <button onClick={() => setDeleteModal({ isOpen: true, id: cm.id, name: cm.name })} className="flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 text-red-600 rounded hover:bg-red-100 text-xs font-medium"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <SearchX className="w-12 h-12 mb-3 text-slate-300" />
                    <p className="text-base font-medium text-slate-600">No results found</p>
                    {search ? (
                      <p className="text-sm mt-1">We couldn't find any data matching "{search}"</p>
                    ) : (
                      <p className="text-sm mt-1">No data available.</p>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between sm:flex-row flex-col gap-3">
          <div className="text-[13px] text-slate-500">
            Showing <span className="font-medium text-slate-700">{filtered.length > 0 ? startIndex : 0}</span> to <span className="font-medium text-slate-700">{endIndex}</span> of <span className="font-medium text-slate-700">{filtered.length}</span> results
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

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 m-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">{editId ? 'Edit' : 'Add'} Class Master</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Grade Name *</label>
                    <input type="text" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Grade 13" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Short Name *</label>
                    <input type="text" value={form.shortName || ''} onChange={(e) => setForm({ ...form, shortName: e.target.value })} placeholder="G13" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Sequence</label>
                    <input type="number" value={form.sequence || 1} onChange={(e) => setForm({ ...form, sequence: +e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Level</label>
                    <select value={form.level || 'Primary'} onChange={(e) => setForm({ ...form, level: e.target.value as any })} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none bg-white">
                      <option>Primary</option><option>Middle</option><option>Secondary</option><option>SrSecondary</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold">Cancel</button>
                <button onClick={handleSave} className="flex-1 px-4 py-2.5 rounded-xl text-white bg-amber-600 hover:bg-amber-700 font-semibold shadow-sm">Save</button>
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
            deleteClassMaster(deleteModal.id);
            toast.success('Class master deleted');
          }
        }}
        itemName={deleteModal.name}
      />
    </div>
  );
};

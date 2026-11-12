import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { Plus, Edit2, Trash2, Users, Search, ChevronDown, ChevronLeft, ChevronRight, ArrowUpDown, SearchX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useAcademicStore, Section } from '../../store/academicStore';
import { ConfirmDeleteModal } from '../../../../components/common/ConfirmDeleteModal';

const ROWS_PER_PAGE = 10;

export const SectionsList = () => {
  const { sections, classYearOfferings, classMasters, academicYears, addSection, updateSection, deleteSection, selectedYearId } = useAcademicStore();
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null; name: string }>({ isOpen: false, id: null, name: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Section>>({ name: '', capacity: 40, classTeacherName: '', room: '' });
  const [selectedOfferingId, setSelectedOfferingId] = useState('');
  const [search, setSearch] = useState('');
  const [offeringFilter, setOfferingFilter] = useState('');
  const [isOfferingOpen, setIsOfferingOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const yearOfferings = classYearOfferings.filter((o) => o.academicYearId === selectedYearId);

  const getOfferingLabel = (offeringId: string) => {
    const o = classYearOfferings.find((x) => x.id === offeringId);
    const cm = classMasters.find((c) => c.id === o?.classMasterId);
    return `${cm?.name || '?'}${o?.stream ? ` (${o.stream})` : ''}`;
  };

  const filtered = useMemo(() => {
    let data = sections.filter((s) => yearOfferings.some((o) => o.id === s.classYearOfferingId));
    if (offeringFilter) data = data.filter((s) => s.classYearOfferingId === offeringFilter);
    if (search) data = data.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.classTeacherName?.toLowerCase().includes(search.toLowerCase()));
    if (sortConfig) {
      data = [...data].sort((a, b) => {
        let aVal: any, bVal: any;
        switch (sortConfig.key) {
          case 'name': aVal = a.name; bVal = b.name; break;
          case 'class': aVal = getOfferingLabel(a.classYearOfferingId); bVal = getOfferingLabel(b.classYearOfferingId); break;
          case 'capacity': aVal = a.capacity; bVal = b.capacity; break;
          case 'enrolled': aVal = a.enrolled; bVal = b.enrolled; break;
          case 'occupancy': aVal = a.enrolled / a.capacity; bVal = b.enrolled / b.capacity; break;
          case 'teacher': aVal = a.classTeacherName || ''; bVal = b.classTeacherName || ''; break;
          case 'room': aVal = a.room || ''; bVal = b.room || ''; break;
          default: return 0;
        }
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [sections, yearOfferings, offeringFilter, search, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginatedData = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ROWS_PER_PAGE, filtered.length);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => { setSearch(value); setCurrentPage(1); };
  const handleOfferingFilter = (value: string) => { setOfferingFilter(value); setCurrentPage(1); };

  const openAdd = () => { setEditId(null); setForm({ name: '', capacity: 40, classTeacherName: '', room: '' }); setSelectedOfferingId(offeringFilter || yearOfferings[0]?.id || ''); setShowModal(true); };
  const openEdit = (s: Section) => { setEditId(s.id); setForm(s); setSelectedOfferingId(s.classYearOfferingId); setShowModal(true); };

  const handleSave = () => {
    if (!form.name || !selectedOfferingId) { toast.error('Fill required fields'); return; }
    if (editId) {
      updateSection(editId, { ...form, classYearOfferingId: selectedOfferingId });
      toast.success('Section updated');
    } else {
      addSection({ id: `SEC-${Date.now()}`, classYearOfferingId: selectedOfferingId, name: form.name!, capacity: form.capacity || 40, enrolled: 0, classTeacherId: '', classTeacherName: form.classTeacherName, room: form.room });
      toast.success('Section created');
    }
    setShowModal(false);
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
        <span className="mx-2">/</span>
        <span className="text-slate-700">Sections</span>
      </div>
      <h1 className="text-xl font-normal text-slate-900 mb-1">Sections — {activeYear?.name || ''}</h1>
      <p className="text-sm text-slate-500 mb-4">Divisions within class-year offerings. Each section has capacity limits and a class teacher.</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
          <div className="text-xs font-bold text-amber-600 uppercase">Total Sections</div>
          <div className="text-2xl font-bold text-amber-700">{filtered.length}</div>
        </div>
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
          <div className="text-xs font-bold text-emerald-600 uppercase">Total Capacity</div>
          <div className="text-2xl font-bold text-emerald-700">{filtered.reduce((s, x) => s + x.capacity, 0)}</div>
        </div>
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
          <div className="text-xs font-bold text-blue-600 uppercase">Enrolled</div>
          <div className="text-2xl font-bold text-blue-700">{filtered.reduce((s, x) => s + x.enrolled, 0)}</div>
        </div>
        <div className="p-3 rounded-lg bg-violet-50 border border-violet-200">
          <div className="text-xs font-bold text-violet-600 uppercase">Available</div>
          <div className="text-2xl font-bold text-violet-700">{filtered.reduce((s, x) => s + (x.capacity - x.enrolled), 0)}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <button onClick={openAdd} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all active:scale-95 shadow-sm"><Plus size={16} /> Add Section</button>
        <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="Search sections..." value={search} onChange={(e) => handleSearch(e.target.value)} className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-48" /></div>
        <div className="relative" onMouseLeave={() => setIsOfferingOpen(false)}>
          <button onClick={() => setIsOfferingOpen(!isOfferingOpen)} className="flex items-center justify-between bg-white border border-slate-200 px-3 py-1.5 rounded-md text-sm text-slate-700 font-medium w-52">
            <span className="truncate">{offeringFilter ? getOfferingLabel(offeringFilter) : 'All Classes'}</span>
            <ChevronDown size={16} className={clsx('text-slate-400 transition-transform', isOfferingOpen && 'rotate-180')} />
          </button>
          <AnimatePresence>
            {isOfferingOpen && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden max-h-64 overflow-y-auto">
                <div onClick={() => { handleOfferingFilter(''); setIsOfferingOpen(false); }} className={clsx('px-3 py-2 text-sm cursor-pointer', !offeringFilter ? 'bg-amber-50 text-amber-700 font-medium' : 'hover:bg-slate-50')}>All Classes</div>
                {yearOfferings.map((o) => (
                  <div key={o.id} onClick={() => { handleOfferingFilter(o.id); setIsOfferingOpen(false); }} className={clsx('px-3 py-2 text-sm cursor-pointer', offeringFilter === o.id ? 'bg-amber-50 text-amber-700 font-medium' : 'hover:bg-slate-50')}>
                    {getOfferingLabel(o.id)}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-medium text-slate-500 uppercase tracking-wider">
              {[
                { label: 'Section', key: 'name' },
                { label: 'Class', key: 'class' },
                { label: 'Capacity', key: 'capacity' },
                { label: 'Enrolled', key: 'enrolled' },
                { label: 'Occupancy', key: 'occupancy' },
                { label: 'Class Teacher', key: 'teacher' },
                { label: 'Room', key: 'room' },
              ].map((h) => (
                <th key={h.key} onClick={() => requestSort(h.key)} className="px-4 py-3 cursor-pointer group hover:bg-slate-100 transition-colors outline-none focus:outline-none select-none">
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
            {paginatedData.map((sec, i) => {
              const pct = Math.round((sec.enrolled / sec.capacity) * 100);
              return (
                <motion.tr key={sec.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-bold text-slate-800">{sec.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{getOfferingLabel(sec.classYearOfferingId)}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{sec.capacity}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-700">{sec.enrolled}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={clsx('h-full rounded-full transition-all', pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500')} style={{ width: `${pct}%` }} />
                      </div>
                      <span className={clsx('text-xs font-bold', pct >= 90 ? 'text-red-600' : pct >= 70 ? 'text-amber-600' : 'text-emerald-600')}>{pct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{sec.classTeacherName || '—'}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{sec.room || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => openEdit(sec)} className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded hover:bg-amber-100 text-xs font-medium"><Edit2 className="w-3 h-3" /> Edit</button>
                      <button onClick={() => setDeleteModal({ isOpen: true, id: sec.id, name: sec.name })} className="px-2 py-1 bg-red-50 border border-red-200 text-red-600 rounded hover:bg-red-100 text-xs font-medium"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center">
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 m-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">{editId ? 'Edit' : 'Add'} Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Class-Year Offering *</label>
                  <select value={selectedOfferingId} onChange={(e) => setSelectedOfferingId(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none bg-white">
                    {yearOfferings.map((o) => <option key={o.id} value={o.id}>{getOfferingLabel(o.id)}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Section Name *</label><input type="text" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="5-A" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Capacity</label><input type="number" value={form.capacity || 40} onChange={(e) => setForm({ ...form, capacity: +e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Class Teacher</label><input type="text" value={form.classTeacherName || ''} onChange={(e) => setForm({ ...form, classTeacherName: e.target.value })} placeholder="J. Mwangi" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Room</label><input type="text" value={form.room || ''} onChange={(e) => setForm({ ...form, room: e.target.value })} placeholder="Room 101" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" /></div>
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
            deleteSection(deleteModal.id);
            toast.success('Section deleted');
          }
        }}
        itemName={deleteModal.name}
      />
    </div>
  );
};

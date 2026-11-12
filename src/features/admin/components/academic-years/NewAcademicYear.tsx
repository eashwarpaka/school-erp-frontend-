import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, Calendar, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { useAcademicStore, TermPattern } from '../../store/academicStore';

const termPatterns: { value: TermPattern; label: string; desc: string }[] = [
  { value: 'Annual', label: 'Annual', desc: 'Single term for the entire year' },
  { value: 'Semester', label: 'Semester', desc: '2 terms — 6 months each' },
  { value: 'Trimester', label: 'Trimester', desc: '3 terms — 4 months each' },
  { value: 'Custom', label: 'Custom', desc: 'Define your own term structure' },
];

export const NewAcademicYear = () => {
  const navigate = useNavigate();
  const { addAcademicYear, addTerm } = useAcademicStore();
  const [form, setForm] = useState({ id: '', name: '', startDate: '', endDate: '', termPattern: 'Semester' as TermPattern });
  const [isCurrent, setIsCurrent] = useState(false);
  const [holidays, setHolidays] = useState<{ date: string; name: string }[]>([]);
  const [newHoliday, setNewHoliday] = useState({ date: '', name: '' });

  const handleSave = () => {
    if (!form.id || !form.name || !form.startDate || !form.endDate) {
      toast.error('Please fill all required fields');
      return;
    }
    const ay = { ...form, status: 'Draft' as const, isCurrent, holidays: holidays.map((h, i) => ({ ...h, id: `H${i}`, type: 'Holiday' as const })), createdAt: new Date().toISOString() };
    addAcademicYear(ay);

    // Auto-generate terms based on pattern
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    if (form.termPattern === 'Semester') {
      const mid = new Date(start.getTime() + (end.getTime() - start.getTime()) / 2);
      addTerm({ id: `T1-${form.id}`, academicYearId: form.id, name: 'Semester 1', sequence: 1, startDate: form.startDate, endDate: mid.toISOString().slice(0, 10), isCurrent: false, status: 'Upcoming' });
      addTerm({ id: `T2-${form.id}`, academicYearId: form.id, name: 'Semester 2', sequence: 2, startDate: new Date(mid.getTime() + 86400000).toISOString().slice(0, 10), endDate: form.endDate, isCurrent: false, status: 'Upcoming' });
    } else if (form.termPattern === 'Trimester') {
      const dur = (end.getTime() - start.getTime()) / 3;
      for (let i = 0; i < 3; i++) {
        const s = new Date(start.getTime() + dur * i);
        const e = new Date(start.getTime() + dur * (i + 1) - (i < 2 ? 86400000 : 0));
        addTerm({ id: `T${i + 1}-${form.id}`, academicYearId: form.id, name: `Term ${i + 1}`, sequence: i + 1, startDate: i === 0 ? form.startDate : s.toISOString().slice(0, 10), endDate: i === 2 ? form.endDate : e.toISOString().slice(0, 10), isCurrent: false, status: 'Upcoming' });
      }
    } else if (form.termPattern === 'Annual') {
      addTerm({ id: `T1-${form.id}`, academicYearId: form.id, name: 'Full Year', sequence: 1, startDate: form.startDate, endDate: form.endDate, isCurrent: false, status: 'Upcoming' });
    }

    toast.success('Academic Year created as Draft with auto-generated terms');
    navigate('/admin/academic-years');
  };

  return (
    <div className="w-full p-1 sm:p-2">
      <div className="flex items-center text-sm text-slate-500 mb-4">
        <NavLink to="/admin/academic-years" className="hover:text-amber-600 transition-colors text-amber-600">Academic Years</NavLink>
        <span className="mx-2">/</span>
        <span className="text-slate-700">New</span>
      </div>
      <h1 className="text-xl font-normal text-slate-900 mb-4">New Academic Year</h1>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-semibold text-slate-800">Academic Year Details</h2>
        </div>
        <div className="p-4 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Academic ID <span className="text-red-500">*</span></label>
              <input type="text" placeholder="e.g. AY2728" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm" />
              <p className="mt-1 text-xs text-slate-400">Unique identifier like AY2728</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Year Name <span className="text-red-500">*</span></label>
              <input type="text" placeholder="e.g. 2027–2028" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Initial Status</label>
              <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-600 font-medium">Draft <span className="text-xs text-slate-400">(new years always start as Draft)</span></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Start Date <span className="text-red-500">*</span></label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-slate-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">End Date <span className="text-red-500">*</span></label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-slate-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mark as Current</label>
              <div className="flex items-center mt-2">
                <button type="button" onClick={() => setIsCurrent(!isCurrent)} className={clsx('relative inline-flex h-5 w-9 rounded-full border-2 border-transparent transition-colors cursor-pointer', isCurrent ? 'bg-amber-500' : 'bg-slate-200')}>
                  <span className={clsx('inline-block h-4 w-4 rounded-full bg-white shadow transition', isCurrent ? 'translate-x-4' : 'translate-x-0')} />
                </button>
                <span className="ml-3 text-sm text-slate-700">Active year</span>
              </div>
            </div>
          </div>

          {/* Term Pattern Selector */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-3">Term Pattern</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {termPatterns.map((tp) => (
                <motion.div
                  key={tp.value}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setForm({ ...form, termPattern: tp.value })}
                  className={clsx(
                    'p-3 rounded-lg border-2 cursor-pointer transition-all',
                    form.termPattern === tp.value
                      ? 'border-amber-500 bg-amber-50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  )}
                >
                  <div className={clsx('text-sm font-semibold mb-1', form.termPattern === tp.value ? 'text-amber-700' : 'text-slate-700')}>{tp.label}</div>
                  <div className="text-xs text-slate-500">{tp.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Holidays */}
          <div className="border-t border-slate-100 pt-4">
            <label className="block text-sm font-bold text-slate-800 mb-3">
              <Calendar className="inline w-4 h-4 mr-1 text-amber-500" /> Holidays & Non-Working Days
            </label>
            <div className="flex items-end gap-3 mb-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Date</label>
                <input type="date" value={newHoliday.date} onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })} className="px-3 py-1.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-slate-500 mb-1">Name</label>
                <input type="text" placeholder="e.g. Republic Day" value={newHoliday.name} onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })} className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <button
                onClick={() => { if (newHoliday.date && newHoliday.name) { setHolidays([...holidays, newHoliday]); setNewHoliday({ date: '', name: '' }); } }}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-200 transition-colors flex items-center gap-1"
              >
                <Plus size={14} /> Add
              </button>
            </div>
            {holidays.length > 0 && (
              <div className="space-y-1">
                {holidays.map((h, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-md">
                    <span className="text-sm text-slate-700">{h.date} — {h.name}</span>
                    <button onClick={() => setHolidays(holidays.filter((_, j) => j !== i))} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 flex items-center gap-3">
            <button onClick={handleSave} className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium rounded-md shadow-sm hover:from-amber-600 hover:to-amber-700 transition-all active:scale-95">Save as Draft</button>
            <button onClick={() => navigate(-1)} className="px-3 py-1.5 bg-white text-slate-700 text-sm font-medium rounded-md border border-slate-300 shadow-sm hover:bg-slate-50 transition-all active:scale-95">Cancel</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

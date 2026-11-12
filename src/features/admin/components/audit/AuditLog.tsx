import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Shield, Clock, ChevronDown, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useAcademicStore } from '../../store/academicStore';

const ROWS_PER_PAGE = 10;

const actionColors: Record<string, string> = {
  Create: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Update: 'bg-blue-50 text-blue-700 border-blue-200',
  Delete: 'bg-red-50 text-red-600 border-red-200',
  StateChange: 'bg-amber-50 text-amber-700 border-amber-200',
};

export const AuditLog = () => {
  const { auditLog } = useAcademicStore();
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const actionOptions = ['All', 'Create', 'Update', 'Delete', 'StateChange'];

  const filtered = useMemo(() => {
    let data = [...auditLog];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((e) => e.entity.toLowerCase().includes(q) || e.entityId.toLowerCase().includes(q) || e.action.toLowerCase().includes(q) || e.user.toLowerCase().includes(q));
    }
    if (actionFilter !== 'All') {
      data = data.filter((e) => e.action === actionFilter);
    }
    if (sortConfig) {
      data.sort((a: any, b: any) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        
        if (sortConfig.key === 'timestamp') {
          aVal = new Date(a.timestamp).getTime();
          bVal = new Date(b.timestamp).getTime();
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    } else {
      // Default sort is descending by timestamp
      data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    return data;
  }, [auditLog, search, actionFilter, sortConfig]);

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
  const handleActionFilter = (value: string) => { setActionFilter(value); setCurrentPage(1); setIsActionOpen(false); };

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
        <span className="mx-2">/</span><span className="text-slate-700">Audit Log</span>
      </div>
      <h1 className="text-xl font-normal text-slate-900 mb-1 flex items-center gap-2"><Shield className="w-5 h-5 text-amber-500" /> Audit Log</h1>
      <p className="text-sm text-slate-500 mb-4">All structural changes to academic year hierarchy are logged here.</p>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search logs..." value={search} onChange={(e) => handleSearch(e.target.value)} className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-64" />
        </div>
        
        {/* Action Filter */}
        <div className="relative" onMouseLeave={() => setIsActionOpen(false)}>
          <button onClick={() => setIsActionOpen(!isActionOpen)} className="flex items-center justify-between bg-white border border-slate-200 px-3 py-1.5 rounded-md text-sm text-slate-700 font-medium w-40">
            <span>{actionFilter === 'All' ? 'All Actions' : actionFilter}</span>
            <ChevronDown size={16} className={clsx('text-slate-400 transition-transform', isActionOpen && 'rotate-180')} />
          </button>
          <AnimatePresence>
            {isActionOpen && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden">
                {actionOptions.map((opt) => (
                  <div key={opt} onClick={() => handleActionFilter(opt)} className={clsx('px-3 py-2 text-sm cursor-pointer hover:bg-slate-50', actionFilter === opt ? 'bg-amber-50 text-amber-700 font-medium' : '')}>
                    {opt === 'All' ? 'All Actions' : opt}
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
              <th onClick={() => requestSort('action')} className="px-4 py-3 cursor-pointer group hover:bg-slate-100 transition-colors w-24">
                <div className="flex items-center gap-1">Action <ArrowUpDown className={clsx('w-3 h-3', sortConfig?.key === 'action' ? 'text-amber-500' : 'text-slate-300 group-hover:text-slate-500')} /></div>
              </th>
              <th onClick={() => requestSort('entity')} className="px-4 py-3 cursor-pointer group hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-1">Details <ArrowUpDown className={clsx('w-3 h-3', sortConfig?.key === 'entity' ? 'text-amber-500' : 'text-slate-300 group-hover:text-slate-500')} /></div>
              </th>
              <th onClick={() => requestSort('timestamp')} className="px-4 py-3 cursor-pointer group hover:bg-slate-100 transition-colors w-40 text-right">
                <div className="flex items-center justify-end gap-1">Date <ArrowUpDown className={clsx('w-3 h-3', sortConfig?.key === 'timestamp' ? 'text-amber-500' : 'text-slate-300 group-hover:text-slate-500')} /></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.map((entry, i) => (
              <motion.tr key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3">
                  <span className={clsx('inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase border', actionColors[entry.action] || 'bg-slate-50 text-slate-600 border-slate-200')}>
                    {entry.action}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-slate-800">{entry.entity} <span className="text-slate-400 font-normal mx-1">·</span> <span className="text-amber-600 font-normal">{entry.entityId}</span></div>
                  {entry.field && <div className="text-xs text-slate-500 mt-0.5">{entry.field}: <span className="line-through text-red-400">{entry.oldValue}</span> → <span className="text-emerald-600 font-medium">{entry.newValue}</span></div>}
                  {!entry.field && entry.newValue && <div className="text-xs text-slate-500 mt-0.5">{entry.newValue}</div>}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="text-xs text-slate-500">{new Date(entry.timestamp).toLocaleString()}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{entry.user}</div>
                </td>
              </motion.tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-16 text-center">
                  <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No audit entries found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between sm:flex-row flex-col gap-3">
            <div className="text-[13px] text-slate-500">
              Showing <span className="font-medium text-slate-700">{startIndex}</span> to <span className="font-medium text-slate-700">{endIndex}</span> of <span className="font-medium text-slate-700">{filtered.length}</span> results
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
        )}
      </div>
    </div>
  );
};

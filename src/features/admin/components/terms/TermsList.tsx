import React, { useState, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, Plus, ArrowUpDown, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useAcademicStore } from '../../store/academicStore';

const ROWS_PER_PAGE = 10;

export const TermsList = () => {
  const navigate = useNavigate();
  const { terms, academicYears, selectedYearId } = useAcademicStore();
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const statusOptions = ['All Status', 'Active', 'Closed', 'Upcoming'];

  const yearTerms = terms.filter(t => t.academicYearId === selectedYearId);
  const activeYear = academicYears.find(y => y.id === selectedYearId);

  const sortedData = useMemo(() => {
    let sortableData = [...yearTerms];
    
    if (statusFilter !== 'All Status') {
      sortableData = sortableData.filter(t => t.status === statusFilter);
    }

    if (sortConfig !== null) {
      sortableData.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [yearTerms, statusFilter, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / ROWS_PER_PAGE));
  const paginatedData = sortedData.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ROWS_PER_PAGE, sortedData.length);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
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

      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-slate-500 mb-6 flex-wrap">
        <NavLink to="/admin" className="hover:text-amber-600 transition-colors">School Admin</NavLink>
        <span className="mx-2">/</span>
        <NavLink to="/admin/academic-years" className="hover:text-amber-600 transition-colors text-amber-600">Academic Years</NavLink>
        <span className="mx-2">/</span>
        <span className="hover:text-amber-600 transition-colors cursor-pointer">{activeYear?.name || 'All'}</span>
        <span className="mx-2">/</span>
        <span className="text-slate-700">Terms</span>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-xl font-normal text-slate-900 mb-1">Terms — {activeYear?.name || 'All'}</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/admin/terms/new')}
          className="flex items-center gap-2 px-2 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium rounded-md shadow-sm hover:from-amber-600 hover:to-amber-700 transition-colors active:scale-95">
          <Plus className="w-4 h-4" />
          Add Term
        </button>
        <div 
          className="relative"
          onMouseLeave={() => setIsStatusDropdownOpen(false)}
        >
          <button
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            className="flex items-center justify-between bg-white border border-slate-200 pl-4 pr-3 py-2 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer text-slate-700 font-medium w-36 transition-all"
          >
            <span>{statusFilter}</span>
            <ChevronDown size={16} className={clsx("text-slate-500 transition-transform duration-200", isStatusDropdownOpen && "rotate-180")} />
          </button>
          
          <AnimatePresence>
            {isStatusDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden"
              >
                {statusOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      setStatusFilter(option);
                      setIsStatusDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={clsx(
                      "px-3 py-2 text-sm cursor-pointer transition-colors",
                      statusFilter === option ? "bg-amber-50 text-amber-700 font-medium" : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    {option}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Data Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {[
                  { label: 'Term ID', key: 'id' },
                  { label: 'Term Name', key: 'name' },
                  { label: 'Sequence', key: 'sequence' },
                  { label: 'Start Date', key: 'startDate' },
                  { label: 'End Date', key: 'endDate' },
                  { label: 'Current', key: 'isCurrent' },
                  { label: 'Status', key: 'status' }
                ].map(header => (
                  <th 
                    key={header.key} 
                    onClick={() => requestSort(header.key)}
                    className="px-4 py-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider cursor-pointer group hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      {header.label}
                      <ArrowUpDown className={clsx("w-3 h-3 transition-colors", sortConfig?.key === header.key ? "text-amber-500" : "text-slate-300 group-hover:text-slate-500")} />
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.map((term, index) => (
                <motion.tr
                  key={term.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50/50 even:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 py-3 font-bold text-slate-800">{term.id}</td>
                  <td className="px-4 py-3 text-amber-600 font-medium">{term.name}</td>
                  <td className="px-4 py-3 text-slate-600">{term.sequence}</td>
                  <td className="px-4 py-3 text-slate-600">{term.startDate}</td>
                  <td className="px-4 py-3 text-slate-600">{term.endDate}</td>
                  <td className="px-4 py-3">
                    {term.isCurrent ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                        <svg className="mr-1 h-3 w-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Current
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={clsx(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
                      term.status === 'Closed' && "bg-slate-100 text-slate-600",
                      term.status === 'Active' && "bg-emerald-50 text-emerald-600",
                      term.status === 'Upcoming' && "bg-blue-50 text-blue-600"
                    )}>
                      {term.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => navigate('/admin/terms/edit')}
                      className="flex items-center gap-1.5 px-2.5 py-1 mx-auto bg-amber-50 border border-amber-200 text-amber-700 rounded hover:bg-amber-100 transition-colors text-xs font-medium shadow-sm">
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  </td>
                </motion.tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                    No terms found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between sm:flex-row flex-col gap-3">
          <div className="text-[13px] text-slate-500">
            Showing <span className="font-medium text-slate-700">{sortedData.length > 0 ? startIndex : 0}</span> to <span className="font-medium text-slate-700">{endIndex}</span> of <span className="font-medium text-slate-700">{sortedData.length}</span> results
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
      </motion.div>
    </div>
  );
};

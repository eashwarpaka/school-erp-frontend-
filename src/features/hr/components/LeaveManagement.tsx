import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, CheckCircle, XCircle, Clock, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useHRStore } from '../store/hrStore';

export const LeaveManagement = () => {
  const { leaveRequests, updateLeaveStatus } = useHRStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const itemsPerPage = 5;

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedRequests = useMemo(() => {
    let filtered = leaveRequests.filter(req => {
      const matchesSearch = req.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return filtered;
  }, [leaveRequests, searchTerm, sortConfig, statusFilter]);

  const totalPages = Math.ceil(filteredAndSortedRequests.length / itemsPerPage);
  const currentRequests = filteredAndSortedRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <ChevronDown size={14} className="text-slate-300 opacity-0 group-hover:opacity-100" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-amber-500" /> : <ChevronDown size={14} className="text-amber-500" />;
  };

  const getLeaveTypeBadge = (type: string) => {
    switch (type) {
      case 'Sick Leave': return 'bg-red-50 text-red-700 border-red-200';
      case 'Casual Leave': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Maternity Leave': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Annual Leave': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium text-slate-800 tracking-tight">Leave Management</h1>
          <p className="text-sm text-slate-500 mt-1">Review and manage staff leave requests.</p>
        </div>
        <div className="flex items-center gap-3 relative">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 border text-sm rounded-xl transition-all font-medium shadow-sm ${
              isFilterOpen || statusFilter !== 'All' 
                ? 'bg-amber-50 border-amber-200 text-amber-700' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Filter size={16} />
            Filters {statusFilter !== 'All' && `(${statusFilter})`}
          </button>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-10 py-2"
              >
                <div className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase">Filter by Status</div>
                {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setIsFilterOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${
                      statusFilter === status ? 'text-amber-600 font-medium bg-amber-50/50' : 'text-slate-700'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search requests by name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer group hover:bg-slate-100/50 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">Staff Member <SortIcon columnKey="name" /></div>
                </th>
                <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer group hover:bg-slate-100/50 transition-colors" onClick={() => handleSort('type')}>
                  <div className="flex items-center gap-2">Leave Type <SortIcon columnKey="type" /></div>
                </th>
                <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer group hover:bg-slate-100/50 transition-colors" onClick={() => handleSort('duration')}>
                  <div className="flex items-center gap-2">Duration <SortIcon columnKey="duration" /></div>
                </th>
                <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer group hover:bg-slate-100/50 transition-colors" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-2">Status <SortIcon columnKey="status" /></div>
                </th>
                <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer group hover:bg-slate-100/50 transition-colors" onClick={() => handleSort('appliedOn')}>
                  <div className="flex items-center gap-2">Applied On <SortIcon columnKey="appliedOn" /></div>
                </th>
                <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {currentRequests.length > 0 ? (
                  currentRequests.map((req, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: idx * 0.05 }}
                      key={req.id} 
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-800">{req.name}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getLeaveTypeBadge(req.type)}`}>
                          {req.type}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600 font-medium">
                        {req.duration}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium gap-1.5 ${
                          req.status === 'Pending' ? 'bg-orange-50 text-orange-700 border border-orange-200/50' :
                          req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' :
                          'bg-red-50 text-red-700 border border-red-200/50'
                        }`}>
                          {req.status === 'Pending' && <Clock size={12} />}
                          {req.status === 'Approved' && <CheckCircle size={12} />}
                          {req.status === 'Rejected' && <XCircle size={12} />}
                          {req.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {new Date(req.appliedOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {req.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => updateLeaveStatus(req.id, 'Approved')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="Approve">
                              <CheckCircle size={18} />
                            </button>
                            <button onClick={() => updateLeaveStatus(req.id, 'Rejected')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Reject">
                              <XCircle size={18} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm">-</span>
                        )}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-500">
                        <Search size={48} className="text-slate-300 mb-4" />
                        <p className="text-lg font-medium text-slate-600">No leave requests found</p>
                        <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-slate-700">{Math.min(currentPage * itemsPerPage, filteredAndSortedRequests.length)}</span> of <span className="font-medium text-slate-700">{filteredAndSortedRequests.length}</span> entries
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === i + 1 
                        ? 'bg-amber-500 text-white shadow-sm' 
                        : 'text-slate-600 hover:bg-white border border-transparent hover:border-slate-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

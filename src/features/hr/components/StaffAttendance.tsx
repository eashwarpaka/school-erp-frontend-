import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Calendar, Check, X, Clock, Edit2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useHRStore } from '../store/hrStore';

export const StaffAttendance = () => {
  const { staffList, attendanceRecords, markAttendance, updateAttendance } = useHRStore();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  const itemsPerPage = 10;
  
  const departments = ['All', ...Array.from(new Set(staffList.map(s => s.department)))];

  const currentRecords = useMemo(() => {
    return attendanceRecords.filter(r => r.date === selectedDate);
  }, [attendanceRecords, selectedDate]);

  const filteredStaff = useMemo(() => {
    let filtered = staffList.filter(staff => {
      const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = departmentFilter === 'All' || staff.department === departmentFilter;
      return matchesSearch && matchesDepartment && staff.status !== 'Inactive';
    });

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key as keyof typeof a];
        let bValue = b[sortConfig.key as keyof typeof b];
        
        // Handle sorting for status and checkIn/checkOut which come from attendance records
        if (['status', 'checkIn', 'checkOut'].includes(sortConfig.key)) {
           const recordA = currentRecords.find(r => r.staffId === a.id);
           const recordB = currentRecords.find(r => r.staffId === b.id);
           aValue = recordA ? recordA[sortConfig.key as keyof typeof recordA] || '' : '';
           bValue = recordB ? recordB[sortConfig.key as keyof typeof recordB] || '' : '';
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filtered;
  }, [staffList, searchTerm, departmentFilter, currentRecords, sortConfig]);

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const currentStaffPage = filteredStaff.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <ChevronDown size={14} className="text-slate-300 opacity-0 group-hover:opacity-100" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-amber-500" /> : <ChevronDown size={14} className="text-amber-500" />;
  };

  const handleMarkStatus = (staffId: string, status: 'Present' | 'Absent' | 'Late' | 'Half Day') => {
    const existingRecord = currentRecords.find(r => r.staffId === staffId);
    
    if (existingRecord) {
      updateAttendance(existingRecord.id, { status });
    } else {
      markAttendance([{
        staffId,
        date: selectedDate,
        status,
        checkIn: status === 'Present' || status === 'Late' || status === 'Half Day' ? '08:00 AM' : undefined
      }]);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Present': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Absent': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Late': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Half Day': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium text-slate-800 tracking-tight">Staff Attendance</h1>
          <p className="text-sm text-slate-500 mt-1">Manage daily attendance and timesheets for staff members.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search staff by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-sm">
                <th className="px-6 py-4 font-medium cursor-pointer group hover:bg-slate-100/50 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">Staff Member <SortIcon columnKey="name" /></div>
                </th>
                <th className="px-6 py-4 font-medium cursor-pointer group hover:bg-slate-100/50 transition-colors" onClick={() => handleSort('department')}>
                  <div className="flex items-center gap-2">Department <SortIcon columnKey="department" /></div>
                </th>
                <th className="px-6 py-4 font-medium text-center cursor-pointer group hover:bg-slate-100/50 transition-colors" onClick={() => handleSort('status')}>
                  <div className="flex items-center justify-center gap-2">Status <SortIcon columnKey="status" /></div>
                </th>
                <th className="px-6 py-4 font-medium cursor-pointer group hover:bg-slate-100/50 transition-colors" onClick={() => handleSort('checkIn')}>
                  <div className="flex items-center gap-2">Check In <SortIcon columnKey="checkIn" /></div>
                </th>
                <th className="px-6 py-4 font-medium cursor-pointer group hover:bg-slate-100/50 transition-colors" onClick={() => handleSort('checkOut')}>
                  <div className="flex items-center gap-2">Check Out <SortIcon columnKey="checkOut" /></div>
                </th>
                <th className="px-6 py-4 font-medium text-right">Quick Mark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {currentStaffPage.map((staff, idx) => {
                  const record = currentRecords.find(r => r.staffId === staff.id);
                  const status = record?.status;

                  return (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      key={staff.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-amber-600 font-bold text-sm border border-amber-100/50 flex-shrink-0">
                            {staff.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{staff.name}</p>
                            <p className="text-xs text-slate-500">{staff.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                        {staff.department}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusBadge(status)}`}>
                          {status || 'Not Marked'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {record?.checkIn || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {record?.checkOut || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleMarkStatus(staff.id, 'Present')}
                            className={`p-2 rounded-lg transition-colors tooltip-trigger ${status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400 hover:bg-slate-100 hover:text-emerald-600'}`}
                            title="Mark Present"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => handleMarkStatus(staff.id, 'Absent')}
                            className={`p-2 rounded-lg transition-colors tooltip-trigger ${status === 'Absent' ? 'bg-rose-100 text-rose-700' : 'text-slate-400 hover:bg-slate-100 hover:text-rose-600'}`}
                            title="Mark Absent"
                          >
                            <X size={16} />
                          </button>
                          <button
                            onClick={() => handleMarkStatus(staff.id, 'Late')}
                            className={`p-2 rounded-lg transition-colors tooltip-trigger ${status === 'Late' ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:bg-slate-100 hover:text-amber-600'}`}
                            title="Mark Late"
                          >
                            <Clock size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filteredStaff.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              No staff members found matching your search.
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-slate-700">{Math.min(currentPage * itemsPerPage, filteredStaff.length)}</span> of <span className="font-medium text-slate-700">{filteredStaff.length}</span> entries
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

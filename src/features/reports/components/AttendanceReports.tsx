import React, { useState, useMemo } from 'react';
import { useReportsStore } from '../store/reportsStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar as CalendarIcon, Download, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

export const AttendanceReports = () => {
  const { attendanceReports } = useReportsStore();

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Sorting state
  const [sortColumn, setSortColumn] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const processedReports = useMemo(() => {
    let filtered = attendanceReports.filter(report => {
      if (startDate && report.date < startDate) return false;
      if (endDate && report.date > endDate) return false;
      return true;
    });

    let sorted = [...filtered].sort((a: any, b: any) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];

      if (sortColumn === 'percentage') {
        valA = (a.presentCount / a.totalStudents) * 100;
        valB = (b.presentCount / b.totalStudents) * 100;
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [attendanceReports, startDate, endDate, sortColumn, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(processedReports.length / itemsPerPage);
  const paginatedReports = processedReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = () => {
    const headers = ['Date', 'Total Students', 'Present', 'Absent', 'On Leave', 'Attendance %'];
    const csvContent = [
      headers.join(','),
      ...processedReports.map(r => {
        const percentage = ((r.presentCount / r.totalStudents) * 100).toFixed(1);
        return `${r.date},${r.totalStudents},${r.presentCount},${r.absentCount},${r.leaveCount},${percentage}%`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'attendance_reports.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const SortIcon = ({ column }: { column: string }) => (
    <ArrowUpDown 
      size={14} 
      className={`ml-1 inline-block transition-colors ${sortColumn === column ? 'text-amber-600' : 'text-slate-400 group-hover:text-slate-600'}`} 
    />
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium text-slate-800 tracking-tight">Attendance Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Daily attendance trends and statistics for the entire school.</p>
        </div>
        <div className="flex items-center gap-3 relative">
           <button 
             onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
             className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium text-sm shadow-sm"
           >
            <CalendarIcon size={18} className="text-slate-500" />
            {startDate && endDate ? `${startDate} to ${endDate}` : 'Select Date Range'}
          </button>
          
          {isDatePickerOpen && (
            <div className="absolute top-full mt-2 right-24 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-10 w-72 animate-in fade-in slide-in-from-top-2 duration-200">
              <h4 className="font-medium text-slate-800 mb-3">Filter by Date</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Start Date</label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">End Date</label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => { setStartDate(''); setEndDate(''); setIsDatePickerOpen(false); }}
                    className="flex-1 px-3 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
                  >
                    Clear
                  </button>
                  <button 
                    onClick={() => setIsDatePickerOpen(false)}
                    className="flex-1 px-3 py-2 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium text-sm shadow-sm"
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-medium text-slate-800 mb-6">Attendance Trends (Last 5 Days)</h3>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedReports} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="presentCount" name="Present" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
              <Bar dataKey="absentCount" name="Absent" stackId="a" fill="#ef4444" />
              <Bar dataKey="leaveCount" name="On Leave" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col mt-6">
         <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-medium text-slate-800">Detailed Daily Log</h3>
         </div>
         <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th 
                  className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer group hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">Date <SortIcon column="date" /></div>
                </th>
                <th 
                  className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer group hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('totalStudents')}
                >
                  <div className="flex items-center">Total Students <SortIcon column="totalStudents" /></div>
                </th>
                <th 
                  className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer group hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('presentCount')}
                >
                  <div className="flex items-center">Present <SortIcon column="presentCount" /></div>
                </th>
                <th 
                  className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer group hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('absentCount')}
                >
                  <div className="flex items-center">Absent <SortIcon column="absentCount" /></div>
                </th>
                <th 
                  className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer group hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('leaveCount')}
                >
                  <div className="flex items-center">On Leave <SortIcon column="leaveCount" /></div>
                </th>
                <th 
                  className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right cursor-pointer group hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('percentage')}
                >
                  <div className="flex items-center justify-end">Attendance % <SortIcon column="percentage" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedReports.map((report, idx) => {
                const percentage = ((report.presentCount / report.totalStudents) * 100).toFixed(1);
                return (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-slate-800">{report.date}</td>
                    <td className="py-4 px-6 text-sm text-slate-600">{report.totalStudents}</td>
                    <td className="py-4 px-6 text-sm text-emerald-600 font-medium">{report.presentCount}</td>
                    <td className="py-4 px-6 text-sm text-red-600 font-medium">{report.absentCount}</td>
                    <td className="py-4 px-6 text-sm text-amber-600 font-medium">{report.leaveCount}</td>
                    <td className="py-4 px-6 text-right">
                       <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                         {percentage}%
                       </span>
                    </td>
                  </tr>
                );
              })}
              {paginatedReports.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No attendance logs available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
         </div>

         {/* Pagination */}
         {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-sm text-slate-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, processedReports.length)} of {processedReports.length} entries
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { useReportsStore, StudentReportData } from '../store/reportsStore';
import { Search, Download, Filter, ChevronDown, ArrowUpDown, ChevronLeft, ChevronRight, X } from 'lucide-react';

export const StudentReports = () => {
  const { studentReports } = useReportsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('All Grades');
  const [selectedStatus, setSelectedStatus] = useState<string>('All Statuses');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentReportData | null>(null);

  const uniqueGrades = useMemo(() => {
    const grades = new Set(studentReports.map(r => r.grade));
    return ['All Grades', ...Array.from(grades).sort()];
  }, [studentReports]);

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(studentReports.map(r => r.status));
    return ['All Statuses', ...Array.from(statuses)];
  }, [studentReports]);
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState<string>('studentName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const processedReports = useMemo(() => {
    let filtered = studentReports.filter(report => 
      (report.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.grade.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedGrade === 'All Grades' || report.grade === selectedGrade) &&
      (selectedStatus === 'All Statuses' || report.status === selectedStatus)
    );

    filtered = filtered.sort((a: any, b: any) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];
      
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [studentReports, searchTerm, selectedGrade, selectedStatus, sortColumn, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(processedReports.length / itemsPerPage);
  const paginatedReports = processedReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = () => {
    const headers = ['Student ID', 'Name', 'Grade', 'Section', 'Attendance %', 'Average Score %', 'Status'];
    const csvContent = [
      headers.join(','),
      ...processedReports.map(r => 
        `STU-${r.id.padStart(4, '0')},"${r.studentName}","${r.grade}","${r.section}",${r.attendancePercentage},${r.averageScore},"${r.status}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'student_reports.csv';
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
          <h1 className="text-2xl sm:text-3xl font-medium text-slate-800 tracking-tight">Student Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Detailed performance and attendance reports for students.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium text-sm shadow-sm"
        >
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search students by name or grade..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={`flex items-center gap-2 px-4 py-2 border text-sm font-medium rounded-xl transition-colors w-full sm:w-auto justify-center ${
                isFiltersOpen 
                  ? 'bg-amber-50 border-amber-200 text-amber-700' 
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Filter size={16} />
              Filters
            </button>
            <div className="relative w-full sm:w-auto">
               <select 
                 value={selectedGrade}
                 onChange={(e) => setSelectedGrade(e.target.value)}
                 className="w-full appearance-none pl-4 pr-10 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
               >
                 {uniqueGrades.map(grade => (
                   <option key={grade} value={grade}>{grade}</option>
                 ))}
               </select>
               <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {isFiltersOpen && (
          <div className="pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <span className="text-sm font-medium text-slate-700 w-20">Status:</span>
              <div className="flex flex-wrap gap-2">
                {uniqueStatuses.map(status => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                      selectedStatus === status 
                        ? 'bg-amber-600 border-amber-600 text-white shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-amber-300 hover:bg-amber-50'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th 
                  className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer group hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('studentName')}
                >
                  <div className="flex items-center">Student Name <SortIcon column="studentName" /></div>
                </th>
                <th 
                  className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer group hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('grade')}
                >
                  <div className="flex items-center">Grade/Section <SortIcon column="grade" /></div>
                </th>
                <th 
                  className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer group hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('attendancePercentage')}
                >
                  <div className="flex items-center">Attendance <SortIcon column="attendancePercentage" /></div>
                </th>
                <th 
                  className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer group hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('averageScore')}
                >
                  <div className="flex items-center">Avg Score <SortIcon column="averageScore" /></div>
                </th>
                <th 
                  className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer group hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">Status <SortIcon column="status" /></div>
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-medium text-slate-800">{report.studentName}</div>
                    <div className="text-xs text-slate-400 mt-0.5">ID: STU-{report.id.padStart(4, '0')}</div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">{report.grade} - {report.section}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${report.attendancePercentage >= 90 ? 'bg-emerald-500' : report.attendancePercentage >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${report.attendancePercentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{report.attendancePercentage}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-semibold text-slate-700">{report.averageScore}%</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      report.status === 'Excellent' ? 'bg-emerald-100 text-emerald-700' :
                      report.status === 'Good' ? 'bg-blue-100 text-blue-700' :
                      report.status === 'Average' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => setSelectedStudent(report)}
                      className="text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedReports.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No student reports found matching your search.
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

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-semibold text-slate-800">Student Details</h2>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-2xl font-bold">
                  {selectedStudent.studentName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{selectedStudent.studentName}</h3>
                  <p className="text-sm text-slate-500">ID: STU-{selectedStudent.id.padStart(4, '0')}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Grade</p>
                  <p className="font-medium text-slate-800">{selectedStudent.grade}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Section</p>
                  <p className="font-medium text-slate-800">{selectedStudent.section}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Attendance</p>
                  <p className="font-medium text-slate-800">{selectedStudent.attendancePercentage}%</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Avg Score</p>
                  <p className="font-medium text-slate-800">{selectedStudent.averageScore}%</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-slate-500">Status</p>
                  <span className={`inline-flex items-center mt-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                    selectedStudent.status === 'Excellent' ? 'bg-emerald-100 text-emerald-700' :
                    selectedStudent.status === 'Good' ? 'bg-blue-100 text-blue-700' :
                    selectedStudent.status === 'Average' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {selectedStudent.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

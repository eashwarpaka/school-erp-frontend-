import React, { useState, useMemo } from 'react';
import { useReportsStore } from '../store/reportsStore';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Download, Award, Target, BookOpen, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

export const PerformanceAnalytics = () => {
  const { performanceData } = useReportsStore();

  // Sorting state
  const [sortColumn, setSortColumn] = useState<string>('subject');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
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

  const processedData = useMemo(() => {
    let sorted = [...performanceData].sort((a: any, b: any) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [performanceData, sortColumn, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = processedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = () => {
    const headers = ['Subject', 'Average Score', 'Highest Score', 'Lowest Score'];
    const csvContent = [
      headers.join(','),
      ...processedData.map(r => `"${r.subject}",${r.averageScore},${r.highestScore},${r.lowestScore}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'performance_analytics.csv';
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
          <h1 className="text-2xl sm:text-3xl font-medium text-slate-800 tracking-tight">School Performance Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Deep dive into academic performance across various subjects.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium text-sm shadow-sm"
        >
          <Download size={18} />
          Export Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
             <Award size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Top Performing Subject</p>
            <h3 className="text-xl font-bold text-slate-800">English (85%)</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
             <Target size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Needs Improvement</p>
            <h3 className="text-xl font-bold text-slate-800">History (75%)</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
             <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Overall Average</p>
            <h3 className="text-xl font-bold text-slate-800">80%</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <h3 className="font-medium text-slate-800 mb-6">Subject Performance Radar</h3>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={performanceData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar name="Average Score" dataKey="averageScore" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                <Radar name="Highest Score" dataKey="highestScore" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
           <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <h3 className="font-medium text-slate-800">Performance Breakdown</h3>
           </div>
           <div className="flex-1 overflow-x-auto p-4">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-slate-100">
                   <th 
                     className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase cursor-pointer group hover:bg-slate-100 transition-colors"
                     onClick={() => handleSort('subject')}
                   >
                     <div className="flex items-center">Subject <SortIcon column="subject" /></div>
                   </th>
                   <th 
                     className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase cursor-pointer group hover:bg-slate-100 transition-colors"
                     onClick={() => handleSort('averageScore')}
                   >
                     <div className="flex items-center">Average <SortIcon column="averageScore" /></div>
                   </th>
                   <th 
                     className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase cursor-pointer group hover:bg-slate-100 transition-colors"
                     onClick={() => handleSort('highestScore')}
                   >
                     <div className="flex items-center">Highest <SortIcon column="highestScore" /></div>
                   </th>
                   <th 
                     className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase cursor-pointer group hover:bg-slate-100 transition-colors"
                     onClick={() => handleSort('lowestScore')}
                   >
                     <div className="flex items-center">Lowest <SortIcon column="lowestScore" /></div>
                   </th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {paginatedData.map((data, idx) => (
                   <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                     <td className="py-3 px-4 text-sm font-medium text-slate-800">{data.subject}</td>
                     <td className="py-3 px-4 text-sm text-slate-600">{data.averageScore}%</td>
                     <td className="py-3 px-4 text-sm text-emerald-600">{data.highestScore}%</td>
                     <td className="py-3 px-4 text-sm text-red-600">{data.lowestScore}%</td>
                   </tr>
                 ))}
                 {paginatedData.length === 0 && (
                   <tr>
                     <td colSpan={4} className="py-8 text-center text-slate-500 text-sm">
                       No performance data available.
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
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, processedData.length)} of {processedData.length} entries
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
    </div>
  );
};

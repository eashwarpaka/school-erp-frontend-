import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Medal, Search, Filter, ArrowUp, ArrowDown, Minus,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

const mockRankings = [
  { id: 1, rank: 1, prevRank: 2, name: 'Alice Smith', class: 'Grade 10 - A', score: 98.5, grade: 'A+' },
  { id: 2, rank: 2, prevRank: 1, name: 'Bob Johnson', class: 'Grade 10 - A', score: 96.2, grade: 'A' },
  { id: 3, rank: 3, prevRank: 3, name: 'Charlie Brown', class: 'Grade 10 - A', score: 94.8, grade: 'A' },
  { id: 4, rank: 4, prevRank: 7, name: 'Diana Prince', class: 'Grade 10 - A', score: 91.0, grade: 'B+' },
  { id: 5, rank: 5, prevRank: 4, name: 'Ethan Hunt', class: 'Grade 10 - A', score: 89.5, grade: 'B' },
  { id: 6, rank: 6, prevRank: 5, name: 'Fiona Gallagher', class: 'Grade 10 - A', score: 88.0, grade: 'B' },
  { id: 7, rank: 7, prevRank: 8, name: 'George Costanza', class: 'Grade 10 - A', score: 86.5, grade: 'B' },
  { id: 8, rank: 8, prevRank: 6, name: 'Hannah Abbott', class: 'Grade 10 - A', score: 85.0, grade: 'B' },
  { id: 9, rank: 9, prevRank: 10, name: 'Ian Malcolm', class: 'Grade 10 - A', score: 82.5, grade: 'B-' },
  { id: 10, rank: 10, prevRank: 9, name: 'Julia Roberts', class: 'Grade 10 - A', score: 81.0, grade: 'B-' },
  { id: 11, rank: 11, prevRank: 12, name: 'Kevin Hart', class: 'Grade 10 - A', score: 79.5, grade: 'C+' },
  { id: 12, rank: 12, prevRank: 11, name: 'Laura Dern', class: 'Grade 10 - A', score: 78.0, grade: 'C+' },
];

export const Rankings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof typeof mockRankings[0] | null, direction: 'asc' | 'desc' }>({ key: 'rank', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSort = (key: keyof typeof mockRankings[0]) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  let filteredRankings = mockRankings.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortConfig.key) {
    filteredRankings.sort((a, b) => {
      const aVal = a[sortConfig.key as keyof typeof mockRankings[0]];
      const bVal = b[sortConfig.key as keyof typeof mockRankings[0]];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const totalPages = Math.ceil(filteredRankings.length / itemsPerPage);
  const paginatedRankings = filteredRankings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig.key !== columnKey) return <ChevronUp className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4 text-amber-500" /> : <ChevronDown className="w-4 h-4 text-amber-500" />;
  };

  return (
    <div className="flex flex-col h-full w-full max-w-full">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight flex items-center gap-2">
            <Trophy className="text-amber-500" />
            Class Rankings
          </h1>
          <p className="text-sm text-slate-500 mt-1">View student performance and class rankings.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select className="bg-white px-3 py-2 rounded-lg shadow-sm border border-slate-200 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all">
            <option>Grade 10 - A</option>
            <option>Grade 9 - B</option>
            <option>Grade 11 - A</option>
          </select>
          <select className="bg-white px-3 py-2 rounded-lg shadow-sm border border-slate-200 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all">
            <option>Term 1 - 2026</option>
            <option>Term 2 - 2026</option>
            <option>Finals - 2025</option>
          </select>
        </div>
      </div>

      {/* Top 3 Podium (Optional extra feature) */}
      <div className="grid grid-cols-3 gap-4 mb-6 mt-4">
        {[mockRankings[1], mockRankings[0], mockRankings[2]].map((student, idx) => {
          if (!student) return null;
          const isFirst = idx === 1;
          const isSecond = idx === 0;
          return (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={clsx(
                "bg-white rounded-2xl p-4 flex flex-col items-center justify-center border shadow-sm relative overflow-hidden",
                isFirst ? "border-amber-300 transform -translate-y-4 shadow-md bg-gradient-to-b from-amber-50/50 to-white" : "border-slate-200",
                isSecond ? "bg-gradient-to-b from-slate-100/50 to-white" : ""
              )}
            >
              {isFirst && <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>}
              <div className="relative mb-3 mt-2">
                <div className={clsx(
                  "w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl shadow-sm z-10 relative border-4 border-white",
                  isFirst ? "bg-amber-100 text-amber-600" : 
                  isSecond ? "bg-slate-200 text-slate-600" : "bg-orange-100 text-orange-700"
                )}>
                  {student.name.charAt(0)}
                </div>
                <div className={clsx(
                  "absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-md text-xs border-2 border-white",
                  isFirst ? "bg-amber-500" : 
                  isSecond ? "bg-slate-400" : "bg-orange-500"
                )}>
                  #{student.rank}
                </div>
              </div>
              <h3 className="font-medium text-slate-800 text-center">{student.name}</h3>
              <p className="text-xl font-bold text-slate-700 mt-1">{student.score}%</p>
            </motion.div>
          )
        })}
      </div>

      {/* Filters Area */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 mb-4 flex">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>
      </div>

      {/* Data Table Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3 w-20 text-center cursor-pointer group select-none hover:bg-slate-100/50 transition-colors" onClick={() => handleSort('rank')}>
                  <div className="flex items-center justify-center gap-1">Rank <SortIcon columnKey="rank" /></div>
                </th>
                <th className="px-4 py-3 cursor-pointer group select-none hover:bg-slate-100/50 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">Student Name <SortIcon columnKey="name" /></div>
                </th>
                <th className="px-4 py-3 text-center">Trend</th>
                <th className="px-4 py-3 text-right cursor-pointer group select-none hover:bg-slate-100/50 transition-colors" onClick={() => handleSort('score')}>
                  <div className="flex items-center justify-end gap-1"><SortIcon columnKey="score" /> Score</div>
                </th>
                <th className="px-4 py-3 text-center cursor-pointer group select-none hover:bg-slate-100/50 transition-colors" onClick={() => handleSort('grade')}>
                  <div className="flex items-center justify-center gap-1">Grade <SortIcon columnKey="grade" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence mode="popLayout">
                {paginatedRankings.length > 0 ? (
                  paginatedRankings.map((student, index) => {
                    const trend = student.prevRank - student.rank;
                    return (
                      <motion.tr
                        key={student.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="hover:bg-slate-50/80 transition-colors even:bg-slate-50/50 group"
                      >
                        <td className="px-4 py-3 text-center">
                          <span className={clsx(
                            "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                            student.rank === 1 && "bg-amber-100 text-amber-700",
                            student.rank === 2 && "bg-slate-200 text-slate-700",
                            student.rank === 3 && "bg-orange-100 text-orange-700",
                            student.rank > 3 && "bg-slate-50 text-slate-500"
                          )}>
                            {student.rank}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800">{student.name}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            {trend > 0 ? (
                              <div className="flex items-center text-green-600 text-xs font-medium gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                                <ArrowUp size={12} /> {trend}
                              </div>
                            ) : trend < 0 ? (
                              <div className="flex items-center text-red-600 text-xs font-medium gap-1 bg-red-50 px-2 py-0.5 rounded-full">
                                <ArrowDown size={12} /> {Math.abs(trend)}
                              </div>
                            ) : (
                              <div className="flex items-center text-slate-400 text-xs font-medium gap-1 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                                <Minus size={12} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-bold text-slate-700">{student.score}%</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={clsx(
                            "inline-flex items-center justify-center px-2 py-1 rounded-lg text-xs font-bold border",
                            student.grade.includes('A') ? "bg-green-50 text-green-700 border-green-200" :
                            student.grade.includes('B') ? "bg-blue-50 text-blue-700 border-blue-200" :
                            "bg-orange-50 text-orange-700 border-orange-200"
                          )}>
                            {student.grade}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-0"
                  >
                    <td colSpan={5} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Trophy size={48} className="mb-4 text-slate-300" />
                        <p className="text-slate-600 font-medium mb-1">No rankings found</p>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-white text-sm text-slate-600 rounded-b-xl">
          <div>
            Showing <span className="font-medium">{filteredRankings.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredRankings.length)}</span> of <span className="font-medium">{filteredRankings.length}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={clsx(
                    "w-8 h-8 rounded-lg flex items-center justify-center font-medium transition-colors",
                    currentPage === i + 1 ? "bg-amber-50 text-amber-700 border border-amber-200" : "hover:bg-slate-100 text-slate-600 border border-transparent"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

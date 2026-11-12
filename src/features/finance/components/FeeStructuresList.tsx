import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronDown, Edit2, Search, ArrowUpDown, ChevronLeft, ChevronRight, SearchX } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const mockStructures = [
  { id: 'FEE-001', name: 'Grade 6 — Term 2 Fees', year: '2025-2026', term: 'Term 2', class: 'Grade 6', active: true },
  { id: 'FEE-002', name: 'Grade 7 — Term 2 Fees', year: '2025-2026', term: 'Term 2', class: 'Grade 7', active: true },
  { id: 'FEE-003', name: 'School-Wide Annual Fees', year: '2025-2026', term: 'All Terms', class: 'All Classes', active: true },
];

export const FeeStructuresList = () => {
  const navigate = useNavigate();
  const [structures] = useState(mockStructures);

  // Dropdown states
  const [yearFilter, setYearFilter] = useState('Year 2025-2026');
  const [termFilter, setTermFilter] = useState('All Terms');
  const [classFilter, setClassFilter] = useState('All Classes');

  // Search, Sort, Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof typeof mockStructures[0], direction: 'asc' | 'desc' } | null>(null);
  const itemsPerPage = 5;

  const handleSort = (key: keyof typeof mockStructures[0]) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredStructures = structures.filter(struct => {
    const matchesSearch = struct.name.toLowerCase().includes(searchQuery.toLowerCase()) || struct.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = yearFilter === 'Year 2025-2026' ? true : struct.year === yearFilter; // Simplistic match for demo
    const matchesTerm = termFilter === 'All Terms' ? true : struct.term === termFilter;
    const matchesClass = classFilter === 'All Classes' ? true : struct.class === classFilter;
    return matchesSearch && matchesYear && matchesTerm && matchesClass;
  });

  const sortedStructures = [...filteredStructures].sort((a, b) => {
    if (!sortConfig) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedStructures.length / itemsPerPage) || 1;
  const paginatedStructures = sortedStructures.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const Dropdown = ({ value, options, onChange }: { value: string, options: string[], onChange: (v: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="relative" onMouseLeave={() => setIsOpen(false)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between bg-white border border-slate-200 px-3 py-1.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 cursor-pointer text-slate-700 font-medium min-w-[140px] transition-all shadow-sm"
        >
          <span>{value}</span>
          <ChevronDown size={16} className={clsx("text-slate-500 transition-transform duration-200", isOpen && "rotate-180")} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden"
            >
              {options.map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={clsx(
                    "px-3 py-2 text-sm cursor-pointer transition-colors whitespace-nowrap",
                    value === option ? "bg-amber-50 text-amber-700 font-medium" : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {option}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="w-full p-1 sm:p-2 text-slate-800">
      {/* Breadcrumb Area */}
      <div className="mb-4">
        <div className="text-sm text-amber-600 hover:underline cursor-pointer mb-1 inline-block">
          School Finance <span className="text-slate-400 mx-1">/</span> Fee Structures
        </div>
        <h1 className="text-xl font-normal text-slate-900 mb-1">Fee Structures</h1>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/finance/structures/new')}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={16} />
            New Fee Structure
          </button>

          <Dropdown
            value={yearFilter}
            options={['Year 2025-2026', 'Year 2024-2025', 'Year 2023-2024']}
            onChange={setYearFilter}
          />
          <Dropdown
            value={termFilter}
            options={['All Terms', 'Term 1', 'Term 2', 'Term 3']}
            onChange={setTermFilter}
          />
          <Dropdown
            value={classFilter}
            options={['All Classes', 'Grade 1', 'Grade 6', 'Grade 7', 'Grade 8']}
            onChange={setClassFilter}
          />
        </div>

        <div className="relative w-full xl:w-64 shrink-0">
          <input
            type="text"
            placeholder="Search structures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="px-4 py-3 cursor-pointer hover:text-amber-600 transition-colors" onClick={() => handleSort('id')}>
                <div className="flex items-center gap-2">FEE ID <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer hover:text-amber-600 transition-colors" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-2">FEE NAME <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer hover:text-amber-600 transition-colors" onClick={() => handleSort('year')}>
                <div className="flex items-center gap-2">ACADEMIC YEAR <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer hover:text-amber-600 transition-colors" onClick={() => handleSort('term')}>
                <div className="flex items-center gap-2">TERM <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer hover:text-amber-600 transition-colors" onClick={() => handleSort('class')}>
                <div className="flex items-center gap-2">CLASS <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer hover:text-amber-600 transition-colors" onClick={() => handleSort('active')}>
                <div className="flex items-center gap-2">ACTIVE <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="px-4 py-3 text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedStructures.length > 0 ? (
              paginatedStructures.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 even:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{row.id}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{row.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{row.year}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{row.term}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{row.class}</td>
                  <td className="px-4 py-3 text-sm">
                    {row.active ? (
                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs border border-green-100 font-medium">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs border border-red-100 font-medium">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <button
                      onClick={() => navigate('/finance/setup')}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-md hover:bg-amber-100 transition-all shadow-sm"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      View / Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center"
                  >
                    <SearchX className="w-12 h-12 mb-3 text-slate-300" />
                    <p className="text-sm font-medium text-slate-600">No data found</p>
                    <p className="text-xs text-slate-400 mt-1">We couldn't find any fee structures matching your search.</p>
                  </motion.div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
          <div className="text-sm text-slate-500">
            Showing {sortedStructures.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedStructures.length)} of {sortedStructures.length} entries
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={clsx(
                    "w-7 h-7 flex items-center justify-center rounded-md text-sm transition-colors",
                    currentPage === idx + 1
                      ? "bg-amber-100 text-amber-700 font-medium"
                      : "text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

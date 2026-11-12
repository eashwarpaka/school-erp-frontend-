import React, { useState, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, Plus, ArrowUpDown, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const classesData = [
  {
    id: 'GRADE6A',
    name: 'Grade 6',
    stream: 'A',
    academicYear: '2025–2026',
    capacity: 40,
    teacher: 'EMP-0021 · J. Mwangi',
    status: 'Active',
  },
  {
    id: 'GRADE6B',
    name: 'Grade 6',
    stream: 'B',
    academicYear: '2025–2026',
    capacity: 40,
    teacher: 'EMP-0034 · A. Osei',
    status: 'Active',
  },
  {
    id: 'GRADE7A',
    name: 'Grade 7',
    stream: 'A',
    academicYear: '2025–2026',
    capacity: 38,
    teacher: 'EMP-0011 · S. Mensah',
    status: 'Active',
  },
];

export const ClassesList = () => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  
  const [yearFilter, setYearFilter] = useState('Academic Year: 2025–2026');
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const yearOptions = ['Academic Year: 2025–2026', 'Academic Year: 2024–2025'];

  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusOptions = ['All Status', 'Active', 'Inactive'];

  const sortedData = useMemo(() => {
    let sortableData = [...classesData];
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
  }, [sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  return (
    <div className="w-full p-1 sm:p-2 text-slate-800">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-slate-500 mb-6 flex-wrap">
        <NavLink to="/admin" className="hover:text-amber-600 transition-colors">School Admin</NavLink>
        <span className="mx-2">/</span>
        <span className="text-slate-700">Classes</span>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-xl font-normal text-slate-900 mb-1">Classes</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/admin/classes/new')}
          className="flex items-center gap-2 px-2 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium rounded-md shadow-sm hover:from-amber-600 hover:to-amber-700 transition-colors active:scale-95">
          <Plus className="w-4 h-4" />
          Add Class
        </button>
        <div className="relative" onMouseLeave={() => setIsYearDropdownOpen(false)}>
          <button
            onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
            className="flex items-center justify-between bg-white border border-slate-200 pl-4 pr-3 py-2 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer text-slate-700 font-medium w-56 transition-all"
          >
            <span className="truncate">{yearFilter}</span>
            <ChevronDown size={16} className={clsx("text-slate-500 transition-transform duration-200 shrink-0", isYearDropdownOpen && "rotate-180")} />
          </button>
          <AnimatePresence>
            {isYearDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden"
              >
                {yearOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      setYearFilter(option);
                      setIsYearDropdownOpen(false);
                    }}
                    className={clsx(
                      "px-3 py-2 text-sm cursor-pointer transition-colors",
                      yearFilter === option ? "bg-amber-50 text-amber-700 font-medium" : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    {option}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative" onMouseLeave={() => setIsStatusDropdownOpen(false)}>
          <button
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            className="flex items-center justify-between bg-white border border-slate-200 pl-4 pr-3 py-2 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer text-slate-700 font-medium w-36 transition-all"
          >
            <span>{statusFilter}</span>
            <ChevronDown size={16} className={clsx("text-slate-500 transition-transform duration-200 shrink-0", isStatusDropdownOpen && "rotate-180")} />
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
                  { label: 'Class ID', key: 'id' },
                  { label: 'Class Name', key: 'name' },
                  { label: 'Stream', key: 'stream' },
                  { label: 'Academic Year', key: 'academicYear' },
                  { label: 'Capacity', key: 'capacity' },
                  { label: 'Class Teacher', key: 'teacher' },
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
              {sortedData.map((cls, index) => (
                <motion.tr
                  key={cls.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50/50 even:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 py-3 font-bold text-slate-800">{cls.id}</td>
                  <td className="px-4 py-3 text-slate-700 font-medium">{cls.name}</td>
                  <td className="px-4 py-3 text-slate-600">{cls.stream}</td>
                  <td className="px-4 py-3 text-slate-600">{cls.academicYear}</td>
                  <td className="px-4 py-3 text-slate-600">{cls.capacity}</td>
                  <td className="px-4 py-3 text-slate-600">{cls.teacher}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={clsx(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
                      cls.status === 'Active' && "bg-emerald-50 text-emerald-600",
                      cls.status === 'Inactive' && "bg-red-50 text-red-600"
                    )}>
                      {cls.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => navigate('/admin/classes/edit')}
                      className="flex items-center gap-1.5 px-2.5 py-1 mx-auto bg-amber-50 border border-amber-200 text-amber-700 rounded hover:bg-amber-100 transition-colors text-xs font-medium shadow-sm">
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between sm:flex-row flex-col gap-3">
          <div className="text-[13px] text-slate-500">
            Showing <span className="font-medium text-slate-700">1</span> to <span className="font-medium text-slate-700">3</span> of <span className="font-medium text-slate-700">3</span> results
          </div>
          <div className="flex gap-1">
            <button className="px-2 py-0.5 text-[13px] border border-slate-200 bg-white rounded text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-2 py-0.5 text-[13px] border border-amber-500 bg-amber-50 text-amber-700 rounded font-medium">1</button>
            <button className="px-2 py-0.5 text-[13px] border border-slate-200 bg-white rounded text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

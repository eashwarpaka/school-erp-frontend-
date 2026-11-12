import React, { useState, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, Plus, ArrowUpDown, Edit2, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const mockStudents = [
  {
    id: 'STU-2024-001',
    name: 'Ama Asante',
    gender: 'Female',
    dob: '12 Mar 2013',
    class: 'Grade 7A',
    admissionDate: '02 Jan 2024',
    status: 'Active'
  },
  {
    id: 'STU-2024-002',
    name: 'Kwame Boateng',
    gender: 'Male',
    dob: '05 Jun 2013',
    class: 'Grade 7A',
    admissionDate: '02 Jan 2024',
    status: 'Active'
  },
  {
    id: 'STU-2025-011',
    name: 'Fatima Al-Rashid',
    gender: 'Female',
    dob: '20 Nov 2014',
    class: 'Grade 6B',
    admissionDate: '05 Jan 2025',
    status: 'Active'
  }
];

export const StudentRegistry = () => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [classFilter, setClassFilter] = useState('All Classes');
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const classOptions = ['All Classes', 'Grade 7A', 'Grade 6B'];

  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusOptions = ['All Status', 'Active', 'Transferred', 'Withdrawn'];

  const sortedData = useMemo(() => {
    let sortableData = [...mockStudents];
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
        <NavLink to="/students" className="hover:text-amber-600 transition-colors">Students & Parents</NavLink>
        <span className="mx-2">/</span>
        <span className="text-amber-600 font-medium">Students</span>
      </div>

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-xl font-normal text-slate-900 mb-1">Students</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.1), 0 8px 10px -6px rgba(245, 158, 11, 0.1)' }} className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm transition-all duration-300">
          <div className="text-3xl font-bold text-slate-800">487</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Total Students</div>
          <div className="text-sm text-amber-600 font-medium mt-2">All active</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.1), 0 8px 10px -6px rgba(245, 158, 11, 0.1)' }} className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm transition-all duration-300">
          <div className="text-3xl font-bold text-slate-800">462</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Active</div>
          <div className="text-sm text-amber-600 font-medium mt-2">Currently enrolled</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.1), 0 8px 10px -6px rgba(245, 158, 11, 0.1)' }} className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm transition-all duration-300">
          <div className="text-3xl font-bold text-slate-800">18</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Transferred</div>
          <div className="text-sm text-amber-600 font-medium mt-2">This year</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.1), 0 8px 10px -6px rgba(245, 158, 11, 0.1)' }} className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm transition-all duration-300">
          <div className="text-3xl font-bold text-slate-800">7</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Withdrawn</div>
          <div className="text-sm text-amber-600 font-medium mt-2">This year</div>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 4px 14px 0 rgba(245, 158, 11, 0.39)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/students/register')}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-sm font-semibold rounded-lg shadow-md hover:from-amber-600 hover:to-yellow-600 transition-all w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          Register Student
        </motion.button>

        <input
          type="text"
          placeholder="Search name / ID..."
          className="px-2 py-1.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm w-full sm:w-64 transition-all"
        />

        <div className="relative w-full sm:w-48" onMouseLeave={() => setIsClassDropdownOpen(false)}>
          <button
            onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
            className="flex items-center justify-between w-full bg-white border border-slate-300 pl-4 pr-3 py-2.5 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer text-slate-700 font-medium transition-all"
          >
            <span className="truncate">{classFilter}</span>
            <ChevronDown size={16} className={clsx("text-slate-500 transition-transform duration-200 shrink-0", isClassDropdownOpen && "rotate-180")} />
          </button>
          <AnimatePresence>
            {isClassDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden"
              >
                {classOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      setClassFilter(option);
                      setIsClassDropdownOpen(false);
                    }}
                    className={clsx(
                      "px-3 py-2 text-sm cursor-pointer transition-colors",
                      classFilter === option ? "bg-amber-50 text-amber-700 font-medium" : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    {option}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative w-full sm:w-48" onMouseLeave={() => setIsStatusDropdownOpen(false)}>
          <button
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            className="flex items-center justify-between w-full bg-white border border-slate-300 pl-4 pr-3 py-2.5 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer text-slate-700 font-medium transition-all"
          >
            <span className="truncate">{statusFilter}</span>
            <ChevronDown size={16} className={clsx("text-slate-500 transition-transform duration-200 shrink-0", isStatusDropdownOpen && "rotate-180")} />
          </button>
          <AnimatePresence>
            {isStatusDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden"
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
                  { label: 'Student ID', key: 'id' },
                  { label: 'Name', key: 'name' },
                  { label: 'Gender', key: 'gender' },
                  { label: 'DOB', key: 'dob' },
                  { label: 'Class', key: 'class' },
                  { label: 'Admission Date', key: 'admissionDate' },
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
              {sortedData.map((student, index) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-amber-50/40 even:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 py-3 font-bold text-slate-800">{student.id}</td>
                  <td className="px-4 py-3 text-slate-700 font-medium">{student.name}</td>
                  <td className="px-4 py-3 text-slate-600">{student.gender}</td>
                  <td className="px-4 py-3 text-slate-600">{student.dob}</td>
                  <td className="px-4 py-3 text-slate-600">{student.class}</td>
                  <td className="px-4 py-3 text-slate-600">{student.admissionDate}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={clsx(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border",
                      student.status === 'Active' && "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-100"
                    )}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/students/${student.id}/edit`)}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-md hover:bg-amber-100 transition-all shadow-sm">
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/students/${student.id}/enroll`)}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold rounded-md hover:bg-indigo-100 transition-all shadow-sm">
                        <BookOpen className="w-3.5 h-3.5" />
                        Enroll
                      </motion.button>
                    </div>
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

import React, { useState, useMemo } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, Calendar, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export const EnrollStudent = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const mockHistory = [
    {
      year: '2024-2025',
      class: 'Grade 6A',
      enrollDate: '02 Jan 2024',
      exitDate: '31 Dec 2024',
      status: 'Completed'
    }
  ];

  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const sortedHistory = useMemo(() => {
    let sortableData = [...mockHistory];
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
      <div className="flex items-center text-sm text-slate-500 mb-4 flex-wrap">
        <NavLink to="/students" className="hover:text-amber-600 transition-colors">Students & Parents</NavLink>
        <span className="mx-2">/</span>
        <NavLink to="/students" className="hover:text-amber-600 transition-colors">Students</NavLink>
        <span className="mx-2">/</span>
        <span className="hover:text-amber-600 transition-colors cursor-pointer">{id || 'STU-2024-001'}</span>
        <span className="mx-2">/</span>
        <span className="text-slate-700">Enroll</span>
      </div>

      {/* Page Title */}
      <div className="mb-4">
        <h1 className="text-xl font-normal text-slate-900 mb-1">Class Enrollment</h1>
      </div>

      {/* Student Banner */}
      <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-md">
        <span className="text-sm text-yellow-800">
          Student: <strong>Ama Asante</strong> - ID: <strong>{id || 'STU-2024-001'}</strong>
        </span>
      </div>

      {/* Enrollment Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-semibold text-slate-800">Enrollment Details</h2>
        </div>

        <div className="p-4 space-y-6">
          {/* Enrollment Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Academic Year */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm appearance-none bg-white transition-shadow text-slate-900">
                  <option>2025 - 2026</option>
                  <option>2024 - 2025</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Class */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Class <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm appearance-none bg-white transition-shadow text-slate-900">
                  <option>Grade 7A</option>
                  <option>Grade 6B</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Enrollment No. */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Enrollment No.
              </label>
              <input
                type="text"
                placeholder="Additional enrollment ref (optional)"
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow"
              />
              <p className="mt-1 text-xs text-slate-400">
                Front-end controlled unique number (ENROLLNO).
              </p>
            </div>

            {/* Enrollment Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Enrollment Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow text-slate-700" />
              </div>
            </div>

            {/* Exit Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Exit Date
              </label>
              <div className="relative">
                <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow text-slate-700" />
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Populate when student leaves class.
              </p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm appearance-none bg-white transition-shadow text-slate-900">
                  <option>Active</option>
                  <option>Completed</option>
                  <option>Withdrawn</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Enrollment History Table */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Enrollment History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {[
                      { label: 'Year', key: 'year' },
                      { label: 'Class', key: 'class' },
                      { label: 'Enroll Date', key: 'enrollDate' },
                      { label: 'Exit Date', key: 'exitDate' }
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
                    <th 
                      onClick={() => requestSort('status')}
                      className="px-4 py-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider text-center cursor-pointer group hover:bg-slate-100 transition-colors"
                    >
                        <div className="flex items-center justify-center gap-1">
                          Status
                          <ArrowUpDown className={clsx("w-3 h-3 transition-colors", sortConfig?.key === 'status' ? "text-amber-500" : "text-slate-300 group-hover:text-slate-500")} />
                        </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedHistory.map((hist, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 even:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 text-slate-800 font-medium">{hist.year}</td>
                      <td className="px-4 py-3 text-slate-700">{hist.class}</td>
                      <td className="px-4 py-3 text-slate-600">{hist.enrollDate}</td>
                      <td className="px-4 py-3 text-slate-600">{hist.exitDate}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                          {hist.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between sm:flex-row flex-col gap-3">
              <div className="text-[13px] text-slate-500">
                Showing <span className="font-medium text-slate-700">1</span> to <span className="font-medium text-slate-700">1</span> of <span className="font-medium text-slate-700">1</span> results
              </div>
              <div className="flex gap-1">
                <button className="px-2 py-0.5 text-[13px] border border-slate-200 bg-white rounded text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
                <button className="px-2 py-0.5 text-[13px] border border-amber-500 bg-amber-50 text-amber-700 rounded font-medium">1</button>
                <button className="px-2 py-0.5 text-[13px] border border-slate-200 bg-white rounded text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center gap-3">
            <button className="px-2 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium rounded-md shadow-sm hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all active:scale-95">
              Save for Authorization
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-2 py-1 bg-white text-slate-700 text-sm font-medium rounded-md border border-slate-300 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all active:scale-95">
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Calendar, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const NewTerm = () => {
  const [isCurrent, setIsCurrent] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full p-1 sm:p-2 text-slate-800">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-slate-500 mb-4 flex-wrap">
        <NavLink to="/admin" className="hover:text-amber-600 transition-colors">School Admin</NavLink>
        <span className="mx-2">/</span>
        <NavLink to="/admin/academic-years" className="hover:text-amber-600 transition-colors">Academic Years</NavLink>
        <span className="mx-2">/</span>
        <span className="hover:text-amber-600 transition-colors cursor-pointer">2025–2026</span>
        <span className="mx-2">/</span>
        <NavLink to="/admin/terms" className="hover:text-amber-600 transition-colors text-amber-600">Terms</NavLink>
        <span className="mx-2">/</span>
        <span className="text-slate-700">Add Term</span>
      </div>

      {/* Page Title */}
      <div className="mb-4">
        <h1 className="text-xl font-normal text-slate-900 mb-1">Add Term — New Term</h1>      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-semibold text-slate-800">Term Details</h2>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Academic Year */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm appearance-none bg-white transition-shadow text-slate-900">
                  <option>2025 - 2026</option>
                  <option>2024 - 2025</option>
                  <option>2023 - 2024</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Term ID */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Term ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. T4"
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow"
              />
            </div>

            {/* Term Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Term Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Term 4"
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sequence */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sequence <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 4"
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow"
              />
              <p className="mt-1 text-xs text-slate-400">
                Order within the academic year.
              </p>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow text-slate-700" />
              </div>
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow text-slate-700" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm appearance-none bg-white transition-shadow">
                  <option>Active</option>
                  <option>Closed</option>
                  <option>Inactive</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Mark as Current Term */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mark as Current Term
              </label>
              <div className="flex items-center mt-2">
                <button
                  type="button"
                  onClick={() => setIsCurrent(!isCurrent)}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${isCurrent ? 'bg-amber-500' : 'bg-slate-200'
                    }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isCurrent ? 'translate-x-4' : 'translate-x-0'
                      }`}
                  />
                </button>
                <span className="ml-3 text-sm text-slate-700 font-medium">Current</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-3">
            <button 
              onClick={() => toast.success('Term saved for authorization successfully')}
              className="px-2 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium rounded-md shadow-sm hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all active:scale-95"
            >
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

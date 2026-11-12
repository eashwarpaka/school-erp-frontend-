import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export const EditClass = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full p-1 sm:p-2 text-slate-800">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-slate-500 mb-6 flex-wrap">
        <NavLink to="/admin" className="hover:text-amber-600 transition-colors">School Admin</NavLink>
        <span className="mx-2">/</span>
        <NavLink to="/admin/classes" className="hover:text-amber-600 transition-colors text-amber-600">Classes</NavLink>
        <span className="mx-2">/</span>
        <span className="text-slate-700">Edit Class</span>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-xl font-normal text-slate-900 mb-1">Edit Class</h1>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-semibold text-slate-800">Class Details</h2>
        </div>

        <div className="p-6 space-y-6">
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
                  <option>2023 - 2024</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Class ID */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Class ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue="GRADE6A"
                disabled
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow text-slate-500"
              />
              <p className="mt-1 text-xs text-slate-400">
                Unique within the org. Include stream if needed.
              </p>
            </div>

            {/* Class Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Class Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue="Grade 6"
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stream / Section */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Stream / Section
              </label>
              <input
                type="text"
                defaultValue="A"
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow"
              />
              <p className="mt-1 text-xs text-slate-400">
                Optional. E.g. "A", "Science", "East"
              </p>
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Capacity
              </label>
              <input
                type="number"
                defaultValue={40}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow"
              />
            </div>

            {/* Class Teacher */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Class Teacher
              </label>
              <input
                type="text"
                defaultValue="EMP-0021"
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm appearance-none bg-white transition-shadow">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 flex items-center gap-3">
            <button className="px-2 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium rounded-md shadow-sm hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all active:scale-95">
              Save Changes
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

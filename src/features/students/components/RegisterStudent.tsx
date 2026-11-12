import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export const RegisterStudent = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full p-1 sm:p-2 text-slate-800">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-slate-500 mb-6 flex-wrap">
        <NavLink to="/students" className="hover:text-amber-600 transition-colors">Students & Parents</NavLink>
        <span className="mx-2">/</span>
        <NavLink to="/students" className="hover:text-amber-600 transition-colors">Students</NavLink>
        <span className="mx-2">/</span>
        <span className="text-slate-700">Register</span>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-xl font-normal text-slate-900 mb-1">Register New Student</h1>
      </div>

      {/* Personal Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-6"
      >
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-semibold text-slate-800">Personal Details</h2>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Title
              </label>
              <div className="relative">
                <select className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm appearance-none bg-white transition-shadow text-slate-500">
                  <option>—</option>
                  <option>Mr.</option>
                  <option>Ms.</option>
                  <option>Miss</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="First name"
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow"
              />
            </div>

            {/* Middle Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Middle Name
              </label>
              <input
                type="text"
                placeholder="Middle name (optional)"
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Last name"
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow text-slate-700" />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Gender
              </label>
              <div className="relative">
                <select className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm appearance-none bg-white transition-shadow text-slate-500">
                  <option>— Select —</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Nationality */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nationality
              </label>
              <input
                type="text"
                placeholder="Nationality"
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow"
              />
            </div>

            {/* National ID / Birth Cert No. */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                National ID / Birth Cert No.
              </label>
              <input
                type="text"
                placeholder="ID or certificate number"
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Admission Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-semibold text-slate-800">Admission Details</h2>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Admission Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Admission Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow text-slate-700" />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm appearance-none bg-white transition-shadow text-slate-900">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Portal Login (SSO User) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Portal Login (SSO User)
              </label>
              <input
                type="text"
                placeholder="SSO User ID (if portal access)"
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow"
              />
              <p className="mt-1 text-xs text-slate-400">
                Optional. Links to SSO for student portal login.
              </p>
              <p className="mt-1 text-xs text-orange-500 flex items-center gap-1 font-medium italic">
                <AlertTriangle className="w-3 h-3" />
                SSO external reference — populated later
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 flex items-center gap-3">
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

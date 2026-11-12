import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, MoreVertical, Briefcase, Mail, Phone, UserX, X, LayoutGrid, List, ChevronUp, ChevronDown } from 'lucide-react';

import { useHRStore, Staff } from '../store/hrStore';

export const StaffDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Staff; direction: 'asc' | 'desc' } | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  const itemsPerPage = viewMode === 'grid' ? 8 : 10;

  const { staffList, addStaff, updateStaff } = useHRStore();
  const departments = ['All', ...Array.from(new Set(staffList.map(s => s.department)))];

  const handleSaveStaff = () => {
    // Collect form data (in a real app, use a proper form library or ref)
    const form = document.getElementById('staffForm') as HTMLFormElement;
    if (!form) return;
    
    const formData = new FormData(form);
    const staffData = {
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      department: formData.get('department') as string,
      status: formData.get('status') as 'Active' | 'On Leave' | 'Inactive',
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      joinDate: editingStaff?.joinDate || new Date().toISOString().split('T')[0],
    };

    if (editingStaff) {
      updateStaff(editingStaff.id, staffData);
    } else {
      addStaff(staffData);
    }
    
    setIsAddStaffModalOpen(false);
    setEditingStaff(null);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDepartment, viewMode]);

  const filteredStaff = useMemo(() => {
    return staffList.filter(staff => {
      const matchesSearch = 
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = selectedDepartment === 'All' || staff.department === selectedDepartment;
      
      return matchesSearch && matchesDepartment;
    });
  }, [staffList, searchTerm, selectedDepartment]);

  const sortedStaff = useMemo(() => {
    let sortableStaff = [...filteredStaff];
    if (sortConfig !== null) {
      sortableStaff.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableStaff;
  }, [filteredStaff, sortConfig]);

  const totalPages = Math.ceil(sortedStaff.length / itemsPerPage);
  const currentStaff = sortedStaff.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key: keyof Staff) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }: { columnKey: keyof Staff }) => {
    if (sortConfig?.key !== columnKey) {
      return <div className="flex flex-col opacity-30"><ChevronUp size={12} className="-mb-1" /><ChevronDown size={12} /></div>;
    }
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-amber-500" /> : <ChevronDown size={14} className="text-amber-500" />;
  };

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-slate-800 tracking-tight">Staff Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage school personnel, teachers, and administrative staff.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-amber-50 text-amber-600' : 'text-slate-400 hover:text-slate-600'}`}
              title="List View"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-amber-50 text-amber-600' : 'text-slate-400 hover:text-slate-600'}`}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
          </div>
          <button
            onClick={() => {
              setEditingStaff(null);
              setIsAddStaffModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all font-medium text-sm shadow-sm shadow-amber-500/20"
          >
            <Plus size={16} />
            Add Staff
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col flex-grow">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, role, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-all font-medium text-sm shadow-sm ${isFilterOpen || selectedDepartment !== 'All' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
            >
              <Filter size={16} className={isFilterOpen || selectedDepartment !== 'All' ? 'text-amber-500' : 'text-slate-400'} />
              {selectedDepartment === 'All' ? 'All Departments' : selectedDepartment}
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 z-20 py-2"
                >
                  <div className="px-3 pb-2 mb-2 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Filter by Department
                  </div>
                  {departments.map(dept => (
                    <button
                      key={dept}
                      onClick={() => {
                        setSelectedDepartment(dept);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedDepartment === dept ? 'bg-amber-50 text-amber-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      {dept}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {sortedStaff.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-500 flex-grow">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-100 p-5 rounded-full mb-5 shadow-inner"
            >
              <UserX size={48} className="text-slate-400" />
            </motion.div>
            <p className="text-lg font-medium text-slate-800 mb-2">No staff members found</p>
            <p className="text-sm text-slate-500 text-center max-w-md">
              We couldn't find anyone matching your current search or filter criteria. Try adjusting them.
            </p>
            {(searchTerm || selectedDepartment !== 'All') && (
              <button 
                onClick={() => { setSearchTerm(''); setSelectedDepartment('All'); }}
                className="mt-6 text-sm font-medium text-amber-600 hover:text-amber-700 bg-amber-50 px-4 py-2 rounded-lg transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            {viewMode === 'list' ? (
              <div className="overflow-x-auto flex-grow">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-sm">
                      <th className="px-6 py-4 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('name')}>
                        <div className="flex items-center gap-2">Staff Member <SortIcon columnKey="name" /></div>
                      </th>
                      <th className="px-6 py-4 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('department')}>
                        <div className="flex items-center gap-2">Department <SortIcon columnKey="department" /></div>
                      </th>
                      <th className="px-6 py-4 font-medium cursor-pointer hover:bg-slate-100 transition-colors hidden md:table-cell" onClick={() => requestSort('phone')}>
                        <div className="flex items-center gap-2">Contact <SortIcon columnKey="phone" /></div>
                      </th>
                      <th className="px-6 py-4 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('status')}>
                        <div className="flex items-center gap-2">Status <SortIcon columnKey="status" /></div>
                      </th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentStaff.map((staff, idx) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        key={staff.id} 
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-amber-600 font-bold text-sm border border-amber-100/50 flex-shrink-0">
                              {staff.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{staff.name}</p>
                              <p className="text-xs text-slate-500">{staff.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                            <Briefcase size={12} className="text-slate-400" />
                            {staff.department}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <Phone size={12} className="text-slate-400" />
                              {staff.phone}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <Mail size={12} className="text-slate-400" />
                              {staff.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                            staff.status === 'Active' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' 
                              : 'bg-rose-50 text-rose-700 border-rose-200/50'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${staff.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                            {staff.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 transition-opacity">
                            <button 
                              onClick={() => setSelectedStaff(staff)}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors tooltip-trigger"
                              title="View Profile"
                            >
                              <Search size={16} />
                            </button>
                            <button 
                              onClick={() => { setEditingStaff(staff); setIsAddStaffModalOpen(true); }}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Edit Staff"
                            >
                              <MoreVertical size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-4 sm:p-6 bg-slate-50/30 flex-grow content-start">
                {currentStaff.map((staff, idx) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    key={staff.id}
                    className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden flex flex-col h-full"
                  >
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-amber-100/50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-amber-600 font-bold text-xl border border-amber-100/50 shadow-sm flex-shrink-0">
                        {staff.name.charAt(0)}
                      </div>
                      <button 
                        onClick={() => { setEditingStaff(staff); setIsAddStaffModalOpen(true); }}
                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                        title="Edit Staff"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>

                    <div className="mb-5 relative z-10">
                      <h3 className="font-medium text-slate-800 text-lg leading-tight mb-1 truncate">{staff.name}</h3>
                      <span className="inline-block px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-lg truncate max-w-full">{staff.role}</span>
                    </div>

                    <div className="space-y-3 mb-6 flex-grow relative z-10">
                      <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50/50 p-2 rounded-lg">
                        <Briefcase size={14} className="text-slate-400 flex-shrink-0" />
                        <span className="font-medium text-slate-700 truncate">{staff.department}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50/50 p-2 rounded-lg">
                        <Mail size={14} className="text-slate-400 flex-shrink-0" />
                        <span className="font-medium text-slate-700 truncate">{staff.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50/50 p-2 rounded-lg">
                        <Phone size={14} className="text-slate-400 flex-shrink-0" />
                        <span className="font-medium text-slate-700 truncate">{staff.phone}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto relative z-10">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${staff.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' :
                        'bg-rose-50 text-rose-700 border-rose-200/50'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${staff.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        {staff.status}
                      </span>
                      <button
                        onClick={() => setSelectedStaff(staff)}
                        className="text-sm font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition-all"
                      >
                        Profile
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {totalPages > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between bg-white gap-4">
            <span className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-700">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-medium text-slate-700">{Math.min(currentPage * itemsPerPage, filteredStaff.length)}</span> of <span className="font-medium text-slate-700">{filteredStaff.length}</span> entries
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm disabled:opacity-50 hover:bg-slate-50 disabled:cursor-not-allowed font-medium text-slate-600 transition-colors shadow-sm"
              >
                Previous
              </button>
              <div className="flex gap-1 items-center px-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === i + 1 
                        ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm disabled:opacity-50 hover:bg-slate-50 disabled:cursor-not-allowed font-medium text-slate-600 transition-colors shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      <AnimatePresence>
        {isAddStaffModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h2 className="text-xl font-semibold text-slate-800">{editingStaff ? 'Edit Staff Member' : 'Add New Staff'}</h2>
                <button
                  onClick={() => setIsAddStaffModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <form id="staffForm" className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                    <input type="text" name="name" required defaultValue={editingStaff?.name} placeholder="e.g. John Doe" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Role</label>
                    <input type="text" name="role" required defaultValue={editingStaff?.role} placeholder="e.g. Senior Teacher" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Department</label>
                    <select name="department" defaultValue={editingStaff?.department || "Academics"} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white transition-all shadow-sm">
                      <option>Academics</option>
                      <option>Administration</option>
                      <option>Sports</option>
                      <option>Library</option>
                      <option>Student Services</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Status</label>
                    <select name="status" defaultValue={editingStaff?.status || "Active"} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white transition-all shadow-sm">
                      <option>Active</option>
                      <option>On Leave</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                    <input type="email" name="email" required defaultValue={editingStaff?.email} placeholder="e.g. john@school.edu" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Phone Number</label>
                    <input type="tel" name="phone" required defaultValue={editingStaff?.phone} placeholder="e.g. +1 234 567 890" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm" />
                  </div>
                </form>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50/50">
                <button
                  onClick={() => setIsAddStaffModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveStaff}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl shadow-sm shadow-amber-500/20 transition-all"
                >
                  {editingStaff ? 'Update Staff Member' : 'Save Staff Member'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Profile Modal */}
      <AnimatePresence>
        {selectedStaff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative"
            >
              {/* Header Profile Cover */}
              <div className="h-32 bg-gradient-to-r from-amber-400 to-orange-500 relative">
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 rounded-full backdrop-blur-sm transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="px-8 pb-8">
                {/* Profile Avatar */}
                <div className="relative -mt-16 mb-4 flex justify-center">
                  <div className="w-32 h-32 rounded-full bg-white p-1.5 shadow-lg">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-amber-700 font-bold text-4xl">
                      {selectedStaff.name.charAt(0)}
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-slate-800">{selectedStaff.name}</h2>
                  <p className="text-amber-600 font-medium">{selectedStaff.role}</p>
                  <span className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${selectedStaff.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    'bg-orange-50 text-orange-700 border-orange-200'
                    }`}>
                    {selectedStaff.status}
                  </span>
                </div>

                <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-amber-500 border border-slate-100">
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Department</p>
                      <p className="text-sm font-semibold text-slate-800">{selectedStaff.department}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-amber-500 border border-slate-100">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Email Address</p>
                      <p className="text-sm font-semibold text-slate-800">{selectedStaff.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-amber-500 border border-slate-100">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Phone Number</p>
                      <p className="text-sm font-semibold text-slate-800">{selectedStaff.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => window.location.href = `mailto:${selectedStaff.email}`}
                    className="flex-1 py-3 bg-amber-50 text-amber-700 font-semibold rounded-xl hover:bg-amber-100 transition-colors shadow-sm"
                  >
                    Send Message
                  </button>
                  <button
                    onClick={() => {
                      setEditingStaff(selectedStaff);
                      setIsAddStaffModalOpen(true);
                      setSelectedStaff(null);
                    }}
                    className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

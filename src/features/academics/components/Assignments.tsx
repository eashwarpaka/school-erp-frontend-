import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Filter, MoreVertical, 
  FileText, Calendar, BookOpen, Clock, 
  CheckCircle2, XCircle, FilePlus2, ArrowUpDown,
  Edit, Trash2, X
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const mockAssignments = [
  { id: 1, title: 'Algebra Equations', subject: 'Mathematics', class: 'Grade 10 - A', dueDate: '2026-07-15', status: 'Active', submissions: 24, total: 30 },
  { id: 2, title: 'Photosynthesis Essay', subject: 'Biology', class: 'Grade 9 - B', dueDate: '2026-07-10', status: 'Past Due', submissions: 28, total: 28 },
  { id: 3, title: 'World War II Timeline', subject: 'History', class: 'Grade 11 - A', dueDate: '2026-07-20', status: 'Draft', submissions: 0, total: 25 },
  { id: 4, title: 'Shakespeare Reading', subject: 'Literature', class: 'Grade 12 - C', dueDate: '2026-07-18', status: 'Active', submissions: 15, total: 32 },
];

export const Assignments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredAssignments = useMemo(() => {
    return mockAssignments.filter(assignment => {
      const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || assignment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const sortedAssignments = useMemo(() => {
    let sortableData = [...filteredAssignments];
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
  }, [filteredAssignments, sortConfig]);

  const paginatedAssignments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAssignments.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedAssignments, currentPage]);

  const totalPages = Math.ceil(sortedAssignments.length / itemsPerPage);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="flex flex-col h-full w-full max-w-full">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight flex items-center gap-2">
            <ClipboardListIcon className="text-amber-500" />
            Assignments Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track student assignments and submissions.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm hover:shadow text-sm whitespace-nowrap"
          >
            <Plus size={16} />
            Create Assignment
          </button>
        </div>
      </div>

      {/* Filters Area */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search assignments by title or subject..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Active', 'Past Due', 'Draft'].map(status => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                statusFilter === status
                  ? "bg-amber-100 text-amber-700 border border-amber-200"
                  : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200 uppercase font-semibold">
              <tr>
                <th 
                  onClick={() => requestSort('title')}
                  className="px-4 py-3 cursor-pointer group hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Title & Subject
                    <ArrowUpDown className={clsx("w-3 h-3 transition-colors", sortConfig?.key === 'title' ? "text-amber-500" : "text-slate-300 group-hover:text-slate-500")} />
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('class')}
                  className="px-4 py-3 cursor-pointer group hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Class
                    <ArrowUpDown className={clsx("w-3 h-3 transition-colors", sortConfig?.key === 'class' ? "text-amber-500" : "text-slate-300 group-hover:text-slate-500")} />
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('dueDate')}
                  className="px-4 py-3 cursor-pointer group hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Due Date
                    <ArrowUpDown className={clsx("w-3 h-3 transition-colors", sortConfig?.key === 'dueDate' ? "text-amber-500" : "text-slate-300 group-hover:text-slate-500")} />
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('submissions')}
                  className="px-4 py-3 cursor-pointer group hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Submissions
                    <ArrowUpDown className={clsx("w-3 h-3 transition-colors", sortConfig?.key === 'submissions' ? "text-amber-500" : "text-slate-300 group-hover:text-slate-500")} />
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('status')}
                  className="px-4 py-3 cursor-pointer group hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Status
                    <ArrowUpDown className={clsx("w-3 h-3 transition-colors", sortConfig?.key === 'status' ? "text-amber-500" : "text-slate-300 group-hover:text-slate-500")} />
                  </div>
                </th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence mode="popLayout">
                {paginatedAssignments.length > 0 ? (
                  paginatedAssignments.map((assignment, index) => (
                    <motion.tr
                      key={assignment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="hover:bg-slate-50/80 transition-colors even:bg-slate-50/50 group"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{assignment.title}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <BookOpen size={12} className="text-amber-500" />
                          {assignment.subject}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                          {assignment.class}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Calendar size={14} className="text-slate-400" />
                          {assignment.dueDate}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[100px]">
                            <div 
                              className="h-full bg-amber-500 rounded-full" 
                              style={{ width: `${(assignment.submissions / assignment.total) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-600">
                            {assignment.submissions}/{assignment.total}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={clsx(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                          assignment.status === 'Active' && "bg-green-50 text-green-700 border-green-200",
                          assignment.status === 'Past Due' && "bg-red-50 text-red-700 border-red-200",
                          assignment.status === 'Draft' && "bg-slate-100 text-slate-700 border-slate-200"
                        )}>
                          {assignment.status === 'Active' && <CheckCircle2 size={12} />}
                          {assignment.status === 'Past Due' && <XCircle size={12} />}
                          {assignment.status === 'Draft' && <Clock size={12} />}
                          {assignment.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => {
                              setSelectedAssignment(assignment);
                              setIsEditModalOpen(true);
                            }}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-md text-xs font-medium transition-colors border border-amber-200 shadow-sm"
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedAssignment(assignment);
                              setIsDeleteModalOpen(true);
                            }}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-xs font-medium transition-colors border border-red-200 shadow-sm"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-0"
                  >
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <FilePlus2 size={48} className="mb-4 text-slate-300" />
                        <p className="text-slate-600 font-medium mb-1">No assignments found</p>
                        <p className="text-sm">Try adjusting your filters or create a new assignment.</p>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between sm:flex-row flex-col gap-3">
          <div className="text-[13px] text-slate-500">
            Showing <span className="font-medium text-slate-700">{sortedAssignments.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-medium text-slate-700">{Math.min(currentPage * itemsPerPage, sortedAssignments.length)}</span> of <span className="font-medium text-slate-700">{sortedAssignments.length}</span> results
          </div>
          <div className="flex gap-1">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 py-0.5 text-[13px] border border-slate-200 bg-white rounded text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: totalPages || 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={clsx(
                  "px-2 py-0.5 text-[13px] border rounded transition-colors",
                  currentPage === i + 1 
                    ? "border-amber-500 bg-amber-50 text-amber-700 font-medium" 
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                )}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-2 py-0.5 text-[13px] border border-slate-200 bg-white rounded text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {/* Create Assignment Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">Create New Assignment</h2>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assignment Title <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="e.g. History Essay" className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="e.g. History" className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Class <span className="text-red-500">*</span></label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow bg-white">
                      <option value="">Select Class</option>
                      <option value="Grade 9 - B">Grade 9 - B</option>
                      <option value="Grade 10 - A">Grade 10 - A</option>
                      <option value="Grade 11 - A">Grade 11 - A</option>
                      <option value="Grade 12 - C">Grade 12 - C</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Due Date <span className="text-red-500">*</span></label>
                    <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow text-slate-700" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Total Marks <span className="text-red-500">*</span></label>
                    <input type="number" min="1" placeholder="e.g. 100" className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea rows={3} placeholder="Enter assignment details..." className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow resize-none"></textarea>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-white text-slate-700 text-sm font-medium rounded-md border border-slate-300 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.success('Assignment created successfully');
                    setIsCreateModalOpen(false);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium rounded-md shadow-sm hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all"
                >
                  Create Assignment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Assignment Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">Edit Assignment</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assignment Title <span className="text-red-500">*</span></label>
                  <input type="text" defaultValue={selectedAssignment.title} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject <span className="text-red-500">*</span></label>
                    <input type="text" defaultValue={selectedAssignment.subject} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Class <span className="text-red-500">*</span></label>
                    <select defaultValue={selectedAssignment.class} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow bg-white">
                      <option value="">Select Class</option>
                      <option value="Grade 9 - B">Grade 9 - B</option>
                      <option value="Grade 10 - A">Grade 10 - A</option>
                      <option value="Grade 11 - A">Grade 11 - A</option>
                      <option value="Grade 12 - C">Grade 12 - C</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Due Date <span className="text-red-500">*</span></label>
                    <input type="date" defaultValue={selectedAssignment.dueDate} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow text-slate-700" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Total Marks <span className="text-red-500">*</span></label>
                    <input type="number" min="1" defaultValue={selectedAssignment.total} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea rows={3} placeholder="Enter assignment details..." className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow resize-none"></textarea>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-white text-slate-700 text-sm font-medium rounded-md border border-slate-300 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.success('Assignment updated successfully');
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium rounded-md shadow-sm hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-200 p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Delete Assignment?</h2>
              <p className="text-slate-500 text-sm mb-6">
                Are you sure you want to delete <span className="font-semibold text-slate-700">"{selectedAssignment.title}"</span>? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 w-full bg-white text-slate-700 text-sm font-medium rounded-md border border-slate-300 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all"
                >
                  No, cancel
                </button>
                <button
                  onClick={() => {
                    toast.success('Assignment deleted successfully');
                    setIsDeleteModalOpen(false);
                  }}
                  className="px-4 py-2 w-full bg-red-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
                >
                  Yes, delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Extracted icon for header
const ClipboardListIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <path d="M12 11h4"/>
    <path d="M12 16h4"/>
    <path d="M8 11h.01"/>
    <path d="M8 16h.01"/>
  </svg>
);

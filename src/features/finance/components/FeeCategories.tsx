import React, { useState } from 'react';
import { Plus, Edit2, Search, ArrowUpDown, ChevronLeft, ChevronRight, SearchX } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const mockCategories = [
  { code: '101', name: 'Tuition Fee', active: true },
  { code: '102', name: 'Activity / Sports Fee', active: true },
  { code: '103', name: 'Bus / Transport Fee', active: true },
  { code: '104', name: 'Boarding Fee', active: false },
  { code: '105', name: 'Uniform Fee', active: true },
];

export const FeeCategories = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [categoryName, setCategoryName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleEdit = (category: typeof mockCategories[0]) => {
    setCategoryName(category.name);
    setIsActive(category.active);
    setEditingCode(category.code);
    setIsFormVisible(true);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const handleAddNew = () => {
    setCategoryName('');
    setIsActive(true);
    setEditingCode(null);
    setIsFormVisible(true);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const handleSave = () => {
    if (!categoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (editingCode) {
      setCategories(categories.map(cat => 
        cat.code === editingCode ? { ...cat, name: categoryName, active: isActive } : cat
      ));
      toast.success('Category updated successfully');
      setEditingCode(null);
    } else {
      const nextCode = (Math.max(0, ...categories.map(c => parseInt(c.code, 10))) + 1).toString();
      setCategories([...categories, { code: nextCode, name: categoryName, active: isActive }]);
      toast.success('Category added successfully');
    }
    setCategoryName('');
    setIsActive(true);
    setIsFormVisible(false);
  };

  // Search, Sort, Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof typeof mockCategories[0], direction: 'asc' | 'desc' } | null>(null);
  const itemsPerPage = 5;

  const handleSort = (key: keyof typeof mockCategories[0]) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cat.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (!sortConfig) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage) || 1;
  const paginatedCategories = sortedCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full p-1 sm:p-2 text-slate-800">
      {/* Breadcrumb Area */}
      <div className="mb-4">
        <div className="text-sm text-amber-600 hover:underline cursor-pointer mb-1 inline-block">
          School Finance <span className="text-slate-400 mx-1">/</span> Fee Categories
        </div>
        <h1 className="text-xl font-normal text-slate-900 mb-1">Fee Categories</h1>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <button
          onClick={handleAddNew}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Category
        </button>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="px-4 py-3 cursor-pointer hover:text-amber-600 transition-colors" onClick={() => handleSort('code')}>
                <div className="flex items-center gap-2">FEE CAT. CODE <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer hover:text-amber-600 transition-colors" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-2">CATEGORY NAME <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer hover:text-amber-600 transition-colors" onClick={() => handleSort('active')}>
                <div className="flex items-center gap-2">ACTIVE <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="px-4 py-3">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedCategories.length > 0 ? (
              paginatedCategories.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 even:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{row.code}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{row.name}</td>
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
                  <td className="px-4 py-3 text-sm">
                    <button 
                      onClick={() => handleEdit(row)}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-md hover:bg-amber-100 transition-all shadow-sm"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="flex flex-col items-center justify-center"
                  >
                    <SearchX className="w-12 h-12 mb-3 text-slate-300" />
                    <p className="text-sm font-medium text-slate-600">No data found</p>
                    <p className="text-xs text-slate-400 mt-1">We couldn't find any categories matching your search.</p>
                  </motion.div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
          <div className="text-sm text-slate-500">
            Showing {sortedCategories.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedCategories.length)} of {sortedCategories.length} entries
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

        {/* Form Area */}
        {isFormVisible && (
          <div className="p-5 border-t border-slate-100 bg-white">
            <h2 className="text-sm font-medium text-slate-800 mb-4">
              {editingCode ? `Edit Category (Code: ${editingCode})` : 'Add New Category'}
            </h2>

            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              <div className="flex-1 max-w-sm">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Library Fee"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 mt-1 sm:mt-6">
                <div className="text-xs font-medium text-slate-700 w-12 hidden sm:block -mt-12 absolute -translate-y-4">Active</div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isActive}
                  onClick={() => setIsActive(!isActive)}
                  className={clsx(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2",
                    isActive ? "bg-amber-500" : "bg-slate-200"
                  )}
                >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className={clsx(
                      "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      isActive ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </button>
                <span className="text-sm text-slate-600 font-medium ml-2">Active</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleSave}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
              >
                {editingCode ? 'Update Category' : 'Save for Authorization'}
              </button>
              <button
                onClick={() => {
                  setCategoryName('');
                  setIsActive(true);
                  setEditingCode(null);
                  setIsFormVisible(false);
                }}
                className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Filter, ChevronRight, FileText, CreditCard, Receipt, ArrowUpDown
} from 'lucide-react';
import clsx from 'clsx';

// Dummy Data
const stats = [
  { label: 'TOTAL BILLED', value: 'INR 412,500', subtext: 'This term', color: 'text-slate-800' },
  { label: 'COLLECTED', value: 'INR 289,300', subtext: '70.1%', color: 'text-slate-800' },
  { label: 'OUTSTANDING', value: 'INR 98,400', subtext: 'Partial / Unpaid', color: 'text-slate-800' },
  { label: 'OVERDUE', value: '24,800', subtext: 'Past due date', color: 'text-red-600' }
];

const studentsFeesData = [
  {
    refId: 'FR-0001',
    studentName: 'Ama Asante',
    studentId: 'STU-2024-001',
    feeStructure: 'Grade 7 Term 2',
    total: 'INR 970.00',
    tax: '—',
    dueDate: '15 May 2025',
    payDate: '10 May 2025',
    status: 'Paid In Full',
  },
  {
    refId: 'FR-0002',
    studentName: 'Kwame Boateng',
    studentId: 'STU-2024-002',
    feeStructure: 'Grade 7 Term 2',
    total: 'INR 970.00',
    tax: '—',
    dueDate: '15 May 2025',
    payDate: '—',
    status: 'Partially Paid',
  },
  {
    refId: 'FR-0003',
    studentName: 'Fatima Al Rashid',
    studentId: 'STU-2025-011',
    feeStructure: 'Grade 6 Term 2',
    total: 'INR 970.00',
    tax: '—',
    dueDate: '15 May 2025',
    payDate: '—',
    status: 'Not Paid',
  }
];

export const StudentFees = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({ key: '', direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = useMemo(() => {
    return studentsFeesData.filter((item) =>
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.refId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const sortedData = useMemo(() => {
    const sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof typeof a];
        const bValue = b[sortConfig.key as keyof typeof b];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid In Full':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-800">Paid In Full</span>;
      case 'Partially Paid':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-800">Partially Paid</span>;
      case 'Not Paid':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">Not Paid</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  const SortableHeader = ({ label, sortKey }: { label: string; sortKey: string }) => (
    <th 
      className="px-6 py-5 font-medium cursor-pointer hover:bg-slate-100/50 transition-colors select-none whitespace-nowrap"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center gap-2">
        {label}
        <ArrowUpDown size={14} className={clsx(
          "transition-colors",
          sortConfig.key === sortKey ? "text-amber-500" : "text-slate-400"
        )} />
      </div>
    </th>
  );

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center text-sm text-slate-500 mb-2">
          <span>School Finance</span>
          <ChevronRight size={14} className="mx-1" />
          <span className="text-amber-600 font-medium">Student Fees</span>
        </div>
        <h1 className="text-2xl font-medium text-slate-800">Student Fees</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={clsx("text-2xl font-semibold mb-2", stat.color)}>{stat.value}</div>
            <div className="text-xs font-medium text-slate-500 tracking-wider mb-1">{stat.label}</div>
            <div className="text-xs text-slate-400 mt-1">{stat.subtext}</div>
          </motion.div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => navigate('/finance/record-payment')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all font-medium text-sm shadow-sm hover:shadow"
          >
            <Plus size={16} />
            <span>Record Payment</span>
          </button>

          <div className="relative flex-1 sm:min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search student ID / name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-amber-500 w-full sm:w-auto">
            <option>All Terms</option>
            <option>Term 1</option>
            <option>Term 2</option>
            <option>Term 3</option>
          </select>
          <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-amber-500 w-full sm:w-auto">
            <option>All Status</option>
            <option>Paid In Full</option>
            <option>Partially Paid</option>
            <option>Not Paid</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-200">
              <tr>
                <SortableHeader label="REF ID" sortKey="refId" />
                <SortableHeader label="STUDENT" sortKey="studentName" />
                <SortableHeader label="FEE STRUCTURE" sortKey="feeStructure" />
                <SortableHeader label="TOTAL" sortKey="total" />
                <SortableHeader label="TAX" sortKey="tax" />
                <SortableHeader label="DUE DATE" sortKey="dueDate" />
                <SortableHeader label="PAY DATE" sortKey="payDate" />
                <SortableHeader label="STATUS" sortKey="status" />
                <th className="px-6 py-5 font-medium text-center whitespace-nowrap">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, idx) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: idx * 0.05 }}
                      key={row.refId}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-5 font-medium text-slate-800">{row.refId}</td>
                      <td className="px-6 py-5">
                        <div className="font-medium text-slate-800">{row.studentName}</div>
                        <div className="text-xs text-slate-400 mt-1">{row.studentId}</div>
                      </td>
                      <td className="px-6 py-5 text-slate-600">{row.feeStructure}</td>
                      <td className="px-6 py-5 font-medium text-slate-800">{row.total}</td>
                      <td className="px-6 py-5 text-slate-500">{row.tax}</td>
                      <td className="px-6 py-5 text-slate-600">{row.dueDate}</td>
                      <td className="px-6 py-5 text-slate-600">{row.payDate}</td>
                      <td className="px-6 py-5">{getStatusBadge(row.status)}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-2">
                          {row.status === 'Paid In Full' ? (
                            <>
                              <button className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:text-amber-600 transition-colors">
                                Payment
                              </button>
                              <button
                                onClick={() => navigate('/finance/receipt')}
                                className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:text-amber-600 transition-colors"
                              >
                                Receipt
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => navigate('/finance/record-payment')}
                              className="px-4 py-1.5 text-xs font-medium text-white bg-amber-500 rounded hover:bg-amber-600 transition-colors shadow-sm"
                            >
                              Record Payment
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-500">
                        <Search size={48} className="text-slate-300 mb-4" />
                        <p className="text-lg font-medium text-slate-600">No data found</p>
                        <p className="text-sm mt-1">We couldn't find any student fees matching your search.</p>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {sortedData.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
            <div className="text-sm text-slate-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium bg-white border border-slate-200 rounded-md disabled:opacity-50 hover:bg-slate-50 transition-colors"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={clsx(
                    "px-3 py-1.5 text-sm font-medium border rounded-md transition-colors",
                    currentPage === i + 1 
                      ? "bg-amber-500 border-amber-500 text-white shadow-sm" 
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm font-medium bg-white border border-slate-200 rounded-md disabled:opacity-50 hover:bg-slate-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


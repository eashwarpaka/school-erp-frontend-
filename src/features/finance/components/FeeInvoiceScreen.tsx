import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, Loader2, DollarSign, Filter, Search, ArrowUpDown, Brain, AlertTriangle, Send } from 'lucide-react';
import { fetchInvoices, Invoice } from '../../../lib/api/finance';
import { useAuthStore } from '../../auth/store';
import clsx from 'clsx';

const PaymentProgress = ({ invoice }: { invoice: Invoice }) => {
  const percentage = (invoice.amount_paid / invoice.amount) * 100;
  
  let color = 'bg-gray-200';
  let textColor = 'text-gray-500';
  let glow = '';
  
  if (invoice.status === 'Paid In Full') {
    color = 'bg-emerald-500';
    textColor = 'text-emerald-700';
  } else if (invoice.status === 'Partially Paid') {
    color = 'bg-amber-400';
    textColor = 'text-amber-700';
  } else {
    color = 'bg-slate-300';
    textColor = 'text-slate-600';
  }

  return (
    <div className="w-full max-w-[150px]">
      <div className="flex justify-between text-xs mb-1.5 font-semibold tracking-wide">
        <span className={textColor}>{invoice.status}</span>
        <span className="text-gray-500">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className={clsx('h-full rounded-full', color)}
        />
      </div>
    </div>
  );
};

export const FeeInvoiceScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const session = useAuthStore((state) => state.session);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [showAIPredictor, setShowAIPredictor] = useState(false);

  const page = parseInt(searchParams.get('page') || '0', 10);

  const { data, isLoading } = useQuery({
    queryKey: ['invoices', session?.orgcode, session?.branchCode, page],
    queryFn: () =>
      fetchInvoices({
        page,
        limit: 20,
        orgCode: session?.orgcode || 0,
        branchCode: session?.branchCode || 0,
      }),
    enabled: !!session,
  });

  const invoices = useMemo(() => data?.data || [], [data]);

  const columns = useMemo<ColumnDef<Invoice>[]>(
    () => [
      {
        accessorKey: 'invoice_number',
        header: 'Invoice #',
        cell: (info) => (
          <span className="font-mono text-sm font-medium text-slate-700">{info.getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'student_name',
        header: 'Student',
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex flex-col">
              <span className="font-medium text-slate-800">{info.getValue() as string}</span>
              <span className="text-xs text-slate-500">{row.student_id}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: (info) => {
          const row = info.row.original;
          const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: row.currency,
          });
          return <span className="font-semibold text-slate-800">{formatter.format(info.getValue() as number)}</span>;
        },
      },
      {
        id: 'progress',
        header: 'Payment Status',
        cell: (info) => <PaymentProgress invoice={info.row.original} />,
      },
      {
        accessorKey: 'due_date',
        header: 'Due Date',
        cell: (info) => (
          <span className="text-sm text-slate-600">
            {new Date(info.getValue() as string).toLocaleDateString()}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: (info) => (
          <button 
            onClick={(e) => { e.stopPropagation(); navigate('/finance/receipt'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-sm"
          >
            <Printer size={14} />
            Receipt
          </button>
        ),
      },
    ],
    [navigate]
  );

  const table = useReactTable({
    data: invoices,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="p-2 sm:p-4 md:p-6 max-w-7xl mx-auto min-h-screen bg-white"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="relative">
          <div className="relative">
            <h1 className="text-2xl font-bold text-slate-800">Fee & Invoices</h1>
            <p className="text-slate-500 mt-1 text-sm">Manage school finances and track outstanding payments</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/finance/record-payment')}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
          >
            <DollarSign size={18} />
            Record Payment
          </button>
          <button 
            onClick={() => setShowAIPredictor(!showAIPredictor)}
            className={clsx(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl transition-colors font-medium text-sm border shadow-sm",
              showAIPredictor 
                ? "bg-slate-100 text-slate-800 border-slate-300"
                : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
            )}
          >
            <Brain size={18} />
            AI Default Predictor
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showAIPredictor && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 40 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-3xl p-6 shadow-lg shadow-purple-100">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-purple-900 flex items-center gap-2">
                    <Brain className="text-purple-600" />
                    AI Fee-Default Prediction Model
                  </h2>
                  <p className="text-sm text-purple-700 mt-1">
                    Analyzing historical payment patterns, sibling fee records, and current economic indicators to predict default risk 30-60 days before due dates.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-purple-100 text-center shadow-sm min-w-[120px]">
                  <div className="text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-1">Model Confidence</div>
                  <div className="text-2xl font-black text-purple-900">92.4%</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {[
                  { name: 'Arjun Sharma', id: 'STU-1092', risk: '94%', insight: 'Consistently pays 14+ days late. Auto-pay recently declined.', amt: '$1,200', action: 'Suggest Payment Plan' },
                  { name: 'Fatima Ali', id: 'STU-0421', risk: '88%', insight: 'Sibling account just defaulted. Historical pattern matches early warning signs.', amt: '$2,400', action: 'Send Gentle Reminder' },
                  { name: 'Kwame Boateng', id: 'STU-2094', risk: '76%', insight: 'Missed recent small incidental fee. Credit card on file expires next week.', amt: '$850', action: 'Request Card Update' },
                ].map(student => (
                  <div key={student.id} className="bg-white rounded-2xl p-4 border border-purple-100 shadow-sm flex flex-col hover:border-purple-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-bold text-slate-800">{student.name}</div>
                        <div className="text-xs text-slate-500 font-mono">{student.id}</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-rose-500 uppercase">Risk Score</span>
                        <span className="font-black text-rose-600">{student.risk}</span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mb-4 flex-1 border border-slate-100">
                      <AlertTriangle size={12} className="inline mr-1 text-amber-500" />
                      {student.insight}
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="font-bold text-slate-800">{student.amt} <span className="text-[10px] font-normal text-slate-500">at risk</span></div>
                      <button className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-1">
                        <Send size={12} />
                        {student.action}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { title: 'Total Outstanding', amount: '$124,500.00', trend: '↑ 12% from last month', trendColor: 'text-rose-500', icon: 'bg-rose-100 text-rose-500' },
          { title: 'Collected This Term', amount: '$845,200.00', trend: '↑ 5% from last month', trendColor: 'text-amber-600', icon: 'bg-amber-100 text-amber-600' },
          { title: 'Overdue Invoices', amount: '42', trend: 'Requires attention', trendColor: 'text-orange-500', icon: 'bg-orange-100 text-orange-500' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">{stat.title}</div>
              <div className="text-2xl font-bold text-slate-800">{stat.amount}</div>
              <div className={`text-xs mt-2 font-medium ${stat.trendColor} flex items-center gap-1`}>
                {stat.trend}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
           <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search invoices..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            />
          </div>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Filter size={16} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors"
                      >
                        <div 
                          className="flex items-center gap-1"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.columnDef.header !== '' && (
                            <ArrowUpDown className={clsx("w-3 h-3", header.column.getIsSorted() ? "text-blue-500" : "text-slate-300")} />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-slate-100">
                {table.getRowModel().rows.map((row, i) => (
                  <tr 
                    key={row.id} 
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="border-t border-slate-200 p-4 bg-slate-50 flex items-center justify-between">
          <div className="text-sm font-medium text-slate-500">
            Showing page <span className="font-bold text-slate-800">{page + 1}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set('page', Math.max(0, page - 1).toString());
                setSearchParams(newParams);
              }}
              disabled={page === 0}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors bg-white shadow-sm"
            >
              Previous
            </button>
            <button
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set('page', (page + 1).toString());
                setSearchParams(newParams);
              }}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors bg-white shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

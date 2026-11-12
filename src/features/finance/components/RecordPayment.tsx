import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

export const RecordPayment = () => {
  const navigate = useNavigate();

  const handleSave = () => {
    toast.success('Payment recorded successfully!');
    navigate('/finance/receipt');
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center text-sm text-slate-500 mb-2">
          <span>School Finance</span>
          <ChevronRight size={14} className="mx-1" />
          <span className="cursor-pointer hover:text-amber-600 transition-colors" onClick={() => navigate('/finance/student-fees')}>Student Fees</span>
          <ChevronRight size={14} className="mx-1" />
          <span className="text-amber-600 font-medium">Record Payment</span>
        </div>
        <h1 className="text-2xl font-semibold text-slate-800">Record Payment</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Form Area */}
        <div className="flex-1 space-y-6">

          {/* Step 1 - Identify Student Fee */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-medium text-slate-800">Step 1 — Identify Student Fee</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Student ID / Name <span className="text-red-500">*</span></label>
                  <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all">
                    <option>Kwame Boateng — STU-2024-002</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Fee Ref ID <span className="text-red-500">*</span></label>
                  <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all">
                    <option>FR-0002 — Grade 7 Term 2 — INR 970.00</option>
                  </select>
                </div>
              </div>

              {/* Fee Breakup */}
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-3">Fee Breakup (FEE002)</h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 font-semibold">CATEGORY</th>
                        <th className="px-4 py-3 font-semibold">AMOUNT</th>
                        <th className="px-4 py-3 font-semibold">DISCOUNT</th>
                        <th className="px-4 py-3 font-semibold">TAX</th>
                        <th className="px-4 py-3 font-semibold">NET</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="px-4 py-3 text-slate-700">Tuition Fee</td>
                        <td className="px-4 py-3 text-slate-600">INR 850.00</td>
                        <td className="px-4 py-3 text-slate-600">0.00</td>
                        <td className="px-4 py-3 text-slate-500">—</td>
                        <td className="px-4 py-3 text-slate-700 font-medium">INR 850.00</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-slate-700">Activity Fee</td>
                        <td className="px-4 py-3 text-slate-600">INR 120.00</td>
                        <td className="px-4 py-3 text-slate-600">0.00</td>
                        <td className="px-4 py-3 text-slate-500">—</td>
                        <td className="px-4 py-3 text-slate-700 font-medium">INR 120.00</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-200 flex justify-end text-sm">
                    <div className="space-x-2">
                      <span className="font-semibold text-slate-800">Total: INR 970.00</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-slate-600">Paid: INR 500.00</span>
                      <span className="text-slate-300">|</span>
                      <span className="font-bold text-red-600">Balance: INR 470.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 2 - Payment Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-medium text-slate-800">Step 2 — Payment Details</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Payment Amount <span className="text-red-500">*</span></label>
                  <input type="text" defaultValue="470.00" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Currency <span className="text-red-500">*</span></label>
                  <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all">
                    <option>INR</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Payment Method <span className="text-red-500">*</span></label>
                  <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all">
                    <option>— Select —</option>
                    <option>Cash</option>
                    <option>Bank Transfer</option>
                    <option>Mobile Money</option>
                    <option>Cheque</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Payment Date <span className="text-red-500">*</span></label>
                  <input type="date" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Reference / Transaction No.</label>
                  <input type="text" placeholder="Bank ref, MPESA code, cheque no..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Paid By (User / Parent)</label>
                  <input type="text" placeholder="User ID or parent name" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" />
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 shadow-sm transition-all"
                >
                  Save & Generate Receipt
                </button>
                <button
                  onClick={() => navigate('/finance/student-fees')}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
          >
            <h3 className="text-sm font-medium text-slate-800 mb-4">Student Info</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="font-semibold text-slate-800 text-base">Kwame Boateng</div>
              <div>ID: <span className="text-slate-800">STU-2024-002</span></div>
              <div>Class: <span className="text-slate-800">Grade 7A - 2025-2026</span></div>
              <div>Term: <span className="text-slate-800">Term 2</span></div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="text-sm font-semibold text-red-600">Balance Due: INR 470.00</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
          >
            <h3 className="text-sm font-medium text-slate-800 mb-4">Payment History</h3>
            <div className="space-y-3">
              <div className="text-xs text-slate-600 pb-3 border-b border-slate-100">
                12 May 2025 · INR 500.00 · Cash
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

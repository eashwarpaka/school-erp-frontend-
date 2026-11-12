import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, Mail, ArrowLeft, ChevronRight, X, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export const FeeReceipt = () => {
  const navigate = useNavigate();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState('emmanuel.boateng@example.com');

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailAddress) return;
    toast.success(`Receipt emailed to ${emailAddress} successfully!`);
    setIsEmailModalOpen(false);
  };

  return (
    <div className="w-full space-y-6 print:space-y-0">
      {/* Header */}
      <div className="print:hidden">
        <div className="flex items-center text-sm text-slate-500 mb-2">
          <span>School Finance</span>
          <ChevronRight size={14} className="mx-1" />
          <span className="cursor-pointer hover:text-amber-600 transition-colors" onClick={() => navigate('/finance/student-fees')}>Student Fees</span>
          <ChevronRight size={14} className="mx-1" />
          <span className="text-amber-600 font-medium">Receipt</span>
        </div>
        <h1 className="text-2xl font-semibold text-slate-800">Fee Receipt</h1>
        <p className="text-sm text-slate-500">Auto-generated after payment confirmation</p>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-3 print:hidden">
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all font-medium text-sm shadow-sm"
        >
          <Printer size={16} />
          <span>Print</span>
        </button>
        <button 
          onClick={() => setIsEmailModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:text-amber-600 transition-all font-medium text-sm shadow-sm"
        >
          <Mail size={16} className="text-blue-500" />
          <span>Email to Parent</span>
        </button>
        <button 
          onClick={() => navigate('/finance/student-fees')}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-medium text-sm shadow-sm ml-auto"
        >
          <ArrowLeft size={16} />
          <span>Back to Fees</span>
        </button>
      </div>

      {/* Receipt Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 sm:p-12 print:shadow-none print:border-none"
      >
        <div className="flex justify-between items-start border-b border-slate-100 pb-8 mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">EFOS School</h2>
            <p className="text-sm text-slate-500 mt-1">P.O. Box 1234 - Accra, Ghana</p>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Receipt No.</div>
            <div className="text-2xl font-bold text-emerald-600">RCT-2025-0871</div>
            <div className="text-sm text-slate-500 mt-1">28 Jun 2025</div>
          </div>
        </div>

        <div className="bg-slate-50/80 rounded-xl p-6 mb-8 border border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-slate-500">Student: <span className="font-semibold text-slate-800">Kwame Boateng</span></span>
              <span className="text-slate-500">Class: <span className="font-semibold text-slate-800">Grade 7A</span></span>
              <span className="text-slate-500">Paid By: <span className="font-semibold text-slate-800">Emmanuel Boateng (father)</span></span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-500">Student ID: <span className="font-semibold text-slate-800">STU-2024-002</span></span>
              <span className="text-slate-500">Academic Year: <span className="font-semibold text-slate-800">2025 - 2026 · Term 2</span></span>
              <span className="text-slate-500">Payment Method: <span className="font-semibold text-slate-800">Cash</span></span>
            </div>
          </div>
        </div>

        <div className="mb-8 border border-slate-100 rounded-xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold w-16">#</th>
                <th className="px-6 py-4 font-semibold">DESCRIPTION</th>
                <th className="px-6 py-4 font-semibold text-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <tr>
                <td className="px-6 py-4 text-amber-600 font-medium">1</td>
                <td className="px-6 py-4 text-slate-700">Tuition Fee</td>
                <td className="px-6 py-4 text-slate-700 font-medium text-right">INR 850.00</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-amber-600 font-medium">2</td>
                <td className="px-6 py-4 text-slate-700">Activity Fee</td>
                <td className="px-6 py-4 text-slate-700 font-medium text-right">INR 120.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-end gap-3 mb-12">
          <div className="flex items-center gap-8 text-sm">
            <span className="font-semibold text-slate-600">Amount Paid</span>
            <span className="font-bold text-lg text-emerald-600 w-32 text-right">INR 970.00</span>
          </div>
          <div className="flex items-center gap-8 text-sm">
            <span className="font-medium text-slate-500">Outstanding Balance</span>
            <span className="font-bold text-lg text-emerald-600 w-32 text-right">INR 0.00</span>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
          This is a computer generated receipt. No signature required.
        </div>
      </motion.div>

      {/* Email Modal */}
      <AnimatePresence>
        {isEmailModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm print:hidden">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2">
                  <Mail className="text-amber-500" size={20} />
                  Email Receipt
                </h3>
                <button onClick={() => setIsEmailModalOpen(false)} className="text-slate-400 hover:text-slate-500 transition-colors p-1 rounded-lg hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSendEmail}>
                <div className="p-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Parent Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="Enter email address" 
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm" 
                  />
                  <p className="text-xs text-slate-500 mt-2">A PDF copy of the receipt will be attached to this email.</p>
                </div>
                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsEmailModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors text-sm">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all flex items-center gap-2 text-sm shadow-sm">
                    <Send size={16} />
                    Send Email
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

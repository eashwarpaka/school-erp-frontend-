import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Smartphone, CheckCircle, Clock, FileText, ChevronRight, AlertCircle, RefreshCw, X, Shield, Lock, SmartphoneNfc
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

// ── Types ──────────────────────────────────────────────────
interface PendingDue {
  id: string;
  title: string;
  category: 'Tuition' | 'Transport' | 'Hostel' | 'Exam';
  amount: number;
  dueDate: string;
  isOverdue: boolean;
  status: 'Pending' | 'Processing';
}

const PENDING_DUES: PendingDue[] = [
  { id: 'FEE-1042', title: 'Grade 8 Term 2 Tuition Fee', category: 'Tuition', amount: 45000, dueDate: '2026-08-15', isOverdue: false, status: 'Pending' },
  { id: 'TRN-882', title: 'Bus Fee (North Route) - Aug', category: 'Transport', amount: 2500, dueDate: '2026-08-05', isOverdue: true, status: 'Pending' },
  { id: 'EXM-091', title: 'Half-Yearly Exam Fee', category: 'Exam', amount: 1200, dueDate: '2026-08-20', isOverdue: false, status: 'Pending' },
];

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

// ── Payment Gateway Modal ──────────────────────────────────
const GatewayModal = ({ 
  amount, 
  items, 
  onClose, 
  onSuccess 
}: { 
  amount: number; 
  items: number; 
  onClose: () => void; 
  onSuccess: () => void; 
}) => {
  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    // Simulate network delay and auto-reconciliation webhook
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 2500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={!processing ? onClose : undefined} />
      
      <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center"><Shield size={16} className="text-white" /></div>
            <div>
              <div className="font-bold text-sm">Secure Checkout</div>
              <div className="text-xs text-slate-400">Powered by Razorpay</div>
            </div>
          </div>
          {!processing && (
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Order Summary */}
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Paying For</div>
            <div className="text-sm text-slate-700 font-medium">{items} item{items > 1 ? 's' : ''} selected</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Amount</div>
            <div className="text-2xl font-black text-slate-800">{fmt(amount)}</div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-6 flex-1">
          <div className="text-sm font-semibold text-slate-700 mb-4">Select Payment Method</div>
          <div className="space-y-3">
            {[
              { id: 'upi', icon: SmartphoneNfc, label: 'UPI / QR Code', desc: 'Google Pay, PhonePe, Paytm' },
              { id: 'card', icon: CreditCard, label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
              { id: 'netbanking', icon: Lock, label: 'Net Banking', desc: 'All major Indian banks' },
            ].map((m) => (
              <div 
                key={m.id} 
                onClick={() => !processing && setMethod(m.id as any)}
                className={clsx(
                  'flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all',
                  method === m.id ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 hover:border-blue-200 bg-white'
                )}
              >
                <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', method === m.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500')}>
                  <m.icon size={20} />
                </div>
                <div>
                  <div className={clsx('font-semibold text-sm', method === m.id ? 'text-blue-900' : 'text-slate-700')}>{m.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{m.desc}</div>
                </div>
                <div className="ml-auto">
                  <div className={clsx('w-5 h-5 rounded-full border-2 flex items-center justify-center', method === m.id ? 'border-blue-500' : 'border-slate-300')}>
                    {method === m.id && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={handlePay} 
            disabled={processing}
            className="w-full mt-6 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-80"
          >
            {processing ? (
              <><RefreshCw size={18} className="animate-spin" /> Processing Payment…</>
            ) : (
              <>Pay {fmt(amount)} Securely</>
            )}
          </button>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase tracking-wide font-medium">
            <Lock size={10} /> 256-bit SSL Encrypted Transaction
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Main Component ─────────────────────────────────────────
export const OnlinePaymentScreen = () => {
  const [selectedDues, setSelectedDues] = useState<Set<string>>(new Set(PENDING_DUES.map(d => d.id)));
  const [showGateway, setShowGateway] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedDues);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedDues(next);
  };

  const selectedItems = PENDING_DUES.filter(d => selectedDues.has(d.id));
  const totalAmount = selectedItems.reduce((sum, item) => sum + item.amount, 0);

  const handleSuccess = () => {
    setShowGateway(false);
    setPaymentSuccess(true);
    toast.success('Payment successful & auto-reconciled!');
  };

  if (paymentSuccess) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center min-h-[400px]">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful!</h2>
          <p className="text-slate-500 text-sm mb-6">Your payment of <span className="font-semibold text-slate-700">{fmt(totalAmount)}</span> has been received and automatically reconciled against your student account.</p>
          
          <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-100 mb-8 space-y-3">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Transaction ID</span><span className="font-medium text-slate-800 font-mono">TXN-8829104A</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Date & Time</span><span className="font-medium text-slate-800">{new Date().toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Payment Method</span><span className="font-medium text-slate-800">UPI</span></div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors">Download Receipt</button>
            <button onClick={() => window.location.reload()} className="flex-1 py-2.5 rounded-xl bg-slate-800 text-white font-medium text-sm hover:bg-slate-700 transition-colors">Back to Portal</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Fee Payments</h1>
        <p className="text-sm text-slate-500 mt-0.5">View and pay pending school fees online</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Dues List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-700">Pending Dues ({PENDING_DUES.length})</h2>
            <button 
              onClick={() => setSelectedDues(new Set(PENDING_DUES.map(d => d.id)))}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Select All
            </button>
          </div>

          <div className="space-y-3">
            {PENDING_DUES.map(due => (
              <motion.div 
                key={due.id} 
                whileHover={{ y: -2 }}
                onClick={() => toggleSelect(due.id)}
                className={clsx(
                  'bg-white rounded-2xl border p-4 cursor-pointer shadow-sm transition-all flex items-start gap-4',
                  selectedDues.has(due.id) ? 'border-blue-400 ring-2 ring-blue-400/20' : 'border-slate-200 hover:border-slate-300'
                )}
              >
                <div className={clsx('w-6 h-6 rounded border-2 flex items-center justify-center mt-0.5 transition-colors', selectedDues.has(due.id) ? 'bg-blue-500 border-blue-500' : 'border-slate-300')}>
                  {selectedDues.has(due.id) && <CheckCircle size={14} className="text-white" />}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-bold text-slate-800">{due.title}</div>
                    <div className="font-bold text-slate-800 text-lg">{fmt(due.amount)}</div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><FileText size={12} /> {due.id}</span>
                    <span className={clsx('flex items-center gap-1 font-medium', due.isOverdue ? 'text-red-600' : 'text-slate-500')}>
                      {due.isOverdue ? <AlertCircle size={12} /> : <Clock size={12} />} 
                      Due: {due.dueDate}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">{due.category}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Checkout Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm sticky top-4">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-800">Payment Summary</h2>
            </div>
            
            <div className="p-5 space-y-4">
              {selectedItems.length === 0 ? (
                <div className="text-center py-6 text-sm text-slate-500">
                  Select fees to proceed with payment
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {selectedItems.map(item => (
                      <div key={item.id} className="flex items-start justify-between text-sm">
                        <div className="text-slate-600 truncate pr-4">{item.title}</div>
                        <div className="font-medium text-slate-800">{fmt(item.amount)}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 border-dashed">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-slate-500 text-sm">Subtotal</div>
                      <div className="font-semibold text-slate-700">{fmt(totalAmount)}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-slate-500 text-sm">Convenience Fee</div>
                      <div className="font-semibold text-emerald-600">Waived</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="font-bold text-slate-800">Total Payable</div>
                    <div className="font-black text-2xl text-slate-900">{fmt(totalAmount)}</div>
                  </div>

                  <button 
                    onClick={() => setShowGateway(true)}
                    className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-md shadow-blue-200 hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    Proceed to Pay <ChevronRight size={16} />
                  </button>
                  
                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 pt-2">
                    <Shield size={12} /> Auto-reconciliation enabled
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gateway Modal */}
      <AnimatePresence>
        {showGateway && (
          <GatewayModal 
            amount={totalAmount} 
            items={selectedItems.length}
            onClose={() => setShowGateway(false)} 
            onSuccess={handleSuccess} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

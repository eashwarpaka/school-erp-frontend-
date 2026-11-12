import React, { useState } from 'react';
import { useAuth } from '../../../lib/authContext';
import { Shield, Fingerprint, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const MfaVerification = ({ onVerified }: { onVerified: () => void }) => {
  const { activeRole } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === '123456') { // Mock verification
      onVerified();
    } else {
      setError('Invalid verification code. Use 123456 for testing.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center h-full w-full bg-slate-50/50 backdrop-blur-sm z-50 absolute inset-0">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 relative overflow-hidden"
      >
        {/* Decorative background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-10"></div>
        
        <div className="relative z-10 w-16 h-16 bg-white border-4 border-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600 shadow-sm">
          <Shield size={28} />
        </div>
        
        <h2 className="relative z-10 text-2xl font-bold text-slate-800 mb-2">Security Verification</h2>
        <p className="relative z-10 text-slate-500 text-sm mb-6">
          Your role (<span className="font-semibold text-indigo-600 capitalize">{activeRole.replace('_', ' ')}</span>) requires Multi-Factor Authentication. 
          Please enter the 6-digit code.
        </p>

        <form onSubmit={handleVerify} className="relative z-10 space-y-4">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Fingerprint size={20} />
              </div>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setError('');
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                }}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border ${error ? 'border-red-300 bg-red-50 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500'} focus:outline-none focus:ring-2 text-center tracking-[0.5em] text-xl font-bold text-slate-800 transition-colors`}
                placeholder="000000"
                maxLength={6}
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2 text-left">{error}</p>}
            {!error && <p className="text-slate-400 text-xs mt-2 text-left">Use 123456 for testing</p>}
          </div>
          
          <button
            type="submit"
            disabled={code.length !== 6}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3.5 rounded-xl transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Verify Identity <ArrowRight size={18} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

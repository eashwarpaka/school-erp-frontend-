import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call to send OTP
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to OTP verification with email state
      navigate('/verify-otp', { state: { email } });
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <Link to="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-amber-600 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to login
        </Link>
      </div>

      <div className="text-center mb-8">
        <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="text-amber-600" size={24} />
        </div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Forgot Password?</h2>
        <p className="text-slate-500 text-sm">
          No worries, we'll send you recovery instructions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail size={18} />
            </div>
            <input
              type="email"
              required
              className="pl-10 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors bg-slate-50 focus:bg-white"
              placeholder="admin@school.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center bg-amber-600 text-white py-2.5 rounded-lg hover:bg-amber-700 transition-all font-medium disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-amber-600/20"
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
    </motion.div>
  );
};

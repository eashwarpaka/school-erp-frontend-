import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store';
import { api } from '../../../lib/axios';
import toast from 'react-hot-toast';
import { Loader2, Mail, Lock, School } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { setUserSession } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    schoolCode: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: { email: string; password: string; schoolCode?: string } = {
        email: formData.email.trim(),
        password: formData.password,
      };

      if (formData.schoolCode.trim()) {
        payload.schoolCode = formData.schoolCode.trim();
      }

      const res = await api.post('/auth/login', payload);

      if (res.data?.success) {
        setUserSession(res.data.user, res.data.school);
        toast.success(res.data.message || 'Login successful!');
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(res.data?.message || 'Login failed.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Invalid credentials or server unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Welcome Back</h2>
        <p className="text-slate-500 text-sm">Please sign in to your Smart School account</p>
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
              placeholder="admin@demo.schoolerp.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock size={18} />
            </div>
            <input
              type="password"
              required
              className="pl-10 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors bg-slate-50 focus:bg-white"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            School Code <span className="text-xs text-slate-400 font-normal">(Optional, e.g. DEMO)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <School size={18} />
            </div>
            <input
              type="text"
              className="pl-10 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors bg-slate-50 focus:bg-white"
              placeholder="DEMO"
              value={formData.schoolCode}
              onChange={(e) => setFormData({ ...formData, schoolCode: e.target.value.toUpperCase() })}
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
            'Sign In'
          )}
        </button>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-amber-600 hover:text-amber-700 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  );
};

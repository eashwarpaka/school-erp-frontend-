import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store';
import { api } from '../../../lib/axios';
import toast from 'react-hot-toast';
import { Loader2, Mail, Lock, User, School } from 'lucide-react';

export const Signup = () => {
  const navigate = useNavigate();
  const { setUserSession } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    schoolName: '',
    schoolCode: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const schoolName = formData.schoolName.trim() || `${formData.name.trim()}'s Academy`;
      const schoolCode = (formData.schoolCode.trim() || formData.name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6)).toUpperCase();

      const res = await api.post('/auth/signup', {
        fullName: formData.name.trim(),
        schoolName,
        schoolCode,
        email: formData.email.trim(),
        password: formData.password,
      });

      if (res.data?.success) {
        toast.success(res.data.message || 'Account created successfully!');
        if (res.data.user) {
          setUserSession(res.data.user, res.data.school);
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      } else {
        toast.error(res.data?.message || 'Registration failed.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Registration failed. Please check inputs.');
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
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Create School Account</h2>
        <p className="text-slate-500 text-sm">Register your school on Smart School ERP</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Administrator Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User size={18} />
            </div>
            <input
              type="text"
              required
              className="pl-10 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors bg-slate-50 focus:bg-white"
              placeholder="Dr. Rajesh Kumar"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            School / Institution Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <School size={18} />
            </div>
            <input
              type="text"
              required
              className="pl-10 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors bg-slate-50 focus:bg-white"
              placeholder="Greenwood International School"
              value={formData.schoolName}
              onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
            />
          </div>
        </div>

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
              placeholder="principal@greenwood.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Password (min 6 characters)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock size={18} />
            </div>
            <input
              type="password"
              required
              minLength={6}
              className="pl-10 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors bg-slate-50 focus:bg-white"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center bg-amber-600 text-white py-2.5 rounded-lg hover:bg-amber-700 transition-all font-medium disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-amber-600/20 mt-2"
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            'Register School'
          )}
        </button>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-amber-600 hover:text-amber-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft } from 'lucide-react';

export const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your email';
  
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // If no email was provided, redirect back to forgot password
  useEffect(() => {
    if (!location.state?.email) {
      navigate('/forgot-password');
    }
  }, [location.state, navigate]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple chars

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) return;
    
    setIsLoading(true);

    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      navigate('/reset-password', { state: { email, otp: otpValue } });
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <Link to="/forgot-password" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-amber-600 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back
        </Link>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Check your email</h2>
        <p className="text-slate-500 text-sm">
          We sent a verification link to <br/>
          <span className="font-medium text-slate-800">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-bold border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors bg-slate-50 focus:bg-white"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.join('').length < 6}
          className="w-full flex items-center justify-center bg-amber-600 text-white py-2.5 rounded-lg hover:bg-amber-700 transition-all font-medium disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-amber-600/20"
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            'Verify OTP'
          )}
        </button>
        
        <div className="text-center">
          <p className="text-sm text-slate-500">
            Didn't receive the email?{' '}
            <button type="button" className="font-medium text-amber-600 hover:text-amber-700 transition-colors">
              Click to resend
            </button>
          </p>
        </div>
      </form>
    </motion.div>
  );
};

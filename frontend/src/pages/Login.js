import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { LogIn, ShieldAlert, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { syncSession } = useAuth();

  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(location.state?.message || null);

  const redirectPath = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

      await syncSession();
      navigate(redirectPath, { replace: true });
    } catch (err) {
      const errMsg = err.message || '';
      const lowerMsg = errMsg.toLowerCase();
      
      if (lowerMsg.includes('confirm') || lowerMsg.includes('verified') || lowerMsg.includes('verification')) {
        setError('Please confirm your email before logging in.');
      } else if (lowerMsg.includes('invalid') || lowerMsg.includes('credentials') || lowerMsg.includes('not found') || lowerMsg.includes('no user') || lowerMsg.includes('invalid_credentials')) {
        setError(
          <span>
            You don’t have an account yet.{' '}
            <Link
              to="/signup"
              state={{ email, from: redirectPath }}
              className="text-[#38BDF8] underline font-bold hover:text-[#0ea5e9] cursor-pointer"
            >
              Create one
            </Link>
            .
          </span>
        );
      } else {
        setError(errMsg || 'Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-[#020617] px-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#071827] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white hero-text uppercase mb-2">
              TRAIL<span className="text-[#38BDF8]">VISTA</span>
            </h1>
            <p className="text-[#94A3B8] text-sm">
              Welcome back! Log in to continue your adventure.
            </p>
          </div>

          {/* Error Banner */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-start space-x-2"
              >
                <ShieldAlert className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[#94A3B8] text-xs mb-1.5 block font-medium">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#38BDF8] disabled:opacity-50"
                placeholder="you@example.com"
                data-testid="login-email-input"
              />
            </div>

            <div>
              <label className="text-[#94A3B8] text-xs mb-1.5 block font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full bg-[#020617] border border-white/10 rounded-lg pl-4 pr-10 py-3 text-white text-sm focus:outline-none focus:border-[#38BDF8] disabled:opacity-50"
                  placeholder="••••••••"
                  data-testid="login-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#38BDF8] hover:bg-[#0ea5e9] text-white px-6 py-3.5 rounded-lg font-bold text-sm transition-all active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:active:scale-100 mt-6"
              data-testid="login-submit-button"
            >
              <LogIn className="h-4.5 w-4.5" />
              <span>{loading ? 'Logging in...' : 'Log In'}</span>
            </button>

            <div className="text-center mt-6">
              <p className="text-[#94A3B8] text-sm">
                Don’t have an account?{' '}
                <Link
                  to="/signup"
                  state={{ from: redirectPath }}
                  className="text-[#38BDF8] hover:underline font-semibold focus:outline-none"
                >
                  Create one
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { consumeRedirect } from '../lib/authRedirect';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, CheckCircle2, Eye, EyeOff, Lock } from 'lucide-react';

const MIN_PASSWORD_LENGTH = 8;

const readCallbackParams = () => {
  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.substring(1));
  return {
    type: search.get('type') || hash.get('type'),
    errorDescription: search.get('error_description') || hash.get('error_description'),
  };
};

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setIsPasswordRecovery } = useAuth();
  const { type, errorDescription } = useMemo(readCallbackParams, []);
  const isRecoveryLink = type === 'recovery';

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const finishSignIn = async () => {
      if (errorDescription) {
        setIsPasswordRecovery(false);
        setError(errorDescription);
        return;
      }

      // supabase-js (detectSessionInUrl + PKCE) exchanges the ?code= on load;
      // getSession() waits for that to finish, so no manual exchange is needed.
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (cancelled) return;

      if (sessionError || !session) {
        setIsPasswordRecovery(false);
        setError(
          isRecoveryLink
            ? 'This reset link is invalid or has expired. Please request a new one.'
            : 'This sign-in link is invalid or has expired. Please log in again.'
        );
        return;
      }

      if (isRecoveryLink) {
        setIsRecovery(true);
        return;
      }

      navigate(consumeRedirect(), { replace: true });
    };

    finishSignIn();
    return () => {
      cancelled = true;
    };
  }, [errorDescription, isRecoveryLink, navigate, setIsPasswordRecovery]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;

      // Clear the temporary recovery session on successful password reset
      await supabase.auth.signOut().catch(() => {});
      setIsPasswordRecovery(false);
      setSuccessMessage('Password updated successfully.');
      navigate('/login', {
        state: {
          message: 'Password updated. Please log in with your new password.',
          mode: 'login',
        },
        replace: true,
      });
    } catch (err) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-[#020617] px-4">
      <div className="max-w-md w-full bg-[#071827] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
        {isRecovery ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-black text-white hero-text uppercase mb-2">
                TRAIL<span className="text-[#38BDF8]">VISTA</span>
              </h1>
              <p className="text-[#94A3B8] text-sm">Enter your new password below.</p>
            </div>

            {/* Success Banner */}
            <AnimatePresence mode="wait">
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm flex items-start space-x-2"
                >
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Banner */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-start space-x-2"
                >
                  <ShieldAlert className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="text-[#94A3B8] text-xs mb-1.5 block font-medium">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full bg-[#020617] border border-white/10 rounded-lg pl-4 pr-10 py-3 text-white text-sm focus:outline-none focus:border-[#38BDF8] disabled:opacity-50"
                    placeholder={`New password (min ${MIN_PASSWORD_LENGTH} chars)`}
                    data-testid="recovery-new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[#94A3B8] text-xs mb-1.5 block font-medium">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full bg-[#020617] border border-white/10 rounded-lg pl-4 pr-10 py-3 text-white text-sm focus:outline-none focus:border-[#38BDF8] disabled:opacity-50"
                    placeholder="Confirm new password"
                    data-testid="recovery-confirm-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#38BDF8] hover:bg-[#0ea5e9] text-white px-6 py-3.5 rounded-lg font-bold text-sm transition-all active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:active:scale-100 mt-6"
              >
                <Lock className="h-4.5 w-4.5" />
                <span>{loading ? 'Updating Password...' : 'Update Password'}</span>
              </button>
            </form>
          </div>
        ) : error ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center text-red-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Authentication Error</h2>
            <p className="text-[#94A3B8] text-sm">{error}</p>
            <button
              onClick={() =>
                navigate('/login', { state: isRecoveryLink ? { mode: 'forgot' } : undefined, replace: true })
              }
              className="mt-4 px-6 py-2 bg-[#38BDF8] hover:bg-[#0ea5e9] text-white rounded-lg font-bold text-sm transition-all"
            >
              {isRecoveryLink ? 'Request Reset Link' : 'Go to Login'}
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#38BDF8]" />
            </div>
            <h2 className="text-xl font-bold text-white">Verifying Account...</h2>
            <p className="text-[#94A3B8] text-sm">Please wait while we complete your authentication.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;

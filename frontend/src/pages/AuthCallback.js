import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, CheckCircle2, Eye, EyeOff, Lock } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { syncSession } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // State for password recovery
  const [isRecovery, setIsRecovery] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const callbackProcessed = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (callbackProcessed.current) return;
      callbackProcessed.current = true;

      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const searchType = params.get('type');
      
      // Parse type from hash (some Supabase routes use hash parameters for type/token)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const hashType = hashParams.get('type');
      const type = searchType || hashType;

      const redirectHome = async () => {
        try {
          await syncSession().catch(() => {});
        } finally {
          navigate('/', { replace: true });
        }
      };

      if (code) {
        try {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;

          if (type === 'recovery') {
            setIsRecovery(true);
          } else {
            await redirectHome();
          }
        } catch (err) {
          console.error('Code exchange failed:', err);
          setError(err.message || 'Verification failed. The link may have expired.');
        }
      } else {
        // If there's already a session set (implicit flow)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('getSession error:', sessionError);
        }
        
        if (session) {
          if (type === 'recovery') {
            setIsRecovery(true);
          } else {
            await redirectHome();
          }
          return;
        }

        // Listen for Auth events in case implicit flow takes a moment to process the hash
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          if (event === 'SIGNED_IN' && currentSession) {
            subscription.unsubscribe();
            if (type === 'recovery') {
              setIsRecovery(true);
            } else {
              await redirectHome();
            }
          }
        });

        // Timeout fallback if no session is detected within 4 seconds
        const timeout = setTimeout(() => {
          subscription.unsubscribe();
          if (!isRecovery) {
            setError(
              'Verification completed, but login session was not created. Please log in manually.'
            );
          }
        }, 4000);
      }
    };

    handleCallback();
  }, [navigate, syncSession, isRecovery]);

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
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;

      setSuccessMessage('Password updated successfully. Redirecting to home...');
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
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
                    placeholder="New password (min 8 chars)"
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
              onClick={() => navigate('/login', { replace: true })}
              className="mt-4 px-6 py-2 bg-[#38BDF8] hover:bg-[#0ea5e9] text-white rounded-lg font-bold text-sm transition-all"
            >
              Go to Login
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

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout, { AuthAlert, AuthField } from '../components/AuthLayout';
import { supabase } from '../lib/supabaseClient';
import { consumeRedirect } from '../lib/authRedirect';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

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

  const toggle = (shown, setShown) => (
    <button
      type="button"
      onClick={() => setShown(!shown)}
      className="flex h-9 w-9 items-center justify-center rounded-full text-[#94A3B8] hover:bg-white/5 hover:text-white"
      aria-label={shown ? 'Hide password' : 'Show password'}
    >
      {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  if (isRecovery) {
    return (
      <AuthLayout title="Choose a new password" subtitle={`Use at least ${MIN_PASSWORD_LENGTH} characters.`}>
        <AuthAlert tone="success">{successMessage}</AuthAlert>
        <AuthAlert>{error}</AuthAlert>

        <form onSubmit={handleUpdatePassword} className="space-y-5">
          <AuthField
            id="recovery-password"
            label="New password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={loading}
            placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
            data-testid="recovery-new-password"
            trailing={toggle(showPassword, setShowPassword)}
          />
          <AuthField
            id="recovery-confirm"
            label="Confirm new password"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            placeholder="Type it again"
            data-testid="recovery-confirm-password"
            trailing={toggle(showConfirmPassword, setShowConfirmPassword)}
          />

          <button type="submit" disabled={loading} className="tv-btn-primary !mt-8 h-12 w-full text-sm">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Updating password…' : 'Update password'}
          </button>
        </form>
      </AuthLayout>
    );
  }

  if (error) {
    return (
      <AuthLayout
        title={isRecoveryLink ? 'That reset link didn’t work' : 'We couldn’t sign you in'}
        subtitle={error}
      >
        <button
          onClick={() =>
            navigate('/login', { state: isRecoveryLink ? { mode: 'forgot' } : undefined, replace: true })
          }
          className="tv-btn-primary h-12 w-full text-sm"
        >
          {isRecoveryLink ? 'Request a new reset link' : 'Go to sign in'}
        </button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Signing you in" subtitle="One moment while we confirm your account.">
      <div className="flex items-center gap-3 text-sm text-[#94A3B8]" role="status">
        <Loader2 className="h-5 w-5 animate-spin text-[#38BDF8]" />
        Verifying…
      </div>
    </AuthLayout>
  );
};

export default AuthCallback;

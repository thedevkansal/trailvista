import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { safeRedirectPath } from '../lib/authRedirect';
import GoogleSignInButton from '../components/GoogleSignInButton';
import AuthLayout, { AuthAlert, AuthField } from '../components/AuthLayout';
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(location.state?.message || null);
  const [mode, setMode] = useState(location.state?.mode || 'login'); // 'login' or 'forgot'
  const [successMessage, setSuccessMessage] = useState(null);

  const redirectPath = safeRedirectPath(location.state?.from);

  const switchMode = (next) => {
    setMode(next);
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Enter your email and password.');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      await login(email, password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      const errMsg = err.message || '';
      const lowerMsg = errMsg.toLowerCase();

      if (lowerMsg.includes('confirm') || lowerMsg.includes('verified') || lowerMsg.includes('verification')) {
        setError('Verify your email first. The link is in your inbox.');
      } else if (lowerMsg.includes('invalid') || lowerMsg.includes('credentials') || lowerMsg.includes('not found') || lowerMsg.includes('no user') || lowerMsg.includes('invalid_credentials')) {
        setError('That email and password don’t match an account.');
      } else {
        setError(errMsg || 'That email and password don’t match an account.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Enter the email you signed up with.');
      return;
    }

    try {
      setError(null);
      setSuccessMessage(null);
      setLoading(true);

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`
      });
      if (resetError) throw resetError;

      setSuccessMessage('If an account exists for this email, a reset link is on its way.');
    } catch (err) {
      setError(err.message || 'Couldn’t send the reset link. Try again in a minute.');
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'forgot') {
    return (
      <AuthLayout
        title="Reset your password"
        subtitle="We’ll email you a link to choose a new one."
        footer={
          <button
            type="button"
            onClick={() => switchMode('login')}
            className="inline-flex items-center gap-2 font-semibold text-white hover:text-[#38BDF8]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </button>
        }
      >
        <AuthAlert tone="success">{successMessage}</AuthAlert>
        <AuthAlert>{error}</AuthAlert>
        <form onSubmit={handleForgotPassword} className="space-y-6">
          <AuthField
            id="forgot-email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            placeholder="you@example.com"
            data-testid="forgot-email-input"
          />
          <button
            type="submit"
            disabled={loading}
            className="tv-btn-primary h-12 w-full text-sm"
            data-testid="forgot-submit-button"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Sending link…' : 'Send reset link'}
          </button>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to see your bookings and reserve your next departure."
      footer={
        <p>
          New to TrailVista?{' '}
          <Link
            to="/signup"
            state={{ from: redirectPath }}
            className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-[#38BDF8]"
          >
            Create an account
          </Link>
        </p>
      }
    >
      <AuthAlert tone="success">{successMessage}</AuthAlert>
      <AuthAlert>{error}</AuthAlert>

      <GoogleSignInButton redirectPath={redirectPath} onError={setError} />

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <AuthField
          id="login-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          placeholder="you@example.com"
          data-testid="login-email-input"
        />
        <AuthField
          id="login-password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          placeholder="Your password"
          data-testid="login-password-input"
          aside={
            <button
              type="button"
              onClick={() => switchMode('forgot')}
              className="text-sm text-[#94A3B8] hover:text-white"
            >
              Forgot password?
            </button>
          }
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#94A3B8] hover:bg-white/5 hover:text-white"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="tv-btn-primary !mt-8 h-12 w-full text-sm"
          data-testid="login-submit-button"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;

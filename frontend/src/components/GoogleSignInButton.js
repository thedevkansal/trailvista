import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const GoogleIcon = () => (
  <svg className="h-4.5 w-4.5" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

const GoogleSignInButton = ({ redirectPath = '/', label = 'Continue with Google', onError }) => {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      await signInWithGoogle(redirectPath);
      // The browser now navigates to Google; nothing else to do here.
    } catch (err) {
      setLoading(false);
      onError?.(err.message || 'Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full bg-white hover:bg-slate-100 text-[#0f172a] px-6 py-3 rounded-lg font-bold text-sm transition-all active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:active:scale-100"
        data-testid="google-sign-in"
      >
        <GoogleIcon />
        <span>{loading ? 'Redirecting to Google...' : label}</span>
      </button>
      <div className="flex items-center space-x-3 text-[10px] uppercase tracking-wider text-[#64748B] font-bold">
        <span className="h-px flex-1 bg-white/10" />
        <span>or use email</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
    </div>
  );
};

export default GoogleSignInButton;

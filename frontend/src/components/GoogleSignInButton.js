import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GoogleIcon = () => (
  <svg className="h-[18px] w-[18px] flex-shrink-0" viewBox="0 0 48 48" aria-hidden="true">
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
    <div className="space-y-6">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full h-12 inline-flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/30 text-white text-sm font-semibold disabled:opacity-60"
        data-testid="google-sign-in"
      >
        {loading ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : <GoogleIcon />}
        <span>{loading ? 'Opening Google…' : label}</span>
      </button>
      <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
        <span className="h-px flex-1 bg-white/10" />
        <span>or with email</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
    </div>
  );
};

export default GoogleSignInButton;

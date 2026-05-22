import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ShieldAlert } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    // Set a fallback timeout — if no session after 5 seconds, show error
    const timeout = setTimeout(() => {
      setError('Verification completed, but login session was not created. Please log in manually.');
    }, 5000);

    // Listen for auth state change (SIGNED_IN after code exchange)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        clearTimeout(timeout);
        navigate('/', { replace: true });
      }
    });

    // Check if session already exists, or explicitly exchange code if present
    const checkSession = async () => {
      try {
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        if (existingSession) {
          clearTimeout(timeout);
          navigate('/', { replace: true });
          return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
          const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
          if (exchangeData.session) {
            clearTimeout(timeout);
            navigate('/', { replace: true });
          }
        }
      } catch (err) {
        console.error('AuthCallback exchange error:', err);
      }
    };

    // Run check/exchange immediately
    checkSession();

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-[#020617] px-4">
      <div className="max-w-md w-full bg-[#071827] border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
        {error ? (
          <div className="space-y-4">
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
          <div className="space-y-4">
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

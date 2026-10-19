import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { rememberRedirect } from '../lib/authRedirect';

const AuthContext = createContext({});

const AUTH_EVENTS = new Set([
  'SIGNED_IN',
  'TOKEN_REFRESHED',
  'SIGNED_OUT',
  'USER_UPDATED',
  'PASSWORD_RECOVERY',
]);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const initialSessionResolved = useRef(false);
  // Id of the user whose profile we currently want; stale fetches are ignored.
  const activeUserId = useRef(null);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(() => {
    try {
      const pathname = window.location.pathname;
      const search = window.location.search;
      const hash = window.location.hash;
      return pathname.startsWith('/auth/callback') && 
        (search.includes('type=recovery') || hash.includes('type=recovery'));
    } catch (e) {
      return false;
    }
  });

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  };

  const clearUser = () => {
    activeUserId.current = null;
    setUser(null);
  };

  const syncProfileForSession = (authSession) => {
    if (!authSession?.user) {
      clearUser();
      return;
    }
    const userId = authSession.user.id;
    activeUserId.current = userId;
    // Show the signed-in user right away; the profile fills in when it loads.
    setUser((prev) => ({
      ...authSession.user,
      profile: prev?.id === userId ? prev.profile : null,
    }));
    fetchProfile(userId).then((profile) => {
      // A logout or account switch may have happened while this was in flight.
      if (activeUserId.current !== userId) return;
      setUser({ ...authSession.user, profile: profile ?? null });
    });
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!isMounted) return;

        setSession(initialSession);
        syncProfileForSession(initialSession);
      } catch (err) {
        console.error('Session initialization error:', err);
      } finally {
        if (isMounted) {
          initialSessionResolved.current = true;
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, authSession) => {
      if (!isMounted) return;
      if (!AUTH_EVENTS.has(event)) return;

      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true);
        setSession(authSession);
        clearUser();
        setLoading(false);
        return;
      }

      if (event === 'SIGNED_OUT') {
        setSession(null);
        clearUser();
        setIsPasswordRecovery(false);
        setLoading(false);
        return;
      }

      if (!initialSessionResolved.current && event !== 'SIGNED_IN') {
        return;
      }

      setSession(authSession);
      if (authSession?.user) {
        setIsPasswordRecovery(false);
        syncProfileForSession(authSession);
      } else {
        clearUser();
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const syncSession = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      throw new Error('Failed to establish a login session. Please try again.');
    }
    setSession(sessionData.session);
    syncProfileForSession(sessionData.session);
    return sessionData.session;
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    await syncSession();
    return data;
  };

  const signup = async (email, password, profileDetails) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: profileDetails.fullName,
          phone: profileDetails.phone,
          city: profileDetails.city,
          age: profileDetails.age ? Number(profileDetails.age) : null,
          travel_style: profileDetails.travelStyle,
        },
      },
    });

    if (error) {
      const errMsg = error.message || '';
      if (error.status === 429 || errMsg.toLowerCase().includes('rate limit')) {
        throw new Error('Too many signup attempts. Please wait a few minutes before trying again.');
      }
      if (errMsg.toLowerCase().includes('already registered') || errMsg.toLowerCase().includes('already exists')) {
        throw new Error('Account already exists. Please log in.');
      }
      throw new Error(error.message || 'Failed to sign up.');
    }

    // The profiles row is created by the on_auth_user_created trigger
    // (supabase/migrations/005_profiles.sql) from the metadata above.
    return data;
  };

  const signInWithGoogle = async (redirectPath = '/') => {
    rememberRedirect(redirectPath);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user: isPasswordRecovery ? null : user,
    session,
    loading,
    login,
    syncSession,
    signup,
    signInWithGoogle,
    logout,
    isPasswordRecovery,
    setIsPasswordRecovery,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

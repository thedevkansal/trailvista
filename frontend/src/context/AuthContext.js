import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

const AUTH_EVENTS = new Set([
  'SIGNED_IN',
  'TOKEN_REFRESHED',
  'SIGNED_OUT',
  'USER_UPDATED',
]);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const initialSessionResolved = useRef(false);

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  };

  const applyUserFromSession = (authSession, profile) => {
    if (!authSession?.user) {
      setUser(null);
      return;
    }
    setUser({ ...authSession.user, profile: profile ?? null });
  };

  const syncProfileForSession = (authSession) => {
    if (!authSession?.user) {
      setUser(null);
      return;
    }
    const userId = authSession.user.id;
    fetchProfile(userId).then((profile) => {
      applyUserFromSession(authSession, profile);
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
        if (initialSession?.user) {
          syncProfileForSession(initialSession);
        } else {
          setUser(null);
        }
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

      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }

      if (!initialSessionResolved.current && event !== 'SIGNED_IN') {
        return;
      }

      setSession(authSession);
      if (authSession?.user) {
        setUser((prev) => ({
          ...authSession.user,
          profile: prev?.id === authSession.user.id ? prev.profile : null,
        }));
        syncProfileForSession(authSession);
      } else {
        setUser(null);
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
        throw new Error('This email is already registered. Please log in instead.');
      }
      throw new Error(error.message || 'Failed to sign up.');
    }

    if (data?.user && (!data.user.identities || data.user.identities.length === 0)) {
      throw new Error('This email is already registered. Please log in instead.');
    }

    if (data?.session && data?.user?.id) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(
          {
            id: data.user.id,
            full_name: profileDetails.fullName,
            phone: profileDetails.phone,
            city: profileDetails.city,
            age: profileDetails.age ? Number(profileDetails.age) : null,
            travel_style: profileDetails.travelStyle,
          },
          { onConflict: 'id' }
        );

      if (profileError) {
        console.error('Error upserting profile client-side:', profileError);
        throw new Error(profileError.message || 'Failed to create user profile.');
      }
    }
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    session,
    loading,
    login,
    syncSession,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

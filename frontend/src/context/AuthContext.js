import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch profile
  const fetchProfile = async (userId) => {
    try {
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
    } catch (err) {
      console.error('Profile fetch error:', err);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (!isMounted) return;
        setSession(session);
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          if (isMounted) {
            setUser({ ...session.user, profile });
          }
        } else {
          if (isMounted) {
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Session initialization error:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      // Only act on meaningful events
      if (event === 'INITIAL_SESSION') {
        // Already handled by initializeAuth above; only update if initializeAuth hasn't finished
        if (loading) return;
      }

      setSession(session);
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        if (isMounted) {
          setUser({ ...session.user, profile });
        }
      } else {
        if (isMounted) {
          setUser(null);
        }
      }
      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    let data, error;
    try {
      ({ data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      }));
    } catch (fetchErr) {
      // Safety net: if the body-stream interceptor error leaks through,
      // re-throw as a generic invalid credentials error
      const msg = (fetchErr?.message || '').toLowerCase();
      if (msg.includes('body stream') || msg.includes('already read') || msg.includes('failed to execute')) {
        throw new Error('Invalid login credentials');
      }
      throw fetchErr;
    }
    if (error) throw error;

    // Confirm session exists and update AuthContext state
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      throw new Error('Failed to establish a login session. Please try again.');
    }

    setSession(sessionData.session);
    if (sessionData.session?.user) {
      const profile = await fetchProfile(sessionData.session.user.id);
      setUser({ ...sessionData.session.user, profile });
    }

    return data;
  };

  const signup = async (email, password, profileDetails) => {
    let data, error;
    try {
      ({ data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: profileDetails.fullName,
            phone: profileDetails.phone,
            city: profileDetails.city,
            age: profileDetails.age ? Number(profileDetails.age) : null,
            travel_style: profileDetails.travelStyle
          }
        }
      }));
    } catch (fetchErr) {
      // Safety net: if the body-stream interceptor error leaks through,
      // re-throw as a rate limit message (most common cause of 429/body stream errors)
      const msg = (fetchErr?.message || '').toLowerCase();
      if (msg.includes('body stream') || msg.includes('already read') || msg.includes('failed to execute')) {
        throw new Error('Too many signup attempts. Please wait a few minutes before trying again.');
      }
      throw fetchErr;
    }
    
    if (error) {
      const errMsg = error.message || '';
      if (error.status === 429 || errMsg.toLowerCase().includes('rate limit')) {
        throw new Error('Too many signup attempts. Please wait a few minutes before trying again.');
      } else if (errMsg.toLowerCase().includes('already registered') || errMsg.toLowerCase().includes('already exists')) {
        throw new Error('This email is already registered. Please log in instead.');
      } else {
        throw new Error(error.message || 'Failed to sign up.');
      }
    }

    if (data?.user && (!data.user.identities || data.user.identities.length === 0)) {
      throw new Error('This email is already registered. Please log in instead.');
    }

    // Only upsert profile client-side if a session is present (email confirmation disabled).
    // If no session exists, the server-side Postgres trigger handles the profile insertion automatically.
    if (data?.session && data?.user?.id) {
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: data.user.id,
          full_name: profileDetails.fullName,
          phone: profileDetails.phone,
          city: profileDetails.city,
          age: profileDetails.age ? Number(profileDetails.age) : null,
          travel_style: profileDetails.travelStyle
        }, { onConflict: "id" });

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
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

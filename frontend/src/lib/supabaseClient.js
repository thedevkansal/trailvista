import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env variables. Restart dev server and check frontend/.env');
}

const nativeFetch = (...args) => {
  const fetchFn = window.__nativeFetch || window.fetch.bind(window);
  return fetchFn(...args);
};

const authOptions = {
  persistSession: true,
  autoRefreshToken: true,
  detectSessionInUrl: true,
  flowType: 'pkce',
  storage: window.localStorage,
};

let supabaseInstance;

if (window.__supabaseInstance) {
  supabaseInstance = window.__supabaseInstance;
} else {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: authOptions,
    global: {
      fetch: nativeFetch,
    },
  });
  window.__supabaseInstance = supabaseInstance;
}

export const supabase = supabaseInstance;

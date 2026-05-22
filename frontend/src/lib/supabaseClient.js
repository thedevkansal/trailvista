import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Supabase URL loaded:', !!supabaseUrl);
console.log('Supabase anon key loaded:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env variables. Restart dev server and check frontend/.env');
}

// Lazy initialization for clean fetch to bypass emergent-main.js interceptor
let iframeFetch = null;
const getCleanFetch = () => {
  if (iframeFetch) return iframeFetch;
  try {
    if (document.body) {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      iframeFetch = iframe.contentWindow.fetch.bind(iframe.contentWindow);
      // Keep iframe in DOM so context remains active, preventing fetch from freezing in Chrome
      return iframeFetch;
    }
  } catch (e) {
    console.warn('Iframe fetch fallback failed:', e);
  }
  return window.__nativeFetch || window.fetch.bind(window);
};

let supabaseInstance;

if (window.__supabaseInstance) {
  supabaseInstance = window.__supabaseInstance;
} else {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: window.localStorage
    },
    global: {
      fetch: (...args) => getCleanFetch()(...args)
    }
  });
  window.__supabaseInstance = supabaseInstance;
}

export const supabase = supabaseInstance;

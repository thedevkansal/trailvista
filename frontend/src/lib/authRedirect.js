// Where to send the user after an auth round-trip (OAuth, email links).
// Only same-site relative paths are allowed, to avoid open redirects.
const STORAGE_KEY = 'tv_auth_redirect';

export function safeRedirectPath(path) {
  if (typeof path !== 'string') return '/';
  if (!path.startsWith('/') || path.startsWith('//') || path.startsWith('/\\')) return '/';
  return path;
}

export function rememberRedirect(path) {
  try {
    sessionStorage.setItem(STORAGE_KEY, safeRedirectPath(path));
  } catch {
    // Storage blocked (private mode); the user lands on the home page instead.
  }
}

export function consumeRedirect() {
  try {
    const path = sessionStorage.getItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    return safeRedirectPath(path);
  } catch {
    return '/';
  }
}

export const displayName = (user) =>
  user?.profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Explorer';

export const initialsOf = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');

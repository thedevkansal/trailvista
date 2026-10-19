-- Pin keep_alive()'s search_path (Supabase advisor: function_search_path_mutable).
-- It only calls now(), which lives in pg_catalog and is always resolvable.
ALTER FUNCTION public.keep_alive() SET search_path = '';

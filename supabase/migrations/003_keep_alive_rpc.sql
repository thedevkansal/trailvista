-- Lightweight RPC for the Vercel keep-alive cron (frontend/api/keep-alive.js).
-- Runs a trivial query so the free-tier project registers activity, without
-- granting the anon role any access to real tables.

CREATE OR REPLACE FUNCTION public.keep_alive()
RETURNS timestamptz
LANGUAGE sql
STABLE
AS $$
  SELECT now();
$$;

REVOKE ALL ON FUNCTION public.keep_alive() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.keep_alive() TO anon, authenticated, service_role;

-- Make PostgREST pick up the new function immediately
NOTIFY pgrst, 'reload schema';

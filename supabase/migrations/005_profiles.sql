-- User profiles, created automatically for every new auth user (email or Google).
-- Safe to run on a project where public.profiles already exists.

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS age integer;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS travel_style text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Google sign-ins have no phone/city/age, and older profiles tables made some of
-- these NOT NULL, which would make the signup trigger fail. Keep them optional.
ALTER TABLE public.profiles ALTER COLUMN full_name DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN phone DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN city DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN age DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN travel_style DROP NOT NULL;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies from the original dashboard setup (granted to every role, incl. INSERT).
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can select their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- Rows are only inserted by the trigger below, never by clients.
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

REVOKE ALL ON public.profiles FROM anon, authenticated;
GRANT SELECT, UPDATE (full_name, phone, city, age, travel_style, updated_at)
  ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO service_role;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  meta jsonb := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, city, age, travel_style)
  VALUES (
    NEW.id,
    COALESCE(meta ->> 'full_name', meta ->> 'name'),
    meta ->> 'phone',
    meta ->> 'city',
    CASE WHEN (meta ->> 'age') ~ '^[0-9]{1,3}$' THEN (meta ->> 'age')::integer END,
    meta ->> 'travel_style'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Only the trigger should run this; don't expose it as an RPC.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill profiles for users who signed up before this trigger existed.
INSERT INTO public.profiles (id, full_name)
SELECT u.id, COALESCE(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name')
FROM auth.users u
ON CONFLICT (id) DO NOTHING;

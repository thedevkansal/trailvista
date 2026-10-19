-- Contact form and trek enquiries, written only by the backend (service role).

CREATE TABLE IF NOT EXISTS public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL CHECK (source IN ('contact', 'trek')),
  name text NOT NULL CHECK (char_length(name) <= 100),
  email text NOT NULL CHECK (char_length(email) <= 320),
  phone text NOT NULL CHECK (char_length(phone) <= 20),
  subject text,
  trek_name text,
  travel_month text,
  group_size integer CHECK (group_size BETWEEN 1 AND 50),
  message text CHECK (char_length(message) <= 2000),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed'))
);

CREATE INDEX IF NOT EXISTS enquiries_created_at_idx ON public.enquiries (created_at DESC);

-- RLS on with no policies: anon/authenticated can't read or write; the backend
-- uses the service role, which bypasses RLS but still needs table privileges.
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.enquiries FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enquiries TO service_role;

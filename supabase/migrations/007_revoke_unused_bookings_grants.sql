-- Clients never need TRUNCATE/REFERENCES/TRIGGER on bookings (RLS doesn't
-- cover TRUNCATE). The backend uses service_role, whose grants are unchanged.
REVOKE TRUNCATE, REFERENCES, TRIGGER ON public.bookings FROM anon, authenticated;

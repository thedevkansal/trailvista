-- Store the departure batch the customer selected at checkout.
-- Nullable so existing bookings (created before this column) stay valid.
-- Apply this before deploying the backend that writes departure_date.

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS departure_date date;

-- Make PostgREST pick up the new column immediately
NOTIFY pgrst, 'reload schema';

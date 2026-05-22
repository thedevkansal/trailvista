create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  trek_id text not null,
  amount numeric not null,
  currency text not null default 'INR',
  razorpay_order_id text,
  razorpay_payment_id text unique,
  payment_status text not null default 'pending',
  booking_status text not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists bookings_user_id_idx on public.bookings (user_id);

alter table public.bookings enable row level security;

create policy "Users can view own bookings"
  on public.bookings
  for select
  using (auth.uid() = user_id);

-- Service role (backend) bypasses RLS for inserts

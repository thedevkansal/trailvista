import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Mountain, Clock, Loader2, LogOut, Receipt, Compass, User, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { treks } from '../data/treksData';
import { todayISO } from '../lib/departures';
import { displayName, initialsOf } from '../lib/user';

const TABS = [
  { id: 'bookings', label: 'My bookings', icon: Compass },
  { id: 'payments', label: 'Payments', icon: Receipt },
  { id: 'profile', label: 'Profile', icon: User },
];

const trekById = Object.fromEntries(treks.map((t) => [t.id, t]));

const formatDate = (iso, opts = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', opts) : null;

const formatMoney = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(
    Number(amount) || 0
  );

const daysUntil = (iso) => {
  const ms = new Date(iso).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
  return Math.round(ms / 86400000);
};

const STATUS_STYLES = {
  confirmed: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
  paid: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
  pending: 'bg-amber-400/10 text-amber-200 border-amber-400/20',
  cancelled: 'bg-red-400/10 text-red-300 border-red-400/20',
  failed: 'bg-red-400/10 text-red-300 border-red-400/20',
  refunded: 'bg-sky-400/10 text-sky-300 border-sky-400/20',
};

const StatusPill = ({ status }) => {
  const key = (status || 'pending').toLowerCase();
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
        STATUS_STYLES[key] || STATUS_STYLES.pending
      }`}
    >
      {key}
    </span>
  );
};

/* ---------------- Bookings ---------------- */

const BookingCard = ({ booking, past }) => {
  const trek = trekById[booking.trek_id];
  const name = trek?.name || booking.trek_id;
  const days = booking.departure_date ? daysUntil(booking.departure_date) : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group grid grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-[#071827] sm:grid-cols-[220px_minmax(0,1fr)] ${
        past ? 'opacity-80' : ''
      }`}
    >
      <div className="relative h-40 overflow-hidden sm:h-full">
        {trek?.image && (
          <img
            src={trek.image}
            alt={name}
            className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
              past ? 'grayscale-[40%]' : ''
            }`}
          />
        )}
        {!past && days !== null && days >= 0 && (
          <span className="tv-cinematic absolute left-3 top-3 rounded-full bg-[#020617]/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            {days === 0 ? 'Departs today' : days === 1 ? 'Departs tomorrow' : `In ${days} days`}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-medium text-white">{name}</h3>
            {trek && <p className="mt-1 text-sm text-[#94A3B8]">{trek.location}</p>}
          </div>
          <StatusPill status={booking.booking_status} />
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="flex items-center gap-1.5 text-[#94A3B8]">
              <CalendarDays className="h-3.5 w-3.5" /> Departure
            </dt>
            <dd className="mt-0.5 font-semibold text-white">
              {formatDate(booking.departure_date) || 'Date to be confirmed'}
            </dd>
          </div>
          {trek && (
            <div>
              <dt className="flex items-center gap-1.5 text-[#94A3B8]">
                <Clock className="h-3.5 w-3.5" /> Duration
              </dt>
              <dd className="mt-0.5 font-semibold text-white">{trek.duration}</dd>
            </div>
          )}
          {trek && (
            <div>
              <dt className="flex items-center gap-1.5 text-[#94A3B8]">
                <Mountain className="h-3.5 w-3.5" /> Highest point
              </dt>
              <dd className="mt-0.5 font-semibold text-white">{trek.maxAltitude}</dd>
            </div>
          )}
        </dl>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-sm">
          <p className="text-[#94A3B8]">
            Booking <span className="tv-num font-semibold text-white">{booking.id.slice(0, 8).toUpperCase()}</span>
            <span className="mx-2 text-white/20">/</span>
            <span className="tv-num font-semibold text-white">{formatMoney(booking.amount, booking.currency)}</span>
          </p>
          {trek && (
            <Link to={`/trek/${trek.id}`} className="font-semibold text-white hover:text-[#38BDF8]">
              {past ? 'Book again' : 'Trek details'}
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
};

const EmptyBookings = ({ past }) => {
  const suggestions = treks.slice(0, 3);
  return (
    <div className="rounded-3xl border border-dashed border-white/20 p-8 sm:p-10">
      <h3 className="font-display text-2xl font-medium text-white">
        {past ? 'No completed treks yet' : 'No upcoming treks'}
      </h3>
      <p className="mt-2 max-w-md text-[#94A3B8]">
        {past
          ? 'Treks you’ve finished will show up here after the departure date.'
          : 'When you book a departure it shows up here with its date, booking reference and payment.'}
      </p>
      {!past && (
        <>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {suggestions.map((t) => (
              <Link
                key={t.id}
                to={`/trek/${t.id}`}
                className="tv-cinematic group relative block h-40 overflow-hidden rounded-2xl"
              >
                <img src={t.image} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-[#020617]/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-white/70">{t.duration}, from ₹{t.price.toLocaleString('en-IN')}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link to="/treks" className="tv-btn-primary mt-8 h-11 px-6 text-sm">
            Browse all treks
          </Link>
        </>
      )}
    </div>
  );
};

const BookingsTab = ({ bookings }) => {
  const [view, setView] = useState('upcoming');
  const today = todayISO();
  const upcoming = bookings
    .filter((b) => !b.departure_date || b.departure_date >= today)
    .sort((a, b) => (a.departure_date || '9999').localeCompare(b.departure_date || '9999'));
  const past = bookings
    .filter((b) => b.departure_date && b.departure_date < today)
    .sort((a, b) => b.departure_date.localeCompare(a.departure_date));
  const list = view === 'upcoming' ? upcoming : past;

  return (
    <div>
      <div className="mb-6 inline-flex rounded-full border border-white/10 p-1">
        {[
          ['upcoming', `Upcoming (${upcoming.length})`],
          ['past', `Completed (${past.length})`],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setView(id)}
            aria-pressed={view === id}
            className={`relative rounded-full px-4 py-2 text-sm font-semibold ${
              view === id ? 'text-[#020617]' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            {view === id && (
              <motion.span
                layoutId="booking-view-pill"
                className="absolute inset-0 rounded-full bg-white"
                transition={{ type: 'spring', stiffness: 400, damping: 34 }}
              />
            )}
            <span className="relative">{label}</span>
          </button>
        ))}
      </div>

      <div key={view} className="space-y-5">
        {list.length === 0 ? (
          <EmptyBookings past={view === 'past'} />
        ) : (
          list.map((b) => <BookingCard key={b.id} booking={b} past={view === 'past'} />)
        )}
      </div>
    </div>
  );
};

/* ---------------- Payments ---------------- */

const PaymentsTab = ({ bookings }) => {
  const paid = bookings.filter((b) => (b.payment_status || '').toLowerCase() === 'paid');
  const total = paid.reduce((sum, b) => sum + Number(b.amount || 0), 0);
  const rows = [...bookings].sort((a, b) => b.created_at.localeCompare(a.created_at));

  if (rows.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/20 p-8 sm:p-10">
        <h3 className="font-display text-2xl font-medium text-white">No payments yet</h3>
        <p className="mt-2 max-w-md text-[#94A3B8]">
          Every payment you make through Razorpay is listed here with its reference, so you always have a receipt to hand.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 grid grid-cols-2 gap-4 sm:max-w-md">
        <div className="rounded-2xl border border-white/10 bg-[#071827] p-5">
          <p className="text-sm text-[#94A3B8]">Total paid</p>
          <p className="tv-num mt-1 font-display text-3xl font-medium text-white">{formatMoney(total)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#071827] p-5">
          <p className="text-sm text-[#94A3B8]">Payments</p>
          <p className="tv-num mt-1 font-display text-3xl font-medium text-white">{paid.length}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10">
        <div className="hidden grid-cols-[1.1fr_1.6fr_1fr_1.4fr_0.8fr] gap-4 border-b border-white/10 bg-white/[0.02] px-6 py-3 text-xs font-semibold text-[#94A3B8] md:grid">
          <span>Date</span>
          <span>Trek</span>
          <span className="text-right">Amount</span>
          <span>Payment reference</span>
          <span>Status</span>
        </div>
        <ul className="divide-y divide-white/10">
          {rows.map((b) => (
            <li
              key={b.id}
              className="grid grid-cols-2 gap-x-4 gap-y-1 px-5 py-4 text-sm md:grid-cols-[1.1fr_1.6fr_1fr_1.4fr_0.8fr] md:items-center md:px-6"
            >
              <span className="text-[#94A3B8] md:text-white">{formatDate(b.created_at)}</span>
              <span className="text-right font-semibold text-white md:order-none md:text-left">
                {trekById[b.trek_id]?.name || b.trek_id}
              </span>
              <span className="tv-num font-semibold text-white md:text-right">{formatMoney(b.amount, b.currency)}</span>
              <span className="tv-num truncate text-right text-xs text-[#94A3B8] md:text-left">
                {b.razorpay_payment_id || '—'}
              </span>
              <span className="col-span-2 md:col-span-1">
                <StatusPill status={b.payment_status} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/* ---------------- Profile ---------------- */

const ProfileField = ({ label, id, children }) => (
  <div>
    <label htmlFor={id} className="mb-2 block text-sm font-medium text-white">
      {label}
    </label>
    {children}
  </div>
);

const inputClass =
  'h-12 w-full rounded-xl border border-white/10 bg-[#071827] px-4 text-[15px] text-white placeholder:text-[#94A3B8]/60 hover:border-white/20 disabled:opacity-60';

const ProfileTab = ({ user, onSaved }) => {
  const p = user.profile || {};
  const [form, setForm] = useState({
    full_name: p.full_name || user.user_metadata?.full_name || '',
    phone: p.phone || '',
    city: p.city && p.city !== 'Not specified' ? p.city : '',
    age: p.age ?? '',
    travel_style: p.travel_style || '',
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // { tone, text }

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim()) {
      setStatus({ tone: 'error', text: 'Add your full name. Trek leaders use it on the permit list.' });
      return;
    }
    if (form.age !== '' && (Number.isNaN(Number(form.age)) || Number(form.age) <= 0)) {
      setStatus({ tone: 'error', text: 'Age must be a positive number.' });
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: form.full_name.trim(),
        phone: form.phone.trim() || null,
        city: form.city.trim() || null,
        age: form.age === '' ? null : Number(form.age),
        travel_style: form.travel_style || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);
    setSaving(false);
    if (error) {
      setStatus({ tone: 'error', text: 'Couldn’t save your profile. Check your connection and try again.' });
      return;
    }
    setStatus({ tone: 'success', text: 'Profile saved' });
    onSaved?.();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <ProfileField label="Full name" id="profile-name">
            <input id="profile-name" className={inputClass} value={form.full_name} onChange={set('full_name')} autoComplete="name" />
          </ProfileField>
        </div>
        <div className="sm:col-span-2">
          <ProfileField label="Email" id="profile-email">
            <input id="profile-email" className={inputClass} value={user.email || ''} disabled readOnly />
          </ProfileField>
          <p className="mt-2 text-xs text-[#94A3B8]">Booking confirmations go to this address.</p>
        </div>
        <ProfileField label="Phone" id="profile-phone">
          <input id="profile-phone" type="tel" className={inputClass} value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" autoComplete="tel" />
        </ProfileField>
        <ProfileField label="City" id="profile-city">
          <input id="profile-city" className={inputClass} value={form.city} onChange={set('city')} placeholder="Where you travel from" autoComplete="address-level2" />
        </ProfileField>
        <ProfileField label="Age" id="profile-age">
          <input id="profile-age" type="number" min="1" className={inputClass} value={form.age} onChange={set('age')} />
        </ProfileField>
        <ProfileField label="Travel style" id="profile-style">
          <select id="profile-style" className={`${inputClass} cursor-pointer`} value={form.travel_style} onChange={set('travel_style')}>
            <option value="">Not set</option>
            <option value="Beginner">First Himalayan trek</option>
            <option value="Adventure">Adventure</option>
            <option value="Family">With family</option>
            <option value="Solo">Solo</option>
            <option value="Premium">Premium comfort</option>
          </select>
        </ProfileField>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={saving} className="tv-btn-primary h-12 px-7 text-sm">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        <AnimatePresence>
          {status && (
            <motion.p
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              role={status.tone === 'error' ? 'alert' : 'status'}
              className={`flex items-center gap-1.5 text-sm ${status.tone === 'error' ? 'text-red-300' : 'text-emerald-300'}`}
            >
              {status.tone === 'success' && <Check className="h-4 w-4" />}
              {status.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
};

/* ---------------- Page ---------------- */

const Account = () => {
  const { user, loading: authLoading, logout, syncSession } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = TABS.some((t) => t.id === searchParams.get('tab')) ? searchParams.get('tab') : 'bookings';

  const [bookings, setBookings] = useState([]);
  const [bookingsState, setBookingsState] = useState('loading'); // loading | ready | error
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    let active = true;
    setBookingsState('loading');
    supabase
      .from('bookings')
      .select('id, trek_id, amount, currency, razorpay_payment_id, payment_status, booking_status, departure_date, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setBookingsState('error');
          return;
        }
        setBookings(data || []);
        setBookingsState('ready');
      });
    return () => {
      active = false;
    };
  }, [userId]);

  const name = displayName(user);
  const memberSince = useMemo(
    () => (user?.created_at ? formatDate(user.created_at, { month: 'long', year: 'numeric' }) : null),
    [user?.created_at]
  );

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617]">
        <Loader2 className="h-6 w-6 animate-spin text-[#94A3B8]" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace state={{ from: `/account?tab=${tab}` }} />;

  const upcomingCount = bookings.filter((b) => !b.departure_date || b.departure_date >= todayISO()).length;

  return (
    <div className="min-h-screen bg-[#020617] pb-24 pt-32 sm:pt-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F2A65A] to-[#38BDF8] font-display text-xl font-semibold text-[#020617] sm:h-20 sm:w-20 sm:text-2xl">
              {initialsOf(name)}
            </div>
            <div className="min-w-0">
              <h1 className="truncate font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">{name}</h1>
              <p className="mt-1 text-sm text-[#94A3B8]">
                {user.email}
                {memberSince && <span className="hidden sm:inline">, member since {memberSince}</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {bookingsState === 'ready' && (
              <p className="text-sm text-[#94A3B8]">
                <span className="tv-num font-semibold text-white">{upcomingCount}</span> upcoming{' '}
                {upcomingCount === 1 ? 'trek' : 'treks'}
              </p>
            )}
            <button
              type="button"
              onClick={async () => {
                await logout();
                navigate('/');
              }}
              className="tv-btn-ghost h-10 px-4 text-sm"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div role="tablist" aria-label="Account sections" className="mt-10 flex gap-1 overflow-x-auto border-b border-white/10 scrollbar-hide">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                role="tab"
                aria-selected={active}
                aria-controls={`panel-${id}`}
                id={`tab-${id}`}
                onClick={() => setSearchParams({ tab: id }, { replace: true })}
                className={`relative flex flex-shrink-0 items-center gap-2 px-4 pb-4 pt-2 text-sm font-semibold ${
                  active ? 'text-white' : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                {active && (
                  <motion.span
                    layoutId="account-tab-underline"
                    className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#F2A65A]"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <section id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className="pt-8">
          {tab === 'profile' ? (
            <ProfileTab user={user} onSaved={() => syncSession().catch(() => {})} />
          ) : bookingsState === 'loading' ? (
            <div className="space-y-5">
              {[0, 1].map((i) => (
                <div key={i} className="h-48 animate-pulse rounded-3xl bg-white/[0.04]" />
              ))}
            </div>
          ) : bookingsState === 'error' ? (
            <div className="rounded-3xl border border-red-400/20 bg-red-500/5 p-8 text-red-200">
              Couldn’t load your bookings. Refresh the page to try again.
            </div>
          ) : tab === 'payments' ? (
            <PaymentsTab bookings={bookings} />
          ) : (
            <BookingsTab bookings={bookings} />
          )}
        </section>
      </div>
    </div>
  );
};

export default Account;

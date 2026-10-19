import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { treks } from '../data/treksData';
import { nextDeparture } from '../lib/departures';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });

// The photo panel features a real upcoming departure so the screen says
// something true about the trips, not just "welcome back".
const featuredTrek = treks.find((t) => nextDeparture(t)) || treks[0];

const AuthLayout = ({ title, subtitle, children, footer }) => {
  const next = nextDeparture(featuredTrek);

  return (
    <div className="min-h-screen bg-[#020617] pt-24 lg:pt-0 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      {/* Photo panel */}
      <aside className="tv-cinematic tv-grain relative hidden lg:block lg:min-h-screen overflow-hidden">
        <img
          src={featuredTrek.image}
          alt={`${featuredTrek.name}, ${featuredTrek.location}`}
          className="tv-drift absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/35 to-[#020617]/50" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-r from-transparent to-[#020617]" />

        <div className="relative z-10 flex h-full flex-col justify-end p-12 xl:p-16 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md"
          >
            <p className="font-display text-4xl xl:text-5xl font-medium leading-[1.05] tracking-tight text-white">
              Your seat on the mountain is one sign-in away.
            </p>
            <Link
              to={`/trek/${featuredTrek.id}`}
              className="group mt-10 flex items-center gap-4 rounded-2xl border border-white/15 bg-white/[0.06] p-4 backdrop-blur-md hover:bg-white/[0.1]"
            >
              <img
                src={featuredTrek.image}
                alt=""
                className="h-14 w-14 flex-shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0">
                <p className="text-xs text-white/60">Next departure</p>
                <p className="truncate text-sm font-semibold text-white">
                  {featuredTrek.name}, {next ? formatDate(next) : featuredTrek.bestSeason}
                </p>
                <p className="text-xs text-white/60">
                  {featuredTrek.duration}, up to {featuredTrek.maxAltitude}
                </p>
              </div>
            </Link>
          </motion.div>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center px-5 pb-16 pt-6 sm:px-8 lg:min-h-screen lg:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[420px]"
        >
          <h1 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-[15px] leading-relaxed text-[#94A3B8]">{subtitle}</p>
          )}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 text-sm text-[#94A3B8]">{footer}</div>}
        </motion.div>
      </main>
    </div>
  );
};

export const AuthAlert = ({ tone = 'error', children }) => (
  <AnimatePresence initial={false}>
    {children && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="overflow-hidden"
        role={tone === 'error' ? 'alert' : 'status'}
      >
        <div
          className={`mb-6 flex items-start gap-3 rounded-2xl border p-4 text-sm ${
            tone === 'error'
              ? 'border-red-400/25 bg-red-500/10 text-red-300'
              : 'border-emerald-400/25 bg-emerald-500/10 text-emerald-300'
          }`}
        >
          {tone === 'error' ? (
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
          )}
          <span>{children}</span>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Label above, input below; optional trailing control (show password) and
// leading adornment (+91).
export const AuthField = ({ label, id, hint, trailing, leading, aside, ...inputProps }) => (
  <div>
    <div className="mb-2 flex items-baseline justify-between">
      <label htmlFor={id} className="text-sm font-medium text-white">
        {label}
      </label>
      {aside}
    </div>
    <div className="relative">
      {leading && (
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#94A3B8]">
          {leading}
        </span>
      )}
      <input
        id={id}
        className={`h-12 w-full rounded-xl border border-white/10 bg-[#071827] text-[15px] text-white placeholder:text-[#94A3B8]/60 hover:border-white/20 disabled:opacity-50 ${
          leading ? 'pl-14' : 'pl-4'
        } ${trailing ? 'pr-12' : 'pr-4'}`}
        {...inputProps}
      />
      {trailing && <div className="absolute right-2 top-1/2 -translate-y-1/2">{trailing}</div>}
    </div>
    {hint && <p className="mt-2 text-xs text-[#94A3B8]">{hint}</p>}
  </div>
);

export default AuthLayout;

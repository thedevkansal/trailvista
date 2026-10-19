import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock, Mountain, ArrowUpRight } from 'lucide-react';
import { nextDeparture } from '../lib/departures';

const DIFFICULTY_DOT = {
  Easy: 'bg-emerald-400',
  Moderate: 'bg-amber-300',
  Difficult: 'bg-rose-400',
};

/**
 * Photo-led trek card. The whole card is the link. Key facts are always
 * visible; on hover/focus the photo slowly pushes in and the summary and
 * call to action rise into place.
 */
const TrekCard = ({ trek, size = 'default' }) => {
  const next = nextDeparture(trek);
  const large = size === 'large';

  return (
    <Link
      to={`/trek/${trek.id}`}
      className={`tv-cinematic group relative block h-full overflow-hidden rounded-[28px] bg-[#071827] !outline-offset-4 ${
        large ? 'min-h-[440px] md:min-h-[600px]' : 'min-h-[420px]'
      }`}
      data-testid={`trek-card-${trek.id}`}
    >
      <img
        src={trek.image}
        alt={trek.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] group-focus-visible:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/35 to-transparent" />
      <div className="absolute inset-0 bg-[#020617]/0 transition-colors duration-700 group-hover:bg-[#020617]/20" />

      {/* Top row */}
      <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#020617]/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
          <span className={`h-1.5 w-1.5 rounded-full ${DIFFICULTY_DOT[trek.difficulty] || 'bg-sky-300'}`} />
          {trek.difficulty}
        </span>
        {trek.seatsLeft && trek.seatsLeft < 10 && (
          <span className="rounded-full bg-[#F2A65A] px-3 py-1.5 text-xs font-bold text-[#1A1208]">
            {trek.seatsLeft} seats left
          </span>
        )}
      </div>

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <p className="text-sm text-white/70">{trek.location}</p>
        <h3
          className={`mt-1 font-display font-medium leading-[1.05] tracking-tight text-white ${
            large ? 'text-3xl md:text-5xl' : 'text-[28px]'
          }`}
        >
          {trek.name}
        </h3>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-white/80">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-white/50" /> {trek.duration}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Mountain className="h-3.5 w-3.5 text-white/50" /> {trek.maxAltitude}
          </span>
          {next && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-white/50" />
              {new Date(next).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>

        {/* Revealed on hover */}
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <p className={`pt-4 text-sm leading-relaxed text-white/75 ${large ? 'max-w-md' : ''} line-clamp-2`}>
              {trek.shortDescription}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-end justify-between border-t border-white/15 pt-4">
          <p className="text-white">
            <span className="text-xs text-white/60">From </span>
            <span className="tv-num font-display text-2xl font-medium">₹{trek.price.toLocaleString('en-IN')}</span>
          </p>
          <span
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white/10 pl-4 pr-3 text-sm font-semibold text-white backdrop-blur-md transition-colors duration-300 group-hover:bg-[#F2A65A] group-hover:text-[#1A1208]"
            data-testid={`trek-view-details-${trek.id}`}
          >
            View trek
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TrekCard;

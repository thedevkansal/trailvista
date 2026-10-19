import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Star } from 'lucide-react';
import { treks } from '../data/treksData';
import { RevealHeading, EASE_OUT } from './motion';

const trekById = Object.fromEntries(treks.map((t) => [t.id, t]));
const inCategory = (id) => treks.filter((t) => t.category?.includes(id));

/* ------------------------------------------------------------------
   Season panels: five photo panels; the one you point at (or focus)
   opens wide to show what's in it.
------------------------------------------------------------------- */

const SEASONS = [
  { id: 'winter', title: 'Winter snow', blurb: 'Pine forests under fresh snow and summit pushes before sunrise.', image: 'brahmatal-trek', to: '/categories/winter' },
  { id: 'summer', title: 'Summer meadows', blurb: 'Alpine lakes, flower valleys and long green ridgelines.', image: 'kashmir-great-lakes-trek', to: '/categories/summer' },
  { id: 'beginner', title: 'First Himalayan trek', blurb: 'Gentle gradients and short days, built for your first time above 12,000 ft.', image: 'kuari-pass-trek', to: '/categories/beginner' },
  { id: 'high-altitude', title: 'Above 14,000 ft', blurb: 'High passes and glacial terrain for trekkers with a few climbs behind them.', image: 'bali-pass-trek', to: '/categories/high-altitude' },
  { id: 'expedition', title: 'Expeditions', blurb: 'Technical climbs to 20,000 ft with summit-day rope teams.', image: 'stok-kangri-expedition', to: '/expeditions' },
];

export const SeasonPanels = () => {
  const [active, setActive] = useState(0);

  return (
    <>
      {/* Desktop: expanding panels */}
      <div className="hidden h-[560px] gap-3 md:flex">
        {SEASONS.map((s, i) => {
          const list = inCategory(s.id);
          const open = active === i;
          return (
            <Link
              key={s.id}
              to={s.to}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="tv-cinematic group relative overflow-hidden rounded-[28px] transition-[flex-grow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ flexGrow: open ? 4.2 : 1, flexBasis: 0 }}
              aria-label={`${s.title}, ${list.length} treks`}
            >
              <img
                src={trekById[s.image]?.image}
                alt=""
                className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  open ? 'scale-100' : 'scale-110'
                }`}
              />
              <div
                className={`absolute inset-0 transition-colors duration-700 ${
                  open ? 'bg-gradient-to-t from-[#020617]/90 via-[#020617]/20 to-transparent' : 'bg-[#020617]/55'
                }`}
              />

              {/* Collapsed label */}
              <span
                className={`absolute bottom-8 left-1/2 origin-center -translate-x-1/2 whitespace-nowrap font-display text-lg font-medium text-white transition-opacity duration-300 [writing-mode:vertical-rl] rotate-180 ${
                  open ? 'opacity-0' : 'opacity-100 delay-200'
                }`}
              >
                {s.title}
              </span>

              {/* Open content */}
              <div
                className={`absolute inset-x-0 bottom-0 p-8 transition-all duration-500 ${
                  open ? 'translate-y-0 opacity-100 delay-200' : 'pointer-events-none translate-y-4 opacity-0'
                }`}
              >
                <p className="text-sm text-white/70">
                  <span className="tv-num">{list.length}</span> {list.length === 1 ? 'trek' : 'treks'}
                </p>
                <h3 className="mt-1 font-display text-4xl font-medium tracking-tight text-white">{s.title}</h3>
                <p className="mt-3 max-w-sm text-white/80">{s.blurb}</p>
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  {list.slice(0, 3).map((t) => (
                    <span key={t.id} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-md">
                      {t.name.replace(/ (Trek|Expedition)$/, '')}
                    </span>
                  ))}
                  <span className="ml-1 inline-flex items-center gap-1 text-sm font-semibold text-white">
                    See all <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Mobile: stacked rows */}
      <div className="space-y-3 md:hidden">
        {SEASONS.map((s) => {
          const list = inCategory(s.id);
          return (
            <Link key={s.id} to={s.to} className="tv-cinematic relative flex h-28 items-end overflow-hidden rounded-2xl p-5">
              <img src={trekById[s.image]?.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/85 to-[#020617]/20" />
              <div className="relative flex w-full items-end justify-between">
                <div>
                  <h3 className="font-display text-xl font-medium text-white">{s.title}</h3>
                  <p className="text-sm text-white/70">
                    {list.length} {list.length === 1 ? 'trek' : 'treks'}
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-white" />
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

/* ------------------------------------------------------------------
   Filmstrip: two rows of photographs that slide in opposite
   directions as you scroll past. Moves only when you do.
------------------------------------------------------------------- */

export const Filmstrip = ({ images }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xA = useTransform(scrollYProgress, [0, 1], ['2%', '-22%']);
  const xB = useTransform(scrollYProgress, [0, 1], ['-22%', '2%']);

  const half = Math.ceil(images.length / 2);
  const rows = [
    [...images.slice(0, half), ...images.slice(0, half)],
    [...images.slice(half), ...images.slice(half)],
  ];

  return (
    <div ref={ref} className="space-y-4 overflow-hidden">
      {rows.map((row, r) => (
        <motion.div key={r} style={reduce ? undefined : { x: r === 0 ? xA : xB }} className="flex w-max gap-4">
          {row.map((img, i) => (
            <figure
              key={`${r}-${i}`}
              className={`relative flex-shrink-0 overflow-hidden rounded-3xl ${
                (i + r) % 3 === 0 ? 'w-[72vw] sm:w-[440px]' : 'w-[56vw] sm:w-[320px]'
              } aspect-[4/3]`}
            >
              <img src={img.url} alt={img.description} loading="lazy" className="h-full w-full object-cover" />
            </figure>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------
   Review spotlight: one story at a time, chosen by the reader.
------------------------------------------------------------------- */

export const ReviewSpotlight = ({ reviews }) => {
  const [index, setIndex] = useState(0);
  const review = reviews[index];
  const go = (delta) => setIndex((i) => (i + delta + reviews.length) % reviews.length);

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-20">
      <div className="min-h-[300px]">
        <div className="mb-8 flex items-center gap-1" aria-label={`${review.rating} out of 5`}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < review.rating ? 'fill-[#F2A65A] text-[#F2A65A]' : 'text-white/20'}`}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.figure
            key={review.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
          >
            <blockquote className="font-display text-2xl font-medium leading-[1.25] tracking-tight text-white sm:text-3xl lg:text-[40px]">
              “{review.review}”
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4">
              <img src={review.image} alt="" className="h-12 w-12 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-white">{review.name}</p>
                <p className="text-sm text-[#94A3B8]">
                  {review.trek},{' '}
                  {new Date(review.date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="flex flex-col justify-between gap-8">
        <ul className="space-y-1" aria-label="Choose a review">
          {reviews.map((r, i) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-current={i === index}
                className={`flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-colors ${
                  i === index ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                }`}
              >
                <img
                  src={r.image}
                  alt=""
                  className={`h-9 w-9 rounded-full object-cover transition ${i === index ? '' : 'opacity-50 grayscale'}`}
                />
                <span className="min-w-0">
                  <span className={`block truncate text-sm font-semibold ${i === index ? 'text-white' : 'text-[#94A3B8]'}`}>
                    {r.name}
                  </span>
                  <span className="block truncate text-xs text-[#94A3B8]">{r.trek}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <button type="button" onClick={() => go(-1)} aria-label="Previous review" className="tv-btn-ghost h-11 w-11">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next review" className="tv-btn-ghost h-11 w-11">
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* Split section header: title on the left, supporting line and link on the right. */
export const SectionHeader = ({ lines, children, className = '' }) => (
  <div className={`mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-12 ${className}`}>
    <RevealHeading
      lines={lines}
      className="font-display text-4xl font-medium leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl"
    />
    {children && <div className="max-w-sm text-[#94A3B8] md:pb-2">{children}</div>}
  </div>
);

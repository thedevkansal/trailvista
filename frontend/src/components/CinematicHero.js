import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, MapPin } from 'lucide-react';

/**
 * CinematicHero
 * Editorial expedition hero with layered typography and parallax depth.
 */
const CinematicHero = ({
  word1 = 'CLIMB',
  word2 = 'BEYOND',
  word3 = 'LIMITS',
  subtitle = 'HIMALAYAN EXPEDITIONS · 2026',
  description = 'Fixed departures. Certified leaders. Safety-first Himalayan expeditions for adventurers above the ordinary.',
  backgroundImage = 'https://images.unsplash.com/photo-1629976791862-5749e12b2f40?crop=entropy&cs=srgb&fm=jpg&q=85&w=2400',
  ctaPrimary = 'Explore Treks',
  ctaSecondary = 'Plan Custom Trip',
  onPrimaryClick,
  onSecondaryClick,
}) => {
  const ref = useRef(null);
  const { scrollY } = useScroll();

  // Parallax for depth
  const bgY = useTransform(scrollY, [0, 800], [0, 180]);
  const bgScale = useTransform(scrollY, [0, 800], [1, 1.1]);
  const textY = useTransform(scrollY, [0, 800], [0, -60]);
  const opacityHero = useTransform(scrollY, [0, 600], [1, 0.15]);

  return (
    <section
      ref={ref}
      className="tv-hero-zone relative w-full h-screen min-h-[760px] overflow-hidden bg-[#020617]"
      data-testid="cinematic-hero"
    >
      {/* Layer 1: Background image with parallax */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 z-0"
      >
        <img
          src={backgroundImage}
          alt="Himalayan mountains"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Cinematic vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/30 to-[#020617]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/50 via-transparent to-[#020617]/30" />
        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{
          backgroundImage: 'url("data:image/svg+xml;utf8,<svg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>")',
        }} />
      </motion.div>

      {/* Layer 2: Massive layered editorial typography */}
      <motion.div
        style={{ y: textY, opacity: opacityHero }}
        className="absolute inset-0 z-10 pointer-events-none"
      >
        <div className="relative w-full h-full max-w-[1700px] mx-auto px-4 sm:px-8">
          {/* Top-left: Solid white */}
          <motion.span
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="hero-text absolute top-[16%] left-[2%] sm:left-[4%] text-white font-black uppercase leading-[0.82] text-[20vw] sm:text-[16vw] lg:text-[14vw] select-none"
            style={{ textShadow: '0 8px 60px rgba(2,6,23,0.7)' }}
          >
            {word1}
          </motion.span>

          {/* Middle-center-right: Outline */}
          <motion.span
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="hero-text absolute top-[40%] right-[3%] sm:right-[5%] font-black uppercase leading-[0.82] text-[20vw] sm:text-[16vw] lg:text-[14vw] hero-text-outline select-none"
          >
            {word2}
          </motion.span>

          {/* Bottom-right: LIMITS - Glacier accent on first letter (moved from left to avoid CTA overlap) */}
          <motion.span
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hero-text absolute bottom-[10%] right-[3%] sm:right-[5%] text-white font-black uppercase leading-[0.82] text-[20vw] sm:text-[16vw] lg:text-[13vw] select-none"
            style={{ textShadow: '0 8px 60px rgba(2,6,23,0.7)' }}
          >
            <span className="text-[#38BDF8]">L</span>{word3.slice(1)}
          </motion.span>
        </div>
      </motion.div>

      {/* Layer 3: Editorial overlay content (top tagline, side details, CTA) */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-8 h-full relative">
          {/* Top tagline */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute top-[10%] left-[2%] sm:left-[4%] flex items-center space-x-3"
          >
            <span className="block h-px w-12 bg-[#38BDF8]" />
            <p className="text-[#BAE6FD] text-xs sm:text-sm uppercase tracking-[0.3em] font-bold">
              {subtitle}
            </p>
          </motion.div>

          {/* Top-right location pill */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="hidden md:flex absolute top-[10%] right-[2%] sm:right-[4%] items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20"
          >
            <MapPin className="h-3.5 w-3.5 text-[#38BDF8]" />
            <span className="text-white text-xs font-semibold tracking-wide">HIMALAYA · 6000M+</span>
          </motion.div>

          {/* Right side vertical poetic line (desktop only) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="hidden lg:block absolute top-[26%] right-[3%]"
          >
            <p className="text-white/80 text-sm leading-relaxed font-light max-w-[200px] text-right">
              The mountains call<br />for those who dare<br />to answer.
            </p>
          </motion.div>

          {/* Bottom-left description + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="absolute bottom-[10%] left-[2%] sm:left-[4%] max-w-md pointer-events-auto"
          >
            <p className="text-white/85 text-sm sm:text-base leading-relaxed mb-5 font-light hidden md:block">
              {description}
            </p>
            <div className="flex flex-wrap gap-3">
              {ctaPrimary && (
                <button
                  onClick={onPrimaryClick}
                  className="bg-[#F97316] hover:bg-[#ea580c] text-white px-7 py-3.5 rounded-full text-sm font-bold tracking-wide transition-all active:scale-95 shadow-[0_0_40px_-10px_#F97316]"
                  data-testid="hero-primary-cta"
                >
                  {ctaPrimary} →
                </button>
              )}
              {ctaSecondary && (
                <button
                  onClick={onSecondaryClick}
                  className="border border-white/30 hover:border-white text-white px-7 py-3.5 rounded-full text-sm font-bold tracking-wide transition-all active:scale-95 backdrop-blur-md bg-white/5"
                  data-testid="hero-secondary-cta"
                >
                  {ctaSecondary}
                </button>
              )}
            </div>
          </motion.div>

          {/* Bottom-right scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="absolute bottom-[10%] right-[2%] sm:right-[4%] flex flex-col items-center"
          >
            <p className="text-white/60 text-[10px] uppercase tracking-[0.3em] font-bold mb-3 [writing-mode:vertical-rl] rotate-180">
              Scroll
            </p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <ArrowDown className="h-4 w-4 text-white/70" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CinematicHero;

import React from 'react';
import { RevealHeading, FadeIn } from './motion';

/**
 * Opening header for inner pages: a large sentence-case title that rises in
 * on load, with an optional supporting paragraph beside it on wide screens.
 * Pass the title as `lines` so the break points are deliberate.
 */
const PageHeader = ({ lines, children, className = '' }) => (
  <header
    className={`mb-12 grid grid-cols-1 gap-6 md:mb-16 lg:grid-cols-12 lg:items-end lg:gap-16 ${className}`}
  >
    <RevealHeading
      as="h1"
      lines={lines}
      className="font-display text-[44px] font-medium leading-[1] tracking-tight text-white sm:text-6xl lg:col-span-7 lg:text-7xl"
    />
    {children && (
      <FadeIn delay={0.2} className="text-lg leading-relaxed text-[#94A3B8] lg:col-span-5 lg:pb-2">
        {children}
      </FadeIn>
    )}
  </header>
);

export default PageHeader;

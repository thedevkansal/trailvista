import React from 'react';
import PageHeader from './PageHeader';
import { FadeIn } from './motion';

/**
 * Long-form policy page: a page title, then numbered sections in a single
 * reading column, with an optional note at the end.
 */
const LegalPage = ({ lines, intro, updated, sections, children }) => (
  <div className="min-h-screen pt-32 pb-24 bg-[#020617] text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader lines={lines}>
        <p>{intro}</p>
        {updated && <p className="mt-2 text-sm">Last updated {updated}</p>}
      </PageHeader>

      <div className="max-w-3xl lg:ml-auto lg:mr-[8.333%]">
        <ol className="border-t border-white/10">
          {sections.map((section, idx) => (
            <FadeIn
              as="li"
              key={section.title}
              delay={0.04 * idx}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 border-b border-white/10 py-8 sm:grid-cols-[3.5rem_minmax(0,1fr)]"
            >
              <span className="tv-num pt-1 font-display text-sm font-medium text-[#94A3B8]">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div>
                <h2 className="font-display text-2xl font-medium tracking-tight text-white">{section.title}</h2>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-[#94A3B8]">{section.content}</p>
              </div>
            </FadeIn>
          ))}
        </ol>
        {children && <div className="mt-10 text-sm text-[#94A3B8]">{children}</div>}
      </div>
    </div>
  </div>
);

export default LegalPage;

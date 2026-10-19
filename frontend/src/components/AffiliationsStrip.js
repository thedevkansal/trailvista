import React from 'react';
import Marquee from 'react-fast-marquee';

/**
 * AffiliationsStrip
 * Real logos served from /public/logos/ — no text fallbacks.
 *  - Affiliations: glass cards, full-color logos, consistent 80px height
 *  - Corporate Partners: grayscale marquee, consistent 48px height, hover restores color
 */

const affiliations = [
  {
    name: 'Indian Mountaineering Foundation',
    sub: 'Apex National Body',
    src: '/logos/affiliations/imf.jpg'
  },
  {
    name: 'Uttarakhand Tourism',
    sub: 'Govt. of Uttarakhand',
    src: '/logos/affiliations/uttarakhand-tourism.svg'
  },
  {
    name: 'Adventure Tour Operators Association',
    sub: 'ATOAI Member',
    src: '/logos/affiliations/atoai.png'
  },
  {
    name: 'Incredible India',
    sub: 'Ministry of Tourism',
    src: '/logos/affiliations/incredible-india.svg'
  }
];

const corporates = [
  { name: 'Google', src: '/logos/corporates/google.svg' },
  { name: 'Microsoft', src: '/logos/corporates/microsoft.svg' },
  { name: 'Amazon', src: '/logos/corporates/amazon.svg' },
  { name: 'Apple', src: '/logos/corporates/apple.svg' },
  { name: 'Meta', src: '/logos/corporates/meta.svg' },
  { name: 'Netflix', src: '/logos/corporates/netflix.svg' },
  { name: 'IBM', src: '/logos/corporates/ibm.svg' },
  { name: 'Oracle', src: '/logos/corporates/oracle.svg' },
  { name: 'Intel', src: '/logos/corporates/intel.svg' },
  { name: 'Salesforce', src: '/logos/corporates/salesforce.svg' },
  { name: 'Adobe', src: '/logos/corporates/adobe.svg' },
  { name: 'Samsung', src: '/logos/corporates/samsung.svg' },
  { name: 'Sony', src: '/logos/corporates/sony.svg' },
  { name: 'Infosys', src: '/logos/corporates/infosys.svg' },
  { name: 'TCS', src: '/logos/corporates/tcs.svg' },
  { name: 'Wipro', src: '/logos/corporates/wipro.svg' },
  { name: 'Accenture', src: '/logos/corporates/accenture.svg' },
  { name: 'Deloitte', src: '/logos/corporates/deloitte.svg' },
  { name: 'Flipkart', src: '/logos/corporates/flipkart.svg' },
  { name: 'Zomato', src: '/logos/corporates/zomato.svg' }
];

const AffiliationsStrip = ({ showHeader = true, compact = false }) => {
  return (
    <section className={compact ? 'py-16' : 'py-20 sm:py-28'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
              Registered and recognised
            </h2>
            <p className="max-w-sm text-[#94A3B8]">The bodies that license and audit how we run treks.</p>
          </div>
        )}

        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {affiliations.map((aff) => (
            <li key={aff.name} className="flex items-center gap-4 bg-[#020617] p-5">
              <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-white p-2">
                <img src={aff.src} alt="" className="max-h-full max-w-full object-contain" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold leading-snug text-white">{aff.name}</span>
                <span className="mt-0.5 block text-xs text-[#94A3B8]">{aff.sub}</span>
              </span>
            </li>
          ))}
        </ul>

        {/* Corporate groups */}
        <div className="mt-20 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h3 className="font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
            Teams that have trekked with us
          </h3>
          <p className="text-[#94A3B8]">500+ company offsites across India and beyond.</p>
        </div>

        <div className="relative mt-8 overflow-hidden border-y border-white/10 py-8 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <Marquee gradient={false} speed={32} pauseOnHover>
            {corporates.map((c) => (
              <div key={c.name} className="mx-10 flex h-10 w-28 items-center justify-center" title={c.name}>
                <img
                  src={c.src}
                  alt={c.name}
                  className="tv-logo h-7 w-auto max-w-[110px] object-contain opacity-50 transition-opacity duration-300 hover:opacity-100"
                />
              </div>
            ))}
          </Marquee>
        </div>
        <p className="mt-4 text-xs text-[#94A3B8]">
          Logos shown for representational purposes. Brand names property of respective owners.
        </p>
      </div>
    </section>
  );
};

export default AffiliationsStrip;

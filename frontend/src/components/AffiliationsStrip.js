import React from 'react';
import { motion } from 'framer-motion';
import Marquee from 'react-fast-marquee';
import HorizontalScrollSection from './HorizontalScrollSection';

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
    <section className={compact ? 'py-16' : 'py-20'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-[#38BDF8] text-sm uppercase tracking-[0.3em] mb-3 font-bold">Trust & Recognition</p>
            <h2 className="text-3xl md:text-4xl font-black text-white hero-text uppercase">
              AFFILIATED <span className="text-[#38BDF8]">WITH</span>
            </h2>
            <div className="w-20 h-1 bg-[#F97316] mx-auto mt-4" />
          </motion.div>
        )}

        {/* Mobile: horizontal swipe row */}
        <HorizontalScrollSection className="mb-20">
          {affiliations.map((aff, idx) => (
            <div
              key={idx}
              className="backdrop-blur-xl bg-white border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[200px] h-full"
            >
              {/* Logo */}
              <div className="flex-1 flex items-center justify-center w-full mb-4">
                <img
                  src={aff.src}
                  alt={aff.name}
                  className="h-16 w-auto max-w-[120px] object-contain"
                />
              </div>
              {/* Caption */}
              <div className="text-center">
                <p className="text-[#020617] font-bold text-sm leading-tight mb-1">{aff.name}</p>
                <p className="text-[#0369A1] text-[10px] uppercase tracking-[0.2em] font-bold">{aff.sub}</p>
              </div>
            </div>
          ))}
        </HorizontalScrollSection>

        {/* Desktop: normal grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-5 mb-20">
          {affiliations.map((aff, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              whileHover={{ y: -4 }}
              className="backdrop-blur-xl bg-white/95 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] hover:shadow-[0_10px_40px_-10px_rgba(56,189,248,0.6)] transition-all"
            >
              {/* Logo */}
              <div className="flex-1 flex items-center justify-center w-full mb-4">
                <img
                  src={aff.src}
                  alt={aff.name}
                  className="h-20 w-auto max-w-[140px] object-contain"
                />
              </div>
              {/* Caption */}
              <div className="text-center">
                <p className="text-[#020617] font-bold text-sm leading-tight mb-1">{aff.name}</p>
                <p className="text-[#0369A1] text-[10px] uppercase tracking-[0.2em] font-bold">{aff.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Corporate Partners */}
        <div className="text-center mb-8">
          <p className="text-[#38BDF8] text-sm uppercase tracking-[0.3em] mb-3 font-bold">Group Adventures For</p>
          <h3 className="text-2xl md:text-3xl font-black text-white hero-text uppercase mb-2">
            CORPORATE <span className="text-[#38BDF8]">PARTNERS</span>
          </h3>
          <p className="text-[#94A3B8] text-sm">Trusted by 500+ teams across India and beyond</p>
        </div>

        <div className="bg-white border border-white/10 rounded-2xl py-10 overflow-hidden">
          <Marquee gradient={false} speed={40} pauseOnHover>
            {corporates.map((c) => (
              <div
                key={c.name}
                className="mx-10 flex items-center justify-center h-12 w-32 group"
                title={c.name}
              >
                <img
                  src={c.src}
                  alt={c.name}
                  className="h-10 w-auto max-w-[120px] object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
            ))}
          </Marquee>
        </div>
        <p className="text-center text-[#94A3B8] text-xs mt-4">
          Logos shown for representational purposes. Brand names property of respective owners.
        </p>
      </div>
    </section>
  );
};

export default AffiliationsStrip;

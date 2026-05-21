import React from 'react';
import { motion } from 'framer-motion';
import Marquee from 'react-fast-marquee';

/**
 * AffiliationsStrip
 *  - Affiliations: monogram seals (always render, look like official badges)
 *  - Corporate Partners: favicon API marquee (reliable across networks)
 */

const affiliations = [
  {
    short: 'IMF',
    name: 'Indian Mountaineering Foundation',
    sub: 'Apex National Body',
    color: '#0F766E',
    accent: '#14B8A6'
  },
  {
    short: 'UTB',
    name: 'Uttarakhand Tourism',
    sub: 'Govt. of Uttarakhand',
    color: '#1E40AF',
    accent: '#3B82F6'
  },
  {
    short: 'ATOAI',
    name: 'Adventure Tour Operators Association',
    sub: 'ATOAI Member',
    color: '#B45309',
    accent: '#F59E0B'
  },
  {
    short: 'MoT',
    name: 'Incredible India',
    sub: 'Ministry of Tourism',
    color: '#7C2D12',
    accent: '#EA580C'
  }
];

const corporates = [
  { name: 'Google', domain: 'google.com' },
  { name: 'Microsoft', domain: 'microsoft.com' },
  { name: 'Amazon', domain: 'amazon.com' },
  { name: 'Apple', domain: 'apple.com' },
  { name: 'Meta', domain: 'meta.com' },
  { name: 'Netflix', domain: 'netflix.com' },
  { name: 'IBM', domain: 'ibm.com' },
  { name: 'Oracle', domain: 'oracle.com' },
  { name: 'Intel', domain: 'intel.com' },
  { name: 'Salesforce', domain: 'salesforce.com' },
  { name: 'Adobe', domain: 'adobe.com' },
  { name: 'Samsung', domain: 'samsung.com' },
  { name: 'Sony', domain: 'sony.com' },
  { name: 'Infosys', domain: 'infosys.com' },
  { name: 'TCS', domain: 'tcs.com' },
  { name: 'Wipro', domain: 'wipro.com' },
  { name: 'Accenture', domain: 'accenture.com' },
  { name: 'Deloitte', domain: 'deloitte.com' },
  { name: 'Flipkart', domain: 'flipkart.com' },
  { name: 'Zomato', domain: 'zomato.com' }
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

        {/* Affiliations - monogram seal badges (always render) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-20">
          {affiliations.map((aff, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              className="bg-[#071827] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[220px] hover:border-[#38BDF8]/40 hover:shadow-[0_0_40px_-10px_#38BDF8] transition-all"
            >
              {/* Monogram seal */}
              <div
                className="relative h-20 w-20 rounded-full flex items-center justify-center mb-4 shadow-lg"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${aff.accent}, ${aff.color})`,
                  boxShadow: `0 0 30px -10px ${aff.accent}`
                }}
              >
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-2 border-white/20" />
                <div className="absolute inset-1.5 rounded-full border border-white/10" />
                <span className="hero-text font-black text-white text-base tracking-tight relative z-10">
                  {aff.short}
                </span>
              </div>
              <p className="text-white font-bold text-sm text-center leading-tight mb-1.5">{aff.name}</p>
              <p className="text-[#38BDF8] text-[10px] uppercase tracking-[0.2em] font-bold text-center">{aff.sub}</p>
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

        <div className="bg-white border border-white/10 rounded-2xl py-8 overflow-hidden">
          <Marquee gradient={false} speed={40} pauseOnHover>
            {corporates.map((c) => (
              <div key={c.name} className="mx-10 flex items-center justify-center h-14">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${c.domain}&sz=128`}
                  alt={c.name}
                  className="h-10 w-10 object-contain mr-3 rounded"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <span className="hero-text text-2xl font-black uppercase tracking-tight text-[#020617]/70 hover:text-[#020617] transition-colors whitespace-nowrap">
                  {c.name}
                </span>
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

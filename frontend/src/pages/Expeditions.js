import React from 'react';
import { useNavigate } from 'react-router-dom';
import TrekCard from '../components/TrekCard';
import HorizontalScrollSection from '../components/HorizontalScrollSection';
import PageHeader from '../components/PageHeader';
import { RevealHeading, FadeIn } from '../components/motion';
import { treks } from '../data/treksData';

const REQUIREMENTS = [
  { title: 'High-altitude experience', desc: 'At least one previous trek above 4,500 m.' },
  { title: 'Strong fitness', desc: 'Excellent cardiovascular and muscular endurance, built over months of training.' },
  { title: 'Technical skills', desc: 'Rope work, ice-axe arrest and crevasse rescue. We run a skills day before the climb.' },
  { title: 'Medical clearance', desc: 'A full health check-up signed by a doctor before departure.' },
];

const Expeditions = () => {
  const navigate = useNavigate();
  const expeditions = treks.filter(t => t.type === 'expedition' || t.difficulty === 'Difficult');

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader lines={['Himalayan', 'expeditions']}>
          <p>High-altitude peak climbs for experienced trekkers, with rope teams, summit windows and a leader who has stood on top before.</p>
        </PageHeader>

        {/* Requirements */}
        <dl className="mb-16 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {REQUIREMENTS.map((r, i) => (
            <FadeIn key={r.title} delay={0.06 * i} className="border-t border-white/10 pt-6">
              <dt className="tv-num font-display text-sm font-medium text-[#94A3B8]">0{i + 1}</dt>
              <dd className="mt-3">
                <p className="font-display text-xl font-medium text-white">{r.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">{r.desc}</p>
              </dd>
            </FadeIn>
          ))}
        </dl>

        {/* Expeditions: swipe on mobile, grid on desktop */}
        <HorizontalScrollSection>
          {expeditions.map((expedition) => (
            <TrekCard key={expedition.id} trek={expedition} />
          ))}
        </HorizontalScrollSection>
        <div className="hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-3">
          {expeditions.map((expedition, i) => (
            <FadeIn key={expedition.id} delay={0.06 * (i % 3)} className="h-full">
              <TrekCard trek={expedition} />
            </FadeIn>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-20 grid grid-cols-1 gap-8 rounded-[28px] border border-white/10 bg-[#071827] p-8 sm:p-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <RevealHeading
              lines={['Ready for the climb?']}
              className="font-display text-4xl font-medium leading-[1.02] tracking-tight text-white sm:text-5xl"
            />
            <p className="mt-4 max-w-xl text-[#94A3B8]">
              Our expedition team will guide you through preparation, training and the climb itself.
            </p>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <button
              onClick={() => navigate('/contact')}
              className="tv-btn-primary h-12 px-7 text-sm"
              data-testid="expeditions-enquire-button"
            >
              Talk to the expedition team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expeditions;

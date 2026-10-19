import React from 'react';
import { Shield, Heart, Thermometer, Award, Users, TrendingUp, Phone } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { SectionHeader } from '../components/HomeSections';
import { FadeIn } from '../components/motion';

const FEATURES = [
  { icon: Heart, title: 'Medical support', desc: 'Oxygen cylinders, first-aid kits and trained medical responders on every trek.' },
  { icon: Users, title: 'Certified guides', desc: 'Trek leaders with mountaineering certifications and wilderness first-aid training.' },
  { icon: Shield, title: 'Emergency protocol', desc: 'Quick evacuation procedures and an emergency response team on call around the clock.' },
  { icon: Thermometer, title: 'Weather monitoring', desc: 'Daily forecasts and route adjustments when conditions change.' },
  { icon: Award, title: 'Quality equipment', desc: 'Four-season tents, rated sleeping bags and technical safety gear.' },
  { icon: TrendingUp, title: 'Small groups', desc: 'Batches of twelve for personal attention and safer management on the trail.' },
];

const PROTOCOLS = [
  {
    title: 'Before the trek',
    items: [
      'A medical questionnaire to assess fitness for altitude',
      'Pre-trek briefing on safety protocols and trail etiquette',
      'Equipment check and handover of safety gear',
      'An acclimatisation schedule for high-altitude routes',
    ],
  },
  {
    title: 'On the trail',
    items: [
      'Oxygen saturation and pulse checks every morning and evening',
      'An experienced trek leader and support staff with the group at all times',
      'Gradual ascent with proper acclimatisation days',
      'Satellite and radio communication for emergencies',
      'Route changes based on weather conditions',
    ],
  },
  {
    title: 'If something goes wrong',
    items: [
      'A 24/7 emergency helpline with instant response',
      'Evacuation plans, including helicopter rescue arrangements',
      'Tie-ups with local hospitals and medical facilities',
      'Comprehensive travel insurance recommended for every trekker',
    ],
  },
];

const Safety = () => {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader lines={['How we keep', 'you safe']}>
          <p>Every protocol below runs on every departure, from a weekend trek to a 6,000 m summit.</p>
        </PageHeader>

        {/* Key safety features */}
        <section className="mb-24 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <FadeIn key={feature.title} delay={0.05 * (index % 3)} className="border-t border-white/10 pt-6">
              <feature.icon className="h-5 w-5 text-[#38BDF8]" />
              <h2 className="mt-4 font-display text-xl font-medium text-white">{feature.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">{feature.desc}</p>
            </FadeIn>
          ))}
        </section>

        {/* Detailed protocols */}
        <section className="mb-24">
          <SectionHeader lines={['Protocols, stage', 'by stage']} />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {PROTOCOLS.map((block, i) => (
              <FadeIn key={block.title} delay={0.08 * i} className="rounded-3xl border border-white/10 bg-[#071827] p-7 sm:p-8">
                <p className="tv-num font-display text-sm font-medium text-[#94A3B8]">0{i + 1}</p>
                <h3 className="mt-3 font-display text-2xl font-medium tracking-tight text-white">{block.title}</h3>
                <ul className="mt-6 space-y-3 text-[#94A3B8]">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2.5 h-1 w-1 flex-shrink-0 rounded-full bg-[#38BDF8]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Emergency contact */}
        <FadeIn className="grid grid-cols-1 gap-8 rounded-[28px] border border-white/10 bg-[#071827] p-8 sm:p-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2 className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">24/7 emergency helpline</h2>
            <p className="mt-3 text-[#94A3B8]">Answered round the clock for anyone on a TrailVista trek, and for their families at home.</p>
          </div>
          <div className="lg:col-span-5 lg:text-right">
            <a href="tel:+919876543210" className="tv-btn-primary h-12 px-7 text-sm">
              <Phone className="h-4 w-4" />
              <span className="tv-num">+91 98765 43210</span>
            </a>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default Safety;

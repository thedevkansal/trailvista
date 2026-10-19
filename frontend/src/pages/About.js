import React from 'react';
import { Award, Users, Heart, Shield } from 'lucide-react';
import AffiliationsStrip from '../components/AffiliationsStrip';
import HorizontalScrollSection from '../components/HorizontalScrollSection';
import PageHeader from '../components/PageHeader';
import { SectionHeader } from '../components/HomeSections';
import { FadeIn, CountUp } from '../components/motion';

const STATS = [
  { value: <CountUp to={10} suffix="+" />, label: 'years in the mountains' },
  { value: <CountUp to={25000} suffix="+" />, label: 'trekkers guided' },
  { value: <CountUp to={50} suffix="+" />, label: 'trek routes' },
  { value: <CountUp to={4.9} decimals={1} />, label: 'average rating' },
];

const VALUES = [
  { icon: Shield, title: 'Safety first', desc: 'Your safety is our top priority on every expedition.' },
  { icon: Heart, title: 'Love of the hills', desc: 'We love the mountains, and it shows in how we run every trek.' },
  { icon: Users, title: 'Community', desc: 'Building a community of responsible mountain lovers.' },
  { icon: Award, title: 'Craft', desc: 'Small details, done well, from the meal plan to the summit push.' },
];

const TEAM = [
  {
    name: 'Rajesh Kumar',
    role: 'Founder and lead expedition guide',
    image: '/team/rajesh.jpg',
    bio: '80+ high-altitude Himalayan summits, certified Wilderness First Responder.'
  },
  {
    name: 'Priya Sharma',
    role: 'Head of operations',
    image: '/team/priya.jpg',
    bio: 'Expedition safety manager and regional community outreach director.'
  },
  {
    name: 'Vikram Singh',
    role: 'Senior trek leader',
    image: '/team/vikram.jpg',
    bio: '12 years of guiding experience on frozen winter Zanskar trails.'
  }
];

const TeamCard = ({ member }) => (
  <figure className="group h-full">
    <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-[#071827]">
      <img
        src={member.image}
        alt={member.name}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
      />
    </div>
    <figcaption className="pt-5">
      <p className="font-display text-2xl font-medium tracking-tight text-white">{member.name}</p>
      <p className="mt-1 text-sm text-[#94A3B8]">{member.role}</p>
      <p className="mt-3 text-sm leading-relaxed text-[#94A3B8]">{member.bio}</p>
    </figcaption>
  </figure>
);

const About = () => {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader lines={['Mountain people,', 'running small treks']}>
          <p>TrailVista has run Himalayan treks and expeditions since 2015, with certified leaders and batches of twelve.</p>
        </PageHeader>

        {/* Story */}
        <section className="mb-24 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <FadeIn className="lg:col-span-7">
            <h2 className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">Our story</h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-[#94A3B8]">
              <p>
                Founded in 2015, TrailVista Expeditions was born from a passion for the mountains and a desire to make Himalayan trekking accessible to everyone. What started as a small team of mountain enthusiasts has grown into one of India’s most trusted adventure travel platforms.
              </p>
              <p>
                Over the years, we’ve guided more than 25,000 trekkers through the Himalaya. Our commitment to safety, sustainability and honest experiences has earned the trust of trekkers from across the globe.
              </p>
              <p>
                Every trek is planned to balance adventure with safety, so you come home with memories that last while the fragile mountain ecosystems we walk through stay intact.
              </p>
            </div>
          </FadeIn>

          <dl className="grid grid-cols-2 gap-x-8 self-start lg:col-span-5">
            {STATS.map((stat, i) => (
              <div key={i} className="border-t border-white/10 py-6">
                <dd className="font-display text-4xl font-medium tracking-tight text-white sm:text-5xl">{stat.value}</dd>
                <dt className="mt-2 text-sm text-[#94A3B8]">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </section>

        {/* Mission and vision */}
        <section className="mb-24 grid grid-cols-1 gap-5 md:grid-cols-2">
          {[
            {
              title: 'Our mission',
              body: 'To make Himalayan trekking accessible, safe and memorable for everyone while promoting responsible tourism and conservation. We want every trek to connect people with the mountains and with themselves.',
            },
            {
              title: 'Our vision',
              body: 'To be India’s most trusted adventure travel company, known for an unwavering commitment to safety, sustainability and life-changing mountain experiences for trekkers of every level.',
            },
          ].map((block, i) => (
            <FadeIn key={block.title} delay={0.08 * i} className="rounded-3xl border border-white/10 bg-[#071827] p-8 sm:p-10">
              <h2 className="font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">{block.title}</h2>
              <p className="mt-4 leading-relaxed text-[#94A3B8]">{block.body}</p>
            </FadeIn>
          ))}
        </section>

        {/* Values */}
        <section className="mb-24">
          <SectionHeader lines={['What we hold to']} />
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, index) => (
              <FadeIn key={value.title} delay={0.06 * index} className="border-t border-white/10 pt-6">
                <value.icon className="h-5 w-5 text-[#38BDF8]" />
                <h3 className="mt-4 font-display text-xl font-medium text-white">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">{value.desc}</p>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Affiliations and corporate partners */}
        <AffiliationsStrip />

        {/* Team */}
        <section className="mt-24">
          <SectionHeader lines={['The people who', 'lead your trek']}>
            <p>Every leader is NIM-trained and certified in wilderness first response.</p>
          </SectionHeader>
          <HorizontalScrollSection>
            {TEAM.map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </HorizontalScrollSection>
          <div className="hidden gap-8 md:grid md:grid-cols-3">
            {TEAM.map((member, i) => (
              <FadeIn key={member.name} delay={0.08 * i}>
                <TeamCard member={member} />
              </FadeIn>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;

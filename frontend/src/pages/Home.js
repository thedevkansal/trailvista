import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Award, CalendarCheck, HeartPulse, CloudSun, Users, Siren } from 'lucide-react';
import CinematicHero from '../components/CinematicHero';
import SearchBar from '../components/SearchBar';
import TrekCard from '../components/TrekCard';
import AffiliationsStrip from '../components/AffiliationsStrip';
import HorizontalScrollSection from '../components/HorizontalScrollSection';
import { SeasonPanels, Filmstrip, ReviewSpotlight, SectionHeader } from '../components/HomeSections';
import { RevealHeading, FadeIn, CountUp } from '../components/motion';
import { treks, reviews, blogPosts } from '../data/treksData';
import { useAuth } from '../context/AuthContext';

const galleryImages = [
  { url: 'https://images.pexels.com/photos/12121705/pexels-photo-12121705.jpeg', description: 'Hikers crossing a snowfield' },
  { url: 'https://images.unsplash.com/photo-1767763713139-2e5e6aadd428?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxNzV8MHwxfHNlYXJjaHwzfHx0cmVra2luZyUyMGdyb3VwJTIwc25vd3xlbnwwfHx8fDE3NzkzOTMyMzl8MA&ixlib=rb-4.1.0&q=85', description: 'Hikers ascending a snowy mountain' },
  { url: 'https://images.unsplash.com/photo-1698763953037-02519fb98565?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHwzfHx0cmVra2VyJTIwc2lsaG91ZXR0ZSUyMG1vdW50YWlufGVufDB8fHx8MTc3OTM5MzIzOXww&ixlib=rb-4.1.0&q=85', description: 'Trekker on a summit' },
  { url: 'https://images.unsplash.com/photo-1773081834522-7c375c2d4a21?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwyfHxoaW1hbGF5YXMlMjBtb3VudGFpbiUyMHN0YXJyeSUyMG5pZ2h0fGVufDB8fHx8MTc3OTM5MzIzOXww&ixlib=rb-4.1.0&q=85', description: 'Snow peaks under a starry sky' },
  { url: 'https://images.unsplash.com/photo-1666501548252-d455a2b9554d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwyfHx0cmVra2luZyUyMGdyb3VwJTIwY2FtcGluZyUyMHRlbnRzJTIwYWR2ZW50dXJlfGVufDB8fHx8MTc3OTM5MzM3NHww&ixlib=rb-4.1.0&q=85', description: 'Tents pitched in a high valley' },
  { url: 'https://images.unsplash.com/photo-1632751796489-cd5902a5737c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHw0fHx0cmVra2luZyUyMGdyb3VwJTIwY2FtcGluZyUyMHRlbnRzJTIwYWR2ZW50dXJlfGVufDB8fHx8MTc3OTM5MzM3NHww&ixlib=rb-4.1.0&q=85', description: 'Group camp below the peaks' },
  { url: treks[6]?.image, description: treks[6]?.name },
  { url: treks[3]?.image, description: treks[3]?.name },
].filter((img) => img.url);

const SAFETY = [
  { icon: Award, title: 'Certified trek leaders', desc: 'Every leader trained at the Nehru Institute of Mountaineering and holds Wilderness First Responder certification.' },
  { icon: Users, title: 'Twelve trekkers, no more', desc: 'Small batches keep the leader-to-trekker ratio safe and the trail quiet.' },
  { icon: HeartPulse, title: 'Oxygen and medical kits at every camp', desc: 'Oximeter checks morning and night, with oxygen cylinders and a stretcher kit carried to high camp.' },
  { icon: CloudSun, title: 'Weather watched every day', desc: 'Summit pushes are timed to forecasts. If the window closes, we turn around.' },
  { icon: Siren, title: 'An evacuation plan for every route', desc: 'Leaders know the nearest road head and medical post from every campsite.' },
  { icon: CalendarCheck, title: 'Departures that run', desc: 'Once you’ve booked, your date is fixed. We don’t cancel for low sign-ups.' },
];

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [featured, ...rest] = treks.slice(0, 5);

  return (
    <div className="min-h-screen overflow-x-clip">
      <CinematicHero
        word1="CLIMB"
        word2="BEYOND"
        word3="LIMITS"
        subtitle="Himalayan treks, 2026–27 season"
        description="Fixed departures, certified leaders and batches of twelve. Treks across Uttarakhand, Himachal, Kashmir and Ladakh."
        ctaPrimary="Explore treks"
        ctaSecondary="Plan a custom trip"
        onPrimaryClick={() => navigate('/treks')}
        onSecondaryClick={() => {
          if (!user) {
            navigate('/signup', { state: { from: '/contact' } });
          } else {
            navigate('/contact');
          }
        }}
      />

      {/* Intro + numbers */}
      <section className="relative z-20 px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <RevealHeading
            lines={['Small groups.', 'Certified leaders.', 'Dates that hold.']}
            className="font-display text-4xl font-medium leading-[1.02] tracking-tight text-white sm:text-5xl lg:col-span-7 lg:text-[64px]"
          />
          <FadeIn delay={0.2} className="lg:col-span-5 lg:pt-3">
            <p className="text-lg leading-relaxed text-[#94A3B8]">
              TrailVista runs small-batch Himalayan treks led by mountain rescue professionals. You bring the legs;
              we handle permits, camps, food, safety and the logistics of getting you to the top and back.
            </p>
            <Link to="/about" className="mt-6 inline-flex items-center gap-1.5 font-semibold text-white hover:text-[#38BDF8]">
              How we run our treks <ArrowUpRight className="h-4 w-4" />
            </Link>
          </FadeIn>
        </div>

        <dl className="mx-auto mt-16 grid max-w-7xl grid-cols-3 border-y border-white/10 lg:mt-24">
          {[
            { value: <CountUp to={25000} suffix="+" />, label: 'trekkers guided' },
            { value: <CountUp to={120} suffix="+" />, label: 'departures a year' },
            { value: <CountUp to={4.9} decimals={1} />, label: 'average rating' },
          ].map((stat, i) => (
            <div key={i} className={`py-8 sm:py-10 ${i > 0 ? 'border-l border-white/10 pl-4 sm:pl-10' : 'pr-4'}`}>
              <dd className="font-display text-3xl font-medium tracking-tight text-white sm:text-5xl lg:text-6xl">{stat.value}</dd>
              <dt className="mt-2 text-xs text-[#94A3B8] sm:text-sm">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Search */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SearchBar onSearch={(filters) => navigate('/treks', { state: { filters } })} />
        </div>
      </section>

      {/* Featured treks */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader lines={['Treks people', 'book first']}>
            <p>Our most-booked routes this season, from first-timer winter summits to week-long lake crossings.</p>
            <Link
              to="/treks"
              className="mt-4 inline-flex items-center gap-1.5 font-semibold text-white hover:text-[#38BDF8]"
              data-testid="view-all-treks-button"
            >
              View all {treks.length} treks <ArrowUpRight className="h-4 w-4" />
            </Link>
          </SectionHeader>

          <HorizontalScrollSection>
            {treks.slice(0, 5).map((trek) => (
              <TrekCard key={trek.id} trek={trek} />
            ))}
          </HorizontalScrollSection>

          <div className="hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
            <FadeIn className="h-full md:col-span-2 lg:row-span-2">
              <TrekCard trek={featured} size="large" />
            </FadeIn>
            {rest.map((trek, i) => (
              <FadeIn key={trek.id} delay={0.08 * (i + 1)} className="h-full">
                <TrekCard trek={trek} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Seasons */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader lines={['Pick your season,', 'then your trail']}>
            <p>Winter brings snow summits, summer opens the high meadows. Not sure? Start with a first-timer trek.</p>
          </SectionHeader>
          <SeasonPanels />
        </div>
      </section>

      {/* Safety */}
      <section className="px-4 py-16 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <RevealHeading
              lines={['How we keep you', 'safe up there']}
              className="font-display text-4xl font-medium leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl"
            />
            <FadeIn delay={0.15} className="tv-cinematic relative mt-10 hidden aspect-[4/5] overflow-hidden rounded-[28px] lg:block">
              <img src={galleryImages[1].url} alt={galleryImages[1].description} className="h-full w-full object-cover" />
            </FadeIn>
          </div>

          <div>
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {SAFETY.map(({ icon: Icon, title, desc }, i) => (
                <FadeIn as="li" key={title} delay={i * 0.05} className="flex gap-5 py-7 sm:py-9">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-white/10 text-[#F2A65A]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-medium text-white sm:text-2xl">{title}</h3>
                    <p className="mt-2 max-w-md leading-relaxed text-[#94A3B8]">{desc}</p>
                  </div>
                </FadeIn>
              ))}
            </ul>
            <Link
              to="/safety"
              className="mt-8 inline-flex items-center gap-1.5 font-semibold text-white hover:text-[#38BDF8]"
              data-testid="learn-more-safety-button"
            >
              Read our full safety protocol <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Filmstrip */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader lines={['From the trail']}>
            <p>Photographs from recent departures.</p>
            <Link to="/gallery" className="mt-4 inline-flex items-center gap-1.5 font-semibold text-white hover:text-[#38BDF8]">
              Open the gallery <ArrowUpRight className="h-4 w-4" />
            </Link>
          </SectionHeader>
        </div>
        <Filmstrip images={galleryImages} />
      </section>

      {/* Reviews */}
      <section className="px-4 py-16 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader lines={['In their words']}>
            <p>Rated 4.9 by trekkers who came back down.</p>
            <Link to="/reviews" className="mt-4 inline-flex items-center gap-1.5 font-semibold text-white hover:text-[#38BDF8]">
              Read all reviews <ArrowUpRight className="h-4 w-4" />
            </Link>
          </SectionHeader>
          <ReviewSpotlight reviews={reviews} />
        </div>
      </section>

      {/* Guides (only when there are posts) */}
      {blogPosts.length > 0 && (
        <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader lines={['Trek guides']}>
              <Link to="/blog" className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-[#38BDF8]" data-testid="view-all-guides-button">
                View all guides <ArrowUpRight className="h-4 w-4" />
              </Link>
            </SectionHeader>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {blogPosts.slice(0, 3).map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden rounded-3xl">
                    <img src={post.image} alt={post.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <p className="mt-4 text-sm text-[#94A3B8]">{post.category}</p>
                  <h3 className="mt-1 font-display text-xl font-medium text-white group-hover:text-[#38BDF8]">{post.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <AffiliationsStrip />

      {/* Final CTA */}
      <section className="tv-cinematic tv-grain relative overflow-hidden px-4 py-32 sm:py-44">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1777461788029-54db5f3971c2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwzfHxtb3VudGFpbiUyMHN1bW1pdCUyMHZpZXclMjBsYW5kc2NhcGV8ZW58MHx8fHwxNzc5MzkzMzc0fDA&ixlib=rb-4.1.0&q=85"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-[#020617]/70" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <RevealHeading
            lines={['Ready to walk', 'above the clouds?']}
            className="font-display text-5xl font-medium leading-[1] tracking-tight text-white sm:text-6xl lg:text-7xl"
          />
          <FadeIn delay={0.2}>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/75">
              Pick a departure, pay securely with Razorpay, and get your confirmation by email the same minute.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button onClick={() => navigate('/treks')} className="tv-btn-primary h-14 px-8 text-base" data-testid="final-cta-plan-trek">
                Find your trek
              </button>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="tv-btn-ghost h-14 px-8 text-base"
                data-testid="final-cta-whatsapp"
              >
                Ask us on WhatsApp
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default Home;

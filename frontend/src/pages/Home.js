import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, Shield, DollarSign, Calendar, MapPin, Thermometer,
  Heart, Award, TrendingUp, Mountain, Snowflake, Sun
} from 'lucide-react';
import CinematicHero from '../components/CinematicHero';
import SearchBar from '../components/SearchBar';
import TrekCard from '../components/TrekCard';
import GalleryMarquee from '../components/GalleryMarquee';
import ReviewMarquee from '../components/ReviewMarquee';
import AffiliationsStrip from '../components/AffiliationsStrip';
import HorizontalScrollSection from '../components/HorizontalScrollSection';
import { treks, reviews, blogPosts, categories } from '../data/treksData';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const popularTreks = treks.slice(0, 6);

  const galleryImages = [
    { url: 'https://images.pexels.com/photos/12121705/pexels-photo-12121705.jpeg', description: 'Hikers snow landscape' },
    { url: 'https://images.unsplash.com/photo-1767763713139-2e5e6aadd428?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxNzV8MHwxfHNlYXJjaHwzfHx0cmVra2luZyUyMGdyb3VwJTIwc25vd3xlbnwwfHx8fDE3NzkzOTMyMzl8MA&ixlib=rb-4.1.0&q=85', description: 'Hikers ascending snowy mountain' },
    { url: 'https://images.unsplash.com/photo-1698763953037-02519fb98565?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHwzfHx0cmVra2VyJTIwc2lsaG91ZXR0ZSUyMG1vdW50YWlufGVufDB8fHx8MTc3OTM5MzIzOXww&ixlib=rb-4.1.0&q=85', description: 'Person on top of mountain' },
    { url: 'https://images.unsplash.com/photo-1773081834522-7c375c2d4a21?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwyfHxoaW1hbGF5YXMlMjBtb3VudGFpbiUyMHN0YXJyeSUyMG5pZ2h0fGVufDB8fHx8MTc3OTM5MzIzOXww&ixlib=rb-4.1.0&q=85', description: 'Snowcapped under starry night' },
    { url: 'https://images.unsplash.com/photo-1666501548252-d455a2b9554d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwyfHx0cmVra2luZyUyMGdyb3VwJTIwY2FtcGluZyUyMHRlbnRzJTIwYWR2ZW50dXJlfGVufDB8fHx8MTc3OTM5MzM3NHww&ixlib=rb-4.1.0&q=85', description: 'Camping tents in mountains' },
    { url: 'https://images.unsplash.com/photo-1632751796489-cd5902a5737c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHw0fHx0cmVra2luZyUyMGdyb3VwJTIwY2FtcGluZyUyMHRlbnRzJTIwYWR2ZW50dXJlfGVufDB8fHx8MTc3OTM5MzM3NHww&ixlib=rb-4.1.0&q=85', description: 'Group camping expedition' },
  ];

  return (
    <div className="min-h-screen">
      {/* Cinematic Hero */}
      <CinematicHero
        word1="CLIMB"
        word2="BEYOND"
        word3="LIMITS"
        subtitle="HIMALAYAN EXPEDITIONS · 2026"
        description="Fixed departures. Certified leaders. Safety-first Himalayan expeditions for adventurers above the ordinary."
        ctaPrimary="Explore Treks"
        ctaSecondary="Plan Custom Trip"
        onPrimaryClick={() => navigate('/treks')}
        onSecondaryClick={() => {
          if (!user) {
            navigate('/signup', { state: { from: '/contact' } });
          } else {
            navigate('/contact');
          }
        }}
      />

      {/* Trust & Stats Section */}
      <section className="relative z-20 px-4 pt-16 pb-8 bg-gradient-to-b from-[#020617] to-[#071827]/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Stats Grid (lg:col-span-5) */}
            <div className="lg:col-span-5 grid grid-cols-3 lg:grid-cols-1 gap-4">
              {[
                { label: 'Happy Trekkers', value: '25,000+' },
                { label: 'Departures Annually', value: '120+' },
                { label: 'Rated Experience', value: '4.9 / 5' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="backdrop-blur-xl bg-[#071827]/60 border border-white/10 rounded-2xl p-5 sm:p-6 text-center lg:text-left shadow-lg hover:border-[#38BDF8]/20 transition-all duration-300"
                >
                  <p className="text-2xl sm:text-3xl font-black text-[#38BDF8] hero-text mb-1">{stat.value}</p>
                  <p className="text-[#94A3B8] text-xs sm:text-sm font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Right Column: Brand Trust Pillars (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-[#38BDF8] text-xs font-bold uppercase tracking-[0.25em]">Himalayan Pioneers</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white hero-text uppercase mt-2 mb-4">
                  EXPEDITIONS ROOTED IN <span className="text-[#38BDF8]">TRUST & SAFETY</span>
                </h2>
                <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed mb-6 font-light">
                  We don't offer generic tour packages. TrailVista designs production-grade, small-batch expeditions guided by certified rescue professionals.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Certified Rescue Guides',
                    desc: 'Every leader is certified by Nehru Institute of Mountaineering and holds Wilderness First Responder (WFR) clearance.',
                    icon: (
                      <svg className="h-5 w-5 text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    )
                  },
                  {
                    title: 'Secure razorpay checkout',
                    desc: 'Direct payment processing. Instant booking confirmation and transparent refund logs.',
                    icon: (
                      <svg className="h-5 w-5 text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )
                  },
                  {
                    title: 'Intimate Batches (Max 12)',
                    desc: 'Small groups ensure a safe guide-to-trekker ratio and minimal environmental impact.',
                    icon: (
                      <svg className="h-5 w-5 text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    )
                  },
                  {
                    title: '100% Guaranteed Dates',
                    desc: 'Once booked, departures are guaranteed. We do not cancel trips due to low registration.',
                    icon: (
                      <svg className="h-5 w-5 text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )
                  }
                ].map((pillar, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex space-x-3"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-[#38BDF8]/10 rounded-lg flex items-center justify-center mt-0.5">
                      {pillar.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm uppercase tracking-wide">{pillar.title}</h4>
                      <p className="text-[#94A3B8] text-xs leading-relaxed mt-1 font-light">{pillar.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search/Filter Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar onSearch={(filters) => navigate('/treks', { state: { filters } })} />
        </div>
      </section>

      {/* Popular Treks */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12"
          >
            <p className="text-[#38BDF8] text-sm uppercase tracking-[0.3em] mb-4 font-bold">Featured Adventures</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white hero-text uppercase mb-6">
              POPULAR <span className="text-[#38BDF8]">TREKS</span>
            </h2>
          </motion.div>

          {/* Mobile: horizontal swipe */}
          <HorizontalScrollSection>
            {popularTreks.map((trek) => (
              <TrekCard key={trek.id} trek={trek} />
            ))}
          </HorizontalScrollSection>

          {/* Desktop: normal grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularTreks.map((trek) => (
              <TrekCard key={trek.id} trek={trek} />
            ))}
          </div>

          <div className="text-center mt-10 sm:mt-12">
            <button
              onClick={() => navigate('/treks')}
              className="bg-[#38BDF8] hover:bg-[#0ea5e9] text-white px-8 py-3 rounded-full font-semibold transition-all active:scale-95"
              data-testid="view-all-treks-button"
            >
              View All Treks
            </button>
          </div>
        </div>
      </section>

      {/* Trek Categories */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#38BDF8] text-sm uppercase tracking-[0.3em] mb-4 font-bold">Find Your Style</p>
            <h2 className="text-4xl md:text-5xl font-black text-white hero-text uppercase mb-6">
              TREK <span className="text-[#38BDF8]">CATEGORIES</span>
            </h2>
          </motion.div>

          {/* Mobile: horizontal swipe */}
          <HorizontalScrollSection>
            {categories.slice(0, 8).map((category, index) => {
              const icons = {
                'Footprints': Mountain,
                'Snowflake': Snowflake,
                'Sun': Sun,
                'Calendar': Calendar,
                'Mountain': Mountain,
                'TrendingUp': TrendingUp,
                'Flag': MapPin,
                'Users': Users
              };
              const IconComponent = icons[category.icon] || Mountain;

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/categories/${category.id}`)}
                  className="bg-[#071827] border border-white/10 rounded-2xl p-6 text-center cursor-pointer h-full tv-card-glow hover:-translate-y-1.5"
                >
                  <div className="w-12 h-12 bg-[#38BDF8]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-6 w-6 text-[#38BDF8]" />
                  </div>
                  <h3 className="text-white font-bold mb-2 text-base">{category.name}</h3>
                  <p className="text-[#94A3B8] text-sm">{category.count} treks</p>
                </motion.div>
              );
            })}
          </HorizontalScrollSection>

          {/* Desktop: normal grid */}
          <div className="hidden md:grid md:grid-cols-2 md:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category, index) => {
              const icons = {
                'Footprints': Mountain,
                'Snowflake': Snowflake,
                'Sun': Sun,
                'Calendar': Calendar,
                'Mountain': Mountain,
                'TrendingUp': TrendingUp,
                'Flag': MapPin,
                'Users': Users
              };
              const IconComponent = icons[category.icon] || Mountain;

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/categories/${category.id}`)}
                  className="bg-[#071827] border border-white/10 rounded-2xl p-6 text-center cursor-pointer tv-card-glow hover:-translate-y-1.5"
                >
                  <div className="w-12 h-12 bg-[#38BDF8]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-6 w-6 text-[#38BDF8]" />
                  </div>
                  <h3 className="text-white font-bold mb-2">{category.name}</h3>
                  <p className="text-[#94A3B8] text-sm">{category.count} treks</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-[#071827]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#38BDF8] text-sm uppercase tracking-[0.3em] mb-4 font-bold">The TrailVista Difference</p>
            <h2 className="text-4xl md:text-5xl font-black text-white hero-text uppercase mb-6">
              WHY <span className="text-[#38BDF8]">CHOOSE US</span>
            </h2>
          </motion.div>

          {/* Mobile: horizontal swipe */}
          <HorizontalScrollSection>
            {[
              { icon: Award, title: 'Certified Trek Leaders', desc: 'Experienced guides with mountaineering certifications and first-aid training' },
              { icon: DollarSign, title: 'Transparent Pricing', desc: 'No hidden costs. All-inclusive pricing with detailed breakdowns' },
              { icon: Shield, title: 'Safety-First Protocol', desc: 'Comprehensive safety measures including oxygen support and emergency evacuation' },
              { icon: Calendar, title: 'Fixed Departures', desc: 'Regular departure dates with guaranteed trips for hassle-free planning' },
              { icon: MapPin, title: 'Local Expertise', desc: 'Deep knowledge of terrain, weather, and local culture for authentic experiences' },
              { icon: Users, title: 'Custom Group Trips', desc: 'Tailored itineraries for corporate teams, families, and private groups' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#071827] border border-white/10 rounded-2xl p-6 h-full tv-card-glow hover:-translate-y-1.5"
              >
                <div className="w-14 h-14 bg-[#38BDF8]/10 rounded-full flex items-center justify-center mb-4">
                  <item.icon className="h-7 w-7 text-[#38BDF8]" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </HorizontalScrollSection>

          {/* Desktop: normal grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {[
              { icon: Award, title: 'Certified Trek Leaders', desc: 'Experienced guides with mountaineering certifications and first-aid training' },
              { icon: DollarSign, title: 'Transparent Pricing', desc: 'No hidden costs. All-inclusive pricing with detailed breakdowns' },
              { icon: Shield, title: 'Safety-First Protocol', desc: 'Comprehensive safety measures including oxygen support and emergency evacuation' },
              { icon: Calendar, title: 'Fixed Departures', desc: 'Regular departure dates with guaranteed trips for hassle-free planning' },
              { icon: MapPin, title: 'Local Expertise', desc: 'Deep knowledge of terrain, weather, and local culture for authentic experiences' },
              { icon: Users, title: 'Custom Group Trips', desc: 'Tailored itineraries for corporate teams, families, and private groups' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#071827] border border-white/10 rounded-2xl p-6 tv-card-glow hover:-translate-y-1.5"
              >
                <div className="w-14 h-14 bg-[#38BDF8]/10 rounded-full flex items-center justify-center mb-4">
                  <item.icon className="h-7 w-7 text-[#38BDF8]" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#38BDF8] text-sm uppercase tracking-[0.3em] mb-4 font-bold">Your Safety, Our Priority</p>
            <h2 className="text-4xl md:text-5xl font-black text-white hero-text uppercase mb-6">
              SAFETY-<span className="text-[#38BDF8]">FIRST</span> APPROACH
            </h2>
          </motion.div>

          {/* Mobile: horizontal swipe */}
          <HorizontalScrollSection>
            {[
              { label: 'Oxygen Support', icon: Heart },
              { label: 'First-Aid Kits', icon: Shield },
              { label: 'Weather Monitoring', icon: Thermometer },
              { label: 'Emergency Evacuation', icon: Award },
              { label: 'Certified Guides', icon: Users },
              { label: 'Small Group Control', icon: TrendingUp }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#071827] border border-white/10 rounded-2xl p-6 text-center h-full tv-card-glow hover:-translate-y-1.5"
              >
                <div className="w-12 h-12 bg-[#38BDF8]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <item.icon className="h-6 w-6 text-[#38BDF8]" />
                </div>
                <p className="text-white text-sm font-semibold">{item.label}</p>
              </motion.div>
            ))}
          </HorizontalScrollSection>

          {/* Desktop: normal grid */}
          <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { label: 'Oxygen Support', icon: Heart },
              { label: 'First-Aid Kits', icon: Shield },
              { label: 'Weather Monitoring', icon: Thermometer },
              { label: 'Emergency Evacuation', icon: Award },
              { label: 'Certified Guides', icon: Users },
              { label: 'Small Group Control', icon: TrendingUp }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#071827] border border-white/10 rounded-2xl p-6 text-center tv-card-glow hover:-translate-y-1.5"
              >
                <div className="w-12 h-12 bg-[#38BDF8]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <item.icon className="h-6 w-6 text-[#38BDF8]" />
                </div>
                <p className="text-white text-sm font-semibold">{item.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/safety')}
              className="text-[#38BDF8] hover:text-[#0ea5e9] font-semibold transition-colors"
              data-testid="learn-more-safety-button"
            >
              Learn More About Our Safety Protocols →
            </button>
          </div>
        </div>
      </section>

      {/* Gallery Marquee */}
      <GalleryMarquee images={galleryImages} />

      {/* Reviews Marquee */}
      <ReviewMarquee reviews={reviews} />

      {/* Blog Preview */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12"
          >
            <p className="text-[#38BDF8] text-sm uppercase tracking-[0.3em] mb-4 font-bold">Knowledge Hub</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white hero-text uppercase mb-6">
              TREK <span className="text-[#38BDF8]">GUIDES</span>
            </h2>
          </motion.div>

          {/* Mobile: horizontal swipe */}
          <HorizontalScrollSection>
            {blogPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => navigate('/blog')}
                className="bg-[#071827] border border-white/10 rounded-2xl overflow-hidden cursor-pointer h-full tv-card-glow hover:-translate-y-1.5"
              >
                <div className="h-48 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <span className="text-[#38BDF8] text-xs font-bold uppercase tracking-wider">{post.category}</span>
                  <h3 className="text-white font-bold text-base mt-2 mb-2">{post.title}</h3>
                  <p className="text-[#94A3B8] text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                  <p className="text-[#94A3B8] text-xs">{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </motion.div>
            ))}
          </HorizontalScrollSection>

          {/* Desktop: normal grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => navigate('/blog')}
                className="bg-[#071827] border border-white/10 rounded-2xl overflow-hidden cursor-pointer tv-card-glow hover:-translate-y-1.5"
              >
                <div className="h-48 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <span className="text-[#38BDF8] text-xs font-bold uppercase tracking-wider">{post.category}</span>
                  <h3 className="text-white font-bold text-lg mt-2 mb-3">{post.title}</h3>
                  <p className="text-[#94A3B8] text-sm mb-4">{post.excerpt}</p>
                  <p className="text-[#94A3B8] text-xs">{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10 sm:mt-12">
            <button
              onClick={() => navigate('/blog')}
              className="border border-white/30 hover:border-[#38BDF8] text-white px-8 py-3 rounded-full font-semibold transition-all active:scale-95"
              data-testid="view-all-guides-button"
            >
              View All Guides
            </button>
          </div>
        </div>
      </section>

      {/* Affiliations + Corporate Partners */}
      <AffiliationsStrip />

      {/* Final CTA */}
      <section className="tv-cinematic relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1777461788029-54db5f3971c2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwzfHxtb3VudGFpbiUyMHN1bW1pdCUyMHZpZXclMjBsYW5kc2NhcGV8ZW58MHx8fHwxNzc5MzkzMzc0fDA&ixlib=rb-4.1.0&q=85"
            alt="Final CTA Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-[#020617]/60" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white hero-text uppercase mb-6">
              READY TO WALK <span className="text-[#38BDF8]">ABOVE THE CLOUDS?</span>
            </h2>
            <p className="text-[#94A3B8] text-lg mb-8 max-w-2xl mx-auto">
              Start your Himalayan adventure with India's most trusted expedition platform
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={() => navigate('/treks')}
                className="bg-[#F97316] hover:bg-[#ea580c] text-white px-8 py-4 rounded-full text-base font-bold transition-all active:scale-95 shadow-lg tv-btn-cta"
                data-testid="final-cta-plan-trek"
              >
                Plan Your Trek
              </button>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                <button className="border border-white/30 hover:border-[#38BDF8] text-white px-8 py-4 rounded-full text-base font-bold transition-all active:scale-95 backdrop-blur-sm" data-testid="final-cta-whatsapp">
                  WhatsApp Us
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

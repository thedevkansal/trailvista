import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, Shield, DollarSign, Calendar, MapPin, Thermometer,
  Heart, Award, TrendingUp, Clock, Mountain, Snowflake, Sun
} from 'lucide-react';
import CinematicHero from '../components/CinematicHero';
import SearchBar from '../components/SearchBar';
import TrekCard from '../components/TrekCard';
import GalleryMarquee from '../components/GalleryMarquee';
import ReviewMarquee from '../components/ReviewMarquee';
import { treks, reviews, blogPosts, categories } from '../data/treksData';

const Home = () => {
  const navigate = useNavigate();
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

  const upcomingDepartures = treks
    .filter(t => t.nextBatch)
    .sort((a, b) => new Date(a.nextBatch) - new Date(b.nextBatch))
    .slice(0, 6);

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
        onSecondaryClick={() => navigate('/contact')}
      />

      {/* Trust Stats - Floating Cards (positioned below hero, not overlapping) */}
      <div className="relative z-20 px-4 pt-12 pb-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-xl bg-[#071827]/80 border border-white/10 rounded-2xl p-6 text-center"
            >
              <p className="text-3xl font-black text-[#38BDF8] hero-text mb-2">25K+</p>
              <p className="text-[#94A3B8] text-sm">Happy Trekkers</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-xl bg-[#071827]/80 border border-white/10 rounded-2xl p-6 text-center"
            >
              <p className="text-3xl font-black text-[#38BDF8] hero-text mb-2">120+</p>
              <p className="text-[#94A3B8] text-sm">Departures Annually</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-xl bg-[#071827]/80 border border-white/10 rounded-2xl p-6 text-center"
            >
              <p className="text-3xl font-black text-[#38BDF8] hero-text mb-2">4.9</p>
              <p className="text-[#94A3B8] text-sm">Rated Experience</p>
            </motion.div>
          </div>
          <p className="text-center text-[#94A3B8] text-sm mt-4">
            Fixed departures • Certified leaders • Safety-first Himalayan expeditions
          </p>
        </div>
      </div>

      {/* Search/Filter Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar onSearch={(filters) => navigate('/treks', { state: { filters } })} />
        </div>
      </section>

      {/* Popular Treks */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#38BDF8] text-sm uppercase tracking-[0.3em] mb-4 font-bold">Featured Adventures</p>
            <h2 className="text-4xl md:text-5xl font-black text-white hero-text uppercase mb-6">
              POPULAR <span className="text-[#38BDF8]">EXPEDITIONS</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularTreks.map((trek) => (
              <TrekCard key={trek.id} trek={trek} />
            ))}
          </div>

          <div className="text-center mt-12">
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

      {/* Upcoming Departures */}
      <section className="py-24 bg-[#071827]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#38BDF8] text-sm uppercase tracking-[0.3em] mb-4 font-bold">Book Your Slot</p>
            <h2 className="text-4xl md:text-5xl font-black text-white hero-text uppercase mb-6">
              UPCOMING <span className="text-[#38BDF8]">DEPARTURES</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingDepartures.map((trek) => (
              <motion.div
                key={trek.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#071827] border border-white/10 rounded-2xl overflow-hidden hover:border-[#38BDF8]/30 transition-colors group"
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={trek.image} alt={trek.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent" />
                  {trek.seatsLeft < 10 && (
                    <span className="absolute top-3 right-3 bg-[#F97316] text-white text-xs font-bold px-3 py-1 rounded-full">
                      {trek.seatsLeft} left
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-bold mb-1">{trek.name}</h3>
                      <p className="text-[#94A3B8] text-sm">{trek.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mb-4 text-sm">
                    <div className="flex items-center space-x-2 text-[#94A3B8]">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(trek.nextBatch).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[#94A3B8]">
                      <Clock className="h-4 w-4" />
                      <span>{trek.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-xl font-bold text-white">₹{trek.price.toLocaleString('en-IN')}</span>
                    <button
                      onClick={() => navigate(`/trek/${trek.id}`)}
                      className="bg-[#38BDF8] hover:bg-[#0ea5e9] text-white px-6 py-2 rounded-full text-sm font-semibold transition-all active:scale-95"
                      data-testid={`departure-book-${trek.id}`}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/departures')}
              className="border border-white/30 hover:border-[#38BDF8] text-white px-8 py-3 rounded-full font-semibold transition-all active:scale-95"
              data-testid="view-all-departures-button"
            >
              View All Departures
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                  className="bg-[#071827] border border-white/10 rounded-2xl p-6 text-center hover:border-[#38BDF8]/30 transition-all hover:-translate-y-2 cursor-pointer"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                className="bg-[#071827] border border-white/10 rounded-2xl p-6"
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
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
                className="bg-[#071827] border border-white/10 rounded-2xl p-6 text-center"
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
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#38BDF8] text-sm uppercase tracking-[0.3em] mb-4 font-bold">Knowledge Hub</p>
            <h2 className="text-4xl md:text-5xl font-black text-white hero-text uppercase mb-6">
              TREK <span className="text-[#38BDF8]">GUIDES</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => navigate('/blog')}
                className="bg-[#071827] border border-white/10 rounded-2xl overflow-hidden hover:border-[#38BDF8]/30 transition-all hover:-translate-y-2 cursor-pointer"
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

          <div className="text-center mt-12">
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
            <h2 className="text-5xl md:text-6xl font-black text-white hero-text uppercase mb-6">
              READY TO WALK <span className="text-[#38BDF8]">ABOVE THE CLOUDS?</span>
            </h2>
            <p className="text-[#94A3B8] text-lg mb-8 max-w-2xl mx-auto">
              Start your Himalayan adventure with India's most trusted expedition platform
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={() => navigate('/treks')}
                className="bg-[#F97316] hover:bg-[#ea580c] text-white px-8 py-4 rounded-full text-base font-bold transition-all active:scale-95 shadow-lg"
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

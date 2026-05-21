import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Heart, Target, Mountain, Shield } from 'lucide-react';
import AffiliationsStrip from '../components/AffiliationsStrip';

const About = () => {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-black text-white hero-text uppercase mb-4">
            ABOUT <span className="text-[#38BDF8]">TRAILVISTA</span>
          </h1>
          <p className="text-[#94A3B8] text-lg max-w-3xl mx-auto">
            Your trusted partner for premium Himalayan expeditions and trekking experiences
          </p>
        </motion.div>

        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black text-white hero-text uppercase mb-6">
              OUR <span className="text-[#38BDF8]">STORY</span>
            </h2>
            <div className="space-y-4 text-[#94A3B8] leading-relaxed">
              <p>
                Founded in 2015, TrailVista Expeditions was born from a passion for the mountains and a desire to make Himalayan trekking accessible to everyone. What started as a small team of mountain enthusiasts has grown into one of India's most trusted adventure travel platforms.
              </p>
              <p>
                Over the years, we've successfully guided more than 25,000 trekkers through the pristine landscapes of the Himalayas. Our commitment to safety, sustainability, and authentic experiences has earned us the trust of adventurers from across the globe.
              </p>
              <p>
                Every trek we organize is carefully curated to balance adventure with safety, ensuring that you create memories that last a lifetime while respecting the fragile mountain ecosystems we traverse.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="bg-[#071827] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[160px]">
              <p className="text-4xl font-black text-[#38BDF8] mb-2">10+</p>
              <p className="text-[#94A3B8] text-sm">Years of Experience</p>
            </div>
            <div className="bg-[#071827] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[160px]">
              <p className="text-4xl font-black text-[#38BDF8] mb-2">25K+</p>
              <p className="text-[#94A3B8] text-sm">Happy Trekkers</p>
            </div>
            <div className="bg-[#071827] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[160px]">
              <p className="text-4xl font-black text-[#38BDF8] mb-2">50+</p>
              <p className="text-[#94A3B8] text-sm">Trek Routes</p>
            </div>
            <div className="bg-[#071827] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[160px]">
              <p className="text-4xl font-black text-[#38BDF8] mb-2">4.9</p>
              <p className="text-[#94A3B8] text-sm">Average Rating</p>
            </div>
          </motion.div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#071827] border border-white/10 rounded-2xl p-8"
          >
            <div className="w-14 h-14 bg-[#38BDF8]/10 rounded-full flex items-center justify-center mb-6">
              <Target className="h-7 w-7 text-[#38BDF8]" />
            </div>
            <h3 className="text-2xl font-black text-white hero-text uppercase mb-4">OUR MISSION</h3>
            <p className="text-[#94A3B8] leading-relaxed">
              To make Himalayan trekking accessible, safe, and memorable for everyone while promoting responsible tourism and environmental conservation. We strive to create transformative experiences that connect people with nature and themselves.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#071827] border border-white/10 rounded-2xl p-8"
          >
            <div className="w-14 h-14 bg-[#38BDF8]/10 rounded-full flex items-center justify-center mb-6">
              <Mountain className="h-7 w-7 text-[#38BDF8]" />
            </div>
            <h3 className="text-2xl font-black text-white hero-text uppercase mb-4">OUR VISION</h3>
            <p className="text-[#94A3B8] leading-relaxed">
              To become the most trusted and preferred adventure travel platform in India, known for our unwavering commitment to safety, sustainability, and creating life-changing mountain experiences for adventurers of all levels.
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-black text-white hero-text uppercase text-center mb-12">
            OUR <span className="text-[#38BDF8]">VALUES</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Safety First', desc: 'Your safety is our top priority in every expedition' },
              { icon: Heart, title: 'Passion', desc: 'We love the mountains and it shows in everything we do' },
              { icon: Users, title: 'Community', desc: 'Building a community of responsible mountain enthusiasts' },
              { icon: Award, title: 'Excellence', desc: 'Committed to delivering exceptional experiences' }
            ].map((value, index) => (
              <div key={index} className="bg-[#071827] border border-white/10 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-[#38BDF8]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-6 w-6 text-[#38BDF8]" />
                </div>
                <h4 className="text-white font-bold mb-2">{value.title}</h4>
                <p className="text-[#94A3B8] text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Affiliations & Corporate Partners (reusable strip) */}
        <AffiliationsStrip />

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-black text-white hero-text uppercase text-center mb-12">
            MEET THE <span className="text-[#38BDF8]">TEAM</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Rajesh Kumar', role: 'Founder & Lead Expedition Guide', image: 'https://images.unsplash.com/photo-1486036413660-59d02a64e549' },
              { name: 'Priya Sharma', role: 'Operations Head', image: 'https://images.pexels.com/photos/5779251/pexels-photo-5779251.jpeg' },
              { name: 'Vikram Singh', role: 'Senior Trek Leader', image: 'https://images.unsplash.com/photo-1486036413660-59d02a64e549' }
            ].map((member, index) => (
              <div key={index} className="bg-[#071827] border border-white/10 rounded-2xl overflow-hidden">
                <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h4 className="text-white font-bold text-lg mb-1">{member.name}</h4>
                  <p className="text-[#38BDF8] text-sm">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
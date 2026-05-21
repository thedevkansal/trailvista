import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TrekCard from '../components/TrekCard';
import { treks } from '../data/treksData';

const Expeditions = () => {
  const navigate = useNavigate();
  const expeditions = treks.filter(t => t.type === 'expedition' || t.difficulty === 'Difficult');

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-[#38BDF8] text-sm uppercase tracking-[0.3em] mb-4 font-bold">Elite Adventures</p>
          <h1 className="text-5xl md:text-6xl font-black text-white hero-text uppercase mb-4">
            HIMALAYAN <span className="text-[#38BDF8]">EXPEDITIONS</span>
          </h1>
          <p className="text-[#94A3B8] text-lg max-w-3xl mx-auto">
            High-altitude peak expeditions for experienced climbers. Technical climbs requiring advanced mountaineering skills.
          </p>
        </motion.div>

        {/* Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-[#071827] border border-white/10 rounded-2xl p-6 text-center">
            <h3 className="text-white font-bold mb-2">Experience Required</h3>
            <p className="text-[#94A3B8] text-sm">Previous high-altitude trekking experience mandatory</p>
          </div>
          <div className="bg-[#071827] border border-white/10 rounded-2xl p-6 text-center">
            <h3 className="text-white font-bold mb-2">Fitness Level</h3>
            <p className="text-[#94A3B8] text-sm">Excellent cardiovascular and muscular endurance</p>
          </div>
          <div className="bg-[#071827] border border-white/10 rounded-2xl p-6 text-center">
            <h3 className="text-white font-bold mb-2">Technical Skills</h3>
            <p className="text-[#94A3B8] text-sm">Rope work, ice climbing, and crevasse rescue knowledge</p>
          </div>
          <div className="bg-[#071827] border border-white/10 rounded-2xl p-6 text-center">
            <h3 className="text-white font-bold mb-2">Medical Clearance</h3>
            <p className="text-[#94A3B8] text-sm">Comprehensive health check-up required</p>
          </div>
        </div>

        {/* Expeditions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {expeditions.map((expedition) => (
            <TrekCard key={expedition.id} trek={expedition} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-[#071827] border border-white/10 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-black text-white hero-text uppercase mb-4">
            READY FOR THE <span className="text-[#38BDF8]">CHALLENGE?</span>
          </h2>
          <p className="text-[#94A3B8] mb-6 max-w-2xl mx-auto">
            Our expedition team will guide you through preparation, training, and the climb itself.
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="bg-[#F97316] hover:bg-[#ea580c] text-white px-8 py-3 rounded-full font-bold transition-all active:scale-95"
            data-testid="expeditions-enquire-button"
          >
            Enquire Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Expeditions;
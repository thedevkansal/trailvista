import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, TrendingUp, Mountain } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrekCard = ({ trek }) => {
  const difficultyColor = {
    'Easy': 'bg-green-500/20 text-green-400 border border-green-500/30',
    'Moderate': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    'Difficult': 'bg-red-500/20 text-red-400 border border-red-500/30'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="bg-[#071827] border border-white/10 rounded-2xl overflow-hidden group tv-card-glow flex flex-col h-full shadow-md hover:shadow-2xl transition-all duration-500"
      data-testid={`trek-card-${trek.id}`}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={trek.image} 
          alt={trek.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-4 left-4 flex space-x-2">
          <span className={`${difficultyColor[trek.difficulty] || 'bg-blue-500/20 text-blue-400 border border-blue-500/30'} text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md`}>
            {trek.difficulty}
          </span>
          {trek.seatsLeft && trek.seatsLeft < 10 && (
            <span className="bg-[#F97316] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-lg">
              {trek.seatsLeft} seats left
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#38BDF8] transition-colors duration-300">
            {trek.name}
          </h3>
          <p className="text-[#94A3B8] text-sm mb-4 line-clamp-2 font-light leading-relaxed">
            {trek.shortDescription}
          </p>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-[#38BDF8]" />
              <span className="text-[#94A3B8] font-light">{trek.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4 text-[#38BDF8]" />
              <span className="text-[#94A3B8] font-light">{trek.duration}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Mountain className="h-4 w-4 text-[#38BDF8]" />
              <span className="text-[#94A3B8] font-light">{trek.maxAltitude}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <TrendingUp className="h-4 w-4 text-[#38BDF8]" />
              <span className="text-[#94A3B8] font-light">{trek.difficulty}</span>
            </div>
          </div>
        </div>

        <div>
          {/* Price and Next Batch */}
          {trek.nextBatch && (
            <div className="mb-4 pb-4 border-b border-white/10 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-0.5">Next departure</p>
                <p className="text-sm font-bold text-white">
                  {new Date(trek.nextBatch).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          )}

          {/* Price and Actions */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-0.5">Expedition fee</p>
              <p className="text-2xl font-black text-white">
                ₹{trek.price.toLocaleString('en-IN')}
              </p>
            </div>
            <Link to={`/trek/${trek.id}`}>
              <button 
                className="bg-[#38BDF8] hover:bg-[#0ea5e9] text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all active:scale-95 shadow-md flex items-center space-x-1"
                data-testid={`trek-view-details-${trek.id}`}
              >
                <span>View Details</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TrekCard;
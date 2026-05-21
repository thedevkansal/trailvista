import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, TrendingUp, Mountain } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrekCard = ({ trek }) => {
  const difficultyColor = {
    'Easy': 'bg-green-500',
    'Moderate': 'bg-yellow-500',
    'Difficult': 'bg-red-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="bg-[#071827] border border-white/10 rounded-2xl overflow-hidden group"
      data-testid={`trek-card-${trek.id}`}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={trek.image} 
          alt={trek.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 flex space-x-2">
          <span className={`${difficultyColor[trek.difficulty]} text-white text-xs font-bold px-3 py-1 rounded-full`}>
            {trek.difficulty}
          </span>
          {trek.seatsLeft && trek.seatsLeft < 10 && (
            <span className="bg-[#F97316] text-white text-xs font-bold px-3 py-1 rounded-full">
              {trek.seatsLeft} seats left
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold tv-text-primary text-white mb-2 group-hover:text-[#38BDF8] transition-colors">
          {trek.name}
        </h3>
        <p className="tv-text-secondary text-[#94A3B8] text-sm mb-4 line-clamp-2">
          {trek.shortDescription}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-[#38BDF8]" />
            <span className="text-[#94A3B8]">{trek.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4 text-[#38BDF8]" />
            <span className="text-[#94A3B8]">{trek.duration}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Mountain className="h-4 w-4 text-[#38BDF8]" />
            <span className="text-[#94A3B8]">{trek.maxAltitude}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className="h-4 w-4 text-[#38BDF8]" />
            <span className="text-[#94A3B8]">{trek.difficulty}</span>
          </div>
        </div>

        {/* Price and Next Batch */}
        {trek.nextBatch && (
          <div className="mb-4 pb-4 border-b border-white/10">
            <p className="text-xs text-[#94A3B8] mb-1">Next Batch</p>
            <p className="text-sm font-semibold text-white">
              {new Date(trek.nextBatch).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[#94A3B8]">Starting from</p>
            <p className="text-2xl font-bold text-white">
              ₹{trek.price.toLocaleString('en-IN')}
            </p>
          </div>
          <Link to={`/trek/${trek.id}`}>
            <button 
              className="bg-[#38BDF8] hover:bg-[#0ea5e9] text-white px-6 py-2 rounded-full text-sm font-semibold transition-all active:scale-95"
              data-testid={`trek-view-details-${trek.id}`}
            >
              View Details
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default TrekCard;
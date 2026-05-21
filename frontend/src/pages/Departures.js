import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { treks } from '../data/treksData';

const Departures = () => {
  const navigate = useNavigate();
  const [filterMonth, setFilterMonth] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');

  const departures = treks
    .filter(t => t.nextBatch)
    .sort((a, b) => new Date(a.nextBatch) - new Date(b.nextBatch))
    .filter(t => {
      if (filterRegion && t.region !== filterRegion) return false;
      if (filterDifficulty && t.difficulty !== filterDifficulty) return false;
      if (filterMonth) {
        const month = new Date(t.nextBatch).toLocaleString('en-US', { month: 'long' });
        if (month !== filterMonth) return false;
      }
      return true;
    });

  const groupByMonth = (departures) => {
    const groups = {};
    departures.forEach(trek => {
      const month = new Date(trek.nextBatch).toLocaleString('en-US', { month: 'long', year: 'numeric' });
      if (!groups[month]) groups[month] = [];
      groups[month].push(trek);
    });
    return groups;
  };

  const groupedDepartures = groupByMonth(departures);

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-[#38BDF8] text-sm uppercase tracking-[0.3em] mb-4 font-bold">Fixed Departures</p>
          <h1 className="text-5xl md:text-6xl font-black text-white hero-text uppercase mb-4">
            UPCOMING <span className="text-[#38BDF8]">DEPARTURES</span>
          </h1>
          <p className="text-[#94A3B8] text-lg">Book your slot on guaranteed departure dates</p>
        </motion.div>

        {/* Filters */}
        <div className="bg-[#071827] border border-white/10 rounded-2xl p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[#94A3B8] text-sm mb-2 block">Filter by Month</label>
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#38BDF8]"
                data-testid="departures-month-filter"
              >
                <option value="">All Months</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
              </select>
            </div>

            <div>
              <label className="text-[#94A3B8] text-sm mb-2 block">Filter by Region</label>
              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#38BDF8]"
                data-testid="departures-region-filter"
              >
                <option value="">All Regions</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Kashmir">Kashmir</option>
                <option value="Ladakh">Ladakh</option>
              </select>
            </div>

            <div>
              <label className="text-[#94A3B8] text-sm mb-2 block">Filter by Difficulty</label>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#38BDF8]"
                data-testid="departures-difficulty-filter"
              >
                <option value="">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Difficult">Difficult</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterMonth('');
                  setFilterRegion('');
                  setFilterDifficulty('');
                }}
                className="w-full border border-white/30 hover:border-[#38BDF8] text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                data-testid="departures-clear-filters"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Grouped Departures */}
        <div className="space-y-12">
          {Object.entries(groupedDepartures).map(([month, treks]) => (
            <div key={month}>
              <h2 className="text-3xl font-black text-white hero-text uppercase mb-6">{month}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {treks.map((trek) => (
                  <motion.div
                    key={trek.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#071827] border border-white/10 rounded-2xl p-6 hover:border-[#38BDF8]/30 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-white font-bold text-lg mb-1">{trek.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-[#94A3B8]">
                          <MapPin className="h-4 w-4" />
                          <span>{trek.location}</span>
                        </div>
                      </div>
                      {trek.seatsLeft < 10 && (
                        <span className="bg-[#F97316] text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                          {trek.seatsLeft} left
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-[#38BDF8]" />
                        <span className="text-white font-semibold">
                          {new Date(trek.nextBatch).toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-[#38BDF8]" />
                        <span className="text-[#94A3B8]">{trek.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          trek.difficulty === 'Easy' ? 'bg-green-500' : 
                          trek.difficulty === 'Moderate' ? 'bg-yellow-500' : 'bg-red-500'
                        } text-white`}>
                          {trek.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div>
                        <p className="text-xs text-[#94A3B8] mb-1">Starting from</p>
                        <p className="text-xl font-bold text-white">
                          ₹{trek.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/trek/${trek.id}`)}
                        className="bg-[#38BDF8] hover:bg-[#0ea5e9] text-white px-6 py-2 rounded-full text-sm font-semibold transition-all active:scale-95"
                        data-testid={`departure-view-${trek.id}`}
                      >
                        Book Now
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {departures.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#94A3B8] text-lg">No departures found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Departures;
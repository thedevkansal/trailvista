import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchBar = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    destination: '',
    month: '',
    difficulty: '',
    duration: '',
    budget: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(filters);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#071827] border border-white/10 rounded-2xl p-6 shadow-xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div>
          <label className="text-[#94A3B8] text-sm mb-2 block">Destination</label>
          <select
            name="destination"
            value={filters.destination}
            onChange={handleChange}
            className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#38BDF8]"
            data-testid="search-destination-select"
          >
            <option value="">All</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Kashmir">Kashmir</option>
            <option value="Ladakh">Ladakh</option>
          </select>
        </div>

        <div>
          <label className="text-[#94A3B8] text-sm mb-2 block">Month</label>
          <select
            name="month"
            value={filters.month}
            onChange={handleChange}
            className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#38BDF8]"
            data-testid="search-month-select"
          >
            <option value="">Any Month</option>
            <option value="january">January</option>
            <option value="february">February</option>
            <option value="march">March</option>
            <option value="april">April</option>
            <option value="may">May</option>
            <option value="june">June</option>
            <option value="july">July</option>
            <option value="august">August</option>
            <option value="september">September</option>
            <option value="october">October</option>
            <option value="november">November</option>
            <option value="december">December</option>
          </select>
        </div>

        <div>
          <label className="text-[#94A3B8] text-sm mb-2 block">Difficulty</label>
          <select
            name="difficulty"
            value={filters.difficulty}
            onChange={handleChange}
            className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#38BDF8]"
            data-testid="search-difficulty-select"
          >
            <option value="">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Difficult">Difficult</option>
          </select>
        </div>

        <div>
          <label className="text-[#94A3B8] text-sm mb-2 block">Duration</label>
          <select
            name="duration"
            value={filters.duration}
            onChange={handleChange}
            className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#38BDF8]"
            data-testid="search-duration-select"
          >
            <option value="">Any Duration</option>
            <option value="3-5">3-5 Days</option>
            <option value="6-8">6-8 Days</option>
            <option value="9+">9+ Days</option>
          </select>
        </div>

        <div>
          <label className="text-[#94A3B8] text-sm mb-2 block">Budget</label>
          <select
            name="budget"
            value={filters.budget}
            onChange={handleChange}
            className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#38BDF8]"
            data-testid="search-budget-select"
          >
            <option value="">Any Budget</option>
            <option value="0-10000">Under ₹10,000</option>
            <option value="10000-20000">₹10,000 - ₹20,000</option>
            <option value="20000+">Above ₹20,000</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="w-full bg-[#F97316] hover:bg-[#ea580c] text-white px-6 py-2 rounded-lg font-semibold transition-all active:scale-95 flex items-center justify-center space-x-2"
            data-testid="search-find-treks-button"
          >
            <Search className="h-4 w-4" />
            <span>Find Treks</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchBar;
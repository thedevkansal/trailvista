import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import TrekCard from '../components/TrekCard';
import { treks } from '../data/treksData';

const AllTreks = () => {
  const location = useLocation();
  const [filteredTreks, setFilteredTreks] = useState(treks);
  const [sortBy, setSortBy] = useState('popular');
  const [filters, setFilters] = useState({
    region: '',
    difficulty: '',
    duration: '',
    price: '',
    season: '',
    category: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (location.state?.filters) {
      applyFilters(location.state.filters);
    }
  }, [location.state]);

  const applyFilters = (newFilters) => {
    let filtered = [...treks];

    // Apply filters
    if (newFilters.destination) {
      filtered = filtered.filter(t => t.region === newFilters.destination);
    }
    if (newFilters.difficulty) {
      filtered = filtered.filter(t => t.difficulty === newFilters.difficulty);
    }

    // Apply sorting
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'duration') {
      filtered.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
    }

    setFilteredTreks(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    applyFilters(filters);
  };

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-black text-white hero-text uppercase mb-4">
            ALL <span className="text-[#38BDF8]">TREKS</span>
          </h1>
          <p className="text-[#94A3B8] text-lg">Discover your next Himalayan adventure</p>
        </motion.div>

        {/* Filter and Sort Bar */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 bg-[#071827] border border-white/10 px-4 py-2 rounded-lg text-white hover:border-[#38BDF8] transition-colors"
            data-testid="toggle-filters-button"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
          </button>

          <div className="flex items-center space-x-4">
            <span className="text-[#94A3B8] text-sm">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-[#071827] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#38BDF8]"
              data-testid="sort-select"
            >
              <option value="popular">Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="duration">Duration</option>
              <option value="upcoming">Upcoming Departures</option>
            </select>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#071827] border border-white/10 rounded-2xl p-6 mb-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="text-[#94A3B8] text-sm mb-2 block">Region</label>
                <select
                  name="region"
                  value={filters.region}
                  onChange={handleFilterChange}
                  className="w-full bg-[#020617] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#38BDF8]"
                  data-testid="filter-region-select"
                >
                  <option value="">All Regions</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Kashmir">Kashmir</option>
                  <option value="Ladakh">Ladakh</option>
                </select>
              </div>

              <div>
                <label className="text-[#94A3B8] text-sm mb-2 block">Difficulty</label>
                <select
                  name="difficulty"
                  value={filters.difficulty}
                  onChange={handleFilterChange}
                  className="w-full bg-[#020617] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#38BDF8]"
                  data-testid="filter-difficulty-select"
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
                  onChange={handleFilterChange}
                  className="w-full bg-[#020617] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#38BDF8]"
                >
                  <option value="">Any Duration</option>
                  <option value="short">3-5 Days</option>
                  <option value="medium">6-8 Days</option>
                  <option value="long">9+ Days</option>
                </select>
              </div>

              <div>
                <label className="text-[#94A3B8] text-sm mb-2 block">Price Range</label>
                <select
                  name="price"
                  value={filters.price}
                  onChange={handleFilterChange}
                  className="w-full bg-[#020617] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#38BDF8]"
                >
                  <option value="">Any Budget</option>
                  <option value="budget">Under ₹10,000</option>
                  <option value="mid">₹10,000 - ₹20,000</option>
                  <option value="premium">Above ₹20,000</option>
                </select>
              </div>

              <div>
                <label className="text-[#94A3B8] text-sm mb-2 block">Season</label>
                <select
                  name="season"
                  value={filters.season}
                  onChange={handleFilterChange}
                  className="w-full bg-[#020617] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#38BDF8]"
                >
                  <option value="">All Seasons</option>
                  <option value="winter">Winter</option>
                  <option value="summer">Summer</option>
                  <option value="monsoon">Monsoon</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilters({ region: '', difficulty: '', duration: '', price: '', season: '', category: '' });
                    setFilteredTreks(treks);
                  }}
                  className="w-full border border-white/30 hover:border-[#38BDF8] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  data-testid="clear-filters-button"
                >
                  Clear All
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        <div className="mb-6">
          <p className="text-[#94A3B8]">
            Showing <span className="text-white font-semibold">{filteredTreks.length}</span> treks
          </p>
        </div>

        {/* Trek Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTreks.map((trek) => (
            <TrekCard key={trek.id} trek={trek} />
          ))}
        </div>

        {filteredTreks.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#94A3B8] text-lg">No treks found matching your criteria.</p>
            <button
              onClick={() => {
                setFilters({ region: '', difficulty: '', duration: '', price: '', season: '', category: '' });
                setFilteredTreks(treks);
              }}
              className="mt-4 text-[#38BDF8] hover:text-[#0ea5e9] font-semibold"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTreks;
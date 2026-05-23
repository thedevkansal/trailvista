import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, RotateCcw } from 'lucide-react';
import TrekCard from '../components/TrekCard';
import HorizontalScrollSection from '../components/HorizontalScrollSection';
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

  const applyFilters = useCallback((newFilters, currentSortBy = sortBy) => {
    let filtered = [...treks];

    // Region / Destination
    const regionVal = newFilters.region || newFilters.destination;
    if (regionVal) {
      filtered = filtered.filter(t => t.region.toLowerCase() === regionVal.toLowerCase());
    }

    // Difficulty
    if (newFilters.difficulty) {
      filtered = filtered.filter(t => t.difficulty.toLowerCase() === newFilters.difficulty.toLowerCase());
    }

    // Duration
    const durationVal = newFilters.duration;
    if (durationVal) {
      filtered = filtered.filter(t => {
        const days = parseInt(t.duration);
        if (isNaN(days)) return true;
        if (durationVal === 'short' || durationVal === '3-5') {
          return days >= 3 && days <= 5;
        }
        if (durationVal === 'medium' || durationVal === '6-8') {
          return days >= 6 && days <= 8;
        }
        if (durationVal === 'long' || durationVal === '9+') {
          return days >= 9;
        }
        return true;
      });
    }

    // Price / Budget
    const priceVal = newFilters.price || newFilters.budget;
    if (priceVal) {
      filtered = filtered.filter(t => {
        if (priceVal === 'budget' || priceVal === '0-10000') {
          return t.price < 10000;
        }
        if (priceVal === 'mid' || priceVal === '10000-20000') {
          return t.price >= 10000 && t.price <= 20000;
        }
        if (priceVal === 'premium' || priceVal === '20000+') {
          return t.price > 20000;
        }
        return true;
      });
    }

    // Season / Month
    const seasonVal = newFilters.season || newFilters.month;
    if (seasonVal) {
      filtered = filtered.filter(t => {
        const bestSeasonLower = t.bestSeason.toLowerCase();
        const seasonLower = seasonVal.toLowerCase();
        
        // Specific month
        if (['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'].includes(seasonLower)) {
          return bestSeasonLower.includes(seasonLower);
        }
        
        // Generic season
        if (seasonLower === 'winter') {
          return ['december', 'january', 'february', 'march', 'winter'].some(m => bestSeasonLower.includes(m));
        }
        if (seasonLower === 'summer') {
          return ['april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'summer'].some(m => bestSeasonLower.includes(m));
        }
        if (seasonLower === 'monsoon') {
          return ['july', 'august', 'september', 'monsoon'].some(m => bestSeasonLower.includes(m));
        }
        return true;
      });
    }

    // Category
    if (newFilters.category) {
      filtered = filtered.filter(t => t.category && t.category.includes(newFilters.category.toLowerCase()));
    }

    // Apply sorting
    if (currentSortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (currentSortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (currentSortBy === 'duration') {
      filtered.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
    }

    setFilteredTreks(filtered);
  }, [sortBy]);

  useEffect(() => {
    if (location.state?.filters) {
      const receivedFilters = location.state.filters;
      const mappedFilters = {
        region: receivedFilters.destination || '',
        difficulty: receivedFilters.difficulty || '',
        duration: receivedFilters.duration === '3-5' ? 'short' : receivedFilters.duration === '6-8' ? 'medium' : receivedFilters.duration === '9+' ? 'long' : (receivedFilters.duration || ''),
        price: receivedFilters.budget === '0-10000' ? 'budget' : receivedFilters.budget === '10000-20000' ? 'mid' : receivedFilters.budget === '20000+' ? 'premium' : (receivedFilters.budget || ''),
        season: receivedFilters.month ? (['december', 'january', 'february', 'march'].includes(receivedFilters.month) ? 'winter' : ['july', 'august', 'september'].includes(receivedFilters.month) ? 'monsoon' : 'summer') : (receivedFilters.month || ''),
        category: receivedFilters.category || ''
      };
      setFilters(mappedFilters);
      applyFilters(mappedFilters);
      setShowFilters(true);
    } else {
      applyFilters(filters);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, applyFilters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    applyFilters(filters, value);
  };

  const clearAllFilters = () => {
    const resetFilters = { region: '', difficulty: '', duration: '', price: '', season: '', category: '' };
    setFilters(resetFilters);
    applyFilters(resetFilters);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#020617] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="text-[#38BDF8] text-xs font-bold uppercase tracking-[0.3em] mb-3 block">Himalayan Destinations</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white hero-text uppercase mb-6 leading-tight">
            ALL EXPEDITIONS
          </h1>
          <p className="text-[#94A3B8] text-base sm:text-lg leading-relaxed font-light">
            Explore our handpicked collection of wilderness expeditions. From snow-clad passes in winter to high-altitude meadow crossings, choose your path with India's elite safety-certified rescue team.
          </p>
        </motion.div>

        {/* Filter and Sort Bar */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-[#071827]/40 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center space-x-2 border px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              showFilters 
                ? 'bg-[#38BDF8] border-[#38BDF8] text-white shadow-lg shadow-[#38BDF8]/20' 
                : 'bg-[#071827] border-white/10 text-white hover:border-[#38BDF8]/40'
            }`}
            data-testid="toggle-filters-button"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>

          <div className="flex items-center justify-between md:justify-end gap-4">
            <span className="text-[#94A3B8] text-sm font-medium">Sort by:</span>
            <div className="relative min-w-[200px]">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full bg-[#071827] border border-white/10 hover:border-white/20 focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/50 text-white rounded-xl pl-4 pr-10 py-3 text-sm transition-all duration-300 appearance-none cursor-pointer"
                data-testid="sort-select"
              >
                <option value="popular">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="duration">Duration: Short to Long</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-[#071827] border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
                  {/* Region Select */}
                  <div>
                    <label className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-2 block">Region</label>
                    <div className="relative">
                      <select
                        name="region"
                        value={filters.region}
                        onChange={handleFilterChange}
                        className="w-full bg-[#020617] border border-white/10 hover:border-white/20 focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/50 text-white rounded-xl pl-4 pr-10 py-3 text-sm transition-all duration-300 appearance-none cursor-pointer"
                        data-testid="filter-region-select"
                      >
                        <option value="">All Regions</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Kashmir">Kashmir</option>
                        <option value="Ladakh">Ladakh</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8] pointer-events-none" />
                    </div>
                  </div>

                  {/* Difficulty Select */}
                  <div>
                    <label className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-2 block">Difficulty</label>
                    <div className="relative">
                      <select
                        name="difficulty"
                        value={filters.difficulty}
                        onChange={handleFilterChange}
                        className="w-full bg-[#020617] border border-white/10 hover:border-white/20 focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/50 text-white rounded-xl pl-4 pr-10 py-3 text-sm transition-all duration-300 appearance-none cursor-pointer"
                        data-testid="filter-difficulty-select"
                      >
                        <option value="">All Levels</option>
                        <option value="Easy">Easy</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Difficult">Difficult</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8] pointer-events-none" />
                    </div>
                  </div>

                  {/* Duration Select */}
                  <div>
                    <label className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-2 block">Duration</label>
                    <div className="relative">
                      <select
                        name="duration"
                        value={filters.duration}
                        onChange={handleFilterChange}
                        className="w-full bg-[#020617] border border-white/10 hover:border-white/20 focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/50 text-white rounded-xl pl-4 pr-10 py-3 text-sm transition-all duration-300 appearance-none cursor-pointer"
                      >
                        <option value="">Any Duration</option>
                        <option value="short">3-5 Days</option>
                        <option value="medium">6-8 Days</option>
                        <option value="long">9+ Days</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8] pointer-events-none" />
                    </div>
                  </div>

                  {/* Price Range Select */}
                  <div>
                    <label className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-2 block">Expedition Fee</label>
                    <div className="relative">
                      <select
                        name="price"
                        value={filters.price}
                        onChange={handleFilterChange}
                        className="w-full bg-[#020617] border border-white/10 hover:border-white/20 focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/50 text-white rounded-xl pl-4 pr-10 py-3 text-sm transition-all duration-300 appearance-none cursor-pointer"
                      >
                        <option value="">Any Budget</option>
                        <option value="budget">Under ₹10,000</option>
                        <option value="mid">₹10,000 - ₹20,000</option>
                        <option value="premium">Above ₹20,000</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8] pointer-events-none" />
                    </div>
                  </div>

                  {/* Season Select */}
                  <div>
                    <label className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-2 block">Season</label>
                    <div className="relative">
                      <select
                        name="season"
                        value={filters.season}
                        onChange={handleFilterChange}
                        className="w-full bg-[#020617] border border-white/10 hover:border-white/20 focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/50 text-white rounded-xl pl-4 pr-10 py-3 text-sm transition-all duration-300 appearance-none cursor-pointer"
                      >
                        <option value="">All Seasons</option>
                        <option value="winter">Winter</option>
                        <option value="summer">Summer</option>
                        <option value="monsoon">Monsoon</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8] pointer-events-none" />
                    </div>
                  </div>

                  {/* Reset Button */}
                  <div className="flex items-end">
                    <button
                      onClick={clearAllFilters}
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center space-x-2 hover:text-[#38BDF8] cursor-pointer"
                      data-testid="clear-filters-button"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Clear All</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Info */}
        {filteredTreks.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-[#94A3B8] text-sm">
              Showing <span className="text-white font-semibold">{filteredTreks.length}</span> verified Himalayan {filteredTreks.length === 1 ? 'expedition' : 'expeditions'}
            </p>
          </div>
        )}

        {/* Trek Grid */}
        {/* Mobile: horizontal swipe */}
        <HorizontalScrollSection>
          {filteredTreks.map((trek) => (
            <TrekCard key={trek.id} trek={trek} />
          ))}
        </HorizontalScrollSection>

        {/* Desktop: normal grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTreks.map((trek) => (
            <TrekCard key={trek.id} trek={trek} />
          ))}
        </div>

        {/* Empty State */}
        {filteredTreks.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 bg-[#071827]/30 border border-white/5 rounded-3xl p-8 max-w-lg mx-auto shadow-2xl mt-12"
          >
            <div className="w-16 h-16 bg-[#38BDF8]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <SlidersHorizontal className="h-8 w-8 text-[#38BDF8] opacity-80" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No expeditions found</h3>
            <p className="text-[#94A3B8] text-sm mb-6 leading-relaxed">
              We couldn't find any treks matching your current filters. Try relaxing your budget, duration, or difficulty settings.
            </p>
            <button
              onClick={clearAllFilters}
              className="bg-[#38BDF8] hover:bg-[#0ea5e9] text-white px-6 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 active:scale-95 shadow-lg shadow-[#38BDF8]/20 flex items-center justify-center space-x-2 mx-auto cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset All Filters</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllTreks;
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, RotateCcw } from 'lucide-react';
import TrekCard from '../components/TrekCard';
import PageHeader from '../components/PageHeader';
import { EASE_OUT } from '../components/motion';
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

  const activeCount = Object.values(filters).filter(Boolean).length;

  const FILTER_FIELDS = [
    {
      name: 'region', label: 'Region', testid: 'filter-region-select',
      options: [['', 'All regions'], ['Uttarakhand', 'Uttarakhand'], ['Himachal Pradesh', 'Himachal Pradesh'], ['Kashmir', 'Kashmir'], ['Ladakh', 'Ladakh']],
    },
    {
      name: 'difficulty', label: 'Difficulty', testid: 'filter-difficulty-select',
      options: [['', 'All levels'], ['Easy', 'Easy'], ['Moderate', 'Moderate'], ['Difficult', 'Difficult']],
    },
    {
      name: 'duration', label: 'Duration',
      options: [['', 'Any length'], ['short', '3 to 5 days'], ['medium', '6 to 8 days'], ['long', '9 days or more']],
    },
    {
      name: 'price', label: 'Price',
      options: [['', 'Any budget'], ['budget', 'Under ₹10,000'], ['mid', '₹10,000 to ₹20,000'], ['premium', 'Above ₹20,000']],
    },
    {
      name: 'season', label: 'Season',
      options: [['', 'All seasons'], ['winter', 'Winter'], ['summer', 'Summer'], ['monsoon', 'Monsoon']],
    },
  ];

  const selectClass =
    'h-11 w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-[#020617] pl-4 pr-10 text-sm text-white hover:border-white/20 focus:border-[#38BDF8] focus:outline-none';

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#020617] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader lines={['Every trek,', 'every season']}>
          <p>
            Snow passes in winter, high meadows in summer. Filter by region, length and budget to find the one that fits.
          </p>
        </PageHeader>

        {/* Filter and sort bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            className="tv-btn-ghost h-11 px-5 text-sm"
            data-testid="toggle-filters-button"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {showFilters ? 'Hide filters' : 'Filters'}
            {activeCount > 0 && (
              <span className="tv-num flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#F2A65A] px-1.5 text-xs font-bold text-[#1A1208]">
                {activeCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3">
            <label htmlFor="sort-select" className="flex-shrink-0 text-sm text-[#94A3B8]">Sort by</label>
            <div className="relative w-full sm:w-56">
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className={`${selectClass} rounded-full bg-[#071827]`}
                data-testid="sort-select"
              >
                <option value="popular">Most popular</option>
                <option value="price-low">Price, low to high</option>
                <option value="price-high">Price, high to low</option>
                <option value="duration">Shortest first</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            </div>
          </div>
        </div>

        {/* Filters panel */}
        <AnimatePresence initial={false}>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="mb-8 overflow-hidden"
            >
              <div className="rounded-3xl border border-white/10 bg-[#071827] p-5 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
                  {FILTER_FIELDS.map((field) => (
                    <div key={field.name}>
                      <label htmlFor={`filter-${field.name}`} className="mb-2 block text-sm font-medium text-white">
                        {field.label}
                      </label>
                      <div className="relative">
                        <select
                          id={`filter-${field.name}`}
                          name={field.name}
                          value={filters[field.name]}
                          onChange={handleFilterChange}
                          className={selectClass}
                          data-testid={field.testid}
                        >
                          {field.options.map(([value, text]) => (
                            <option key={value} value={value}>{text}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                      </div>
                    </div>
                  ))}

                  <div className="flex items-end">
                    <button
                      onClick={clearAllFilters}
                      disabled={activeCount === 0}
                      className="tv-btn-ghost h-11 w-full px-4 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                      data-testid="clear-filters-button"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Clear all
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results info */}
        {filteredTreks.length > 0 && (
          <p className="mb-6 text-sm text-[#94A3B8]" aria-live="polite">
            <span className="tv-num font-semibold text-white">{filteredTreks.length}</span>{' '}
            {filteredTreks.length === 1 ? 'trek' : 'treks'}
            {activeCount > 0 ? ' match your filters' : ' open for booking'}
          </p>
        )}

        {/* Trek grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredTreks.map((trek) => (
            <TrekCard key={trek.id} trek={trek} />
          ))}
        </div>

        {/* Empty state */}
        {filteredTreks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="rounded-3xl border border-dashed border-white/20 p-8 sm:p-12"
          >
            <h2 className="font-display text-3xl font-medium tracking-tight text-white">No treks match those filters</h2>
            <p className="mt-3 max-w-md text-[#94A3B8]">
              Try a wider budget, a different season or a longer trip. Or clear everything and start again.
            </p>
            <button onClick={clearAllFilters} className="tv-btn-primary mt-8 h-12 px-7 text-sm">
              Clear filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllTreks;

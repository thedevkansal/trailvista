import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { EASE_OUT } from '../components/motion';

const Gallery = () => {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Campsites', 'Snow Trails', 'Summit Views', 'Forest Routes', 'Trekkers'];

  const images = [
    { 
      url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=800', 
      title: 'Under the Milky Way', 
      category: 'Campsites',
      aspect: 'aspect-[3/4]'
    },
    { 
      url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=800', 
      title: 'First light on the peak', 
      category: 'Summit Views',
      aspect: 'aspect-video'
    },
    { 
      url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=800', 
      title: 'Ascending the ridge', 
      category: 'Trekkers',
      aspect: 'aspect-[4/5]'
    },
    { 
      url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800', 
      title: 'Whispering pines', 
      category: 'Forest Routes',
      aspect: 'aspect-square'
    },
    { 
      url: 'https://images.unsplash.com/photo-1767763713139-2e5e6aadd428?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxNzV8MHwxfHNlYXJjaHwzfHx0cmVra2luZyUyMGdyb3VwJTIwc25vd3xlbnwwfHx8fDE3NzkzOTMyMzl8MA&ixlib=rb-4.1.0&q=85', 
      title: 'Fresh winter powder', 
      category: 'Snow Trails',
      aspect: 'aspect-[3/2]'
    },
    { 
      url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=80&w=800', 
      title: 'Brahmatal night shelter', 
      category: 'Campsites',
      aspect: 'aspect-[4/5]'
    },
    { 
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800', 
      title: 'Trishul massif horizon', 
      category: 'Summit Views',
      aspect: 'aspect-video'
    },
    { 
      url: 'https://images.pexels.com/photos/12121705/pexels-photo-12121705.jpeg', 
      title: 'Above the clouds', 
      category: 'Trekkers',
      aspect: 'aspect-[3/2]'
    },
    { 
      url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=800', 
      title: 'Autumn birch glade', 
      category: 'Forest Routes',
      aspect: 'aspect-[3/4]'
    },
    { 
      url: 'https://images.unsplash.com/photo-1673505411900-f6b228603625?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHw0fHxtb3VudGFpbiUyMHN1bW1pdCUyMHZpZXclMjBsYW5kc2NhcGV8ZW58MHx8fHwxNzc5MzkzMzc0fDA&ixlib=rb-4.1.0&q=85', 
      title: 'Into the whiteout', 
      category: 'Snow Trails',
      aspect: 'aspect-square'
    },
    { 
      url: 'https://images.unsplash.com/photo-1666501548252-d455a2b9554d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwyfHx0cmVra2luZyUyMGdyb3VwJTIwY2FtcGluZyUyMHRlbnRzJTIwYWR2ZW50dXJlfGVufDB8fHx8MTc3OTM5MzM3NHww&ixlib=rb-4.1.0&q=85', 
      title: 'High meadow camp', 
      category: 'Campsites',
      aspect: 'aspect-[3/2]'
    },
    { 
      url: 'https://images.unsplash.com/photo-1677820915322-88e580e7fe70?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHw0fHxoaW1hbGF5YW4lMjBtb3VudGFpbiUyMHBlYWtzJTIwc25vd3xlbnwwfHx8fDE3NzkzOTMzNzR8MA&ixlib=rb-4.1.0&q=85', 
      title: 'Peaks from Kuari Pass', 
      category: 'Summit Views',
      aspect: 'aspect-[4/3]'
    },
    { 
      url: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=800', 
      title: 'Solitary explorer', 
      category: 'Trekkers',
      aspect: 'aspect-[3/4]'
    },
    { 
      url: 'https://images.unsplash.com/photo-1677820915319-0b9312776320?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwzfHxoaW1hbGF5YW4lMjBtb3VudGFpbiUyMHBlYWtzJTIwc25vd3xlbnwwfHx8fDE3NzkzOTMzNzR8MA&ixlib=rb-4.1.0&q=85', 
      title: 'Snowline in the pines', 
      category: 'Forest Routes',
      aspect: 'aspect-video'
    },
    { 
      url: 'https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?auto=format&fit=crop&q=80&w=800', 
      title: 'Frozen ridge walk', 
      category: 'Snow Trails',
      aspect: 'aspect-[3/2]'
    }
  ];

  const filteredImages = activeCategory === 'All'
    ? images
    : images.filter(img => img.category === activeCategory);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIdx === null) return;
      if (e.key === 'Escape') setSelectedIdx(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIdx, filteredImages]);

  const handleNext = () => {
    setSelectedIdx(prev => (prev === null || prev === filteredImages.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setSelectedIdx(prev => (prev === null || prev === 0 ? filteredImages.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#020617] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader lines={['From the trail']}>
          <p>Camps, summits and the people who reached them, photographed on our Himalayan departures.</p>
        </PageHeader>

        {/* Category filters */}
        <div className="mb-10 flex flex-wrap gap-1 md:mb-14" role="group" aria-label="Filter photos">
          {categories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setSelectedIdx(null);
                }}
                aria-pressed={active}
                className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  active ? 'text-[#020617]' : 'text-[#94A3B8] hover:text-white'
                }`}
                data-testid={`gallery-filter-${cat.toLowerCase().replace(' ', '-')}`}
              >
                {active && (
                  <motion.span
                    layoutId="gallery-filter-pill"
                    className="absolute inset-0 rounded-full bg-white shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Masonry grid */}
        <div className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3">
          {filteredImages.map((image, index) => (
            <motion.button
              type="button"
              key={image.url}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              onClick={() => setSelectedIdx(index)}
              className="tv-cinematic group relative block w-full break-inside-avoid overflow-hidden rounded-3xl bg-[#071827] text-left !outline-offset-4"
              aria-label={`Open ${image.title}`}
            >
              <img
                src={image.url}
                alt={image.title}
                loading="lazy"
                className="w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#020617]/85 via-[#020617]/10 to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                <p className="text-xs text-white/70">{image.category}</p>
                <p className="mt-1 font-display text-xl font-medium text-white">{image.title}</p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedIdx !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIdx(null)}
              className="tv-cinematic fixed inset-0 z-[100] flex items-center justify-center bg-[#020617]/95 p-4 backdrop-blur-md"
              role="dialog"
              aria-modal="true"
              aria-label={filteredImages[selectedIdx].title}
            >
              <button
                onClick={() => setSelectedIdx(null)}
                className="tv-btn-ghost absolute right-4 top-4 z-10 h-11 w-11 sm:right-6 sm:top-6"
                aria-label="Close"
                data-testid="gallery-close-modal"
              >
                <X className="h-5 w-5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="tv-btn-ghost absolute bottom-6 left-4 z-10 h-11 w-11 sm:bottom-auto sm:left-8"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <motion.figure
                key={selectedIdx}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                onClick={(e) => e.stopPropagation()}
                className="flex w-full max-w-4xl flex-col items-center"
              >
                <div className="relative max-h-[70vh] overflow-hidden rounded-3xl bg-black">
                  <img
                    src={filteredImages[selectedIdx].url}
                    alt={filteredImages[selectedIdx].title}
                    className="h-auto max-h-[70vh] w-full object-contain"
                  />
                </div>
                <figcaption className="mt-6 text-center">
                  <p className="font-display text-2xl font-medium tracking-tight text-white">{filteredImages[selectedIdx].title}</p>
                  <p className="mt-1 text-sm text-white/60">
                    {filteredImages[selectedIdx].category} · <span className="tv-num">{selectedIdx + 1} of {filteredImages.length}</span>
                  </p>
                </figcaption>
              </motion.figure>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="tv-btn-ghost absolute bottom-6 right-4 z-10 h-11 w-11 sm:bottom-auto sm:right-8"
                aria-label="Next photo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Gallery;

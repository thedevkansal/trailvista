import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

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
      title: 'First Light on Peak Peak', 
      category: 'Summit Views',
      aspect: 'aspect-video'
    },
    { 
      url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=800', 
      title: 'Ascending the Ridge', 
      category: 'Trekkers',
      aspect: 'aspect-[4/5]'
    },
    { 
      url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800', 
      title: 'Whispering Pines', 
      category: 'Forest Routes',
      aspect: 'aspect-square'
    },
    { 
      url: 'https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&q=80&w=800', 
      title: 'Fresh Winter Powder', 
      category: 'Snow Trails',
      aspect: 'aspect-[3/2]'
    },
    { 
      url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=80&w=800', 
      title: 'Brahmatal Night Shelter', 
      category: 'Campsites',
      aspect: 'aspect-[4/5]'
    },
    { 
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800', 
      title: 'Trishul Massif Horizon', 
      category: 'Summit Views',
      aspect: 'aspect-video'
    },
    { 
      url: 'https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&q=80&w=800', 
      title: 'Expedition Team Summit', 
      category: 'Trekkers',
      aspect: 'aspect-[3/2]'
    },
    { 
      url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=800', 
      title: 'Autumn Birch Glade', 
      category: 'Forest Routes',
      aspect: 'aspect-[3/4]'
    },
    { 
      url: 'https://images.unsplash.com/photo-1502613374890-fc53b0172931?auto=format&fit=crop&q=80&w=800', 
      title: 'Blizzard Trail Markers', 
      category: 'Snow Trails',
      aspect: 'aspect-square'
    },
    { 
      url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=800', 
      title: 'High Meadows Retreat', 
      category: 'Campsites',
      aspect: 'aspect-[3/2]'
    },
    { 
      url: 'https://images.unsplash.com/photo-1549558549-415fe4c37b81?auto=format&fit=crop&q=80&w=800', 
      title: 'The Golden Crest', 
      category: 'Summit Views',
      aspect: 'aspect-[4/3]'
    },
    { 
      url: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=800', 
      title: 'Solitary Explorer', 
      category: 'Trekkers',
      aspect: 'aspect-[3/4]'
    },
    { 
      url: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&q=80&w=800', 
      title: 'Green Valley Entrance', 
      category: 'Forest Routes',
      aspect: 'aspect-video'
    },
    { 
      url: 'https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?auto=format&fit=crop&q=80&w=800', 
      title: 'Frozen Ridge Walk', 
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
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black hero-text uppercase mb-4 tracking-wider">
            EXPEDITION <span className="text-[#38BDF8]">GALLERY</span>
          </h1>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            High-fidelity moments and documentary visuals from our real Himalayan trekking summits.
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedIdx(null);
              }}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all duration-300 border cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#38BDF8] border-[#38BDF8] text-white shadow-lg shadow-[#38BDF8]/20'
                  : 'bg-[#071827] border-white/10 text-[#94A3B8] hover:border-[#38BDF8]/30 hover:text-white'
              }`}
              data-testid={`gallery-filter-${cat.toLowerCase().replace(' ', '-')}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bento / Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.url}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              onClick={() => setSelectedIdx(index)}
              className="break-inside-avoid cursor-pointer group block"
            >
              <div className="relative overflow-hidden rounded-2xl border border-white/10 hover:border-[#38BDF8]/40 transition-all duration-500 bg-[#071827] shadow-lg">
                <img 
                  src={image.url} 
                  alt={image.title}
                  className={`w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out`}
                />
                
                {/* Visual Glassmorphism overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-[#020617]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="bg-[#38BDF8] text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md mb-2 inline-block">
                      {image.category}
                    </span>
                    <h3 className="text-white text-base font-black tracking-wide flex items-center justify-between">
                      <span>{image.title}</span>
                      <ZoomIn className="h-4 w-4 text-[#38BDF8]" />
                    </h3>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cinematic Lightbox Modal */}
        <AnimatePresence>
          {selectedIdx !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIdx(null)}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedIdx(null)}
                className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors cursor-pointer bg-white/5 p-2 rounded-full border border-white/10 focus:outline-none"
                data-testid="gallery-close-modal"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-4 sm:left-8 text-white/70 hover:text-white transition-colors cursor-pointer bg-white/5 p-3 rounded-full border border-white/10 focus:outline-none"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Lightbox Content Container */}
              <motion.div
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-4xl w-full flex flex-col items-center"
              >
                <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black max-h-[70vh]">
                  <img 
                    src={filteredImages[selectedIdx].url} 
                    alt={filteredImages[selectedIdx].title}
                    className="w-full h-auto max-h-[70vh] object-contain"
                  />
                </div>
                
                {/* Image Info */}
                <div className="mt-6 text-center">
                  <span className="bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {filteredImages[selectedIdx].category}
                  </span>
                  <h3 className="text-white text-2xl font-black tracking-wide mt-3">{filteredImages[selectedIdx].title}</h3>
                  <p className="text-[#64748B] text-xs mt-2 uppercase tracking-widest">
                    Image {selectedIdx + 1} of {filteredImages.length}
                  </p>
                </div>
              </motion.div>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 sm:right-8 text-white/70 hover:text-white transition-colors cursor-pointer bg-white/5 p-3 rounded-full border border-white/10 focus:outline-none"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Gallery;
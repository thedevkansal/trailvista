import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    { url: 'https://images.pexels.com/photos/12121705/pexels-photo-12121705.jpeg', title: 'Summit Success', category: 'Peaks' },
    { url: 'https://images.unsplash.com/photo-1767763713139-2e5e6aadd428', title: 'Group Ascent', category: 'Teams' },
    { url: 'https://images.unsplash.com/photo-1698763953037-02519fb98565', title: 'Mountain Vista', category: 'Landscapes' },
    { url: 'https://images.unsplash.com/photo-1773081834522-7c375c2d4a21', title: 'Starry Peaks', category: 'Night Sky' },
    { url: 'https://images.unsplash.com/photo-1666501548252-d455a2b9554d', title: 'Base Camp', category: 'Camps' },
    { url: 'https://images.unsplash.com/photo-1632751796489-cd5902a5737c', title: 'Group Camping', category: 'Camps' },
    { url: 'https://images.pexels.com/photos/11091486/pexels-photo-11091486.jpeg', title: 'Winter Camp', category: 'Camps' },
    { url: 'https://images.unsplash.com/photo-1629976791862-5749e12b2f40', title: 'Snow Trek', category: 'Winter' },
    { url: 'https://images.unsplash.com/photo-1677820915319-0b9312776320', title: 'Frozen Trail', category: 'Winter' },
    { url: 'https://images.unsplash.com/photo-1692685820422-61b43dff3fca', title: 'Peak View', category: 'Landscapes' },
    { url: 'https://images.unsplash.com/photo-1777461788029-54db5f3971c2', title: 'Summit Silhouette', category: 'Peaks' },
    { url: 'https://images.unsplash.com/photo-1673505411900-f6b228603625', title: 'Mountain Conqueror', category: 'Peaks' }
  ];

  const categories = ['All', 'Peaks', 'Camps', 'Teams', 'Landscapes', 'Winter', 'Night Sky'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredImages = activeCategory === 'All' 
    ? images 
    : images.filter(img => img.category === activeCategory);

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white hero-text uppercase mb-4">
            EXPEDITION <span className="text-[#38BDF8]">GALLERY</span>
          </h1>
          <p className="text-[#94A3B8] text-lg">Moments captured from our Himalayan adventures</p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-[#38BDF8] text-white'
                  : 'bg-[#071827] border border-white/10 text-[#94A3B8] hover:border-[#38BDF8]'
              }`}
              data-testid={`gallery-filter-${cat.toLowerCase().replace(' ', '-')}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filteredImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              onClick={() => setSelectedImage(image)}
              className="break-inside-avoid cursor-pointer group"
            >
              <div className="relative overflow-hidden rounded-2xl border border-white/10 hover:border-[#38BDF8]/30 transition-all">
                <img 
                  src={image.url} 
                  alt={image.title}
                  className="w-full h-auto group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold">{image.title}</h3>
                    <p className="text-[#38BDF8] text-sm">{image.category}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-[#38BDF8] transition-colors"
              data-testid="gallery-close-modal"
            >
              <X className="h-8 w-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl w-full"
            >
              <img 
                src={selectedImage.url} 
                alt={selectedImage.title}
                className="w-full h-auto rounded-2xl"
              />
              <div className="mt-4 text-center">
                <h3 className="text-white text-2xl font-bold">{selectedImage.title}</h3>
                <p className="text-[#38BDF8]">{selectedImage.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
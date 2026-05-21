import React from 'react';
import Marquee from 'react-fast-marquee';
import { motion } from 'framer-motion';

const GalleryMarquee = ({ images }) => {
  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-[#38BDF8] text-sm uppercase tracking-[0.3em] mb-4 font-bold">Expedition Moments</p>
          <h2 className="text-4xl md:text-5xl font-black text-white hero-text uppercase mb-6">
            WITNESS THE <span className="text-[#38BDF8]">JOURNEY</span>
          </h2>
        </motion.div>
      </div>

      <Marquee gradient={false} speed={30} pauseOnHover={true}>
        {images.map((img, index) => (
          <div key={index} className="mx-2">
            <div className="w-80 h-64 rounded-2xl overflow-hidden border border-white/10 hover:scale-105 transition-transform duration-300">
              <img 
                src={img.url} 
                alt={img.description}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default GalleryMarquee;
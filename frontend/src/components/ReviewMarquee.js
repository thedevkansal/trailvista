import React from 'react';
import Marquee from 'react-fast-marquee';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const ReviewMarquee = ({ reviews }) => {
  return (
    <div className="py-24 bg-[#071827]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-[#38BDF8] text-sm uppercase tracking-[0.3em] mb-4 font-bold">Trekker Stories</p>
          <h2 className="text-4xl md:text-5xl font-black text-white hero-text uppercase mb-6">
            HEAR FROM <span className="text-[#38BDF8]">ADVENTURERS</span>
          </h2>
        </motion.div>
      </div>

      <Marquee gradient={false} speed={25} pauseOnHover={true}>
        {reviews.map((review) => (
          <div key={review.id} className="mx-3">
            <div className="w-96 bg-[#071827] border border-white/10 rounded-2xl p-6 hover:border-[#38BDF8]/30 transition-colors">
              {/* Rating */}
              <div className="flex space-x-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#F97316] text-[#F97316]" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-[#94A3B8] text-sm leading-relaxed mb-4">
                "{review.review}"
              </p>

              {/* Reviewer Info */}
              <div className="flex items-center space-x-3 pt-4 border-t border-white/10">
                <img 
                  src={review.image} 
                  alt={review.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-white font-semibold text-sm">{review.name}</p>
                  <p className="text-[#94A3B8] text-xs">{review.trek}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default ReviewMarquee;
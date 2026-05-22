import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import HorizontalScrollSection from '../components/HorizontalScrollSection';
import { reviews } from '../data/treksData';

const Reviews = () => {
  const allReviews = [
    ...reviews,
    {
      id: 7,
      name: 'Amit Verma',
      trek: 'Roopkund Trek',
      rating: 5,
      review: 'Incredible trek with mysterious skeleton lake! The guides were knowledgeable and ensured our safety throughout.',
      image: 'https://images.unsplash.com/photo-1486036413660-59d02a64e549',
      date: '2025-10-15'
    },
    {
      id: 8,
      name: 'Neha Kapoor',
      trek: 'Kedarkantha Trek',
      rating: 5,
      review: 'Perfect winter trek! The snow-covered trails and summit views exceeded all expectations.',
      image: 'https://images.pexels.com/photos/5779251/pexels-photo-5779251.jpeg',
      date: '2025-12-20'
    },
    {
      id: 9,
      name: 'Karan Malhotra',
      trek: 'Kuari Pass Trek',
      rating: 5,
      review: 'Stunning views of Nanda Devi! Well-organized trek with excellent food and camping arrangements.',
      image: 'https://images.unsplash.com/photo-1486036413660-59d02a64e549',
      date: '2025-11-05'
    }
  ];

  const stats = [
    { label: 'Average Rating', value: '4.9/5' },
    { label: 'Total Reviews', value: '2,500+' },
    { label: 'Happy Trekkers', value: '25,000+' },
    { label: 'Repeat Customers', value: '40%' }
  ];

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white hero-text uppercase mb-4">
            TREKKER <span className="text-[#38BDF8]">REVIEWS</span>
          </h1>
          <p className="text-[#94A3B8] text-lg">What our adventurers say about their experiences</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#071827] border border-white/10 rounded-2xl p-6 text-center"
            >
              <p className="text-3xl font-black text-[#38BDF8] mb-2">{stat.value}</p>
              <p className="text-[#94A3B8] text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Reviews Grid */}
        {/* Mobile: horizontal swipe */}
        <HorizontalScrollSection>
          {allReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#071827] border border-white/10 rounded-2xl p-5 h-full"
            >
              <div className="flex space-x-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#F97316] text-[#F97316]" />
                ))}
              </div>
              <p className="text-[#94A3B8] text-sm leading-relaxed mb-4">
                "{review.review}"
              </p>
              <div className="flex items-center space-x-3 pt-4 border-t border-white/10">
                <img src={review.image} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-white font-bold text-sm">{review.name}</p>
                  <p className="text-[#38BDF8] text-xs">{review.trek}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </HorizontalScrollSection>

        {/* Desktop: normal grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#071827] border border-white/10 rounded-2xl p-6"
            >
              {/* Rating */}
              <div className="flex space-x-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[#F97316] text-[#F97316]" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-[#94A3B8] leading-relaxed mb-6">
                "{review.review}"
              </p>

              {/* Reviewer Info */}
              <div className="flex items-center space-x-4 pt-6 border-t border-white/10">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-white font-bold">{review.name}</p>
                  <p className="text-[#38BDF8] text-sm">{review.trek}</p>
                  <p className="text-[#94A3B8] text-xs mt-1">
                    {new Date(review.date).toLocaleDateString('en-IN', {
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Testimonials Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-[#071827] border border-white/10 rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl font-black text-white hero-text uppercase mb-4">
            VIDEO <span className="text-[#38BDF8]">TESTIMONIALS</span>
          </h2>
          <p className="text-[#94A3B8] mb-8">Watch our trekkers share their experiences</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#020617] border border-white/10 rounded-xl h-48 flex items-center justify-center">
                <p className="text-[#94A3B8]">Video Testimonial {i}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reviews;
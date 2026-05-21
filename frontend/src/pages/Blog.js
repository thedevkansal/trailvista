import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { blogPosts } from '../data/treksData';

const Blog = () => {
  const allPosts = [
    ...blogPosts,
    { id: 4, title: 'Essential Gear Guide for Himalayan Treks', category: 'Gear Guide', excerpt: 'Complete checklist of equipment and gear needed for successful Himalayan trekking.', image: 'https://images.pexels.com/photos/11091486/pexels-photo-11091486.jpeg', date: '2025-12-25', slug: 'essential-gear-guide' },
    { id: 5, title: 'Top 10 Winter Treks in India', category: 'Trek Guide', excerpt: 'Explore the best snow treks during winter season across the Indian Himalayas.', image: 'https://images.unsplash.com/photo-1677820915319-0b9312776320', date: '2025-12-20', slug: 'top-winter-treks' },
    { id: 6, title: 'Dealing with Altitude Sickness', category: 'Health Guide', excerpt: 'Prevention, symptoms, and treatment of altitude sickness during high-altitude treks.', image: 'https://images.unsplash.com/photo-1777461788029-54db5f3971c2', date: '2025-12-15', slug: 'altitude-sickness-guide' }
  ];

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-black text-white hero-text uppercase mb-4">
            TREK <span className="text-[#38BDF8]">GUIDES</span>
          </h1>
          <p className="text-[#94A3B8] text-lg">Expert advice, tips, and guides for your Himalayan adventures</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPosts.map((post) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#071827] border border-white/10 rounded-2xl overflow-hidden hover:border-[#38BDF8]/30 transition-all hover:-translate-y-2"
            >
              <div className="h-56 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#38BDF8] text-xs font-bold uppercase tracking-wider">
                    {post.category}
                  </span>
                  <div className="flex items-center space-x-2 text-[#94A3B8] text-xs">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
                <h2 className="text-white font-bold text-xl mb-3 hover:text-[#38BDF8] transition-colors">
                  {post.title}
                </h2>
                <p className="text-[#94A3B8] text-sm leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <button className="text-[#38BDF8] hover:text-[#0ea5e9] font-semibold text-sm transition-colors">
                  Read More →
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
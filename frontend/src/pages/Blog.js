import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { blogPosts } from '../data/blogData';

const Blog = () => {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#020617] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-black text-white hero-text uppercase mb-4 tracking-wider">
            TREK <span className="text-[#38BDF8]">GUIDES</span>
          </h1>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            Expert advice, gear checklists, fitness tips, and winter prep from our expedition leaders.
          </p>
        </motion.div>

        {/* Blog Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#071827] border border-white/10 rounded-2xl overflow-hidden hover:border-[#38BDF8]/30 hover:shadow-xl hover:shadow-[#38BDF8]/5 transition-all duration-300 flex flex-col h-full group"
            >
              {/* Card Image */}
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-750 ease-out"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#38BDF8] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-1">
                {/* Meta details */}
                <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-3">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#38BDF8]" />
                    <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#38BDF8]" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-white font-bold text-xl mb-3 group-hover:text-[#38BDF8] transition-colors leading-tight">
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h2>

                {/* Excerpt */}
                <p className="text-[#94A3B8] text-sm leading-relaxed mb-6 flex-1">
                  {post.excerpt}
                </p>

                {/* Action Link */}
                <Link 
                  to={`/blog/${post.id}`} 
                  className="text-[#38BDF8] hover:text-[#0ea5e9] font-bold text-sm transition-colors inline-flex items-center space-x-1.5 mt-auto group/btn cursor-pointer"
                >
                  <span>Read Full Article</span>
                  <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
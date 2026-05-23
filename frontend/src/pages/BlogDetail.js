import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, ChevronRight, User } from 'lucide-react';
import { blogPosts } from '../data/blogData';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const post = blogPosts.find((p) => p.id === parseInt(id));

  if (!post) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center text-white bg-[#020617]">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Article Not Found</h2>
          <p className="text-[#94A3B8] mb-6">The blog post you are looking for does not exist or has been moved.</p>
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[#38BDF8] hover:bg-[#0ea5e9] text-white font-bold rounded-xl transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Blogs</span>
          </Link>
        </div>
      </div>
    );
  }

  // Get related posts (excluding current post, max 3)
  const relatedPosts = blogPosts
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#020617] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb navigation */}
        <div className="flex items-center space-x-2 text-sm text-[#94A3B8] mb-8">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#38BDF8] font-medium truncate max-w-[200px] sm:max-w-none">{post.title}</span>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/blog')}
          className="inline-flex items-center space-x-2 text-[#94A3B8] hover:text-[#38BDF8] transition-colors mb-6 group cursor-pointer focus:outline-none"
        >
          <ArrowLeft className="h-4.5 w-4.5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Back to Guides</span>
        </button>

        {/* Article Container */}
        <article className="bg-[#071827] border border-white/10 rounded-3xl overflow-hidden shadow-2xl mb-16">
          {/* Featured Image */}
          <div className="h-64 sm:h-[400px] w-full overflow-hidden relative">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071827] via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 sm:left-8">
              <span className="bg-[#38BDF8] text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg">
                {post.category}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#94A3B8] mb-6 border-b border-white/5 pb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-[#38BDF8]" />
                <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-[#38BDF8]" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                  {post.author.avatar ? (
                    <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-3 w-3 text-white" />
                  )}
                </div>
                <span className="font-medium text-white">{post.author.name}</span>
                <span className="text-[#64748B]">({post.author.role})</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight mb-8">
              {post.title}
            </h1>

            {/* Article Sections */}
            <div className="prose prose-invert max-w-none space-y-8 text-sm sm:text-base leading-relaxed text-[#CBD5E1]">
              {post.sections.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide border-l-4 border-[#38BDF8] pl-3.5 py-0.5">
                    {section.heading}
                  </h2>
                  <p className="whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </article>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <div className="border-t border-white/10 pt-12">
            <h3 className="text-2xl font-black uppercase text-white mb-8 tracking-wider">
              RELATED <span className="text-[#38BDF8]">ARTICLES</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rPost) => (
                <motion.article
                  key={rPost.id}
                  whileHover={{ y: -6 }}
                  className="bg-[#071827] border border-white/10 rounded-2xl overflow-hidden hover:border-[#38BDF8]/30 transition-all flex flex-col h-full"
                >
                  <div className="h-40 overflow-hidden relative">
                    <img src={rPost.image} alt={rPost.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-[#38BDF8] text-[10px] font-bold uppercase tracking-wider mb-2">
                      {rPost.category}
                    </span>
                    <h4 className="text-white font-bold text-sm mb-2 hover:text-[#38BDF8] transition-colors line-clamp-2">
                      <Link to={`/blog/${rPost.id}`}>{rPost.title}</Link>
                    </h4>
                    <p className="text-[#94A3B8] text-xs line-clamp-2 mb-4 leading-relaxed">
                      {rPost.excerpt}
                    </p>
                    <Link
                      to={`/blog/${rPost.id}`}
                      className="text-[#38BDF8] hover:text-[#0ea5e9] font-bold text-xs mt-auto flex items-center space-x-1"
                    >
                      <span>Read Article</span>
                      <span>→</span>
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogDetail;

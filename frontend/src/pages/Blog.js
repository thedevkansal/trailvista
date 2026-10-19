import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { FadeIn } from '../components/motion';
import { blogPosts } from '../data/blogData';

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const Blog = () => {
  const [lead, ...rest] = blogPosts;

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#020617] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader lines={['Field notes and', 'trek guides']}>
          <p>Gear checklists, training plans and winter prep, written by the leaders who walk these trails every season.</p>
        </PageHeader>

        {/* Lead story */}
        {lead && (
          <FadeIn as="article" className="mb-16">
            <Link to={`/blog/${lead.id}`} className="group grid grid-cols-1 gap-8 !outline-offset-4 lg:grid-cols-12 lg:items-end">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] bg-[#071827] lg:col-span-7">
                <img
                  src={lead.image}
                  alt={lead.title}
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
              </div>
              <div className="lg:col-span-5 lg:pb-4">
                <p className="text-sm text-[#94A3B8]">
                  {lead.category} · {formatDate(lead.date)} · {lead.readTime}
                </p>
                <h2 className="mt-3 font-display text-3xl font-medium leading-[1.1] tracking-tight text-white sm:text-4xl">
                  {lead.title}
                </h2>
                <p className="mt-4 leading-relaxed text-[#94A3B8]">{lead.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-white group-hover:text-[#38BDF8]">
                  Read the guide <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </FadeIn>
        )}

        {/* Remaining posts */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 border-t border-white/10 pt-12 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, idx) => (
            <FadeIn as="article" key={post.id} delay={0.06 * (idx % 3)} className="h-full">
              <Link to={`/blog/${post.id}`} className="group flex h-full flex-col !outline-offset-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[#071827]">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                  />
                </div>
                <p className="mt-5 text-sm text-[#94A3B8]">
                  {post.category} · {post.readTime}
                </p>
                <h2 className="mt-2 font-display text-2xl font-medium leading-[1.15] tracking-tight text-white transition-colors group-hover:text-[#38BDF8]">
                  {post.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#94A3B8]">{post.excerpt}</p>
                <p className="mt-4 text-xs text-[#94A3B8]">{formatDate(post.date)}</p>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;

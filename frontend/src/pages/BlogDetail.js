import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { RevealHeading, FadeIn } from '../components/motion';
import { blogPosts } from '../data/blogData';

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

// Section copy marks emphasis with **double asterisks**; show it as bold text.
const renderInline = (text) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>
    ) : (
      part
    )
  );

const BlogDetail = () => {
  const { id } = useParams();

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const post = blogPosts.find((p) => p.id === parseInt(id));

  if (!post) {
    return (
      <div className="flex min-h-screen items-center bg-[#020617] px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <h1 className="font-display text-5xl font-medium leading-[1] tracking-tight text-white sm:text-6xl">
            We can’t find that guide
          </h1>
          <p className="mt-6 max-w-md text-lg text-[#94A3B8]">It may have been moved or retired.</p>
          <Link to="/blog" className="tv-btn-primary mt-10 h-12 px-7 text-sm">
            Browse all guides
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
      <article>
        {/* Header */}
        <header className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#94A3B8] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            All guides
          </Link>
          <p className="mt-8 text-sm text-[#94A3B8]">
            {post.category} · <span className="tv-num">{formatDate(post.date)}</span> · {post.readTime}
          </p>
          <RevealHeading
            as="h1"
            lines={[post.title]}
            className="mt-3 font-display text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
          />
          <FadeIn delay={0.2} className="mt-8 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white/10">
              {post.author.avatar ? (
                <img src={post.author.avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <User className="h-4 w-4 text-white" />
              )}
            </span>
            <span>
              <span className="block text-sm font-semibold text-white">{post.author.name}</span>
              <span className="block text-xs text-[#94A3B8]">{post.author.role}</span>
            </span>
          </FadeIn>
        </header>

        {/* Featured image */}
        <FadeIn delay={0.1} className="mx-auto mt-12 max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="aspect-[16/9] overflow-hidden rounded-[28px] bg-[#071827]">
            <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
          </div>
        </FadeIn>

        {/* Body */}
        <div className="mx-auto mt-16 max-w-3xl space-y-12 px-4 sm:px-6 lg:px-8">
          {post.sections.map((section, idx) => (
            <section key={idx}>
              <h2 className="font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
                {section.heading}
              </h2>
              <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-[#94A3B8]">
                {renderInline(section.content)}
              </p>
            </section>
          ))}
        </div>
      </article>

      {/* Related guides */}
      {relatedPosts.length > 0 && (
        <aside className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-t border-white/10 pt-12">
            <RevealHeading
              as="h2"
              lines={['Keep reading']}
              className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl"
            />
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-3">
              {relatedPosts.map((rPost, i) => (
                <FadeIn as="article" key={rPost.id} delay={0.06 * i} className="h-full">
                  <Link to={`/blog/${rPost.id}`} className="group flex h-full flex-col !outline-offset-4">
                    <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-[#071827]">
                      <img
                        src={rPost.image}
                        alt={rPost.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                      />
                    </div>
                    <p className="mt-5 text-sm text-[#94A3B8]">
                      {rPost.category} · {rPost.readTime}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-medium leading-[1.2] tracking-tight text-white transition-colors group-hover:text-[#38BDF8]">
                      {rPost.title}
                    </h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#94A3B8]">{rPost.excerpt}</p>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default BlogDetail;

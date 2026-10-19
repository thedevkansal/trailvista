import React from 'react';
import { Star } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { ReviewSpotlight, SectionHeader } from '../components/HomeSections';
import { FadeIn, CountUp } from '../components/motion';
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
    { label: 'average rating', value: <CountUp to={4.9} decimals={1} suffix="/5" /> },
    { label: 'reviews', value: <CountUp to={2500} suffix="+" /> },
    { label: 'trekkers guided', value: <CountUp to={25000} suffix="+" /> },
    { label: 'come back for another trek', value: <CountUp to={40} suffix="%" /> }
  ];

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader lines={['In their', 'own words']}>
          <p>What trekkers say once they’re back down, unedited.</p>
        </PageHeader>

        {/* Stats */}
        <dl className="mb-24 grid grid-cols-2 gap-x-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="border-t border-white/10 py-8">
              <dd className="font-display text-3xl font-medium tracking-tight text-white sm:text-5xl">{stat.value}</dd>
              <dt className="mt-2 text-xs text-[#94A3B8] sm:text-sm">{stat.label}</dt>
            </div>
          ))}
        </dl>

        {/* Spotlight */}
        <section className="mb-24">
          <ReviewSpotlight reviews={allReviews.slice(0, 6)} />
        </section>

        {/* All reviews */}
        <section>
          <SectionHeader lines={['Every review']} />
          <div className="columns-1 gap-5 space-y-5 md:columns-2 lg:columns-3">
            {allReviews.map((review, i) => (
              <FadeIn
                key={review.id}
                delay={0.05 * (i % 3)}
                className="break-inside-avoid rounded-3xl border border-white/10 bg-[#071827] p-6 sm:p-7"
              >
                <div className="flex gap-1" aria-label={`${review.rating} out of 5`}>
                  {[...Array(5)].map((_, s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${s < review.rating ? 'fill-[#F2A65A] text-[#F2A65A]' : 'text-white/20'}`}
                    />
                  ))}
                </div>
                <blockquote className="mt-5 leading-relaxed text-white">“{review.review}”</blockquote>
                <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                  <img src={review.image} alt="" className="h-10 w-10 rounded-full object-cover" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{review.name}</p>
                    <p className="truncate text-xs text-[#94A3B8]">
                      {review.trek},{' '}
                      {new Date(review.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Reviews;

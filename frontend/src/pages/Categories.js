import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight, Mountain, Snowflake, Sun, Calendar, TrendingUp, Flag, Users } from 'lucide-react';
import TrekCard from '../components/TrekCard';
import PageHeader from '../components/PageHeader';
import { FadeIn } from '../components/motion';
import { treks, categories } from '../data/treksData';

const icons = {
  'Footprints': Mountain,
  'Snowflake': Snowflake,
  'Sun': Sun,
  'Calendar': Calendar,
  'Mountain': Mountain,
  'TrendingUp': TrendingUp,
  'Flag': Flag,
  'Users': Users
};

const inCategory = (id) => treks.filter(t => t.category && t.category.includes(id));

// One cover photo per category, avoiding repeats where the category has another trek to show.
const covers = (() => {
  const used = new Set();
  return Object.fromEntries(categories.map((c) => {
    const list = inCategory(c.id);
    const pick = list.find((t) => !used.has(t.image)) || list[0];
    if (pick) used.add(pick.image);
    return [c.id, pick?.image];
  }));
})();

const Categories = () => {
  const { id } = useParams();

  if (id) {
    const category = categories.find(c => c.id === id);
    const categoryTreks = inCategory(id);

    return (
      <div className="min-h-screen pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/categories" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#94A3B8] hover:text-white">
            All categories
          </Link>
          <PageHeader lines={[category?.name || 'Treks']}>
            <p>
              <span className="tv-num">{categoryTreks.length}</span> {categoryTreks.length === 1 ? 'trek' : 'treks'} with open departures.
            </p>
          </PageHeader>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categoryTreks.map((trek, i) => (
              <FadeIn key={trek.id} delay={0.06 * (i % 3)} className="h-full">
                <TrekCard trek={trek} />
              </FadeIn>
            ))}
          </div>

          {categoryTreks.length === 0 && (
            <div className="rounded-3xl border border-dashed border-white/20 p-8 sm:p-10">
              <h2 className="font-display text-2xl font-medium text-white">Nothing here yet</h2>
              <p className="mt-2 max-w-md text-[#94A3B8]">We haven’t scheduled treks in this category for the season. Every other route is open for booking.</p>
              <Link to="/treks" className="tv-btn-primary mt-8 h-11 px-6 text-sm">
                Browse all treks
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader lines={['Treks by', 'style and season']}>
          <p>From weekend first-timers to roped expeditions. Choose the kind of trip you have in mind.</p>
        </PageHeader>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => {
            const IconComponent = icons[category.icon] || Mountain;
            const list = inCategory(category.id);
            const cover = covers[category.id];
            return (
              <FadeIn key={category.id} delay={0.05 * (index % 4)}>
                <Link
                  to={`/categories/${category.id}`}
                  className="tv-cinematic group relative flex h-56 flex-col justify-end overflow-hidden rounded-3xl bg-[#071827] p-5 sm:h-72"
                >
                  {cover ? (
                    <>
                      <img
                        src={cover}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-[#020617]/30 to-transparent" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0B2A44] to-[#020617]">
                      <IconComponent className="absolute right-5 top-5 h-8 w-8 text-white/30" />
                    </div>
                  )}
                  <div className="relative flex items-end justify-between gap-3">
                    <div>
                      <h2 className="font-display text-2xl font-medium tracking-tight text-white">{category.name}</h2>
                      <p className="mt-1 text-sm text-white/70">
                        {list.length > 0 ? (
                          <>
                            <span className="tv-num">{list.length}</span> {list.length === 1 ? 'trek' : 'treks'}
                          </>
                        ) : (
                          'On request'
                        )}
                      </p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 flex-shrink-0 text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;

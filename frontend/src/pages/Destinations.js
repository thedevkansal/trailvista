import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import TrekCard from '../components/TrekCard';
import PageHeader from '../components/PageHeader';
import { FadeIn } from '../components/motion';
import { treks, destinations } from '../data/treksData';

const Destinations = () => {
  const { id } = useParams();

  const allDestinations = destinations || [
    { id: 'uttarakhand', name: 'Uttarakhand', description: 'Land of Gods', trekCount: 5, image: 'https://images.unsplash.com/photo-1629976791862-5749e12b2f40' },
    { id: 'himachal', name: 'Himachal Pradesh', description: 'Adventure Paradise', trekCount: 3, image: 'https://images.unsplash.com/photo-1666501548252-d455a2b9554d' },
    { id: 'kashmir', name: 'Kashmir', description: 'Paradise on Earth', trekCount: 2, image: 'https://images.unsplash.com/photo-1632751796489-cd5902a5737c' },
    { id: 'ladakh', name: 'Ladakh', description: 'High Altitude Desert', trekCount: 2, image: 'https://images.pexels.com/photos/11091486/pexels-photo-11091486.jpeg' }
  ];

  if (id) {
    const destination = allDestinations.find(d => d.id === id);
    const destinationTreks = treks.filter(t => t.region.toLowerCase().includes(id));

    return (
      <div className="min-h-screen pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/destinations" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#94A3B8] hover:text-white">
            All destinations
          </Link>
          <PageHeader lines={['Treks in', destination?.name || 'this region']}>
            <p>{destination?.description}</p>
            <p className="mt-2 text-sm">
              <span className="tv-num">{destinationTreks.length}</span> {destinationTreks.length === 1 ? 'trek' : 'treks'}
            </p>
          </PageHeader>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {destinationTreks.map((trek, i) => (
              <FadeIn key={trek.id} delay={0.06 * (i % 3)} className="h-full">
                <TrekCard trek={trek} />
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader lines={['Where in the', 'Himalaya?']}>
          <p>Four regions, each with its own season and character. Pick one to see every trek we run there.</p>
        </PageHeader>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {allDestinations.map((dest, index) => (
            <FadeIn key={dest.id} delay={0.08 * (index % 2)}>
              <Link
                to={`/destinations/${dest.id}`}
                className="tv-cinematic group relative block h-[420px] overflow-hidden rounded-[28px] md:h-[480px]"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-[#020617]/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-8">
                  <div>
                    <p className="text-sm text-white/70">
                      <span className="tv-num">{dest.trekCount}</span> {dest.trekCount === 1 ? 'trek' : 'treks'}
                    </p>
                    <h2 className="mt-1 font-display text-4xl font-medium tracking-tight text-white sm:text-5xl">{dest.name}</h2>
                    <p className="mt-2 text-white/80">{dest.description}</p>
                  </div>
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors duration-300 group-hover:bg-[#F2A65A] group-hover:text-[#1A1208]">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Destinations;

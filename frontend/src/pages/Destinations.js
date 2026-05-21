import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import TrekCard from '../components/TrekCard';
import { treks, destinations } from '../data/treksData';

const Destinations = () => {
  const navigate = useNavigate();
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-black text-white hero-text uppercase mb-4">
              TREKS IN <span className="text-[#38BDF8]">{destination?.name.toUpperCase()}</span>
            </h1>
            <p className="text-[#94A3B8] text-lg">{destination?.description}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinationTreks.map((trek) => (
              <TrekCard key={trek.id} trek={trek} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-black text-white hero-text uppercase mb-4">
            EXPLORE <span className="text-[#38BDF8]">DESTINATIONS</span>
          </h1>
          <p className="text-[#94A3B8] text-lg">Discover trekking destinations across the Himalayas</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {allDestinations.map((dest, index) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/destinations/${dest.id}`)}
              className="relative h-96 rounded-2xl overflow-hidden cursor-pointer group"
            >
              <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-3xl font-black text-white hero-text uppercase mb-2">{dest.name}</h3>
                <p className="text-[#94A3B8] mb-4">{dest.description}</p>
                <p className="text-[#38BDF8] font-semibold">{dest.trekCount} Treks Available</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Destinations;
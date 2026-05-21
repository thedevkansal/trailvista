import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Mountain, Snowflake, Sun, Calendar, TrendingUp, Flag, Users } from 'lucide-react';
import TrekCard from '../components/TrekCard';
import { treks, categories } from '../data/treksData';

const Categories = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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

  if (id) {
    const category = categories.find(c => c.id === id);
    const categoryTreks = treks.filter(t => t.category && t.category.includes(id));

    return (
      <div className="min-h-screen pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-black text-white hero-text uppercase mb-4">
              {category?.name.toUpperCase()}
            </h1>
            <p className="text-[#94A3B8] text-lg">{categoryTreks.length} treks available</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryTreks.map((trek) => (
              <TrekCard key={trek.id} trek={trek} />
            ))}
          </div>

          {categoryTreks.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#94A3B8] text-lg">No treks found in this category yet.</p>
              <button onClick={() => navigate('/treks')} className="mt-4 text-[#38BDF8] hover:text-[#0ea5e9]">
                View All Treks
              </button>
            </div>
          )}
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
            TREK <span className="text-[#38BDF8]">CATEGORIES</span>
          </h1>
          <p className="text-[#94A3B8] text-lg">Find treks that match your style and experience level</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const IconComponent = icons[category.icon] || Mountain;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/categories/${category.id}`)}
                className="bg-[#071827] border border-white/10 rounded-2xl p-6 text-center hover:border-[#38BDF8]/30 transition-all hover:-translate-y-2 cursor-pointer"
              >
                <div className="w-14 h-14 bg-[#38BDF8]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="h-7 w-7 text-[#38BDF8]" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{category.name}</h3>
                <p className="text-[#94A3B8] text-sm">{category.count} treks</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;
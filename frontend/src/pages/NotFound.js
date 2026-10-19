import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-[#020617] px-4 text-white">
    <div className="text-center max-w-md">
      <Compass className="h-12 w-12 text-[#38BDF8] mx-auto mb-6" />
      <p className="text-[#38BDF8] text-sm font-bold uppercase tracking-widest mb-2">404</p>
      <h1 className="text-3xl font-black hero-text uppercase mb-4">Off the trail</h1>
      <p className="text-[#94A3B8] mb-8">We couldn't find the page you were looking for.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/" className="bg-[#38BDF8] hover:bg-[#0ea5e9] text-white px-6 py-3 rounded-lg font-bold text-sm">
          Back to home
        </Link>
        <Link to="/treks" className="border border-white/20 hover:border-[#38BDF8] text-white px-6 py-3 rounded-lg font-bold text-sm">
          Browse treks
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;

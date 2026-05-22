import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, Calendar, TrendingUp, Mountain, Users, Shield, 
  Download, MessageCircle, ChevronDown, Check, X, Clock
} from 'lucide-react';
import EnquiryModal from '../components/EnquiryModal';
import { treks, reviews as allReviews } from '../data/treksData';

const TrekDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const trek = treks.find(t => t.id === id);
  
  if (!trek) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Trek not found</h2>
          <button onClick={() => navigate('/treks')} className="text-[#38BDF8]">
            View all treks
          </button>
        </div>
      </div>
    );
  }

  const trekReviews = allReviews.filter(r => r.trek === trek.name);

  const itinerary = [
    { day: 1, title: 'Arrival and Base Camp', description: `Arrive at the base location. Complete registration and briefing. Check equipment and meet your trek leader and group.` },
    { day: 2, title: 'Base Camp to Camp 1', description: `Begin trekking through scenic trails. Gradual ascent with breaks. Reach Camp 1 and settle in for the night.` },
    { day: 3, title: 'Camp 1 to Camp 2', description: `Continue ascending through diverse terrain. Experience changing landscapes. Camp at higher altitude.` },
    { day: 4, title: 'Camp 2 to Summit Camp', description: `Trek to summit camp. Final preparations for summit push. Early rest for summit day.` },
    { day: 5, title: 'Summit Day', description: `Early morning summit attempt. Reach the peak and celebrate. Descend to lower camp.` },
    { day: 6, title: 'Descent and Return', description: `Complete descent back to base. Celebrate completion. Departure to your onward journey.` }
  ];

  const inclusions = [
    'Accommodation in tents/guesthouses',
    'All meals from dinner on Day 1 to breakfast on last day',
    'Experienced trek leader and support staff',
    'First-aid medical kits and oxygen cylinder',
    'Permits and entry fees',
    'Trekking equipment (tent, sleeping bag, mattress)',
    'Kitchen and dining tent',
    'All necessary safety equipment'
  ];

  const exclusions = [
    'Transportation to/from base camp',
    'Personal trekking gear (shoes, backpack, etc.)',
    'Insurance',
    'Porter to carry personal luggage',
    'Any meals during transit',
    'Any expense of personal nature'
  ];

  const thingsToCarry = [
    'Trekking shoes (waterproof)',
    'Backpack (40-60L)',
    'Warm layers and fleece',
    'Rain jacket and pants',
    'Trekking poles',
    'Water bottle (2L)',
    'Headlamp with spare batteries',
    'Personal medical kit',
    'Sunglasses and sunscreen',
    'Personal toiletries'
  ];

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-24">
      {/* Hero Section */}
      <div className="tv-cinematic relative h-[60vh] mb-12">
        <img 
          src={trek.image} 
          alt={trek.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/70 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                  trek.difficulty === 'Easy' ? 'bg-green-500' : 
                  trek.difficulty === 'Moderate' ? 'bg-yellow-500' : 'bg-red-500'
                } text-white`}>
                  {trek.difficulty}
                </span>
                {trek.seatsLeft < 10 && (
                  <span className="px-4 py-1 rounded-full text-sm font-bold bg-[#F97316] text-white">
                    Only {trek.seatsLeft} seats left
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white hero-text uppercase mb-4">
                {trek.name}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-[#94A3B8]">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>{trek.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>{trek.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mountain className="h-5 w-5" />
                  <span>{trek.maxAltitude}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>{trek.difficulty}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Facts */}
            <div className="bg-[#071827] border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Quick Facts</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-[#94A3B8] text-sm mb-1">Duration</p>
                  <p className="text-white font-bold">{trek.duration}</p>
                </div>
                <div>
                  <p className="text-[#94A3B8] text-sm mb-1">Max Altitude</p>
                  <p className="text-white font-bold">{trek.maxAltitude}</p>
                </div>
                <div>
                  <p className="text-[#94A3B8] text-sm mb-1">Difficulty</p>
                  <p className="text-white font-bold">{trek.difficulty}</p>
                </div>
                <div>
                  <p className="text-[#94A3B8] text-sm mb-1">Best Season</p>
                  <p className="text-white font-bold">{trek.bestSeason}</p>
                </div>
              </div>
            </div>

            {/* Overview */}
            <div className="bg-[#071827] border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
              <p className="text-[#94A3B8] leading-relaxed">{trek.overview}</p>
            </div>

            {/* Itinerary */}
            <div className="bg-[#071827] border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Day-wise Itinerary</h2>
              <div className="space-y-4">
                {itinerary.map((day) => (
                  <details key={day.day} className="group">
                    <summary className="flex items-center justify-between cursor-pointer bg-[#020617] border border-white/10 rounded-lg p-4 hover:border-[#38BDF8] transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-[#38BDF8]/10 rounded-full flex items-center justify-center">
                          <span className="text-[#38BDF8] font-bold">D{day.day}</span>
                        </div>
                        <div>
                          <p className="text-white font-bold">{day.title}</p>
                        </div>
                      </div>
                      <ChevronDown className="h-5 w-5 text-[#94A3B8] group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="mt-2 ml-14 text-[#94A3B8] text-sm leading-relaxed">
                      {day.description}
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Inclusions/Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#071827] border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Inclusions</h3>
                <ul className="space-y-2">
                  {inclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-[#94A3B8] text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#071827] border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Exclusions</h3>
                <ul className="space-y-2">
                  {exclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-[#94A3B8] text-sm">
                      <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Things to Carry */}
            <div className="bg-[#071827] border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Things to Carry</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {thingsToCarry.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-[#94A3B8] text-sm">
                    <Check className="h-4 w-4 text-[#38BDF8] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            {trekReviews.length > 0 && (
              <div className="bg-[#071827] border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Trekker Reviews</h2>
                <div className="space-y-4">
                  {trekReviews.map((review) => (
                    <div key={review.id} className="border-b border-white/10 pb-4 last:border-0">
                      <div className="flex items-start space-x-4">
                        <img 
                          src={review.image} 
                          alt={review.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <p className="text-white font-bold">{review.name}</p>
                            <div className="flex space-x-1">
                              {[...Array(review.rating)].map((_, i) => (
                                <svg key={i} className="h-4 w-4 fill-[#F97316] text-[#F97316]" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <p className="text-[#94A3B8] text-sm">{review.review}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Card - Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-[#071827] border border-white/10 rounded-2xl p-6">
              <div className="mb-6">
                <p className="text-[#94A3B8] text-sm mb-2">Starting from</p>
                <p className="text-4xl font-black text-white">₹{trek.price.toLocaleString('en-IN')}</p>
                <p className="text-[#94A3B8] text-sm mt-1">per person</p>
              </div>

              {trek.nextBatch && (
                <div className="mb-6 pb-6 border-b border-white/10">
                  <p className="text-[#94A3B8] text-sm mb-2">Next Departure</p>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-[#38BDF8]" />
                    <p className="text-white font-bold">
                      {new Date(trek.nextBatch).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  {trek.seatsLeft < 10 && (
                    <p className="text-[#F97316] text-sm mt-2 font-semibold">
                      Hurry! Only {trek.seatsLeft} seats remaining
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <button 
                  onClick={() => setEnquiryOpen(true)}
                  className="w-full bg-[#F97316] hover:bg-[#ea580c] text-white px-6 py-3 rounded-lg font-bold transition-all active:scale-95"
                  data-testid="trek-detail-book-now"
                >
                  Book Now
                </button>
                <button 
                  onClick={() => setEnquiryOpen(true)}
                  className="w-full border border-white/30 hover:border-[#38BDF8] text-white px-6 py-3 rounded-lg font-bold transition-all active:scale-95 flex items-center justify-center space-x-2"
                  data-testid="trek-detail-send-enquiry"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Send Enquiry</span>
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-white/20 hover:border-[#25D366] hover:bg-[#25D366]/10 text-white px-3 py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all active:scale-95 flex items-center justify-center space-x-1.5"
                    data-testid="trek-detail-whatsapp"
                  >
                    <svg className="h-4 w-4 text-[#25D366] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                    </svg>
                    <span>WhatsApp</span>
                  </a>
                  <button
                    className="border border-white/20 hover:border-[#38BDF8] hover:bg-[#38BDF8]/10 text-white px-3 py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all active:scale-95 flex items-center justify-center space-x-1.5"
                    data-testid="trek-detail-download-brochure"
                  >
                    <Download className="h-4 w-4 text-[#38BDF8] flex-shrink-0" />
                    <span>Brochure</span>
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-[#94A3B8] text-xs text-center">
                  All-inclusive pricing • No hidden costs • Free cancellation up to 15 days before departure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EnquiryModal 
        isOpen={enquiryOpen} 
        onClose={() => setEnquiryOpen(false)} 
        trekName={trek.name}
      />
    </div>
  );
};

export default TrekDetail;

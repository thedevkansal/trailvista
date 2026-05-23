import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, TrendingUp, Mountain, Users, Shield, 
  ChevronDown, Check, X, Clock, ShieldAlert, MessageCircle, Info
} from 'lucide-react';
import EnquiryModal from '../components/EnquiryModal';
import { treks, reviews as allReviews } from '../data/treksData';
import { useAuth } from '../context/AuthContext';
import { loadRazorpay } from '../lib/loadRazorpay';
import {
  createPaymentOrder,
  verifyPayment,
  openRazorpayCheckout,
  AuthRequiredError,
  VERIFY_FAILED_MESSAGE,
} from '../lib/paymentService';

const TrekDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const trek = treks.find(t => t.id === id);
  
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  // Initialize selected date and scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
    if (trek) {
      if (trek.availableDates && trek.availableDates.length > 0) {
        setSelectedDate(trek.availableDates[0]);
      } else if (trek.nextBatch) {
        setSelectedDate(trek.nextBatch);
      }
    }
  }, [id, trek]);

  if (!trek) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-[#020617] text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Trek not found</h2>
          <button onClick={() => navigate('/treks')} className="text-[#38BDF8] font-bold">
            View all treks
          </button>
        </div>
      </div>
    );
  }

  const trekReviews = allReviews.filter(r => r.trek === trek.name);

  // Default Fallbacks
  const defaultItinerary = [
    { day: 1, title: 'Arrival and Base Camp', description: 'Arrive at the base location. Complete registration and briefing. Check equipment and meet your trek leader.' },
    { day: 2, title: 'Base Camp to Camp 1', description: 'Begin trekking through scenic trails. Gradual ascent with breaks. Reach Camp 1 and settle in for the night.' },
    { day: 3, title: 'Camp 1 to Camp 2', description: 'Continue ascending through diverse terrain. Experience changing landscapes.' },
    { day: 4, title: 'Camp 2 to Summit Camp', description: 'Trek to summit camp. Final preparations for summit push.' },
    { day: 5, title: 'Summit Day', description: 'Early morning summit attempt. Reach the peak and celebrate. Descend to lower camp.' },
    { day: 6, title: 'Descent and Return', description: 'Complete descent back to base. Celebrate completion.' }
  ];

  const defaultInclusions = [
    'Accommodation in high-altitude adventure tents (twin/triple sharing)',
    'All vegetarian meals from dinner on Day 1 to breakfast on last day',
    'Certified trek leader, Wilderness First Aid responders, and support staff',
    'Emergency oxygen cylinders, medical stretches, and first-aid kits',
    'National park permits and forest entry fees',
    'High-quality camping gear (sleeping bags, mattresses, crampons/gaiters)'
  ];

  const defaultExclusions = [
    'Transportation to and from the starting base camp',
    'Personal trekking gear (shoes, backpack, rain layers, trekking poles)',
    'Medical or travel insurance',
    'Personal porters to carry individual luggage',
    'Meals during transit to base village'
  ];

  const defaultThingsToCarry = [
    'Waterproof high-ankle trekking shoes with good grip',
    '40-60L backpack with comfortable chest straps and rain cover',
    'Three layers of clothing (moisture-wicking thermals, fleece mid-layer, windproof hardshell)',
    'Polarized UV-protection sunglasses (critical for snow sections)',
    'Warm woolen beanie, balaclava, and sun cap',
    'Insulated thermos water bottles (2 liters minimum)',
    'LED Headlamp with fresh backup battery cells'
  ];

  const itinerary = trek.itinerary || defaultItinerary;
  const inclusions = trek.inclusions || defaultInclusions;
  const exclusions = trek.exclusions || defaultExclusions;
  const thingsToCarry = trek.thingsToCarry || defaultThingsToCarry;
  const safetyNotes = trek.safetyNotes || 'Acclimatization hikes are strictly mandatory. We carry oxygen cylinders and first aid kits on every batch.';
  const specialHighlights = trek.whatMakesSpecial || [];

  const handleBookNow = async () => {
    setPaymentError(null);
    setBookingSuccess(null);
    setShowBookingDialog(false);
    setPaymentLoading(true);

    // Save selected departure date in local storage so verification dialog can display it
    if (selectedDate) {
      localStorage.setItem(`trek_selected_date_${trek.id}`, selectedDate);
    }

    try {
      await loadRazorpay();
      const order = await createPaymentOrder({ trekId: trek.id });

      openRazorpayCheckout({
        order,
        trek,
        user,
        onVerified: async (response) => {
          try {
            setPaymentLoading(true);
            const result = await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              trekId: trek.id,
              amount: trek.price,
              userEmail: user?.email,
              customerName: user?.profile?.full_name || user?.user_metadata?.full_name,
              departureDate: selectedDate,
            });
            if (!result?.success) {
              throw new Error(VERIFY_FAILED_MESSAGE);
            }
            setBookingSuccess({
              ...result,
              selected_date: selectedDate
            });
            setShowBookingDialog(true);
            setPaymentError(null);
          } catch (err) {
            if (err instanceof AuthRequiredError) {
              navigate('/login', { state: { from: location.pathname } });
              return;
            }
            setPaymentError(VERIFY_FAILED_MESSAGE);
            setShowBookingDialog(false);
          } finally {
            setPaymentLoading(false);
          }
        },
        onError: (err) => {
          setPaymentError(err.message || 'Payment failed.');
          setPaymentLoading(false);
        },
      });
    } catch (err) {
      if (err instanceof AuthRequiredError) {
        setPaymentError(err.message);
        navigate('/login', { state: { from: location.pathname } });
        return;
      }
      setPaymentError(err.message || 'Could not start payment.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const scrollToSection = (idName) => {
    setActiveTab(idName);
    const element = document.getElementById(idName);
    if (element) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-24 bg-[#020617] text-white">
      {/* Hero Section */}
      <div className="relative h-[65vh] mb-8 overflow-hidden">
        <img 
          src={trek.image} 
          alt={trek.name}
          className="w-full h-full object-cover transform scale-100 hover:scale-102 transition-transform duration-[4000ms]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  trek.difficulty === 'Easy' ? 'bg-green-500/95 shadow-md shadow-green-500/20' : 
                  trek.difficulty === 'Moderate' ? 'bg-yellow-500/95 shadow-md shadow-yellow-500/20' : 
                  'bg-red-500/95 shadow-md shadow-red-500/20'
                } text-white`}>
                  {trek.difficulty}
                </span>
                {trek.bestSeason && (
                  <span className="px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#38BDF8]/90 text-white shadow-md shadow-[#38BDF8]/10">
                    {trek.bestSeason}
                  </span>
                )}
                {trek.seatsLeft < 10 && (
                  <span className="px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#F97316]/95 text-white shadow-md shadow-[#F97316]/20">
                    Only {trek.seatsLeft} seats left
                  </span>
                )}
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white hero-text uppercase mb-4 leading-tight">
                {trek.name}
              </h1>
              <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-[#CBD5E1] text-sm sm:text-base font-semibold">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-[#38BDF8]" />
                  <span>{trek.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-[#38BDF8]" />
                  <span>{trek.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mountain className="h-5 w-5 text-[#38BDF8]" />
                  <span>{trek.maxAltitude}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-[#38BDF8]" />
                  <span>{trek.difficulty} Grade</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Anchor Tabs */}
      <div className="sticky top-20 z-30 bg-[#020617]/90 border-b border-white/10 backdrop-blur-md mb-8 py-3.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'itinerary', label: 'Itinerary' },
              { id: 'dates', label: 'Departure Dates' },
              { id: 'carry', label: 'What to Carry' },
              { id: 'inclusions', label: 'Inclusions' },
              { id: 'safety', label: 'Safety Guidelines' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`text-sm font-black uppercase tracking-wider transition-colors pb-1 border-b-2 cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#38BDF8] text-[#38BDF8]'
                    : 'border-transparent text-[#94A3B8] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Overview */}
            <section id="overview" className="bg-[#071827] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-2xl font-black uppercase tracking-wider text-white mb-4">Overview</h2>
              <p className="text-[#94A3B8] leading-relaxed text-sm sm:text-base mb-6">
                {trek.overview}
              </p>
              
              {specialHighlights.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/5">
                  <h3 className="text-lg font-bold text-white mb-3">Trek Highlights</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {specialHighlights.map((hl, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-[#94A3B8] text-sm">
                        <Check className="h-4.5 w-4.5 text-[#38BDF8] flex-shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Quick Facts */}
            <div className="bg-[#071827] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-2xl font-black uppercase tracking-wider text-white mb-6">Expedition Facts</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-1">Duration</p>
                  <p className="text-white font-extrabold text-lg">{trek.duration}</p>
                </div>
                <div>
                  <p className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-1">Max Altitude</p>
                  <p className="text-white font-extrabold text-lg">{trek.maxAltitude}</p>
                </div>
                <div>
                  <p className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-1">Difficulty</p>
                  <p className="text-white font-extrabold text-lg">{trek.difficulty}</p>
                </div>
                <div>
                  <p className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-1">Best Season</p>
                  <p className="text-white font-extrabold text-lg">{trek.bestSeason}</p>
                </div>
              </div>
            </div>

            {/* Itinerary */}
            <section id="itinerary" className="bg-[#071827] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-2xl font-black uppercase tracking-wider text-white mb-6">Day-by-Day Itinerary</h2>
              <div className="space-y-4">
                {itinerary.map((day) => (
                  <details key={day.day} className="group">
                    <summary className="flex items-center justify-between cursor-pointer bg-[#020617] border border-white/10 rounded-xl p-4 hover:border-[#38BDF8]/40 transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-[#38BDF8]/10 rounded-lg flex items-center justify-center border border-[#38BDF8]/20">
                          <span className="text-[#38BDF8] font-black text-sm">Day {day.day}</span>
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm sm:text-base">{day.title}</p>
                        </div>
                      </div>
                      <ChevronDown className="h-5 w-5 text-[#94A3B8] group-open:rotate-180 transition-transform duration-300" />
                    </summary>
                    <div className="mt-3 ml-14 text-[#94A3B8] text-sm sm:text-base leading-relaxed border-l-2 border-white/5 pl-4 py-1">
                      {day.description}
                    </div>
                  </details>
                ))}
              </div>
            </section>

            {/* Departure Dates Selector */}
            <section id="dates" className="bg-[#071827] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-2xl font-black uppercase tracking-wider text-white mb-4">Choose Departure Date</h2>
              <p className="text-[#94A3B8] text-sm mb-6">Select from our upcoming fixed departures batch list. Guides, permits, and slots are pre-arranged.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(trek.availableDates || [trek.nextBatch]).map((dateStr) => {
                  const isSelected = selectedDate === dateStr;
                  return (
                    <div
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`cursor-pointer rounded-xl p-4 border flex items-center justify-between transition-all duration-300 ${
                        isSelected 
                          ? 'bg-[#38BDF8]/10 border-[#38BDF8] shadow-lg shadow-[#38BDF8]/5' 
                          : 'bg-[#020617] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Calendar className={`h-5 w-5 ${isSelected ? 'text-[#38BDF8]' : 'text-[#64748B]'}`} />
                        <div>
                          <p className="text-white font-black text-sm">
                            {new Date(dateStr).toLocaleDateString('en-IN', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </p>
                          <p className="text-[#64748B] text-[10px] uppercase font-bold mt-0.5">Fixed Departure</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-[#38BDF8] text-white' : 'bg-white/5 text-[#94A3B8]'
                        }`}>
                          {trek.seatsLeft} slots left
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 bg-[#38BDF8] rounded-full flex items-center justify-center">
                            <Check className="h-3.5 w-3.5 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Inclusions & Exclusions */}
            <section id="inclusions" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#071827] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
                <h3 className="text-xl font-black uppercase tracking-wider text-white mb-4">Inclusions</h3>
                <ul className="space-y-3">
                  {inclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-[#94A3B8] text-sm">
                      <Check className="h-4.5 w-4.5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#071827] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
                <h3 className="text-xl font-black uppercase tracking-wider text-white mb-4">Exclusions</h3>
                <ul className="space-y-3">
                  {exclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-[#94A3B8] text-sm">
                      <X className="h-4.5 w-4.5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Things to Carry */}
            <section id="carry" className="bg-[#071827] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-2xl font-black uppercase tracking-wider text-white mb-4">Things to Carry</h2>
              <p className="text-[#94A3B8] text-sm mb-6">Ensure you prepare these gears before arriving at the base camp. Proper preparation protects you from alpine weather shifts.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {thingsToCarry.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 text-[#94A3B8] text-sm">
                    <Check className="h-4.5 w-4.5 text-[#38BDF8] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Safety Guidelines */}
            <section id="safety" className="bg-[#071827] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-2xl font-black uppercase tracking-wider text-white mb-4">Safety Protocols</h2>
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex items-start space-x-3 mb-6">
                <Info className="h-5 w-5 text-[#F97316] flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                  High altitude treks have dynamic climates and lower oxygen levels. Our emergency protocols are managed in partnership with regional Himalayan rescue divisions.
                </p>
              </div>
              <p className="text-[#94A3B8] leading-relaxed text-sm sm:text-base">
                {safetyNotes}
              </p>
            </section>

            {/* Reviews */}
            {trekReviews.length > 0 && (
              <div className="bg-[#071827] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
                <h2 className="text-2xl font-black uppercase tracking-wider text-white mb-6">Trekker Reviews</h2>
                <div className="space-y-6">
                  {trekReviews.map((review) => (
                    <div key={review.id} className="border-b border-white/10 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-start space-x-4">
                        <img 
                          src={review.image} 
                          alt={review.name}
                          className="w-12 h-12 rounded-full object-cover border border-white/10"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <p className="text-white font-bold">{review.name}</p>
                            <div className="flex space-x-0.5">
                              {[...Array(review.rating)].map((_, i) => (
                                <svg key={i} className="h-4 w-4 fill-[#F97316] text-[#F97316]" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <p className="text-[#94A3B8] text-sm leading-relaxed">{review.review}</p>
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
            <div className="sticky top-40 bg-[#071827] border border-white/10 rounded-2xl p-6 shadow-2xl tv-card-glow hidden lg:block">
              <div className="mb-6">
                <p className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-2">Starting from</p>
                <p className="text-4xl font-black text-white">₹{trek.price.toLocaleString('en-IN')}</p>
                <p className="text-[#94A3B8] text-xs mt-1">all-inclusive price per person</p>
              </div>

              {selectedDate && (
                <div className="mb-6 pb-6 border-b border-white/10">
                  <p className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-2">Selected Departure</p>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-[#38BDF8]" />
                    <p className="text-white font-extrabold">
                      {new Date(selectedDate).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  {trek.seatsLeft < 10 && (
                    <p className="text-[#F97316] text-xs mt-2 font-bold uppercase tracking-wide">
                      Hurry! Only {trek.seatsLeft} seats remaining
                    </p>
                  )}
                </div>
              )}

              <AnimatePresence mode="wait">
                {paymentError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-start space-x-2"
                  >
                    <ShieldAlert className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{paymentError}</span>
                  </motion.div>
                )}
                {bookingSuccess && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm"
                  >
                    <p className="font-bold text-white mb-1">Booking confirmed!</p>
                    <p>{bookingSuccess.message || 'Your trek booking is confirmed.'}</p>
                    {bookingSuccess.selected_date && (
                      <p className="text-xs text-[#38BDF8] mt-1 font-bold">
                        Departure: {new Date(bookingSuccess.selected_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <button 
                  onClick={handleBookNow}
                  disabled={paymentLoading || !!bookingSuccess}
                  className="w-full bg-[#F97316] hover:bg-[#ea580c] text-white px-6 py-3.5 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 tv-btn-cta shadow-lg shadow-[#F97316]/10 cursor-pointer"
                  data-testid="trek-detail-book-now"
                >
                  {paymentLoading ? 'Processing...' : bookingSuccess ? 'Booked' : 'Book Now'}
                </button>
                
                <button 
                  onClick={() => {
                    if (!user) {
                      navigate('/signup', { state: { from: location.pathname } });
                    } else {
                      setEnquiryOpen(true);
                    }
                  }}
                  className="w-full border border-white/20 hover:border-[#38BDF8] hover:bg-white/5 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center space-x-2 text-sm cursor-pointer"
                  data-testid="trek-detail-send-enquiry"
                >
                  <MessageCircle className="h-4.5 w-4.5 text-[#38BDF8]" />
                  <span>Send Enquiry</span>
                </button>
                
                <div className="flex items-center justify-center space-x-1.5 text-[10px] text-[#64748B] pt-2 uppercase font-bold tracking-wide">
                  <Shield className="h-3.5 w-3.5 text-green-500" />
                  <span>Secure booking • Limited seats</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-[#64748B] text-[10px] leading-relaxed text-center">
                  All-inclusive pricing • Free cancellation up to 15 days before departure • 24/7 rescue support
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

      <AnimatePresence>
        {showBookingDialog && bookingSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4"
            onClick={() => setShowBookingDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-md w-full bg-[#071827] border border-green-500/30 rounded-2xl p-8 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto w-14 h-14 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mb-4">
                <Check className="h-7 w-7 text-green-400" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Thank You!</h2>
              <p className="text-lg font-bold text-[#38BDF8] mb-3">Booking Confirmed</p>
              <p className="text-[#94A3B8] text-sm mb-2">
                {bookingSuccess.message || `Your booking for ${trek.name} is confirmed.`}
              </p>
              {bookingSuccess.selected_date && (
                <p className="text-xs text-[#F97316] font-bold mb-4 uppercase tracking-wider">
                  Departure Date: {new Date(bookingSuccess.selected_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              )}
              {bookingSuccess.email_sent && bookingSuccess.email_to && (
                <p className="text-[#94A3B8] text-sm mb-6 border-t border-white/5 pt-4">
                  Confirmation email sent to <span className="text-white font-bold">{bookingSuccess.email_to}</span>
                </p>
              )}
              <button
                onClick={() => setShowBookingDialog(false)}
                className="w-full bg-[#38BDF8] hover:bg-[#0ea5e9] text-white px-6 py-3 rounded-lg font-bold text-sm transition-all cursor-pointer"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Unobtrusive Chat Button */}
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 lg:bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#22c35e] text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="Chat with us on WhatsApp"
        data-testid="trek-detail-whatsapp"
      >
        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
        </svg>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2.5 transition-all duration-500 ease-out text-sm font-black uppercase tracking-wider whitespace-nowrap">
          Chat with us
        </span>
      </a>

      {/* Mobile Sticky Booking Widget */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#071827]/95 border-t border-white/10 p-4 pb-safe flex items-center justify-between backdrop-blur-md shadow-2xl lg:hidden">
        <div>
          <p className="text-[10px] text-[#64748B] uppercase tracking-wider mb-0.5">Starting from</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-black text-white">₹{trek.price.toLocaleString('en-IN')}</span>
            <span className="text-[#94A3B8] text-[10px]">/ person</span>
          </div>
          {selectedDate && (
            <p className="text-[#38BDF8] text-[10px] font-bold uppercase tracking-wider mt-0.5">
              Dept: {new Date(selectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              if (!user) {
                navigate('/signup', { state: { from: location.pathname } });
              } else {
                setEnquiryOpen(true);
              }
            }}
            className="border border-white/20 hover:border-[#38BDF8] text-white p-2.5 rounded-xl font-bold text-xs"
            aria-label="Send Enquiry"
          >
            <MessageCircle className="h-5 w-5" />
          </button>
          <button
            onClick={handleBookNow}
            disabled={paymentLoading || !!bookingSuccess}
            className="bg-[#F97316] hover:bg-[#ea580c] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-lg cursor-pointer"
          >
            {paymentLoading ? 'Processing...' : bookingSuccess ? 'Booked' : 'Book Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrekDetail;

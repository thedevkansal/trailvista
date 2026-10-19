import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calendar, Mountain, Shield, Star,
  ChevronDown, Check, X, ShieldAlert, MessageCircle, Info
} from 'lucide-react';
import EnquiryModal from '../components/EnquiryModal';
import { RevealHeading, EASE_OUT } from '../components/motion';
import { treks, reviews as allReviews } from '../data/treksData';
import { useAuth } from '../context/AuthContext';
import { loadRazorpay } from '../lib/loadRazorpay';
import { upcomingDepartures } from '../lib/departures';
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
    // Only future departures can be booked; default to the earliest one.
    setSelectedDate(trek ? upcomingDepartures(trek)[0] || '' : '');
  }, [id, trek]);

  if (!trek) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-[#020617] px-4 text-white">
        <div className="text-center">
          <h2 className="font-display text-4xl font-medium tracking-tight text-white">We can’t find that trek</h2>
          <p className="mt-3 text-[#94A3B8]">It may have been renamed or retired for the season.</p>
          <button onClick={() => navigate('/treks')} className="tv-btn-primary mt-8 h-12 px-7 text-sm">
            Browse all treks
          </button>
        </div>
      </div>
    );
  }

  const trekReviews = allReviews.filter(r => r.trek === trek.name);
  const departures = upcomingDepartures(trek);

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
    if (!selectedDate) {
      setPaymentError('There are no upcoming departures for this trek yet. Send us an enquiry instead.');
      return;
    }
    setPaymentError(null);
    setBookingSuccess(null);
    setShowBookingDialog(false);
    setPaymentLoading(true);

    try {
      await loadRazorpay();
      const order = await createPaymentOrder({ trekId: trek.id, departureDate: selectedDate || null });

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
        setPaymentLoading(false);
        navigate('/login', { state: { from: location.pathname } });
        return;
      }
      setPaymentError(err.message || 'Could not start payment.');
      setPaymentLoading(false);
    }
    // On success the checkout stays open; its own callbacks clear the loading state.
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

  const formatDate = (dateStr, opts = { day: 'numeric', month: 'short', year: 'numeric' }) =>
    new Date(dateStr).toLocaleDateString('en-IN', opts);

  const openEnquiry = () => {
    if (!user) {
      navigate('/signup', { state: { from: location.pathname } });
    } else {
      setEnquiryOpen(true);
    }
  };

  const bookLabel = paymentLoading ? 'Processing…' : bookingSuccess ? 'Booked' : selectedDate ? 'Book this departure' : 'No upcoming dates';

  const SECTION_TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'dates', label: 'Dates' },
    { id: 'carry', label: 'What to carry' },
    { id: 'inclusions', label: 'What’s included' },
    { id: 'safety', label: 'Safety' }
  ];

  const sectionTitle = 'font-display text-3xl font-medium tracking-tight text-white sm:text-4xl';

  return (
    <div className="min-h-screen pt-24 pb-24 bg-[#020617] text-white">
      {/* Hero */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="tv-cinematic tv-grain relative mx-auto h-[68vh] min-h-[520px] max-w-7xl overflow-hidden rounded-[28px]">
          <img src={trek.image} alt={trek.name} className="tv-drift absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-[#020617]/10" />

          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-12">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#020617]/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    trek.difficulty === 'Easy' ? 'bg-emerald-400' : trek.difficulty === 'Moderate' ? 'bg-amber-300' : 'bg-rose-400'
                  }`}
                />
                {trek.difficulty}
              </span>
              {trek.bestSeason && (
                <span className="rounded-full bg-[#020617]/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                  {trek.bestSeason}
                </span>
              )}
              {trek.seatsLeft < 10 && (
                <span className="rounded-full bg-[#F2A65A] px-3 py-1.5 text-xs font-bold text-[#1A1208]">
                  {trek.seatsLeft} seats left
                </span>
              )}
            </div>
            <RevealHeading
              as="h1"
              lines={[trek.name]}
              className="max-w-4xl font-display text-[44px] font-medium leading-[1] tracking-tight text-white sm:text-6xl lg:text-7xl"
            />
            <motion.dl
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: EASE_OUT }}
              className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80 sm:text-base"
            >
              {[
                { icon: MapPin, label: 'Location', value: trek.location },
                { icon: Calendar, label: 'Duration', value: trek.duration },
                { icon: Mountain, label: 'Highest point', value: trek.maxAltitude },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <dt className="sr-only">{label}</dt>
                  <Icon className="h-4 w-4 text-white/50" />
                  <dd>{value}</dd>
                </div>
              ))}
            </motion.dl>
          </div>
        </div>
      </div>

      {/* Section navigation */}
      <div className="sticky top-20 z-30 mt-8 hidden border-b border-white/10 bg-[#020617]/80 backdrop-blur-md md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Trek sections" className="flex gap-1">
            {SECTION_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                aria-current={activeTab === tab.id ? 'true' : undefined}
                className={`relative px-3 py-4 text-sm font-semibold transition-colors ${
                  activeTab === tab.id ? 'text-white' : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="trek-section-underline"
                    className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-[#F2A65A]"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Main content */}
          <div className="space-y-20 lg:col-span-8">

            {/* Overview */}
            <section id="overview">
              <h2 className={sectionTitle}>Overview</h2>
              <p className="mt-6 text-lg leading-relaxed text-[#94A3B8]">{trek.overview}</p>

              <dl className="mt-10 grid grid-cols-2 gap-x-8 md:grid-cols-4">
                {[
                  { label: 'Duration', value: trek.duration },
                  { label: 'Highest point', value: trek.maxAltitude },
                  { label: 'Difficulty', value: trek.difficulty },
                  { label: 'Best season', value: trek.bestSeason },
                ].map((fact) => (
                  <div key={fact.label} className="border-t border-white/10 py-5">
                    <dt className="text-sm text-[#94A3B8]">{fact.label}</dt>
                    <dd className="tv-num mt-1 font-display text-xl font-medium text-white">{fact.value}</dd>
                  </div>
                ))}
              </dl>

              {specialHighlights.length > 0 && (
                <div className="mt-10">
                  <h3 className="font-display text-xl font-medium text-white">Highlights</h3>
                  <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
                    {specialHighlights.map((hl, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[#94A3B8]">
                        <Check className="mt-1 h-4 w-4 flex-shrink-0 text-[#38BDF8]" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Itinerary */}
            <section id="itinerary">
              <h2 className={sectionTitle}>Day by day</h2>
              <div className="mt-8 border-t border-white/10">
                {itinerary.map((day) => (
                  <details key={day.day} className="group border-b border-white/10">
                    <summary className="flex cursor-pointer list-none items-center gap-5 py-5 [&::-webkit-details-marker]:hidden">
                      <span className="tv-num w-14 flex-shrink-0 text-sm text-[#94A3B8]">Day {day.day}</span>
                      <span className="flex-1 font-display text-lg font-medium text-white sm:text-xl">{day.title}</span>
                      <ChevronDown className="h-5 w-5 flex-shrink-0 text-[#94A3B8] transition-transform duration-300 group-open:rotate-180" />
                    </summary>
                    <p className="pb-6 pl-[76px] pr-10 leading-relaxed text-[#94A3B8]">{day.description}</p>
                  </details>
                ))}
              </div>
            </section>

            {/* Departure dates */}
            <section id="dates">
              <h2 className={sectionTitle}>Choose a departure</h2>
              <p className="mt-3 text-[#94A3B8]">Fixed departures with leaders, permits and camps already arranged.</p>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2" role="group" aria-label="Departure dates">
                {departures.map((dateStr) => {
                  const isSelected = selectedDate === dateStr;
                  return (
                    <button
                      type="button"
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                      aria-pressed={isSelected}
                      className={`flex items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-colors !rounded-2xl ${
                        isSelected
                          ? 'border-[#38BDF8] bg-[#38BDF8]/[0.07]'
                          : 'border-white/10 bg-[#071827] hover:border-white/20'
                      }`}
                    >
                      <span>
                        <span className="tv-num block font-display text-lg font-medium text-white">
                          {formatDate(dateStr, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="mt-0.5 block text-sm text-[#94A3B8]">
                          <span className="tv-num">{trek.seatsLeft}</span> seats left
                        </span>
                      </span>
                      <span
                        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border ${
                          isSelected ? 'border-[#38BDF8] bg-[#38BDF8]' : 'border-white/20'
                        }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5 text-[#020617]" />}
                      </span>
                    </button>
                  );
                })}
              </div>
              {departures.length === 0 && (
                <p className="text-[#94A3B8]" data-testid="no-upcoming-departures">
                  No upcoming departures are scheduled yet. Send us an enquiry and we'll tell you when the next batch opens.
                </p>
              )}
            </section>

            {/* Inclusions and exclusions */}
            <section id="inclusions">
              <h2 className={sectionTitle}>What’s included</h2>
              <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2">
                <div>
                  <h3 className="font-display text-xl font-medium text-white">Included</h3>
                  <ul className="mt-5 space-y-3">
                    {inclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[#94A3B8]">
                        <Check className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-display text-xl font-medium text-white">Not included</h3>
                  <ul className="mt-5 space-y-3">
                    {exclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[#94A3B8]">
                        <X className="mt-1 h-4 w-4 flex-shrink-0 text-rose-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Things to carry */}
            <section id="carry">
              <h2 className={sectionTitle}>What to carry</h2>
              <p className="mt-3 text-[#94A3B8]">Pack these before you reach base camp. The right layers make the difference when the weather turns.</p>
              <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
                {thingsToCarry.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[#94A3B8]">
                    <span className="mt-2.5 h-1 w-1 flex-shrink-0 rounded-full bg-[#38BDF8]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Safety */}
            <section id="safety">
              <h2 className={sectionTitle}>Safety on this trek</h2>
              <p className="mt-6 text-lg leading-relaxed text-[#94A3B8]">{safetyNotes}</p>
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/10 bg-[#071827] p-5">
                <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#38BDF8]" />
                <p className="text-sm leading-relaxed text-[#94A3B8]">
                  High-altitude weather changes fast and the air holds less oxygen. Our emergency protocols are run with regional Himalayan rescue teams.
                </p>
              </div>
            </section>

            {/* Reviews */}
            {trekReviews.length > 0 && (
              <section>
                <h2 className={sectionTitle}>From people who’ve done it</h2>
                <div className="mt-8 space-y-8">
                  {trekReviews.map((review) => (
                    <figure key={review.id} className="border-t border-white/10 pt-8">
                      <div className="flex gap-1" aria-label={`${review.rating} out of 5`}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-[#F2A65A] text-[#F2A65A]' : 'text-white/20'}`} />
                        ))}
                      </div>
                      <blockquote className="mt-4 font-display text-xl font-medium leading-[1.35] text-white sm:text-2xl">
                        “{review.review}”
                      </blockquote>
                      <figcaption className="mt-5 flex items-center gap-3">
                        <img src={review.image} alt="" className="h-10 w-10 rounded-full object-cover" />
                        <span className="text-sm font-semibold text-white">{review.name}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Booking card, sticky on desktop */}
          <div className="lg:col-span-4">
            <div className="sticky top-40 hidden rounded-[28px] border border-white/10 bg-[#071827] p-7 lg:block">
              <p className="text-sm text-[#94A3B8]">From</p>
              <p className="tv-num mt-1 font-display text-5xl font-medium tracking-tight text-white">
                ₹{trek.price.toLocaleString('en-IN')}
              </p>
              <p className="mt-1 text-sm text-[#94A3B8]">per person, all inclusive</p>

              {selectedDate && (
                <div className="mt-6 border-t border-white/10 pt-6">
                  <p className="text-sm text-[#94A3B8]">Departure</p>
                  <p className="tv-num mt-1 font-display text-xl font-medium text-white">
                    {formatDate(selectedDate, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  {trek.seatsLeft < 10 && (
                    <p className="mt-1 text-sm font-semibold text-[#F2A65A]">
                      {trek.seatsLeft} seats left on this departure
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => scrollToSection('dates')}
                    className="mt-2 text-sm font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
                  >
                    Change date
                  </button>
                </div>
              )}

              <AnimatePresence mode="wait">
                {paymentError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 flex items-start gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400"
                    role="alert"
                  >
                    <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{paymentError}</span>
                  </motion.div>
                )}
                {bookingSuccess && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-300"
                    role="status"
                  >
                    <p className="mb-1 font-semibold text-white">Booking confirmed</p>
                    <p>{bookingSuccess.message || 'Your trek booking is confirmed.'}</p>
                    {bookingSuccess.selected_date && (
                      <p className="tv-num mt-1 text-xs">Departure: {formatDate(bookingSuccess.selected_date)}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleBookNow}
                  disabled={paymentLoading || !!bookingSuccess || !selectedDate}
                  className="tv-btn-primary h-12 w-full px-6 text-sm"
                  data-testid="trek-detail-book-now"
                >
                  {bookLabel}
                </button>

                <button
                  onClick={openEnquiry}
                  className="tv-btn-ghost h-12 w-full px-6 text-sm"
                  data-testid="trek-detail-send-enquiry"
                >
                  Ask a question
                </button>
              </div>

              <ul className="mt-6 space-y-2 border-t border-white/10 pt-6 text-sm text-[#94A3B8]">
                <li className="flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-400" /> Secure payment with Razorpay</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#94A3B8]" /> Free cancellation up to 15 days before</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#94A3B8]" /> Round-the-clock rescue support</li>
              </ul>
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617]/80 px-4 backdrop-blur-md"
            onClick={() => setShowBookingDialog(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#071827] p-8"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="booking-confirmed-title"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/15">
                <Check className="h-6 w-6 text-emerald-400" />
              </span>
              <h2 id="booking-confirmed-title" className="mt-6 font-display text-3xl font-medium tracking-tight text-white">
                You’re going to {trek.name.replace(/ (Trek|Expedition)$/, '')}
              </h2>
              <p className="mt-3 text-[#94A3B8]">
                {bookingSuccess.message || `Your booking for ${trek.name} is confirmed.`}
              </p>
              {bookingSuccess.selected_date && (
                <p className="tv-num mt-4 font-display text-lg font-medium text-white">
                  {formatDate(bookingSuccess.selected_date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
              {bookingSuccess.email_sent && bookingSuccess.email_to && (
                <p className="mt-4 border-t border-white/10 pt-4 text-sm text-[#94A3B8]">
                  Confirmation sent to <span className="font-semibold text-white">{bookingSuccess.email_to}</span>
                </p>
              )}
              <button
                onClick={() => setShowBookingDialog(false)}
                className="tv-btn-primary mt-8 h-12 w-full px-6 text-sm"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating chat button */}
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        className="group fixed bottom-24 right-4 z-50 flex items-center justify-center rounded-full bg-[#25D366] p-3.5 text-white shadow-2xl transition-transform duration-300 hover:scale-105 lg:bottom-6 lg:right-6"
        aria-label="Chat with us on WhatsApp"
        data-testid="trek-detail-whatsapp"
      >
        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
        </svg>
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-500 ease-out group-hover:ml-2.5 group-hover:max-w-xs">
          Chat with us
        </span>
      </a>

      {/* Mobile sticky booking bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#071827]/95 p-4 pb-safe backdrop-blur-md lg:hidden">
        {paymentError && (
          <p className="mb-3 flex items-start gap-2 text-sm text-red-400" role="alert">
            <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{paymentError}</span>
          </p>
        )}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="tv-num font-display text-xl font-medium text-white">
              ₹{trek.price.toLocaleString('en-IN')}
              <span className="ml-1 font-sans text-xs font-normal text-[#94A3B8]">/ person</span>
            </p>
            {selectedDate && (
              <p className="tv-num truncate text-xs text-[#94A3B8]">
                {formatDate(selectedDate, { weekday: 'short', day: 'numeric', month: 'short' })}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openEnquiry}
              className="tv-btn-ghost h-11 w-11"
              aria-label="Ask a question"
            >
              <MessageCircle className="h-5 w-5" />
            </button>
            <button
              onClick={handleBookNow}
              disabled={paymentLoading || !!bookingSuccess || !selectedDate}
              className="tv-btn-primary h-11 px-5 text-sm"
            >
              {paymentLoading ? 'Processing…' : bookingSuccess ? 'Booked' : selectedDate ? 'Book now' : 'No dates'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrekDetail;

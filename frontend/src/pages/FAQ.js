import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const faqCategories = [
  {
    category: 'Booking & Payment',
    items: [
      {
        q: 'How do I book a trek with TrailVista?',
        a: 'You can book directly via the trek detail page using the Book Now button, send us an enquiry, or WhatsApp us at +91 98765 43210. Our team confirms your slot within 2 hours during business hours.'
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept UPI, all major credit/debit cards, net banking, and bank transfers. Bookings are confirmed instantly once payment is received.'
      },
      {
        q: 'Can I pay in installments?',
        a: 'Yes. For treks above ₹15,000 we offer a 50% advance + 50% before departure plan. EMI options are also available for select cards.'
      },
      {
        q: 'Is GST included in the trek price?',
        a: 'All prices listed are exclusive of 5% GST. The GST amount is added to your final payment summary before checkout.'
      }
    ]
  },
  {
    category: 'Safety & Health',
    items: [
      {
        q: 'How safe are TrailVista treks?',
        a: 'Safety is our absolute priority. Every trek has certified trek leaders, oxygen cylinders, first-aid kits, satellite communication on high-altitude trails, and 24/7 emergency response.'
      },
      {
        q: 'Do I need to be physically fit?',
        a: 'Fitness requirements vary by trek difficulty. Easy treks need basic walking endurance; Moderate treks expect 5km run in 30 min; Difficult treks require 8 weeks of dedicated training. We send a personalised fitness plan post booking.'
      },
      {
        q: 'What if I get altitude sickness?',
        a: 'Our leaders are trained in AMS, HACE, and HAPE recognition. We carry medical-grade oxygen, follow conservative acclimatisation schedules, and arrange evacuation if needed at no extra cost.'
      },
      {
        q: 'Is travel insurance mandatory?',
        a: 'It is mandatory for all expeditions above 4500m and strongly recommended for every trek. We can suggest partner insurers covering high-altitude treks and helicopter evacuation.'
      }
    ]
  },
  {
    category: 'Cancellation & Refund',
    items: [
      {
        q: 'What is the cancellation policy?',
        a: 'Free cancellation up to 30 days before departure (100% refund). 15-29 days: 75% refund. 7-14 days: 50%. Under 7 days: 25% refund. All refunds process within 7 working days.'
      },
      {
        q: 'Can I reschedule my trek?',
        a: 'Yes. You can reschedule once at no charge if requested at least 15 days before departure. Subsequent reschedules carry a ₹1000 admin fee.'
      },
      {
        q: 'What happens if the trek is cancelled by TrailVista?',
        a: 'We provide a 100% refund or free reschedule to any departure of equal value. Cancellations from our side are rare and only happen for weather or safety reasons.'
      }
    ]
  },
  {
    category: 'On the Trek',
    items: [
      {
        q: 'What kind of food is served?',
        a: 'Nutritious vegetarian meals — high-altitude friendly, fresh, hot. Breakfast, lunch, snacks, dinner & evening tea included. Special dietary needs (Jain, gluten-free, vegan) accommodated with prior notice.'
      },
      {
        q: 'What is the accommodation like?',
        a: 'Two-person alpine tents on standard treks; mountain lodges or guesthouses where available on the route. Sleeping bags rated to -10°C and high-density mattresses provided.'
      },
      {
        q: 'Will I have phone or internet on the trek?',
        a: 'Network coverage is limited above 9000ft. Most base camps have BSNL/Jio signal. We carry satellite phones for emergencies on remote trails.'
      },
      {
        q: 'Can I bring my own porter?',
        a: 'Yes, you can either rent a personal porter (₹350/kg for entire trek, max 10kg) or carry your own backpack. Pre-book porters at least 7 days before departure.'
      }
    ]
  }
];

const FAQ = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(0);
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-[#38BDF8] text-sm uppercase tracking-[0.3em] mb-4 font-bold">Need Answers?</p>
          <h1 className="text-5xl md:text-6xl font-black text-white hero-text uppercase mb-4">
            FREQUENTLY ASKED <span className="text-[#38BDF8]">QUESTIONS</span>
          </h1>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            Everything you need to know about trekking with TrailVista — safety, bookings, cancellations and life on the trail.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-[#071827] border border-white/10 rounded-2xl p-4 space-y-1">
              {faqCategories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => { setActiveCategory(idx); setOpenIndex(0); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeCategory === idx
                      ? 'bg-[#38BDF8] text-white'
                      : 'text-[#94A3B8] hover:bg-white/5 hover:text-white'
                  }`}
                  data-testid={`faq-category-${idx}`}
                >
                  {cat.category}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ accordions */}
          <div className="lg:col-span-3 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {faqCategories[activeCategory].items.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#071827] border border-white/10 rounded-2xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                      data-testid={`faq-question-${activeCategory}-${idx}`}
                    >
                      <span className="text-white font-bold pr-4">{item.q}</span>
                      <ChevronDown className={`h-5 w-5 text-[#38BDF8] flex-shrink-0 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {openIndex === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 text-[#94A3B8] text-sm leading-relaxed">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Still have questions CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#071827] border border-white/10 rounded-2xl p-8 mt-8 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-[#F97316]/10 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-7 w-7 text-[#F97316]" />
              </div>
              <h3 className="text-2xl font-black text-white hero-text uppercase mb-2">
                STILL HAVE <span className="text-[#38BDF8]">QUESTIONS?</span>
              </h3>
              <p className="text-[#94A3B8] mb-6">
                Our trek experts respond within 2 hours during business hours.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => navigate('/contact')}
                  className="bg-[#F97316] hover:bg-[#ea580c] text-white px-6 py-3 rounded-full font-bold transition-all active:scale-95"
                  data-testid="faq-contact-button"
                >
                  Contact Us
                </button>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/30 hover:border-[#38BDF8] text-white px-6 py-3 rounded-full font-bold transition-all active:scale-95"
                  data-testid="faq-whatsapp-button"
                >
                  WhatsApp Us
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

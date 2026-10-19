import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { FadeIn, RevealHeading, EASE_OUT } from '../components/motion';

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
        <PageHeader lines={['Questions,', 'answered']}>
          <p>Safety, bookings, cancellations and life on the trail. If something isn’t covered here, ask us directly.</p>
        </PageHeader>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Category list */}
          <div className="lg:col-span-4">
            <div className="flex flex-wrap gap-1 lg:sticky lg:top-28 lg:flex-col" role="group" aria-label="FAQ topics">
              {faqCategories.map((cat, idx) => {
                const active = activeCategory === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => { setActiveCategory(idx); setOpenIndex(0); }}
                    aria-pressed={active}
                    className={`relative rounded-full px-4 py-2 text-left text-sm font-semibold transition-colors lg:py-3 ${
                      active ? 'text-[#020617]' : 'text-[#94A3B8] hover:text-white'
                    }`}
                    data-testid={`faq-category-${idx}`}
                  >
                    {active && (
                      <motion.span
                        layoutId="faq-category-pill"
                        className="absolute inset-0 rounded-full bg-white shadow-sm"
                        transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      />
                    )}
                    <span className="relative">{cat.category}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Questions */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
                className="border-t border-white/10"
              >
                {faqCategories[activeCategory].items.map((item, idx) => {
                  const open = openIndex === idx;
                  return (
                    <div key={idx} className="border-b border-white/10">
                      <button
                        type="button"
                        onClick={() => setOpenIndex(open ? -1 : idx)}
                        aria-expanded={open}
                        className="flex w-full items-start justify-between gap-6 py-6 text-left !rounded-lg"
                        data-testid={`faq-question-${activeCategory}-${idx}`}
                      >
                        <span className="font-display text-lg font-medium text-white sm:text-xl">{item.q}</span>
                        <Plus
                          className={`mt-1 h-5 w-5 flex-shrink-0 text-[#94A3B8] transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: EASE_OUT }}
                            className="overflow-hidden"
                          >
                            <p className="max-w-2xl pb-6 leading-relaxed text-[#94A3B8]">{item.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Still have questions */}
            <FadeIn className="mt-16 rounded-[28px] border border-white/10 bg-[#071827] p-8 sm:p-10">
              <RevealHeading
                lines={['Still have a question?']}
                className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl"
              />
              <p className="mt-3 text-[#94A3B8]">Our trek team replies within two hours during business hours.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => navigate('/contact')}
                  className="tv-btn-primary h-12 px-7 text-sm"
                  data-testid="faq-contact-button"
                >
                  Contact us
                </button>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tv-btn-ghost h-12 px-7 text-sm"
                  data-testid="faq-whatsapp-button"
                >
                  WhatsApp us
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

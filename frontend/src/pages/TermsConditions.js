import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Compass, AlertTriangle, RefreshCw, Scale, Users } from 'lucide-react';

const TermsConditions = () => {
  const sections = [
    {
      icon: Compass,
      title: '1. Bookings & Reservation',
      content: 'To confirm an expedition booking, user registrations must be completed through TrailVista. A slot is reserved only upon receipt of the specified booking fee. The full remaining balance must be paid at least 15 days prior to the trek departure date.'
    },
    {
      icon: RefreshCw,
      title: '2. Cancellations & Refund Policy',
      content: 'Cancellations must be requested via email or the dashboard. Refunds follow this schedule:\n• Cancel 30 days or more before trek: 100% refund.\n• Cancel 15-29 days before trek: 50% refund.\n• Cancel less than 15 days before trek: No refund available due to advanced campsite reservations and permits.'
    },
    {
      icon: AlertTriangle,
      title: '3. Wilderness Risks & Health Requirements',
      content: 'High-altitude mountaineering and trekking carry inherent environmental risks, including physical strain, unpredictable weather, landslides, and altitude sickness. By booking, you certify that you are physically fit and comply with our pre-expedition training guidelines. TrailVista is not responsible for injuries arising from undisclosed health conditions.'
    },
    {
      icon: Scale,
      title: '4. Itinerary Alterations',
      content: 'Safety is our absolute priority. We reserve the right to alter itineraries, change campsites, or cancel batches due to blizzards, landslides, road closures, government restrictions, or other force majeure circumstances. In such cases, alternative treks or credit vouchers will be issued.'
    },
    {
      icon: Users,
      title: '5. Participant Code of Conduct',
      content: 'TrailVista promotes responsible, eco-friendly tourism. We strictly enforce a "Leave No Trace" policy. Littering, alcohol abuse, or non-compliance with the trek leader\'s safety directions will result in immediate termination of the trek for the offending participant without any refund.'
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#020617] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-[#F97316]/10 rounded-2xl mb-4 border border-[#F97316]/20">
            <FileText className="h-8 w-8 text-[#F97316]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black hero-text uppercase mb-4 tracking-wider">
            TERMS & <span className="text-[#F97316]">CONDITIONS</span>
          </h1>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            Please read these terms carefully before booking your expedition. Last updated: May 2026.
          </p>
        </motion.div>

        {/* Content Blocks */}
        <div className="space-y-8">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#071827] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F97316]/30 transition-all duration-300 shadow-xl"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-[#F97316]/5 rounded-xl border border-white/5 text-[#F97316] flex-shrink-0">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-3 tracking-wide">{section.title}</h2>
                    <p className="text-[#94A3B8] leading-relaxed text-sm sm:text-base whitespace-pre-line">{section.content}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Disclaimer Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center border-t border-white/10 pt-10"
        >
          <p className="text-[#64748B] text-xs max-w-lg mx-auto">
            These terms govern your use of the TrailVista platform. Continued booking indicates acceptance of these guidelines, risks, and cancellation terms.
          </p>
        </motion.div>

      </div>
    </div>
  );
};

export default TermsConditions;

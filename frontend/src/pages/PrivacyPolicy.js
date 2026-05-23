import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Database, CreditCard, Mail, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Lock,
      title: 'Authentication & Security',
      content: 'All user authentication, signup, and login workflows are secured and handled by Supabase Auth. We do not store raw passwords on our servers. Your password and profile credentials are encrypted at rest and in transit using modern security protocols.'
    },
    {
      icon: Database,
      title: 'Information We Collect',
      content: 'We collect information you provide directly to us when creating an account or booking an expedition. This includes your name, email address, phone number, emergency contact details, and any health information or trekking history required to ensure safety during your trip.'
    },
    {
      icon: CreditCard,
      title: 'Payment Processing',
      content: 'All booking payments are processed securely through Razorpay. TrailVista does not store, access, or log your raw credit card numbers, CVVs, or internet banking credentials. Your financial transaction is encrypted and managed entirely under Razorpay\'s certified security compliance.'
    },
    {
      icon: Mail,
      title: 'Email & Communications',
      content: 'We use your email address to send transactional messages, including booking confirmations, safety compliance forms, itinerary updates, and account security notifications. You may opt out of promotional newsletters at any time.'
    },
    {
      icon: Shield,
      title: 'Data Retention & Protection',
      content: 'We retain your personal information only as long as necessary to fulfill your booking requirements and legal obligations. We do not sell or lease your personal information to third-party marketing companies.'
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
          <div className="inline-flex items-center justify-center p-3 bg-[#38BDF8]/10 rounded-2xl mb-4 border border-[#38BDF8]/20">
            <Shield className="h-8 w-8 text-[#38BDF8]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black hero-text uppercase mb-4 tracking-wider">
            PRIVACY <span className="text-[#38BDF8]">POLICY</span>
          </h1>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            How we collect, protect, and manage your data at TrailVista. Last updated: May 2026.
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
                className="bg-[#071827] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#38BDF8]/30 transition-all duration-300 shadow-xl"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-[#38BDF8]/5 rounded-xl border border-white/5 text-[#38BDF8] flex-shrink-0">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-3 tracking-wide">{section.title}</h2>
                    <p className="text-[#94A3B8] leading-relaxed text-sm sm:text-base">{section.content}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Contact Info Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center border-t border-white/10 pt-10"
        >
          <div className="inline-flex items-center space-x-2 text-[#94A3B8] hover:text-[#38BDF8] transition-colors cursor-pointer mb-2">
            <Mail className="h-5 w-5" />
            <span className="font-semibold">privacy@trailvista.com</span>
          </div>
          <p className="text-[#64748B] text-xs">
            For questions or requests regarding your data, please contact our data compliance desk.
          </p>
        </motion.div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;

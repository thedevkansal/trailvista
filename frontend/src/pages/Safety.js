import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Heart, Thermometer, Award, Users, TrendingUp, AlertTriangle, Phone, Mountain } from 'lucide-react';

const Safety = () => {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="text-[#38BDF8] text-sm uppercase tracking-[0.3em] mb-4 font-bold">Your Safety, Our Priority</p>
          <h1 className="text-5xl md:text-6xl font-black text-white hero-text uppercase mb-4">
            SAFETY <span className="text-[#38BDF8]">PROTOCOLS</span>
          </h1>
          <p className="text-[#94A3B8] text-lg max-w-3xl mx-auto">
            Comprehensive safety measures to ensure your Himalayan adventure is both thrilling and secure
          </p>
        </motion.div>

        {/* Key Safety Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: Heart, title: 'Medical Support', desc: 'Oxygen cylinders, first-aid kits, and trained medical responders on every trek' },
            { icon: Users, title: 'Certified Guides', desc: 'Experienced trek leaders with mountaineering certifications and wilderness first-aid training' },
            { icon: Shield, title: 'Emergency Protocol', desc: 'Quick evacuation procedures and 24/7 emergency response team' },
            { icon: Thermometer, title: 'Weather Monitoring', desc: 'Real-time weather tracking and route adjustments for safety' },
            { icon: Award, title: 'Quality Equipment', desc: 'High-quality tents, sleeping bags, and safety gear' },
            { icon: TrendingUp, title: 'Small Group Size', desc: 'Limited group sizes for personalized attention and better safety management' }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#071827] border border-white/10 rounded-2xl p-6"
            >
              <div className="w-14 h-14 bg-[#38BDF8]/10 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="h-7 w-7 text-[#38BDF8]" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Detailed Protocols */}
        <div className="space-y-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#071827] border border-white/10 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-black text-white hero-text uppercase mb-6">
              PRE-TREK <span className="text-[#38BDF8]">PREPARATION</span>
            </h2>
            <ul className="space-y-3 text-[#94A3B8]">
              <li className="flex items-start space-x-3">
                <span className="text-[#38BDF8] mt-1">•</span>
                <span>Comprehensive medical questionnaire to assess fitness levels</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#38BDF8] mt-1">•</span>
                <span>Pre-trek briefing covering safety protocols, do's and don'ts</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#38BDF8] mt-1">•</span>
                <span>Equipment check and distribution of safety gear</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#38BDF8] mt-1">•</span>
                <span>Acclimatization schedule for high-altitude treks</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#071827] border border-white/10 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-black text-white hero-text uppercase mb-6">
              DURING THE <span className="text-[#38BDF8]">TREK</span>
            </h2>
            <ul className="space-y-3 text-[#94A3B8]">
              <li className="flex items-start space-x-3">
                <span className="text-[#38BDF8] mt-1">•</span>
                <span>Regular health check-ups and monitoring of oxygen saturation levels</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#38BDF8] mt-1">•</span>
                <span>Experienced trek leader and support staff always present</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#38BDF8] mt-1">•</span>
                <span>Gradual ascent with proper acclimatization days</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#38BDF8] mt-1">•</span>
                <span>Communication devices for emergency situations</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#38BDF8] mt-1">•</span>
                <span>Route adjustments based on weather conditions</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#071827] border border-white/10 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-black text-white hero-text uppercase mb-6">
              EMERGENCY <span className="text-[#38BDF8]">RESPONSE</span>
            </h2>
            <ul className="space-y-3 text-[#94A3B8]">
              <li className="flex items-start space-x-3">
                <span className="text-[#38BDF8] mt-1">•</span>
                <span>24/7 emergency helpline with instant response capability</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#38BDF8] mt-1">•</span>
                <span>Evacuation procedures including helicopter rescue arrangements</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#38BDF8] mt-1">•</span>
                <span>Tie-ups with local hospitals and medical facilities</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#38BDF8] mt-1">•</span>
                <span>Comprehensive insurance coverage recommended</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#F97316] to-[#ea580c] rounded-2xl p-8 text-center"
        >
          <AlertTriangle className="h-12 w-12 text-white mx-auto mb-4" />
          <h3 className="text-2xl font-black text-white hero-text uppercase mb-4">24/7 EMERGENCY HELPLINE</h3>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Phone className="h-6 w-6 text-white" />
            <a href="tel:+919876543210" className="text-3xl font-bold text-white">+91 98765 43210</a>
          </div>
          <p className="text-white/90">Available round-the-clock for all trekking emergencies</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Safety;
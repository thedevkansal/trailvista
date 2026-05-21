import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-black text-white hero-text uppercase mb-4">
            GET IN <span className="text-[#38BDF8]">TOUCH</span>
          </h1>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            Have questions about our treks? Planning a custom expedition? We're here to help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-[#071827] border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-[#38BDF8]/10 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-[#38BDF8]" />
              </div>
              <h3 className="text-white font-bold mb-2">Phone</h3>
              <p className="text-[#94A3B8] text-sm mb-2">Mon-Sat: 9 AM - 8 PM</p>
              <a href="tel:+919876543210" className="text-[#38BDF8] hover:text-[#0ea5e9] transition-colors">
                +91 98765 43210
              </a>
            </div>

            <div className="bg-[#071827] border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-[#38BDF8]/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-[#38BDF8]" />
              </div>
              <h3 className="text-white font-bold mb-2">Email</h3>
              <p className="text-[#94A3B8] text-sm mb-2">We'll respond within 24 hours</p>
              <a href="mailto:hello@trailvista.com" className="text-[#38BDF8] hover:text-[#0ea5e9] transition-colors">
                hello@trailvista.com
              </a>
            </div>

            <div className="bg-[#071827] border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-[#38BDF8]/10 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-[#38BDF8]" />
              </div>
              <h3 className="text-white font-bold mb-2">Office</h3>
              <p className="text-[#94A3B8] text-sm">
                123 Mountain Road<br />
                Dehradun, Uttarakhand 248001<br />
                India
              </p>
            </div>

            <div className="bg-[#071827] border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">WhatsApp</h3>
              <a 
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white px-6 py-3 rounded-lg font-semibold transition-all active:scale-95 flex items-center justify-center space-x-2"
                data-testid="contact-whatsapp-button"
              >
                <Send className="h-4 w-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-[#071827] border border-white/10 rounded-2xl p-8">
              {!showSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[#94A3B8] text-sm mb-2 block">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8]"
                        placeholder="Enter your name"
                        data-testid="contact-name-input"
                      />
                    </div>

                    <div>
                      <label className="text-[#94A3B8] text-sm mb-2 block">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8]"
                        placeholder="Enter your email"
                        data-testid="contact-email-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[#94A3B8] text-sm mb-2 block">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8]"
                        placeholder="Enter your phone number"
                        data-testid="contact-phone-input"
                      />
                    </div>

                    <div>
                      <label className="text-[#94A3B8] text-sm mb-2 block">Subject *</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8]"
                        data-testid="contact-subject-select"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="booking">Booking Assistance</option>
                        <option value="custom">Custom Trek</option>
                        <option value="corporate">Corporate Trip</option>
                        <option value="feedback">Feedback</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[#94A3B8] text-sm mb-2 block">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8] resize-none"
                      placeholder="Tell us about your query or requirements..."
                      data-testid="contact-message-textarea"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#F97316] hover:bg-[#ea580c] text-white px-6 py-4 rounded-lg font-bold transition-all active:scale-95 flex items-center justify-center space-x-2"
                    data-testid="contact-submit-button"
                  >
                    <Send className="h-5 w-5" />
                    <span>Send Message</span>
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Message Sent!</h3>
                  <p className="text-[#94A3B8] text-lg">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-[#071827] border border-white/10 rounded-2xl p-4 h-96 flex items-center justify-center"
        >
          <div className="text-center">
            <MapPin className="h-12 w-12 text-[#38BDF8] mx-auto mb-4" />
            <p className="text-[#94A3B8]">Map Placeholder - Office Location</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
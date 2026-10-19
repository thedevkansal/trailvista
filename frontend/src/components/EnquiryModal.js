import React, { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitEnquiry, upcomingMonths } from '../lib/enquiryService';

const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
  travelMonth: '',
  numberOfPeople: '1',
  message: '',
  website: '',
};

const EnquiryModal = ({ isOpen, onClose, trekName = '' }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const travelMonths = useMemo(() => upcomingMonths(), []);

  // Close the modal a moment after a successful send.
  useEffect(() => {
    if (!showSuccess) return undefined;
    const timer = setTimeout(() => {
      setShowSuccess(false);
      setFormData(EMPTY_FORM);
      onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [showSuccess, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      await submitEnquiry({
        source: 'trek',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        trek_name: trekName || null,
        travel_month: formData.travelMonth,
        group_size: Number(formData.numberOfPeople) || 1,
        message: formData.message,
        website: formData.website,
      });
      setShowSuccess(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#071827] border border-white/10 rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            {!showSuccess ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white hero-text">Send Enquiry</h2>
                  <button
                    onClick={onClose}
                    className="text-[#94A3B8] hover:text-white transition-colors"
                    data-testid="enquiry-close-button"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {trekName && (
                  <div className="mb-6 p-4 bg-[#020617] border border-white/10 rounded-lg">
                    <p className="text-sm text-[#94A3B8] mb-1">Trek Selected</p>
                    <p className="text-white font-semibold">{trekName}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 relative">
                  {/* Honeypot for bots; hidden from people and screen readers */}
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  />
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
                      data-testid="enquiry-name-input"
                    />
                  </div>

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
                      data-testid="enquiry-phone-input"
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
                      data-testid="enquiry-email-input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#94A3B8] text-sm mb-2 block">Travel Month *</label>
                      <select
                        name="travelMonth"
                        value={formData.travelMonth}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8]"
                        data-testid="enquiry-month-select"
                      >
                        <option value="">Select month</option>
                        {travelMonths.map((month) => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[#94A3B8] text-sm mb-2 block">Number of People *</label>
                      <input
                        type="number"
                        name="numberOfPeople"
                        value={formData.numberOfPeople}
                        onChange={handleChange}
                        min="1"
                        max="50"
                        required
                        className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8]"
                        data-testid="enquiry-people-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#94A3B8] text-sm mb-2 block">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8] resize-none"
                      placeholder="Any specific requirements or questions?"
                      data-testid="enquiry-message-textarea"
                    />
                  </div>

                  {submitError && (
                    <p className="text-red-400 text-sm" role="alert" data-testid="enquiry-submit-error">{submitError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#F97316] hover:bg-[#ea580c] text-white px-6 py-3 rounded-lg font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                    data-testid="enquiry-submit-button"
                  >
                    {submitting ? 'Sending...' : 'Send Enquiry'}
                  </button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Enquiry Sent!</h3>
                <p className="text-[#94A3B8]">We'll get back to you within 24 hours.</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnquiryModal;
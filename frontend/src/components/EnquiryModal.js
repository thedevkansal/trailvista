import React, { useEffect, useMemo, useState } from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitEnquiry, upcomingMonths } from '../lib/enquiryService';
import { EASE_OUT } from './motion';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-[#020617] px-4 text-[15px] text-white placeholder:text-[#94A3B8]/60 hover:border-white/20 focus:border-[#38BDF8] focus:outline-none';

const Field = ({ label, id, children }) => (
  <div>
    <label htmlFor={id} className="mb-2 block text-sm font-medium text-white">
      {label}
    </label>
    {children}
  </div>
);

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
          className="fixed inset-0 z-[100] flex items-end justify-center bg-[#020617]/80 p-0 backdrop-blur-md sm:items-center sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-title"
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[28px] border border-white/10 bg-[#071827] p-6 sm:rounded-[28px] sm:p-8"
          >
            {!showSuccess ? (
              <>
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 id="enquiry-title" className="font-display text-3xl font-medium tracking-tight text-white">
                      Ask about this trek
                    </h2>
                    {trekName && <p className="mt-1 text-[#94A3B8]">{trekName}</p>}
                  </div>
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="tv-btn-ghost h-10 w-10 flex-shrink-0"
                    data-testid="enquiry-close-button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="relative space-y-4">
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
                  <Field label="Full name" id="enquiry-name">
                    <input
                      id="enquiry-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      className={`${inputClass} h-12`}
                      placeholder="Your name"
                      data-testid="enquiry-name-input"
                    />
                  </Field>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Phone" id="enquiry-phone">
                      <input
                        id="enquiry-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        autoComplete="tel"
                        className={`${inputClass} h-12`}
                        placeholder="+91 98765 43210"
                        data-testid="enquiry-phone-input"
                      />
                    </Field>
                    <Field label="Email" id="enquiry-email">
                      <input
                        id="enquiry-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        className={`${inputClass} h-12`}
                        placeholder="you@example.com"
                        data-testid="enquiry-email-input"
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Travel month" id="enquiry-month">
                      <select
                        id="enquiry-month"
                        name="travelMonth"
                        value={formData.travelMonth}
                        onChange={handleChange}
                        required
                        className={`${inputClass} h-12 cursor-pointer`}
                        data-testid="enquiry-month-select"
                      >
                        <option value="">Choose</option>
                        {travelMonths.map((month) => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="People" id="enquiry-people">
                      <input
                        id="enquiry-people"
                        type="number"
                        name="numberOfPeople"
                        value={formData.numberOfPeople}
                        onChange={handleChange}
                        min="1"
                        max="50"
                        required
                        className={`${inputClass} tv-num h-12`}
                        data-testid="enquiry-people-input"
                      />
                    </Field>
                  </div>

                  <Field label="Message (optional)" id="enquiry-message">
                    <textarea
                      id="enquiry-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      className={`${inputClass} resize-none py-3`}
                      placeholder="Any questions or special requirements?"
                      data-testid="enquiry-message-textarea"
                    />
                  </Field>

                  {submitError && (
                    <p className="text-sm text-red-400" role="alert" data-testid="enquiry-submit-error">{submitError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="tv-btn-primary h-12 w-full px-6 text-sm"
                    data-testid="enquiry-submit-button"
                  >
                    {submitting ? 'Sending…' : 'Send enquiry'}
                  </button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
                className="py-6"
                role="status"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/15">
                  <Check className="h-6 w-6 text-emerald-400" />
                </span>
                <h3 className="mt-6 font-display text-3xl font-medium tracking-tight text-white">Enquiry sent</h3>
                <p className="mt-2 text-[#94A3B8]">We’ll get back to you within 24 hours.</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnquiryModal;

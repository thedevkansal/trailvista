import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check } from 'lucide-react';
import { submitEnquiry } from '../lib/enquiryService';
import PageHeader from '../components/PageHeader';
import { FadeIn, EASE_OUT } from '../components/motion';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-[#071827] px-4 text-[15px] text-white placeholder:text-[#94A3B8]/60 hover:border-white/20 focus:border-[#38BDF8] focus:outline-none';

const Field = ({ label, id, children }) => (
  <div>
    <label htmlFor={id} className="mb-2 block text-sm font-medium text-white">
      {label}
    </label>
    {children}
  </div>
);

const CHANNELS = [
  { label: 'Phone', note: 'Mon to Sat, 9 am to 8 pm', value: '+91 98765 43210', href: 'tel:+919876543210' },
  { label: 'Email', note: 'We reply within 24 hours', value: 'hello@trailvista.com', href: 'mailto:hello@trailvista.com' },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    website: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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
        source: 'contact',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        website: formData.website,
      });
      setShowSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '', website: '' });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader lines={['Talk to', 'the trek team']}>
          <p>Questions about a route, help with a booking, or a custom expedition for your group. A real person reads every message.</p>
        </PageHeader>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Contact details */}
          <FadeIn className="lg:col-span-4">
            <dl className="border-t border-white/10">
              {CHANNELS.map((c) => (
                <div key={c.label} className="border-b border-white/10 py-6">
                  <dt className="text-sm text-[#94A3B8]">{c.label}</dt>
                  <dd className="mt-1">
                    <a href={c.href} className="tv-num break-words font-display text-xl font-medium text-white hover:text-[#38BDF8] sm:text-2xl">
                      {c.value}
                    </a>
                    <p className="mt-1 text-sm text-[#94A3B8]">{c.note}</p>
                  </dd>
                </div>
              ))}
              <div className="border-b border-white/10 py-6">
                <dt className="text-sm text-[#94A3B8]">Office</dt>
                <dd className="mt-1 text-white">
                  123 Mountain Road
                  <br />
                  Dehradun, Uttarakhand 248001
                  <br />
                  India
                </dd>
              </div>
            </dl>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 font-semibold text-white hover:text-[#38BDF8]"
              data-testid="contact-whatsapp-button"
            >
              Chat on WhatsApp <ArrowUpRight className="h-4 w-4" />
            </a>
          </FadeIn>

          {/* Contact form */}
          <FadeIn delay={0.1} className="lg:col-span-8">
            {!showSuccess ? (
              <form onSubmit={handleSubmit} className="relative space-y-6">
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
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Field label="Full name" id="contact-name">
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      className={`${inputClass} h-12`}
                      placeholder="Your name"
                      data-testid="contact-name-input"
                    />
                  </Field>
                  <Field label="Email" id="contact-email">
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      className={`${inputClass} h-12`}
                      placeholder="you@example.com"
                      data-testid="contact-email-input"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Field label="Phone" id="contact-phone">
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      autoComplete="tel"
                      className={`${inputClass} h-12`}
                      placeholder="+91 98765 43210"
                      data-testid="contact-phone-input"
                    />
                  </Field>
                  <Field label="What’s it about?" id="contact-subject">
                    <select
                      id="contact-subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={`${inputClass} h-12 cursor-pointer`}
                      data-testid="contact-subject-select"
                    >
                      <option value="">Choose a topic</option>
                      <option value="general">General question</option>
                      <option value="booking">Help with a booking</option>
                      <option value="custom">Custom trek</option>
                      <option value="corporate">Corporate trip</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </Field>
                </div>

                <Field label="Message" id="contact-message">
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className={`${inputClass} resize-none py-3`}
                    placeholder="Tell us which trek, your dates and group size, or anything else on your mind."
                    data-testid="contact-message-textarea"
                  />
                </Field>

                {submitError && (
                  <p className="text-sm text-red-400" role="alert" data-testid="contact-submit-error">{submitError}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="tv-btn-primary h-12 w-full px-8 text-sm sm:w-auto"
                  data-testid="contact-submit-button"
                >
                  {submitting ? 'Sending…' : 'Send message'}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
                className="rounded-[28px] border border-white/10 bg-[#071827] p-8 sm:p-12"
                role="status"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/15">
                  <Check className="h-6 w-6 text-emerald-400" />
                </span>
                <h2 className="mt-6 font-display text-3xl font-medium tracking-tight text-white">Message sent</h2>
                <p className="mt-3 max-w-md text-lg text-[#94A3B8]">
                  Thanks for writing. Someone from the trek team will get back to you within 24 hours.
                </p>
              </motion.div>
            )}
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default Contact;

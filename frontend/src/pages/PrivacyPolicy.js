import React from 'react';
import LegalPage from '../components/LegalPage';

const sections = [
  {
    title: 'Authentication and security',
    content: 'All user authentication, signup, and login workflows are secured and handled by Supabase Auth. We do not store raw passwords on our servers. Your password and profile credentials are encrypted at rest and in transit using modern security protocols.'
  },
  {
    title: 'Information we collect',
    content: 'We collect information you provide directly to us when creating an account or booking an expedition. This includes your name, email address, phone number, emergency contact details, and any health information or trekking history required to ensure safety during your trip.'
  },
  {
    title: 'Payment processing',
    content: 'All booking payments are processed securely through Razorpay. TrailVista does not store, access, or log your raw credit card numbers, CVVs, or internet banking credentials. Your financial transaction is encrypted and managed entirely under Razorpay\'s certified security compliance.'
  },
  {
    title: 'Email and communications',
    content: 'We use your email address to send transactional messages, including booking confirmations, safety compliance forms, itinerary updates, and account security notifications. You may opt out of promotional newsletters at any time.'
  },
  {
    title: 'Data retention and protection',
    content: 'We retain your personal information only as long as necessary to fulfill your booking requirements and legal obligations. We do not sell or lease your personal information to third-party marketing companies.'
  }
];

const PrivacyPolicy = () => (
  <LegalPage
    lines={['Privacy policy']}
    intro="How we collect, protect and manage your data at TrailVista."
    updated="May 2026"
    sections={sections}
  >
    <p>
      Questions or requests about your data? Write to{' '}
      <a
        href="mailto:privacy@trailvista.com"
        className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
      >
        privacy@trailvista.com
      </a>
      .
    </p>
  </LegalPage>
);

export default PrivacyPolicy;

import React from 'react';
import LegalPage from '../components/LegalPage';

const sections = [
  {
    title: 'Bookings and reservations',
    content: 'To confirm an expedition booking, user registrations must be completed through TrailVista. A slot is reserved only upon receipt of the specified booking fee. The full remaining balance must be paid at least 15 days prior to the trek departure date.'
  },
  {
    title: 'Cancellations and refunds',
    content: 'Cancellations must be requested via email or the dashboard. Refunds follow this schedule:\n• Cancel 30 days or more before trek: 100% refund.\n• Cancel 15-29 days before trek: 50% refund.\n• Cancel less than 15 days before trek: No refund available due to advanced campsite reservations and permits.'
  },
  {
    title: 'Wilderness risks and health',
    content: 'High-altitude mountaineering and trekking carry inherent environmental risks, including physical strain, unpredictable weather, landslides, and altitude sickness. By booking, you certify that you are physically fit and comply with our pre-expedition training guidelines. TrailVista is not responsible for injuries arising from undisclosed health conditions.'
  },
  {
    title: 'Itinerary changes',
    content: 'Safety is our absolute priority. We reserve the right to alter itineraries, change campsites, or cancel batches due to blizzards, landslides, road closures, government restrictions, or other force majeure circumstances. In such cases, alternative treks or credit vouchers will be issued.'
  },
  {
    title: 'Code of conduct',
    content: 'TrailVista promotes responsible, eco-friendly tourism. We strictly enforce a "Leave No Trace" policy. Littering, alcohol abuse, or non-compliance with the trek leader\'s safety directions will result in immediate termination of the trek for the offending participant without any refund.'
  }
];

const TermsConditions = () => (
  <LegalPage
    lines={['Terms and', 'conditions']}
    intro="Please read these before you book a trek."
    updated="May 2026"
    sections={sections}
  >
    <p>
      These terms govern your use of the TrailVista platform. Continued booking indicates acceptance of these
      guidelines, risks, and cancellation terms.
    </p>
  </LegalPage>
);

export default TermsConditions;

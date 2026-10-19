const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || '').replace(/\/$/, '');

export async function submitEnquiry(payload) {
  if (!BACKEND_URL) throw new Error('Enquiries are not configured. Please email us instead.');

  let res;
  try {
    res = await fetch(`${BACKEND_URL}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error('Could not reach our server. Please check your connection and try again.');
  }

  if (res.ok) return res.json().catch(() => ({ success: true }));

  if (res.status === 429) throw new Error('Too many enquiries from you. Please try again in a few minutes.');
  if (res.status === 422) throw new Error('Please check your details: a valid name, email and phone number are required.');
  throw new Error('Could not send your enquiry. Please try again.');
}

// Next twelve months, e.g. "November 2026", starting from the current month.
export function upcomingMonths(count = 12, from = new Date()) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(from.getFullYear(), from.getMonth() + i, 1);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  });
}

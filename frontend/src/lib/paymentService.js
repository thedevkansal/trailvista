import { supabase } from './supabaseClient';

const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || '').replace(/\/$/, '');

export const VERIFY_FAILED_MESSAGE =
  'Payment succeeded but booking verification failed. Please contact support.';

export class AuthRequiredError extends Error {
  constructor(message = 'Please login to book this trek') {
    super(message);
    this.name = 'AuthRequiredError';
  }
}

async function getAccessToken() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    throw new Error(error.message || 'Failed to read session.');
  }
  const token = session?.access_token;
  if (!token) {
    throw new AuthRequiredError();
  }
  return token;
}

async function parseResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = data.detail;
    const message =
      typeof detail === 'string'
        ? detail
        : Array.isArray(detail)
          ? detail.map((d) => d.msg || d.message).join(', ')
          : data.message || 'Request failed';
    throw new Error(message);
  }
  return data;
}

async function apiPost(path, body, networkErrorMessage = 'Could not reach payment server.') {
  if (!BACKEND_URL) throw new Error('Payment backend is not configured.');
  const headers = await authHeaders();
  let res;
  try {
    res = await fetch(`${BACKEND_URL}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(networkErrorMessage);
  }
  return parseResponse(res);
}

async function authHeaders() {
  const accessToken = await getAccessToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
}

export async function createPaymentOrder({ trekId }) {
  return apiPost('/api/payments/create-order', { trek_id: trekId, currency: 'INR' });
}

export async function verifyPayment({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  trekId,
  amount,
  userEmail,
  customerName,
}) {
  try {
    return await apiPost(
      '/api/payments/verify',
      {
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
        trek_id: trekId,
        amount,
        user_email: userEmail,
        customer_name: customerName,
      },
      VERIFY_FAILED_MESSAGE
    );
  } catch (err) {
    if (err instanceof AuthRequiredError) throw err;
    throw new Error(VERIFY_FAILED_MESSAGE);
  }
}

export function openRazorpayCheckout({
  order,
  trek,
  user,
  onVerified,
  onError,
}) {
  const keyId = process.env.REACT_APP_RAZORPAY_KEY_ID;
  if (!keyId) {
    onError(new Error('Razorpay is not configured.'));
    return;
  }

  const displayName =
    user?.profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    '';

  const configId =
    process.env.REACT_APP_RAZORPAY_CONFIG_ID || 'config_SsVsHAqPNmyksz';

  const options = {
    key: keyId,
    amount: order.amount,
    currency: order.currency || 'INR',
    name: 'TrailVista',
    description: trek?.name || 'TrailVista Booking',
    order_id: order.order_id,
    config_id: configId,
    prefill: {
      name: displayName,
      email: user?.email || '',
      contact: user?.profile?.phone || user?.phone || '',
    },
    handler: onVerified,
    modal: {
      ondismiss: () => {
        onError(new Error('Payment cancelled.'));
      },
    },
    theme: {
      color: '#0ea5e9',
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.on('payment.failed', (response) => {
    const msg =
      response?.error?.description ||
      response?.error?.reason ||
      'Payment failed. Please try again.';
    onError(new Error(msg));
  });
  rzp.open();
}

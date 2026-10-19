// Vercel Cron target (see vercel.json). Free-tier Supabase projects pause after
// 7 days without activity, so run one cheap read query against the database daily.
module.exports = async (req, res) => {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  const supabaseUrl = (process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL || '').replace(/\/$/, '');
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return res.status(500).json({ ok: false, error: 'Supabase env variables not configured' });
  }

  try {
    // public.keep_alive() is defined in supabase/migrations/003_keep_alive_rpc.sql
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/keep_alive`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      },
      body: '{}',
    });

    if (!response.ok) {
      const body = await response.text();
      console.error('Supabase keep-alive failed', response.status, body);
      return res.status(502).json({ ok: false, status: response.status });
    }

    return res.status(200).json({ ok: true, pingedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Supabase keep-alive error', error);
    return res.status(502).json({ ok: false, error: error.message });
  }
};

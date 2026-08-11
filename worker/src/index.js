/**
 * larpauto-form — valuation enquiry endpoint.
 *
 * Takes the POST from the site's form, formats it, and sends it to
 * TO_EMAIL through Resend. Nothing is stored here; the email is the record.
 *
 * Deliberately narrow: it accepts one shape of request from one set of
 * origins and refuses everything else, so it cannot be turned into an open
 * relay for someone else's page.
 */

const FIELDS = [
  ['name', 'Name', true],
  ['email', 'Email', true],
  ['vin', 'VIN', true],
  ['mileage', 'Mileage', true],
  ['owners', 'Number of owners', true],
  ['accidents', 'Accident history', true],
  ['options', 'Window sticker / options', false],
  ['trade_offer', 'Trade-in offer', false],
  ['service_history', 'Service history', false],
  ['modifications', 'Modifications', false],
];

const MAX_BODY = 64 * 1024; // a text form; anything larger is not a real enquiry
const MAX_FIELD = 5000;

function corsHeaders(origin, env) {
  const allowed = (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const ok = origin && allowed.includes(origin);
  return {
    'Access-Control-Allow-Origin': ok ? origin : allowed[0] || '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
    _ok: ok,
  };
}

function json(body, status, headers) {
  const { _ok, ...h } = headers;
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...h },
  });
}

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const cors = corsHeaders(origin, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: (({ _ok, ...h }) => h)(cors) });
    }
    if (request.method !== 'POST') {
      return json({ success: false, message: 'Method not allowed' }, 405, cors);
    }
    if (!cors._ok) {
      return json({ success: false, message: 'Origin not allowed' }, 403, cors);
    }
    if (!env.RESEND_API_KEY) {
      // Misconfiguration, not the visitor's fault — say so plainly in the log
      // and give them something actionable rather than a silent failure.
      console.error('RESEND_API_KEY is not set on the worker');
      return json(
        { success: false, message: 'The form is not configured yet.' },
        500,
        cors
      );
    }

    // --- read the submission -------------------------------------------------
    let data = {};
    try {
      const type = request.headers.get('Content-Type') || '';
      const raw = await request.text();
      if (raw.length > MAX_BODY) {
        return json({ success: false, message: 'Too large' }, 413, cors);
      }
      if (type.includes('application/json')) {
        data = JSON.parse(raw);
      } else {
        for (const [k, v] of new URLSearchParams(raw)) data[k] = v;
      }
    } catch {
      return json({ success: false, message: 'Could not read that' }, 400, cors);
    }

    // --- spam and validity ---------------------------------------------------
    if (data['company-website']) {
      // Honeypot filled: accept silently so the bot does not learn anything.
      return json({ success: true, message: 'Thanks' }, 200, cors);
    }

    const clean = {};
    for (const [key, label, required] of FIELDS) {
      const v = (data[key] ?? '').toString().trim().slice(0, MAX_FIELD);
      if (required && !v) {
        return json({ success: false, message: `${label} is required` }, 400, cors);
      }
      clean[key] = v;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean.email)) {
      return json({ success: false, message: 'That email does not look right' }, 400, cors);
    }

    // --- compose -------------------------------------------------------------
    const rows = FIELDS.filter(([k]) => clean[k])
      .map(
        ([k, label]) =>
          `<tr><td style="padding:8px 14px 8px 0;vertical-align:top;color:#5e686f;white-space:nowrap">${label}</td>` +
          `<td style="padding:8px 0;vertical-align:top;color:#12171c">${escapeHtml(clean[k]).replace(/\n/g, '<br>')}</td></tr>`
      )
      .join('');

    const html =
      `<div style="font:15px/1.6 -apple-system,Segoe UI,sans-serif;color:#12171c">` +
      `<p style="margin:0 0 16px;font-weight:700">New valuation request</p>` +
      `<table style="border-collapse:collapse">${rows}</table>` +
      `<p style="margin:20px 0 0;color:#5e686f;font-size:13px">Reply to this email to reach ${escapeHtml(clean.name)} directly.</p>` +
      `</div>`;

    const text = FIELDS.filter(([k]) => clean[k])
      .map(([k, label]) => `${label}:\n${clean[k]}`)
      .join('\n\n');

    // --- send ----------------------------------------------------------------
    // Overridable so the endpoint can be pointed at a local mock in tests.
    const api = env.RESEND_API_BASE || 'https://api.resend.com';
    const res = await fetch(`${api}/emails`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `LARP Auto <${env.FROM_EMAIL}>`,
        to: [env.TO_EMAIL],
        reply_to: clean.email,
        subject: `Valuation request — ${clean.name}${clean.vin ? ` — ${clean.vin}` : ''}`,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('resend failed', res.status, detail);
      return json(
        { success: false, message: 'Could not send that. Please email us directly.' },
        502,
        cors
      );
    }

    return json({ success: true, message: 'Sent' }, 200, cors);
  },
};

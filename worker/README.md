# larpauto-form

Cloudflare Worker that receives the site's valuation form and emails it to
`sales@larpauto.com` through Resend. No database, no third-party form service,
no submission cap beyond Resend's own sending limits.

## Deploy

```bash
cd worker
npx wrangler login            # opens a browser once
npx wrangler secret put RESEND_API_KEY   # paste the key, it is never committed
npx wrangler deploy
```

`deploy` prints a URL like `https://larpauto-form.<subdomain>.workers.dev`.
Put that in `../src/lib/site.js` as `formEndpoint`, then push — the site
rebuilds and the form goes live.

## Configuration

`wrangler.toml` holds the non-secret settings:

- `TO_EMAIL` — where enquiries land
- `FROM_EMAIL` — must be on a domain verified in Resend. Until `larpauto.com`
  is verified, use `onboarding@resend.dev` or nothing will send.
- `ALLOWED_ORIGINS` — the only origins allowed to POST. Anything else gets a
  403, so the endpoint cannot be used as an open relay from someone else's
  page.

`RESEND_API_KEY` is a **secret**, set with `wrangler secret put`. It must never
go in `wrangler.toml` — this repo is public.

## What it does

- rejects anything that is not a POST from an allowed origin
- accepts a filled honeypot silently, so bots learn nothing
- requires name, email, VIN, mileage, owners and accident history
- caps body at 64KB and each field at 5,000 characters
- sets `reply_to` to the sender, so replying in your inbox reaches the customer

## Testing locally

```bash
node /tmp/mock-resend.mjs &     # or any endpoint that returns 200
npx wrangler dev --local \
  --var RESEND_API_KEY:test \
  --var RESEND_API_BASE:http://localhost:8788 \
  --var ALLOWED_ORIGINS:http://localhost:4322
```

`RESEND_API_BASE` exists so the send can be pointed at a mock instead of the
live API.

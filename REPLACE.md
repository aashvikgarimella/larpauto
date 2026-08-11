# Before launch

Two things block delivery. Everything else on this list is optional polish.

## 1. Connect the form — otherwise nothing reaches you

The form collects everything correctly but **cannot deliver until you set an
access key.** Right now a visitor who submits sees an honest message telling
them to email you directly. It does not pretend to send.

1. Go to **https://web3forms.com**
2. Enter **sales@larpauto.com**. They email you an access key. No account, no
   password, free.
3. Put the key in `src/lib/site.js` → `formAccessKey`
4. `npm run build`

That key is public by design — it only ever posts to your inbox, so it is safe
to ship in the page. It works on any host, because it is just a request from
the visitor's browser to their API. You do not need a backend.

Test it with a real submission before you send anyone to the site.

**If you would rather not use a third party:** Formspree, Getform and Basin work
the same way, and Squarespace's own form block would work if you rebuild the
form there. All of them need an account somewhere. There is no way to email from
a static page without one.

## 2. Hosting — Squarespace will not serve this site

Worth being blunt about, because it affects your plan. This is an Astro static
build: a folder of HTML, CSS and fonts in `dist/`. Squarespace does not let you
upload a site like this — it serves pages built in its own editor. Their code
blocks and code injection are for snippets, not a whole site.

You own **larpauto.com** through Squarespace, and that is fine. The domain and
the hosting are separate decisions. Two options:

- **Keep the domain where it is, host the site elsewhere.** Put `dist/` on
  Netlify, Cloudflare Pages or Vercel (all free at this size, all take a
  drag-and-drop), then change the DNS records in your Squarespace domain
  settings to point at them. The domain stays yours and stays where it is.
- **Rebuild the site inside Squarespace.** You would be rebuilding it in their
  editor, and the voxel animation and generated logo would not survive.

The first is what I would do. Say the word and I will walk you through it.

## Still open

| What | Where | Notes |
|---|---|---|
| **Where the car lives during the sale** | FAQ | Unanswered on the page. First thing a $150k owner asks. Decide custody, and confirm what insurance covers a client vehicle in your care — this may need a specific policy or a Florida dealer licence. |
| **Physical address** | Footer | Not present. Needed on any commercial email you send, and expected by anyone vetting you. |
| **Phone number** | `src/lib/site.js` | Optional, but this audience calls. |

## Settled

- Name: **LARP Auto**. Domain `larpauto.com`.
- Prep fee **$750, non-refundable**, stated plainly on the page.
- Success fee by value band: under $40k quoted · $40–70k **$750** · $70–120k
  **$1,250** · $120–250k **$2,000** · above $250k quoted. No percentage.
- Listing standard: 100+ photographs. Paint-meter readings, compression and
  leakdown, and paint-correction reporting were removed.
- Three conditions published: photo ID and registration before any work; the
  registered owner present or on video if the seller is not the owner; no
  checks, payment cleared before meeting.

## One caution

The worked example in "The gap" ($56,000 trade → $64,500 sale → you keep $7,000)
is labelled **Illustration** and says outright that no such sale happened. Keep
that label until you have a real result. The moment you have one, replace the
example with it — a real number with a real car behind it is worth more than
anything else you could put on this page.

Also worth ten minutes with someone qualified: the non-refundable fee combined
with "if you do not provide ID we keep the fee and provide no service" is the
kind of term that draws consumer-protection complaints in Florida. The ID
requirement itself is sound and I would keep it exactly as written — it is the
money half that is worth a second opinion.

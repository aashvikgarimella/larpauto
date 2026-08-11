/**
 * Every undecided fact lives here. Swap these and the site follows.
 * See REPLACE.md for what each one needs.
 */
export const site = {
  name: 'LARP Auto',
  wordmark: 'LARP',
  wordmarkTail: 'AUTO',

  region: 'South Florida',
  counties: 'Miami-Dade · Broward · Palm Beach',

  prepFee: 750,

  // Success fee by value band, owed on completion. Confirmed 2026-08-10.
  tiers: [
    { band: 'Under $40,000', min: 'Quoted' },
    { band: '$40,000 – $70,000', min: '$750' },
    { band: '$70,000 – $120,000', min: '$1,250' },
    { band: '$120,000 – $250,000', min: '$2,000' },
    { band: 'Above $250,000', min: 'Quoted' },
  ],

  bookingUrl: '#start',
  email: 'sales@larpauto.com',
  phone: null,

  /**
   * The Cloudflare Worker that receives the form and emails it on via Resend.
   *
   * Deploy it from worker/ (see REPLACE.md), then paste the URL it prints —
   * something like https://larpauto-form.<your-subdomain>.workers.dev
   *
   * Left null, the form sends nothing and says so rather than pretending.
   */
  formEndpoint: null,
};

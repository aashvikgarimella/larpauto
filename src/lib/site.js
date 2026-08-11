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
   * Web3Forms access key — this is what makes the form actually deliver.
   *
   * Get one in about a minute at https://web3forms.com: enter
   * sales@larpauto.com, and the key is emailed to you. No account, no
   * password, free. Paste it here and every submission is forwarded to that
   * address. It is a public key by design; it only ever posts to your inbox,
   * so it is safe to ship in the page.
   *
   * Works on any host — Squarespace, Netlify, anywhere — because it is just a
   * request to their API from the visitor's browser. No backend of your own.
   *
   * Until this is set the form cannot deliver, and it will say so plainly
   * rather than pretending to send.
   */
  formAccessKey: null,
};

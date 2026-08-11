import puppeteer from 'puppeteer-core';
const OUT = process.env.OUT || './shots';
const b = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--hide-scrollbars'],
});
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 1000 });
await p.goto('http://localhost:4322/', { waitUntil: 'networkidle0' });

// intercept the mailto navigation the fallback triggers
let mailto = null;
p.on('request', (r) => {
  if (r.url().startsWith('mailto:')) mailto = r.url();
});
await p.evaluate(() => {
  const orig = Object.getOwnPropertyDescriptor(window.Location.prototype, 'href');
  window.__mailto = null;
});
await p.evaluateOnNewDocument(() => {});

const form = await p.$('#valuation');
await form.evaluate((el) => el.scrollIntoView({ block: 'start' }));
await new Promise((r) => setTimeout(r, 700));
await p.screenshot({ path: `${OUT}/form-top.png` });

// fill it out
await p.evaluate(() => {
  const set = (n, v) => {
    const el = document.querySelector(`[name="${n}"]`);
    if (el) { el.value = v; el.dispatchEvent(new Event('input', {bubbles:true})); }
  };
  set('name', 'Alex Moreno');
  set('email', 'alex@example.com');
  set('vin', 'WP0AF2A99JS165123');
  set('mileage', '18,400');
  set('owners', '2');
  set('accidents', 'None. Clean Carfax.');
  set('options', 'PCCB, full bucket seats, front axle lift, Weissach package');
  set('trade_offer', '$205,000 verbal from a local dealer');
  set('service_history', 'All Porsche dealer, records in hand, major done at 15k');
  set('modifications', 'Titanium exhaust; stock system retained in the box');
});
await new Promise((r) => setTimeout(r, 200));
await p.screenshot({ path: `${OUT}/form-filled.png`, fullPage: false });

// capture the composed mailto by intercepting the navigation
await p.setRequestInterception(true);
let composed = null;
p.on('request', (req) => {
  if (req.url().startsWith('mailto:')) {
    composed = req.url();
    req.abort().catch(() => {});
  } else {
    req.continue().catch(() => {});
  }
});
await p.evaluate(() => document.getElementById('valuation').requestSubmit());
await new Promise((r) => setTimeout(r, 1200));
console.log('MAILTO CAPTURED:', composed ? 'yes' : 'no');
if (composed) {
  const u = new URL(composed);
  console.log('  to     :', u.pathname);
  console.log('  subject:', decodeURIComponent(new URLSearchParams(u.search).get('subject') || ''));
  console.log('  body   :\n' + decodeURIComponent(new URLSearchParams(u.search).get('body') || '').split('\n').map(l => '    ' + l).join('\n'));
}
await p.screenshot({ path: `${OUT}/form-sent.png` });
await b.close();

/**
 * Screenshot + overflow audit at real device viewports.
 * Chrome's headless window clamps to 500px wide, so mobile has to come from
 * CDP device emulation rather than --window-size.
 */
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const CHROME =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = process.env.URL || 'http://localhost:4321/';
const OUT = process.env.OUT || './shots';
const TAG = process.env.TAG || 'a';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, dsf: 1, mobile: false },
  { name: 'laptop', width: 1180, height: 800, dsf: 1, mobile: false },
  { name: 'tablet', width: 820, height: 1180, dsf: 1, mobile: true },
  { name: 'mobile', width: 390, height: 844, dsf: 1, mobile: true },
  { name: 'small', width: 320, height: 690, dsf: 1, mobile: true },
];

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--hide-scrollbars', '--disable-gpu'],
});

const report = [];

for (const v of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport({
    width: v.width,
    height: v.height,
    deviceScaleFactor: v.dsf,
    isMobile: v.mobile,
    hasTouch: v.mobile,
  });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1400)); // let the authored motion settle

  const audit = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const offenders = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.right > vw + 1 || r.left < -1) {
        const cls =
          typeof el.className === 'string' ? el.className : el.className.baseVal;
        offenders.push(
          `${el.tagName.toLowerCase()}${cls ? '.' + cls.trim().split(/\s+/).join('.') : ''} [w=${Math.round(r.width)} right=${Math.round(r.right)}]`
        );
      }
    }
    // smallest tap targets among interactive elements
    const small = [];
    for (const el of document.querySelectorAll('a, button, summary')) {
      const r = el.getBoundingClientRect();
      if (r.height > 0 && r.height < 40) {
        small.push(`${el.tagName.toLowerCase()}:"${(el.textContent || '').trim().slice(0, 24)}" h=${Math.round(r.height)}`);
      }
    }
    return {
      vw,
      scrollWidth: document.documentElement.scrollWidth,
      pageHeight: document.documentElement.scrollHeight,
      offenders: [...new Set(offenders)].slice(0, 12),
      small: [...new Set(small)].slice(0, 8),
    };
  });

  report.push({ viewport: v.name, ...audit });

  await page.screenshot({
    path: `${OUT}/${TAG}-${v.name}-fold.png`,
    fullPage: false,
  });
  if (v.name === 'desktop' || v.name === 'mobile') {
    await page.screenshot({
      path: `${OUT}/${TAG}-${v.name}-full.png`,
      fullPage: true,
    });
  }
  await page.close();
}

await browser.close();
console.log(JSON.stringify(report, null, 2));

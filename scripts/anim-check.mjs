import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--hide-scrollbars'],
});
const p = await b.newPage();
await p.setViewport({ width: 1000, height: 700 });
await p.goto(process.env.URL || 'http://localhost:4322/', { waitUntil: 'networkidle0' });
const read = () =>
  p.evaluate(() =>
    [...document.querySelectorAll('[data-layer]')].map(
      (el) => el.dataset.layer + ':' + getComputedStyle(el).transform
    )
  );
await new Promise((r) => setTimeout(r, 700));
const a = await read();
await new Promise((r) => setTimeout(r, 1300));
const c = await read();
a.forEach((v, i) => {
  const name = v.split(':')[0];
  console.log(name.padEnd(9), v === c[i] ? 'STATIC' : 'MOVING');
});
await b.close();

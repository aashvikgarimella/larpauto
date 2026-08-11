# Meridian

Marketing site for an enthusiast-vehicle sales advisory service.
Astro, static output, no backend. All illustration is isometric voxel geometry
generated at build time — the site ships no photography.

```bash
npm install
npm run dev              # http://localhost:4321
npm run build            # → dist/
npm run preview
URL=http://localhost:4321/ OUT=./shots npm run shots   # 5 viewports + overflow audit
```

- `PRODUCT.md` — durable product truth
- `DESIGN.md` — the design system, recorded from the built code
- `REPLACE.md` — **read before launching**; placeholders and assumptions
- `src/lib/voxel.js` — isometric renderer + the vehicle model
- `src/lib/scenes.js` — the six scenes composed from it
- `src/lib/site.js` — every undecided fact, in one place

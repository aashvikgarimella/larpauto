import {
  voxelScene,
  voxelSceneLayered,
  box,
  at,
  car,
  column,
  paint,
  plate,
  markCar,
  driveDelta,
  PROFILES,
} from './voxel.js';

const INK = '#12171C';
const RED = '#E53935';
const MARK_AXLES_EXPORT = [1, 6];

/* ------------------------------------------------------------------- hero */

const LANES = [
  { y: 0, body: 'blue', start: -12, units: 22, dur: 5.6, delay: -1.9 },
  { y: 9, body: 'red', start: -2, units: 22, dur: 4.4, delay: -0.4 },
  { y: 18, body: 'yellow', start: -15, units: 22, dur: 6.3, delay: -3.4 },
];

/**
 * Hero: three cars running the same stretch of road at different speeds. The
 * red one is quickest, which is the page's whole argument rendered as a race —
 * the same asset, sold three ways, does not arrive at the same place.
 */
export function raceScene(u = 10) {
  const ROAD_X = -17;
  const ROAD_LEN = 44;

  // lane divider dashes, the only voxels the road itself needs
  let base = [];
  for (const divider of [8, 17]) {
    for (let x = ROAD_X + 2; x < ROAD_X + ROAD_LEN - 2; x += 6) {
      base = base.concat(box(x, divider, 0, 3, 1, 1, 'lane', { topOnly: true }));
    }
  }

  const layers = LANES.map((lane, i) => {
    const d = driveDelta(lane.units, u);
    return {
      name: `car${i}`,
      voxels: at(
        car({
          profile: i === 1 ? PROFILES.gt : i === 0 ? PROFILES.saloon : PROFILES.wedge,
          body: lane.body,
          stripe: i === 1 ? 'silver' : null,
        }),
        lane.start,
        lane.y,
        1
      ),
      vars: {
        '--dx': `${Math.round(d.dx)}px`,
        '--dy': `${Math.round(d.dy)}px`,
        '--dur': `${lane.dur}s`,
        '--delay': `${lane.delay}s`,
      },
    };
  });

  return voxelSceneLayered(
    { base, layers },
    {
      u,
      pad: 10,
      prelude: (uu, bounds, stroke, sw) =>
        plate(ROAD_X, 0, ROAD_LEN, 26, 0, 'road', uu, bounds, stroke, sw),
    }
  );
}

/* ------------------------------------------------------------------- gap */

/**
 * The gap: what a dealer offers against what a well-run sale reaches. The
 * difference is the only part in red, because it is the only part we are paid
 * for. It drops into place once, like a piece seating.
 */
export function spreadScene(u = 13) {
  const BASE = 7;
  const GAIN = 4;
  let base = [];
  base = base.concat(column(0, 1, BASE, 'graphite'));
  base = base.concat(column(6, 1, BASE, 'graphite'));
  base = base.concat(box(0, 1, BASE, 2, 2, GAIN, 'red', { opacity: 0.18 }));

  const layers = [
    {
      name: 'gain',
      voxels: column(6, 1, GAIN, 'red').map((k) => ({ ...k, z: k.z + BASE })),
      vars: { '--drop': `${Math.round(u * 5)}px` },
    },
  ];

  return voxelSceneLayered(
    { base, layers },
    {
      u,
      pad: 18,
      extraTop: 12,
      prelude: (uu, bounds, stroke, sw) =>
        plate(-1, -1, 12, 8, -1, 'slab', uu, bounds, stroke, sw),
    }
  );
}

/* ----------------------------------------------------------------- stages */

/** Stage 1 — the audit. Measurement marks along the flank. */
export function auditScene(u = 11) {
  const v = car({ body: 'blue' });
  const marks = [[7, 6, 2], [12, 6, 2], [17, 6, 2]];
  return voxelScene(paint(v, marks, 'yellow'), {
    u,
    pad: 16,
    prelude: (uu, bounds, stroke, sw) =>
      plate(-1, -1, 22, 10, -1, 'plinth', uu, bounds, stroke, sw),
    overlay: (p) =>
      marks
        .map(([x, y, z]) => {
          const c = p(x, y, z);
          return `<circle cx="${c.x}" cy="${c.y + u * 1.2}" r="${u * 1.7}" fill="none" stroke="${INK}" stroke-width="1.2" stroke-dasharray="3 3" opacity=".55"/>`;
        })
        .join(''),
  });
}

/** Stage 2 — the dossier: stacked plates, the topmost in yellow. */
export function dossierScene(u = 12) {
  let v = [];
  ['graphite', 'graphite', 'pewter', 'yellow'].forEach((m, i) => {
    v = v.concat(box(1 + i, 1 + i, i, 6 - i, 6 - i, 1, m));
  });
  return voxelScene(v, {
    u,
    pad: 16,
    prelude: (uu, bounds, stroke, sw) =>
      plate(0, 0, 10, 8, -1, 'slab', uu, bounds, stroke, sw),
  });
}

/**
 * Stage 3 — venue selection. Four routes, one lit, and the car actually drives
 * down the chosen one.
 */
export function venueScene(u = 10) {
  const pads = [
    { x: 26, y: 0, m: 'pewter' },
    { x: 30, y: 4, m: 'yellow' },
    { x: 34, y: 8, m: 'pewter' },
    { x: 38, y: 12, m: 'pewter' },
  ];

  let base = [];
  for (const pad of pads) base = base.concat(box(pad.x, pad.y, 0, 3, 3, 1, pad.m));

  const d = driveDelta(6, u);
  const layers = [
    {
      name: 'chooser',
      voxels: car({ profile: PROFILES.gt, body: 'red', stripe: 'silver' }),
      vars: {
        '--dx': `${Math.round(d.dx)}px`,
        '--dy': `${Math.round(d.dy)}px`,
        '--dur': '3.4s',
        '--delay': '0s',
      },
    },
  ];

  return voxelSceneLayered(
    { base, layers },
    {
      u,
      pad: 14,
      overlay: (p) =>
        pads
          .map((pad) => {
            const a = p(20, 3, 2);
            const b = p(pad.x, pad.y + 1, 1);
            const lit = pad.m === 'yellow';
            return `<line x1="${a.x}" y1="${a.y + u}" x2="${b.x}" y2="${b.y + u * 0.5}" stroke="${lit ? RED : INK}" stroke-width="${lit ? 1.8 : 1}" stroke-dasharray="4 4" opacity="${lit ? 0.9 : 0.3}"/>`;
          })
          .join(''),
    }
  );
}

/** Stage 4 — the fallback ladder: if one route closes, the next opens. */
export function ladderScene(u = 12) {
  let v = [];
  [1, 2, 3, 4].forEach((h, i) => {
    v = v.concat(box(i * 3, 1, 0, 2, 2, h, i === 3 ? 'red' : 'graphite'));
  });
  return voxelScene(v, {
    u,
    pad: 16,
    prelude: (uu, bounds, stroke, sw) =>
      plate(-1, -1, 14, 6, -1, 'slab', uu, bounds, stroke, sw),
  });
}

/** The wordmark glyph: a compact green voxel car. */
export function logoCarSVG(u = 5) {
  const v = car({ profile: PROFILES.gt, body: 'green', stripe: 'silver' });
  const s = voxelScene(v, { u, pad: 2, strokeWidth: 0.7 });
  return `<svg class="mark__glyph" viewBox="${s.viewBox}" aria-hidden="true" focusable="false">${s.svg}</svg>`;
}

/** A single piece at call-out scale — the 1:1 box from an instruction sheet. */
export function chipSVG(m = 'red', u = 13, dz = 2) {
  const s = voxelScene(box(0, 0, 0, 1, 1, dz, m), { u, pad: 4 });
  return `<svg viewBox="${s.viewBox}" width="${s.width}" height="${s.height}" role="presentation" focusable="false">${s.svg}</svg>`;
}

/** A small car at call-out scale, for the parts boxes. */
export function carChipSVG(body = 'red', u = 4) {
  const s = voxelScene(car({ body, wheels: true }), { u, pad: 3, strokeWidth: 0.5 });
  return `<svg viewBox="${s.viewBox}" width="${s.width}" height="${s.height}" role="presentation" focusable="false">${s.svg}</svg>`;
}

export function sceneSVG(scene, { title, desc, className = '' } = {}) {
  const a11y = title
    ? `<title>${title}</title>${desc ? `<desc>${desc}</desc>` : ''}`
    : '';
  return `<svg class="${className}" viewBox="${scene.viewBox}" role="${title ? 'img' : 'presentation'}"${title ? '' : ' aria-hidden="true" focusable="false"'}>${a11y}${scene.svg}</svg>`;
}

/**
 * Isometric voxel renderer.
 *
 * Emits plain SVG at build time. A voxel is three parallelograms — top, left,
 * right — in three shades of one material, outlined in ink. Hidden faces are
 * culled, so a solid body of several hundred voxels ships as only the polygons
 * you can actually see.
 *
 * Grid axes: +x draws right-and-down, +y draws left-and-down, +z draws up.
 * Vehicles put the nose at high x so the front faces the viewer.
 *
 * `voxelSceneLayered` exists for motion: a layer becomes ONE <g> that CSS can
 * translate, rather than one <g> per voxel, which would mean animating several
 * hundred elements per car.
 */

/** Three shades per material: lit top, left cheek, right cheek. */
export const MAT = {
  // bodywork — the instruction-book palette
  red:      { top: '#F2564F', left: '#E53935', right: '#BC2A26' },
  yellow:   { top: '#FFDF72', left: '#FFD23F', right: '#DDAF23' },
  blue:     { top: '#8FD4FF', left: '#5FB8F2', right: '#3B95D4' },
  silver:   { top: '#F4F6F8', left: '#DBE1E7', right: '#C3CBD3' },
  green:    { top: '#5FCB84', left: '#3AAE64', right: '#2A8A4C' },
  graphite: { top: '#AEB7BF', left: '#8C959D', right: '#6E777E' },
  pewter:   { top: '#D8DDE2', left: '#BFC7CF', right: '#A3ADB7' },

  // details
  glass:    { top: '#4A555E', left: '#363F47', right: '#262D33' },
  tire:     { top: '#3A4147', left: '#262C31', right: '#171B1F' },
  lamp:     { top: '#FFF6DA', left: '#F0E5C2', right: '#D8CDA9' },
  brass:    { top: '#FFDF72', left: '#FFD23F', right: '#DDAF23' },
  rim:      { top: '#F4F6F8', left: '#DBE1E7', right: '#C3CBD3' },

  // ground and structure
  road:     { top: '#E6E9EC', left: '#CDD3D8', right: '#B4BCC3' },
  lane:     { top: '#FFDF72', left: '#FFD23F', right: '#DDAF23' },
  plinth:   { top: '#DCE3E8', left: '#C3CBD2', right: '#AAB4BC' },
  slab:     { top: '#E9EDF0', left: '#D0D7DC', right: '#B7C0C7' },
  ink:      { top: '#3A4147', left: '#262C31', right: '#171B1F' },
};

const HALF_H = 0.5;
const INK = '#12171C';

export function project(x, y, z, u) {
  return { x: (x - y) * u, y: (x + y) * u * HALF_H - z * u };
}

const key = (x, y, z) => `${x},${y},${z}`;
const r = (n) => Math.round(n * 100) / 100;

/** Emit the polygons for one set of voxels, culling against `solid`. */
function emit(voxels, { u, stroke, strokeWidth, solid, bounds }) {
  const ordered = [...voxels].sort(
    (a, b) => a.x + a.y + a.z - (b.x + b.y + b.z) || a.z - b.z
  );
  const parts = [];

  for (const v of ordered) {
    const { x, y, z } = v;
    const p = project(x, y, z, u);
    const hw = u;
    const qh = u * HALF_H;
    const ch = u;

    const A = [p.x, p.y];
    const B = [p.x + hw, p.y + qh];
    const C = [p.x, p.y + 2 * qh];
    const D = [p.x - hw, p.y + qh];
    const Cd = [p.x, p.y + 2 * qh + ch];
    const Bd = [p.x + hw, p.y + qh + ch];
    const Dd = [p.x - hw, p.y + qh + ch];

    const showTop = !solid.has(key(x, y, z + 1));
    const showLeft = !v.topOnly && !solid.has(key(x, y + 1, z));
    const showRight = !v.topOnly && !solid.has(key(x + 1, y, z));
    if (!showTop && !showLeft && !showRight) continue;

    if (bounds) for (const pt of [A, B, C, D, Cd, Bd, Dd]) bounds(pt[0], pt[1]);

    const mat = MAT[v.m] || MAT.silver;
    const sk = v.stroke ?? stroke;
    const op = v.opacity != null ? ` opacity="${v.opacity}"` : '';
    const face = (pts, fill) =>
      `<polygon points="${pts.map((q) => `${r(q[0])},${r(q[1])}`).join(' ')}" fill="${fill}"${op}${sk ? ` stroke="${sk}" stroke-width="${strokeWidth}" stroke-linejoin="round"` : ''}/>`;

    if (showLeft) parts.push(face([D, C, Cd, Dd], mat.left));
    if (showRight) parts.push(face([B, C, Cd, Bd], mat.right));
    if (showTop) parts.push(face([A, B, C, D], mat.top));
  }
  return parts.join('');
}

function measure() {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  const track = (px, py) => {
    if (px < minX) minX = px;
    if (px > maxX) maxX = px;
    if (py < minY) minY = py;
    if (py > maxY) maxY = py;
  };
  track.box = () => ({ minX, maxX, minY, maxY });
  return track;
}

export function voxelScene(voxels, opts = {}) {
  return voxelSceneLayered({ base: voxels, layers: [] }, opts);
}

/**
 * @param {{base: Array, layers: Array<{name: string, voxels: Array, vars?: object}>}} input
 */
export function voxelSceneLayered(input, opts = {}) {
  const {
    u = 12,
    pad = 8,
    stroke = INK,
    strokeWidth = 0.8,
    overlay = '',
    extraTop = 0,
    extraHeight = 0,
  } = opts;

  const { base = [], layers = [] } = input;
  const all = [base, ...layers.map((l) => l.voxels)].flat();

  const solid = new Set();
  for (const v of all) if (!v.ghost) solid.add(key(v.x, v.y, v.z));

  const bounds = measure();
  const cfg = { u, stroke, strokeWidth, solid, bounds };

  const preludeSvg = opts.prelude ? opts.prelude(u, bounds, stroke, strokeWidth) : '';
  const baseSvg = emit(base, cfg);

  // A moving layer resolves occlusion against itself alone: it must not have
  // holes punched in it by the static scene it slides over, and it will not be
  // sitting where it started once the animation runs.
  const layerSvg = layers.map((l) => {
    const own = new Set();
    for (const v of l.voxels) if (!v.ghost) own.add(key(v.x, v.y, v.z));
    const vars = l.vars
      ? ` style="${Object.entries(l.vars).map(([k, val]) => `${k}:${val}`).join(';')}"`
      : '';
    return `<g data-layer="${l.name}"${vars}>${emit(l.voxels, { ...cfg, solid: own })}</g>`;
  });

  const b = bounds.box();
  const w = b.maxX - b.minX + pad * 2;
  const h = b.maxY - b.minY + pad * 2 + extraTop + extraHeight;
  const ox = -b.minX + pad;
  const oy = -b.minY + pad + extraTop;

  const localProject = (x, y, z) => {
    const p = project(x, y, z, u);
    return { x: p.x + ox, y: p.y + oy };
  };

  const body =
    `<g transform="translate(${r(ox)} ${r(oy)})">${preludeSvg}${baseSvg}${layerSvg.join('')}</g>` +
    (typeof overlay === 'function' ? overlay(localProject, u) : overlay);

  return {
    svg: body,
    width: Math.round(w),
    height: Math.round(h),
    project: localProject,
    viewBox: `0 0 ${Math.round(w)} ${Math.round(h)}`,
    u,
  };
}

/* ---------------------------------------------------------------- builders */

export function box(x, y, z, dx, dy, dz, m, extra = {}) {
  const out = [];
  for (let i = 0; i < dx; i++)
    for (let j = 0; j < dy; j++)
      for (let k = 0; k < dz; k++)
        out.push({ x: x + i, y: y + j, z: z + k, m, ...extra });
  return out;
}

export function at(voxels, dx, dy, dz = 0) {
  return voxels.map((v) => ({ ...v, x: v.x + dx, y: v.y + dy, z: v.z + dz }));
}

export function paint(voxels, coords, m) {
  const set = new Set(coords.map((c) => c.join(',')));
  return voxels.map((v) => (set.has(key(v.x, v.y, v.z)) ? { ...v, m } : v));
}

/**
 * A flat rectangular surface, emitted as three polygons rather than one voxel
 * per cell. A 42x28 road is 1176 voxels and about 150KB of markup; the same
 * road as a plate is three polygons. Use it for any unbroken flat ground.
 */
export function plate(x, y, dx, dy, z, m, u, bounds, stroke = INK, strokeWidth = 0.8) {
  const A = project(x, y, z, u);
  const pt = (px, py) => {
    if (bounds) bounds(px, py);
    return `${r(px)},${r(py)}`;
  };
  const mat = MAT[m] || MAT.road;
  const h = u;

  // top surface
  const t1 = [A.x, A.y];
  const t2 = [A.x + dx * u, A.y + dx * u * HALF_H];
  const t3 = [A.x + (dx - dy) * u, A.y + (dx + dy) * u * HALF_H];
  const t4 = [A.x - dy * u, A.y + dy * u * HALF_H];

  const poly = (pts, fill) =>
    `<polygon points="${pts.map((q) => pt(q[0], q[1])).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>`;

  // the two cheeks the viewer can see, dropped by one unit of height
  const drop = ([px, py]) => [px, py + h];
  const right = poly([t2, t3, drop(t3), drop(t2)], mat.right);
  const left = poly([t4, t3, drop(t3), drop(t4)], mat.left);

  return right + left + poly([t1, t2, t3, t4], mat.top);
}

/** Screen delta for a move of n grid units along +x, in CSS pixels. */
export function driveDelta(n, u) {
  return { dx: n * u, dy: n * u * HALF_H };
}

/* Roofline height per unit of length. Two body courses, one glass course, one
   roof course: low and long rather than tall and slabby. */
export const PROFILES = {
  coupe:  [2, 2, 2, 2, 2, 3, 3, 4, 4, 4, 4, 4, 3, 2, 2, 2, 2, 2, 2, 2],
  saloon: [2, 2, 2, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 2, 2, 2, 2, 2],
  wedge:  [2, 2, 3, 3, 3, 3, 4, 4, 4, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2],
  // mid-engine GT: long low nose, cabin forward of centre, raised engine deck
  // behind it. Read rear (x=0) to nose (x=length-1).
  gt:     [2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2],
};

const AXLES = [3, 4, 15, 16];
const MARK_AXLES = [1, 6];

/**
 * A vehicle. Two courses of bodywork six voxels wide, a glazed greenhouse
 * stepping in to four, and flared arches over each wheel — the hips are what
 * stop the silhouette reading as a loaf.
 */
export function car(opts = {}) {
  const {
    profile = PROFILES.coupe,
    body = 'silver',
    wheels = true,
    plinth = false,
    stripe = null,
    axles = null,
  } = opts;

  const v = [];
  const push = (x, y, z, m) => v.push({ x, y, z, m });

  // Height 2 is the beltline. Height 3 is raised bodywork — an engine deck or
  // a rear haunch — and stays solid. Only height 4 opens a glazed cabin, so a
  // profile never leaves bare glass as the top surface of the car.
  for (let x = 0; x < profile.length; x++) {
    const h = profile[x];
    for (let z = 1; z <= Math.min(h, 2); z++) {
      for (let y = 1; y <= 6; y++) push(x, y, z, body);
    }
    if (h === 3) for (let y = 2; y <= 5; y++) push(x, y, 3, body);
    if (h >= 4) {
      for (let y = 2; y <= 5; y++) push(x, y, 3, 'glass');
      for (let y = 2; y <= 5; y++) push(x, y, 4, body);
    }
  }

  if (wheels) {
    for (const x of axles || AXLES) {
      for (const y of [0, 7]) {
        push(x, y, 0, 'tire');
        push(x, y, 1, 'tire');
        push(x, y, 2, body);
      }
    }
  }

  const nose = profile.length - 1;
  for (const y of [1, 2, 5, 6]) push(nose, y, 2, 'lamp');

  let out = v;
  // Twin racing stripes down the spine, climbing over the greenhouse rather
  // than stopping at it — the whole point of a GT stripe is that it is
  // continuous from nose to tail.
  if (stripe) {
    const spine = [];
    for (let x = 0; x < profile.length; x++) {
      // the topmost solid course of this column, so the stripe rides the
      // bodywork continuously from nose to tail
      const top = Math.min(profile[x], 4);
      spine.push([x, 3, top], [x, 4, top]);
    }
    out = paint(out, spine, stripe);
  }

  return plinth
    ? box(-1, -1, -1, profile.length + 2, 10, 1, 'plinth').concat(out)
    : out;
}

/**
 * A deliberately chunky car for the wordmark glyph. The full `car()` model
 * carries more detail than a 28px mark can resolve, so this one is built from
 * as few voxels as still read as a car: a 5x4 body, a 3x2 cabin, four wheels.
 */
export function markCar(body = 'green') {
  let v = [];
  v = v.concat(box(0, 1, 1, 4, 2, 1, body));  // body
  v = v.concat(box(1, 1, 2, 2, 2, 1, body));  // cabin
  for (const x of [0, 3]) {
    for (const y of [0, 3]) v.push({ x, y, z: 0, m: 'tire' });
  }
  return v;
}

export function column(x, y, height, m, extra = {}) {
  return box(x, y, 0, 2, 2, height, m, extra);
}

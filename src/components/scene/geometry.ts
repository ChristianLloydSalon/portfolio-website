/** Deterministic geometry for the procedural hero scene (viewBox 1600 x 1000). */

export const VB_W = 1600;
export const VB_H = 1000;
export const HORIZON = 640;

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Star { x: number; y: number; r: number; twinkle: boolean; delay: number }
export function makeStars(count = 110): Star[] {
  const r = rng(7);
  return Array.from({ length: count }, () => ({
    x: r() * VB_W,
    y: r() * HORIZON * 0.62,
    r: r() < 0.08 ? 1.9 : 0.6 + r() * 0.9,
    twinkle: r() < 0.25,
    delay: r() * 4,
  }));
}

export interface Building { x: number; w: number; h: number; antenna: boolean; windows: { x: number; y: number }[] }
export function makeSkyline(): Building[] {
  const r = rng(42);
  const out: Building[] = [];
  let x = -20;
  while (x < VB_W + 20) {
    const w = 26 + r() * 52;
    // Denser, taller downtown cluster to the right of center; low rise elsewhere.
    const d = Math.abs(x - 1080) / 520;
    const core = Math.max(0, 1 - d);
    const h = 18 + r() * 40 + core * core * (120 + r() * 170);
    const windows: { x: number; y: number }[] = [];
    for (let wy = HORIZON - h + 10; wy < HORIZON - 8; wy += 11) {
      for (let wx = x + 5; wx < x + w - 6; wx += 9) {
        if (r() < 0.22 + core * 0.18) windows.push({ x: wx, y: wy });
      }
    }
    out.push({ x, w, h, antenna: core > 0.55 && r() < 0.45, windows });
    x += w + (r() < 0.3 ? 4 + r() * 10 : 0);
  }
  return out;
}

/** Ridge line of distant hills, closed to the horizon. */
export function ridgePath() {
  const r = rng(3);
  let d = `M0 ${HORIZON} L0 ${HORIZON - 70}`;
  const step = 80;
  for (let x = 0; x <= VB_W; x += step) {
    const peak = HORIZON - 40 - r() * 90 - (x < 500 ? 50 * Math.sin((x / 500) * Math.PI) : 0);
    d += ` Q ${x + step / 2} ${peak - 20} ${x + step} ${peak}`;
  }
  return `${d} L${VB_W} ${HORIZON} Z`;
}

/** Palm tree: tapered trunk + drooping fronds drawn as rachis and leaflets. */
export interface PalmShape { trunk: string; fronds: string[]; leaflets: string; coconuts: { x: number; y: number }[] }
export function makePalm(baseX: number, baseY: number, height: number, lean: number, seed: number, scale = 1): PalmShape {
  const r = rng(seed);
  const topX = baseX + lean;
  const topY = baseY - height;
  const midX = baseX + lean * 0.25 + (r() - 0.5) * 30;
  const midY = baseY - height * 0.55;
  const wB = 15 * scale;
  const wT = 6 * scale;
  const trunk =
    `M${baseX - wB} ${baseY} Q${midX - (wB + wT) / 2} ${midY} ${topX - wT} ${topY} ` +
    `L${topX + wT} ${topY} Q${midX + (wB + wT) / 2} ${midY} ${baseX + wB} ${baseY} Z`;

  const fronds: string[] = [];
  let leaflets = '';
  const count = 9;
  for (let i = 0; i < count; i++) {
    const angle = (-20 + (220 / (count - 1)) * i + (r() - 0.5) * 14) * (Math.PI / 180);
    const L = (150 + r() * 70) * scale;
    const droop = (60 + r() * 70) * scale * (0.6 + Math.abs(Math.cos(angle)));
    const cx = topX, cy = topY;
    const tx = cx + Math.cos(angle) * L;
    const ty = cy - Math.sin(angle) * L * 0.55 + droop;
    const qx = cx + Math.cos(angle) * L * 0.5;
    const qy = cy - Math.sin(angle) * L * 0.5 - L * 0.28;
    fronds.push(`M${cx} ${cy} Q${qx} ${qy} ${tx} ${ty}`);
    for (let t = 0.14; t <= 0.96; t += 0.055) {
      const bx = (1 - t) ** 2 * cx + 2 * (1 - t) * t * qx + t * t * tx;
      const by = (1 - t) ** 2 * cy + 2 * (1 - t) * t * qy + t * t * ty;
      const dx = 2 * (1 - t) * (qx - cx) + 2 * t * (tx - qx);
      const dy = 2 * (1 - t) * (qy - cy) + 2 * t * (ty - qy);
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len, ny = dx / len;
      const leafLen = (12 + 42 * Math.sin(Math.PI * Math.min(1, t * 1.15))) * scale;
      for (const side of [1, -1]) {
        const vx = nx * side * 0.55 + (dx / len) * 0.35;
        const vy = ny * side * 0.55 + (dy / len) * 0.35 + 0.75;
        const vl = Math.hypot(vx, vy);
        leaflets += `M${bx.toFixed(1)} ${by.toFixed(1)} l${((vx / vl) * leafLen).toFixed(1)} ${((vy / vl) * leafLen).toFixed(1)} `;
      }
    }
  }
  const coconuts = [0, 1, 2].map((k) => ({ x: topX - 8 + k * 8 * scale, y: topY + 8 + (k % 2) * 6 }));
  return { trunk, fronds, leaflets, coconuts };
}

/** Standing figure silhouette, feet at (0,0), ~300 units tall. Head: circle at (0, FIGURE_HEAD_Y) r=FIGURE_HEAD_R. */
export const FIGURE_HEAD_Y = -279;
export const FIGURE_HEAD_R = 19;
export const FIGURE_PATH =
  'M-7 -258 L-7 -251 C-20 -249 -32 -246 -36 -238 C-40 -228 -41 -205 -42 -180 L-44 -140 ' +
  'C-44 -132 -36 -130 -34 -138 L-31 -180 L-28 -212 L-25 -170 L-27 -135 L-24 -60 L-22 -6 L-30 0 L-8 0 ' +
  'L-6 -8 L-3 -120 L3 -120 L6 -8 L8 0 L30 0 L22 -6 L24 -60 L27 -135 L25 -170 L28 -212 L31 -180 L34 -138 ' +
  'C36 -130 44 -132 44 -140 L42 -180 C41 -205 40 -228 36 -238 C32 -246 20 -249 7 -251 L7 -258 Z';

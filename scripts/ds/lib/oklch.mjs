// scripts/lib/oklch.mjs

// =============================================================================
// OKLCH, and the sRGB gamut ceiling
// =============================================================================
//
// The checks that reason about a colour ladder cannot use the WCAG contrast
// ratio for the pale end of it. The formula is logarithmic and compresses
// everything near 1.0: the difference between 1.06 and 1.12 is large to the eye
// and almost nothing to the number. OKLCH lightness is roughly linear in
// perception, so surfaces, washes and dividers are measured in ΔL here and only
// text is measured in ratio.
//
// The gamut ceiling is the other half, and it is the physical fact behind the
// question "why did my washed accent turn into water". sRGB does not let a
// colour be light and saturated at the same time, and HOW MUCH it does not
// depends on the hue: the sRGB blue primary is intrinsically dark, so a light
// blue is obligatorily low-chroma, while amber and orange hold chroma at high
// lightness. At L 0.90 an amber can reach roughly C 0.15 and a blue roughly
// C 0.07 — half. That is not a matter of taste and no amount of token design
// gets around it.
// =============================================================================

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function rgbToOklch([r, g, b]) {
  const R = lin(r), G = lin(g), B = lin(b);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  let h = (Math.atan2(bb, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { L, C: Math.hypot(a, bb), h };
}

export function oklchToRgb({ L, C, h }) {
  const hr = (h * Math.PI) / 180;
  const a = C * Math.cos(hr);
  const b = C * Math.sin(hr);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    gam(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    gam(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    gam(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)
  ];
}

const inGamut = (rgb) => rgb.every((c) => c >= -1e-4 && c <= 1 + 1e-4);

// The largest chroma this hue can hold at this lightness, in sRGB. Bisection
// rather than an analytic solve: the gamut boundary in OKLCH has no closed form
// that is worth the lines, and twenty-four iterations land inside 1e-5.
export function maxChroma(L, h) {
  let lo = 0, hi = 0.5;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(oklchToRgb({ L, C: mid, h }))) lo = mid;
    else hi = mid;
  }
  return lo;
}

// Shortest distance around the hue circle.
export function hueDistance(a, b) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

export const relLuminance = ([r, g, b]) =>
  0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);

export function contrast(a, b) {
  const x = relLuminance(a), y = relLuminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

// CSS colour text -> [r, g, b] in 0..1, plus the alpha when there is one.
//
// The alpha matters: an alpha WASH is a real mechanism here, and a checker that
// drops it measures the solid pigment instead of the pale fill anyone will see.
// `compositeOver()` is what turns it back into something measurable.
export function parseColour(v) {
  const s = v.trim();
  let m = s.match(/^#([0-9a-f]{3,8})$/i);
  if (m) {
    let x = m[1];
    if (x.length === 3 || x.length === 4) x = [...x].map((c) => c + c).join('');
    return [0, 2, 4].map((i) => parseInt(x.slice(i, i + 2), 16) / 255);
  }
  m = s.match(/^rgba?\(([^)]+)\)$/i);
  if (m) {
    const all = m[1].split(/[\s,/]+/).filter(Boolean);
    const rgb = all.slice(0, 3).map((p) => (p.endsWith('%') ? parseFloat(p) / 100 : parseFloat(p) / 255));
    if (all.length > 3) {
      rgb.alpha = all[3].endsWith('%') ? parseFloat(all[3]) / 100 : parseFloat(all[3]);
    }
    return rgb;
  }
  if (s.toLowerCase() === 'white') return [1, 1, 1];
  if (s.toLowerCase() === 'black') return [0, 0, 0];
  return null;
}

// Lay a translucent colour over an opaque one. Straight source-over in linear
// light would be more correct physically; browsers composite in sRGB, so this
// matches what a screen actually shows.
export function compositeOver(fg, bg) {
  const a = fg.alpha;
  if (a == null || a >= 1) return fg;
  return [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a));
}

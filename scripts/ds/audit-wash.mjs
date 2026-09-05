// scripts/audit-wash.mjs

// =============================================================================
// AUDIT-WASH — can this palette have a washed accent at all?
// =============================================================================
//
//     node scripts/audit-wash.mjs <product-dir> [--gate]
//
// A washed accent — the pale tint that says "the interface is currently in this
// state" — is the single most fragile thing in the monochrome school, and
// whether it works at all is decided by physics before anyone opens a design
// tool. This reports on that, and with `--gate` fails the build when a product
// USES a wash the physics does not support.
//
// -----------------------------------------------------------------------------
// THE THREE THINGS THAT DECIDE IT
// -----------------------------------------------------------------------------
//
// 1. CHROMA AGAINST THE NEUTRAL IT SITS ON. A wash has to read as coloured, and
//    the neutral underneath is not colourless — a warm paper carries chroma of
//    its own. When the two are close, the eye reads neither grey nor blue, and
//    the word for the result is water. The rule with a number: the wash needs at
//    least THREE TIMES the chroma of the neutral beneath it.
//
// 2. THE GAMUT CEILING. sRGB does not allow light and saturated at once, and how
//    much it disallows depends on hue. The blue primary is intrinsically dark,
//    so a pale blue is obligatorily low-chroma; amber is the opposite. At the
//    same lightness a blue has roughly a quarter of the chroma available to an
//    amber. A wash that needs C 0.045 at L 0.95 is impossible in blue and easy
//    in amber, and no token design changes that.
//
// 3. HUE DISTANCE FROM THE NEUTRAL. Past about 150° the wash reads as a stain
//    rather than as a tint of the page — a cold patch on warm paper. Cream and
//    blue, the classic notebook pairing, is about 166° apart. It is a beautiful
//    combination as DARK INK ON PAPER and a bad one as pale blue on cream.
//
// -----------------------------------------------------------------------------
// WHAT IT DOES WITH THE ANSWER
// -----------------------------------------------------------------------------
//
// It prints a CAPABILITY REPORT rather than a verdict: which accent treatments
// this palette supports and which it does not. That report is what the interview
// should branch on — a client whose palette cannot hold a wash should never be
// offered "a soft tint of the main colour" as an option for a selected state,
// because the build will produce something ugly and nobody will be able to say
// why.
//
// And it prints the remediations WITH THE NUMBER attached: how far the accent
// hue would have to move, how far the neutral hue would, and what lightness
// recovers the chroma. A refusal that does not say what would fix it just moves
// the problem.
// =============================================================================

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { rgbToOklch, maxChroma, hueDistance, parseColour, contrast } from './lib/oklch.mjs';

const dir = process.argv[2];
const gate = process.argv.includes('--gate');
if (!dir || !existsSync(join(dir, 'ds.css'))) {
  console.error('audit-wash: pass a product directory holding ds.css');
  process.exit(1);
}

const css = readFileSync(join(dir, 'ds.css'), 'utf8');

// The LIGHT theme block only. Dark has its own ceilings and its own answer, and
// mixing the two into one verdict would hide whichever is worse.
const tokens = new Map();
for (const m of css.matchAll(/--app-([a-z0-9-]+):\s*([^;]+);/g)) {
  if (!tokens.has(m[1])) tokens.set(m[1], m[2].trim());
}
const lch = (name) => {
  const v = tokens.get(name);
  if (!v) return null;
  const rgb = parseColour(v);
  return rgb ? { ...rgbToOklch(rgb), rgb, css: v } : null;
};

// The monochrome school emits `accent`; the others emit `action`. Read whichever
// is there rather than requiring one, because this measurement is about pigment
// against neutral and every school has both.
const accent = lch('bg-accent') ?? lch('bg-action');
const wash = lch('bg-accent-subtle') ?? lch('bg-action-subtle');
const ink = lch('fg-accent') ?? lch('fg-action') ?? lch('fg-link');
const page = lch('bg-page');
const surface = lch('bg-surface');

if (!accent || !page) {
  console.error('audit-wash: could not read bg-accent/bg-action and bg-page from ds.css');
  process.exit(1);
}

const f = (n, d = 4) => n.toFixed(d);
const bold = (s) => `[1m${s}[0m`;
const dim = (s) => `[2m${s}[0m`;

const grounds = [
  ['page', page],
  ['surface', surface]
].filter(([, g]) => g);

console.log(`\n${bold('Accent capability')} ${dim(`— ${dir}`)}\n`);
console.log(`  accent  L ${f(accent.L, 3)}  C ${f(accent.C)}  h ${f(accent.h, 1)}   ${accent.css}`);
if (wash) console.log(`  wash    L ${f(wash.L, 3)}  C ${f(wash.C)}  h ${f(wash.h, 1)}   ${wash.css}`);
for (const [name, g] of grounds) {
  console.log(`  ${name.padEnd(7)} L ${f(g.L, 3)}  C ${f(g.C)}  h ${f(g.h, 1)}   ${g.css}`);
}

const dh = hueDistance(accent.h, page.h);

// IS THE WASH EVEN AN ACCENT WASH?
//
// `$accent-wash: false` routes every subtle slot onto the neutral family, so
// what comes back under `bg-accent-subtle` is a quiet neutral fill. Measured
// naively that reads as a catastrophic chroma failure — it has the paper's own
// chroma, which is the whole point — and the audit spent one run reporting a
// deliberate decision as a defect.
//
// The signature is unambiguous: the wash shares the PAPER's hue while the accent
// does not. No palette produces that by accident.
const neutralWash =
  wash != null && hueDistance(wash.h, page.h) < 20 && hueDistance(accent.h, page.h) > 20;
const band =
  dh <= 30 ? 'same family — a wash works easily, and the risk is blandness'
  : dh <= 90 ? 'adjacent — the safest pairing. Wash and solid both work'
  : dh <= 150 ? 'distant — a wash needs a forced chroma floor'
  : 'near-complementary — SOLID AND DARK INK ONLY. A wash turns to mud';

console.log(`\n  ${bold('hue distance')}  ${f(dh, 1)}°  ${dim(`accent ${f(accent.h, 0)}° vs neutral ${f(page.h, 0)}°`)}`);
console.log(`                ${band}`);

// --- the three tests -------------------------------------------------------
const findings = [];

for (const [name, g] of grounds) {
  if (!wash || neutralWash) continue;
  const floor = g.C * 3;
  const ceiling = maxChroma(wash.L, accent.h);
  const ok = wash.C >= floor;
  console.log(
    `\n  ${bold(`wash on ${name}`)}\n` +
      `    chroma   ${f(wash.C)}   needs ≥ ${f(floor)} ${dim(`(3 × the neutral's ${f(g.C)})`)}   ${ok ? 'ok' : bold('FAILS')}\n` +
      `    ceiling  ${f(ceiling)}   ${dim(`the most this hue can hold at L ${f(wash.L, 3)} in sRGB`)}` +
      (ceiling < floor ? `   ${bold('IMPOSSIBLE at this lightness')}` : '')
  );
  if (!ok) findings.push({ kind: 'chroma', name, have: wash.C, need: floor, ceiling });
  if (ceiling < floor) findings.push({ kind: 'gamut', name, need: floor, ceiling, L: wash.L });
}

if (ink && wash && !neutralWash) {
  const c = contrast(ink.rgb, wash.rgb);
  console.log(
    `\n  ${bold('accent ink on the wash')}  ${f(c, 2)}:1  ${dim('needs ≥ 4.5 — the most forgotten pair in the school')}` +
      (c < 4.5 ? `   ${bold('FAILS')}` : '')
  );
  if (c < 4.5) findings.push({ kind: 'ink', have: c });
}

for (const [name, g] of grounds) {
  const c = contrast(accent.rgb, g.rgb);
  console.log(`  ${bold(`solid accent on ${name}`)}  ${f(c, 2)}:1  ${dim('needs ≥ 3 — it is a UI component')}` + (c < 3 ? `   ${bold('FAILS')}` : ''));
  if (c < 3) findings.push({ kind: 'solid', name, have: c });
}

// --- the capability report -------------------------------------------------
const washViable = dh <= 150 && !findings.some((x) => x.kind === 'chroma' || x.kind === 'gamut');
const solidViable = !findings.some((x) => x.kind === 'solid');
const inkViable = !findings.some((x) => x.kind === 'ink');

console.log(`\n${bold('Capability')}`);
console.log(`  solid fill      ${solidViable ? 'available' : bold('unavailable')}`);
console.log(`  accent ink      ${inkViable ? 'available' : bold('unavailable')}`);
console.log(
    neutralWash
      ? `  washed accent   ${bold('routed to neutral')}   ${dim('the palette declared $accent-wash: false')}`
      : `  washed accent   ${washViable ? 'available' : bold('unavailable')}`
  );
console.log(`  outlined        available   ${dim('a border in the accent needs no chroma headroom')}`);

if (!washViable && !neutralWash) {
  // WHICH TEST FAILED decides which remedies are honest, and the first version
  // of this block printed all three every time. On the palette that prompted it,
  // chroma passed on both grounds and only the hue distance failed — so it
  // offered to darken the wash to recover chroma that was never missing, and
  // named the current lightness as the fix. Advice that does not know why it is
  // being given is worse than no advice.
  const chromaFailed = findings.some((x) => x.kind === 'chroma' || x.kind === 'gamut');
  const hueFailed = dh > 150;

  console.log(`\n${bold('Why, and what would change it')}\n`);
  if (hueFailed && !chromaFailed) {
    console.log(`  The chroma is fine — this wash holds ${f(wash.C)} against a floor of`);
    console.log(`  ${f(page.C * 3)}. What fails is DISTANCE: ${f(dh, 0)}° of hue between the pigment and`);
    console.log(`  the paper. A pale patch of a near-opposite hue does not read as a tint of`);
    console.log(`  the surface, it reads as a stain on it, and no amount of chroma fixes that.`);
  } else if (chromaFailed) {
    console.log(`  The wash carries too little chroma against the neutral beneath it. The eye`);
    console.log(`  reads neither grey nor colour, which is the effect people describe as water.`);
  }

  console.log(`\n  1. KEEP THE PIGMENT AND DROP THE WASH.`);
  console.log(`     The accent lives at the solid fill and the dark ink instead — which for a`);
  console.log(`     near-complementary pair is what it has always been good at. Selected states`);
  console.log(`     then take neutral elevation, or a small solid indicator. Cheapest, and for`);
  console.log(`     a hue-distance failure it is usually the right answer rather than the`);
  console.log(`     resigned one.`);

  if (hueFailed) {
    // BOTH directions, because the shorter arc is not automatically the better
    // design. Going one way from a blue lands in violet and keeps the coldness;
    // going the other lands in teal and gives some of it up. The tool reports
    // the arithmetic and does not pretend to know which the product wants.
    // SCANNED, not derived. The closed form for "how far, and which way" is
    // easy to write and easy to write backwards — the first version reported a
    // hue 180° from the paper as an improvement on one 165° away, because it
    // subtracted where it should have added. Walking one degree at a time in
    // each direction until the rule passes cannot be wrong in that way.
    const walk = (step) => {
      for (let i = 1; i <= 180; i++) {
        const h = (accent.h + step * i + 360) % 360;
        if (hueDistance(h, page.h) <= 150) return { h, moved: i, d: hueDistance(h, page.h) };
      }
      return null;
    };
    const a = walk(1), b = walk(-1);
    console.log(`\n  2. MOVE THE ACCENT HUE. Both directions work; they are different designs:`);
    for (const [cand, label] of [[a, 'warmer, toward violet and red'], [b, 'cooler, toward teal and green']]) {
      if (!cand) continue;
      console.log(
        `     → ${f(cand.h, 0).padStart(3)}°  ${dim(`${f(cand.moved, 0)}° of movement, lands ${f(cand.d, 0)}° from the paper — ${label}`)}`
      );
    }
    console.log(`     The shorter arc is not automatically the better design. Both numbers are`);
    console.log(`     here so the choice is made on the product, not on the arithmetic.`);
    console.log(`\n  3. MOVE THE NEUTRAL instead. If the pigment is the brand, the paper is what`);
    console.log(`     should give ground: a neutral carrying a little of the accent's hue is the`);
    console.log(`     school's default pairing precisely because it removes this whole problem.`);
  }

  if (chromaFailed) {
    const floor = page.C * 3;
    let bestL = null;
    for (let L = (wash ? wash.L : 0.93) - 0.005; L > 0.4; L -= 0.005) {
      if (maxChroma(L, accent.h) >= floor * 1.15) { bestL = L; break; }
    }
    if (bestL) {
      console.log(`\n  ${hueFailed ? 4 : 2}. DARKEN THE WASH to about L ${f(bestL, 3)}, where this hue holds`);
      console.log(`     ${f(maxChroma(bestL, accent.h))} against a floor of ${f(floor)}. Every 0.04 of lightness`);
      console.log(`     given up buys chroma back, because the sRGB gamut is widest in the middle.`);
    } else {
      console.log(`\n  ${hueFailed ? 4 : 2}. No lightness recovers the chroma at this hue in sRGB.`);
    }
  }
}

// -----------------------------------------------------------------------------
// THE GATE FIRES ON USE, NOT ON CAPABILITY
// -----------------------------------------------------------------------------
//
// "This palette cannot hold a wash" is a FACT about a colour pair, not a defect.
// Plenty of good products are built on near-complementary pairs and simply do
// not use a wash — navy ink on cream paper is a whole tradition. Failing the
// build on the fact would be the tool refusing a legitimate design.
//
// What IS a defect is a product that paints with a wash the physics does not
// support. So the gate looks for the token being CONSUMED: a `var(--app-bg-
// accent-subtle)` somewhere other than its own declaration means something on
// screen is painted with it.
const washTokens = ['--app-bg-accent-subtle', '--app-bg-selected-subtle', '--app-bg-action-subtle'];
const uses = [];
for (const t of washTokens) {
  const consumed = new RegExp(`var\\(\\s*${t}\\b`, 'g');
  const n = (css.match(consumed) ?? []).length;
  if (n) uses.push(`${t} × ${n}`);
}
// The product's own stylesheet counts too — that is where the rail was painting.
const appCss = existsSync(join(dir, 'app.css')) ? readFileSync(join(dir, 'app.css'), 'utf8') : '';
for (const t of washTokens) {
  const n = (appCss.match(new RegExp(`var\\(\\s*${t}\\b`, 'g')) ?? []).length;
  if (n) uses.push(`${t} × ${n} in app.css`);
}

if (uses.length) {
  console.log(`\n${bold('The wash is in use')}  ${dim(uses.join(', '))}`);
} else {
  console.log(`\n${bold('The wash is not painted anywhere')}  ${dim('the capability above is unused, which is fine')}`);
}

if (gate) {
  const fatal = [...findings];
  if (!washViable && !neutralWash && uses.length) {
    fatal.push({ kind: 'used-anyway' });
    console.log(
      `\n  ${bold('A wash this palette cannot support is being painted.')}\n` +
        `  Either take one of the routes above, or move the elements using it to a\n` +
        `  neutral rung with a solid indicator — and record the choice.`
    );
  }
  if (fatal.length) {
    console.log(`\n${bold(`${fatal.length} finding(s).`)}`);
    process.exit(1);
  }
}
console.log('');

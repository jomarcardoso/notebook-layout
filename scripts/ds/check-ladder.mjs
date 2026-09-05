// scripts/check-ladder.mjs

// =============================================================================
// CHECK-LADDER — every fill measured against the surface it sits on
// =============================================================================
//
//     node scripts/check-ladder.mjs <product-dir> [more …] [--gate]
//
// The two measurements that would have caught, on their own, all four causes of
// the worst-looking element this repository has shipped:
//
//   1. ΔL between a component fill and the surface beneath it. Between 0.02 and
//      0.04 with nothing else carrying the boundary is a bug — the tone is
//      trying and failing. Below 0.02 the tone is doing nothing at all.
//
//   2. Chroma of a chromatic fill against the chroma of the neutral beneath it.
//      Under 3× is the effect people describe as water: not grey, not coloured,
//      just wrong.
//
// `audit-wash.mjs` asks whether one specific thing — the accent wash — is
// possible for a palette. This asks something narrower and more mechanical of
// EVERY subtle fill a theme emits, including the ones nobody was thinking about
// when the palette was chosen. The distinction matters: the accent was fine in
// the product that prompted all of this, and a different product in the same
// repository has a warm brown accent whose wash carries C 0.018 where its warm
// page demands 0.034. Nobody had looked.
//
// -----------------------------------------------------------------------------
// WHY ΔL AND NOT THE CONTRAST RATIO
// -----------------------------------------------------------------------------
//
// The WCAG ratio is logarithmic and compresses everything near 1.0. Two
// surfaces at 1.06 and 1.12 are a large perceptual difference and almost no
// numeric one, so a ladder audited in ratios has steps that are not steps.
// OKLCH lightness is roughly linear in perception. Text stays in ratios, where
// the formula is calibrated and legally binding; surfaces and fills are in ΔL.
// =============================================================================

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { rgbToOklch, hueDistance, parseColour, compositeOver } from './lib/oklch.mjs';

const args = process.argv.slice(2);
const gate = args.includes('--gate');
const dirs = args.filter((a) => !a.startsWith('--'));
if (!dirs.length) {
  console.error('check-ladder: pass one or more product directories holding ds.css');
  process.exit(1);
}

// The band, from claude-6.md, and the reason each edge is where it is.
const TONE_DEAD = 0.02;   // below this the fill is not separating anything
const TONE_WEAK = 0.04;   // below this it needs a border to finish the job
const CHROMA_RATIO = 3;   // a chromatic fill against the neutral beneath it

// A fill is CHROMATIC when its hue is its own rather than the paper's. Warm
// neutrals carry real chroma — this is not a "C > 0" test, it is a "does this
// belong to a different family" test.
const CHROMATIC_HUE = 20;

const bold = (s) => `[1m${s}[0m`;
const dim = (s) => `[2m${s}[0m`;
const f = (n, d = 4) => n.toFixed(d);

let problems = 0;
let measured = 0;

for (const dir of dirs) {
  const path = join(dir, 'ds.css');
  if (!existsSync(path)) continue;
  const css = readFileSync(path, 'utf8');

  // The first declaration of each token wins: `ds.css` emits the light theme
  // before the dark one, and the dark theme has its own bands. Auditing both in
  // one pass would average away whichever is worse.
  const tokens = new Map();
  for (const m of css.matchAll(/--app-([a-z0-9-]+):\s*([^;}]+)[;}]/g)) {
    if (!tokens.has(m[1])) tokens.set(m[1], m[2].trim());
  }
  // A TRANSLUCENT FILL IS MEASURED AS IT WILL BE SEEN, composited over the
  // ground. Read raw, an alpha wash reports the SOLID pigment — full chroma,
  // full darkness — and every rule here would pass on a fill that is in fact
  // pale. The whole point of an alpha wash is that its colour is decided by what
  // is under it, so the checker has to put something under it.
  const readRaw = (name) => {
    const v = tokens.get(name);
    if (!v) return null;
    const rgb = parseColour(v);
    return rgb ? { rgb, css: v, name } : null;
  };
  const page0 = readRaw('bg-page');
  const read = (name, ground) => {
    const r = readRaw(name);
    if (!r) return null;
    const g = ground ?? page0?.rgb;
    const flat = g ? compositeOver(r.rgb, g) : r.rgb;
    return { ...rgbToOklch(flat), css: r.css, name, translucent: r.rgb.alpha != null };
  };

  const page = read('bg-page');
  const surface = read('bg-surface');
  if (!page) continue;

  // WHICH SURFACE DOES A FILL SIT ON? Both, is the honest answer — a chip is on
  // the page in one place and inside a card in another, and this is exactly the
  // asymmetry that made the same token look right in one and wrong in the other.
  // So every fill is measured against every surface the theme declares, and the
  // WORST result is the one reported. A fill that only works on one of the two
  // is a fill waiting to be moved.
  const grounds = [['page', page], ['surface', surface]].filter(([, g]) => g);

  // WHAT IS AND IS NOT A COMPONENT FILL, because the first version of this check
  // measured everything against everything and produced sixty findings, almost
  // all of them correct behaviour reported as a defect. Three separations, each
  // one learned from a false positive:
  //
  //   SURFACES are not component fills. `bg-sunken` and `bg-raised` are rungs
  //   elected to be a ground, and adjacent surfaces are SUPPOSED to sit at
  //   ΔL 0.02–0.04 — the exact band this check flags for a fill. Measuring them
  //   with the fill's band reported the ladder's correct spacing as too tight.
  //   `bg-raised` is worse still: a modal is separated by a shadow, and its tone
  //   being identical to the card beneath it is the design.
  //
  //   STATES are relative to their own resting fill, not to the ground. A hover
  //   is one rung above the rest, so it is ΔL 0.02 from the thing it modifies
  //   and inevitably close to the ground the rest was already close to. Measured
  //   against the page it looks broken and is not.
  //
  //   ACHROMATIC fills have no hue to compare. `#ffffff` returned a hue distance
  //   of whatever the arctangent of zero gave, and the chroma rule then fired on
  //   pure white for having no chroma — which is what white is.
  const isState = (k) => /-(hover|active)$/.test(k);
  const restFills = [...tokens.keys()].filter((k) => /^bg-.*-subtle$/.test(k));
  const stateFills = [...tokens.keys()].filter((k) => /^bg-.*-subtle-(hover|active)$/.test(k));

  const rows = [];

  // --- resting fills, against every ground they might sit on ---------------
  for (const key of restFills) {
    for (const [gname, g] of grounds) {
      const fill = read(key, readRaw(g.name)?.rgb);
      if (!fill) continue;
      measured++;
      const dL = Math.abs(fill.L - g.L);
      const achromatic = fill.C < 0.002 || g.C < 0.0005;
      const chromatic = !achromatic && hueDistance(fill.h, g.h) > CHROMATIC_HUE;
      const ratio = g.C > 0.0005 ? fill.C / g.C : Infinity;

      // ONE BOUNDARY, ONE MECHANISM — the same rule the rest of this system runs
      // on, applied to the two things a fill can separate itself with.
      //
      // A pale red on cream is recognisably PINK at ΔL 0.04, and demanding 0.05
      // of lightness from it as well is asking for a second mechanism to do a
      // job the first already did. The lightness rule is for fills that separate
      // by TONE; a fill that clears the chroma rule separates by HUE and is
      // exempt from it.
      //
      // The version before this one flagged every status fill in every theme,
      // which is how the exemption was found: four families, seven products, and
      // in all of them the alert backgrounds look fine.
      const separatesByChroma = !achromatic && ratio >= CHROMA_RATIO;

      // MEANT to be chromatic, by name. An amber at fifteen times the paper's
      // chroma is obviously distinguishable even though its HUE is ten degrees
      // from the paper's — so hue distance is the wrong test for "is this fill
      // carrying colour", and using it flagged every warning background in the
      // repository. The chroma ratio answers that on its own.
      //
      // What hue distance is still good for is spotting a slot that has been
      // ROUTED to the neutral family by `$accent-wash: false`: same hue as the
      // ground, chroma barely above it. That is a decision, not a failure, and
      // it should fall through to the tone rule like any other neutral fill.
      const meantChromatic = !/^bg-neutral-/.test(fill.name);
      // Exact, rather than a threshold. A slot routed to the neutral family holds
      // the neutral family VALUE, so comparing the two is unambiguous — and a
      // threshold was not: a warm ramp gets more chromatic as it darkens, so the
      // neutral rung 3 sits at twice the page chroma all by itself, and the first
      // guess of 1.6x let it through as water.
      const quiet = tokens.get('bg-neutral-subtle');
      const routedToNeutral = meantChromatic && quiet != null && fill.css === quiet;

      const issues = [];
      if (meantChromatic && !routedToNeutral && !separatesByChroma) {
        issues.push(`chroma ${f(fill.C)} is ${f(ratio, 1)}× the ground's ${f(g.C)} — under ${CHROMA_RATIO}× reads as water`);
      }
      if (!separatesByChroma) {
        if (dL < TONE_DEAD) issues.push(`tone does nothing (ΔL ${f(dL, 3)} < ${TONE_DEAD})`);
        else if (dL < TONE_WEAK) issues.push(`tone too weak alone (ΔL ${f(dL, 3)}, needs a border or another rung)`);
      }
      if (issues.length) rows.push({ fill, gname, issues });
    }
  }

  // --- states, against the resting fill they modify -------------------------
  //
  // A state that does not move is the bug this catches, and it is a common one:
  // layer 2 falls a `-hover` back to the fill itself when a theme has not
  // declared one, which is the right default and produces a control that does
  // not react.
  for (const key of stateFills) {
    const fill = read(key);
    const rest = read(key.replace(/-(hover|active)$/, ''));
    if (!fill || !rest) continue;
    measured++;
    const dL = Math.abs(fill.L - rest.L);
    if (dL < 0.008) {
      rows.push({
        fill,
        gname: `its own resting fill (--app-${rest.name})`,
        issues: [`the state does not move (ΔL ${f(dL, 3)}) — the control will not react`]
      });
    }
  }

  if (!rows.length) continue;
  console.log(`\n${bold('Fills that do not separate from their ground')} ${dim(`— ${dir}`)}\n`);
  for (const r of rows) {
    console.log(`  ${bold(`--app-${r.fill.name}`)} ${dim(`on ${r.gname}`)}  ${r.fill.css}`);
    for (const i of r.issues) console.log(`    ${i}`);
    problems++;
  }
}

if (!problems) {
  console.log(`check-ladder: ok — ${measured} fill/ground pairs, every one separating.`);
  process.exit(0);
}

console.log(`
Two ways a fill fails, and they want opposite fixes.

  TONE TOO WEAK is a LADDER problem. The fill is on a rung calibrated for a
  different surface — a rung is a distance from the surface, not a property of
  the component, so the same token is right inside a card and wrong on the page.
  Move it a rung, or give the element a border and stop asking the tone to do a
  job it cannot.

  CHROMA UNDER 3× is a PIGMENT problem and no rung fixes it. Either the fill was
  built by mixing toward white — which loses chroma far faster than lightness —
  or the hue cannot hold chroma at that lightness in sRGB. Force a chroma floor
  when generating it, drop its lightness until the gamut widens, or accept that
  this palette has no wash and route the slot to the neutral family with
  \`$accent-wash: false\`.
`);
console.log(bold(`${problems} finding(s) across ${measured} pairs.`));
if (gate) process.exit(1);

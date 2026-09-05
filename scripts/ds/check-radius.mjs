// scripts/check-radius.mjs

// =============================================================================
// CHECK-RADIUS — is there a scale, or one value written three times?
// =============================================================================
//
//     node scripts/check-radius.mjs <product-dir> [more …] [--gate]
//
// A product noticed that its interface "looked like it had a single corner
// radius" and assumed it was a mistake. It was: the theme held
// `radius-control: 4px` and `radius-surface: 6px`, two values two pixels apart,
// which the eye reads as one. The archetype had asked for restraint and the
// build had turned restraint into sameness — a scale whose steps are not steps.
//
// Two rules, and they pull in opposite directions, which is why both are needed.
//
// -----------------------------------------------------------------------------
// 1. THE STEPS HAVE TO BE STEPS
// -----------------------------------------------------------------------------
//
// A radius scale is small on purpose — four entries, not twelve — and every one
// of them has a job:
//
//   radius-sm       checkbox, badge, small indicators
//   radius-control  button, input, select
//   radius-surface  card, modal, panel
//   radius-pill     chip, tag, avatar
//
// If two adjacent entries are within a couple of pixels, the product has fewer
// radii than it thinks, and the distinction it wrote down is not reaching the
// screen. The threshold here is deliberately loose: 1.5× or 3px, whichever is
// smaller to satisfy — enough to catch "4 and 6" without dictating a ratio to a
// product whose archetype wants sharp corners.
//
// -----------------------------------------------------------------------------
// 2. CONCENTRIC CORNERS
// -----------------------------------------------------------------------------
//
// The rule almost nobody applies, and it answers "why does this look slightly
// wrong" in nested corners: the OUTER radius should be the INNER radius plus the
// padding between them. A card with 16px of padding holding a button with a 6px
// radius is visually correct at about 22px — because the two arcs are then
// concentric, and the gap between them stays constant all the way round.
//
// When the outer radius is smaller than inner + padding, the corners diverge and
// the interface looks amateur without anyone being able to name the reason.
//
// This one is a REPORT, never a gate. The ideal is often larger than an
// archetype wants — an editorial product with a 4px control and 16px of card
// padding would need a 20px card, which is rounder than "editorial" means — and
// a rule that fights the design language is a rule that gets switched off. It
// prints the ideal, the actual, and the gap, so the deviation is a decision.
// =============================================================================

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const gate = args.includes('--gate');
const dirs = args.filter((a) => !a.startsWith('--'));
if (!dirs.length) {
  console.error('check-radius: pass one or more product directories holding ds.css');
  process.exit(1);
}

const bold = (s) => `[1m${s}[0m`;
const dim = (s) => `[2m${s}[0m`;

// `9999px` is the pill and is not a step on this ladder — it is the absence of a
// corner. Comparing it to anything produces a number and no information.
const PILL = 500;

let problems = 0;

for (const dir of dirs) {
  const path = join(dir, 'ds.css');
  if (!existsSync(path)) continue;
  const css = readFileSync(path, 'utf8');

  // Values arrive either as a literal or as a chain of `var()` and `calc()` —
  // `--app-pad-surface: var(--app-space-lg)` on top of
  // `--app-space-lg: calc(var(--app-space-unit) * 6)`. Resolving one hop of
  // aliasing and one multiplication covers everything this system emits, and
  // returning null for anything else is correct: a value this cannot read is a
  // value it should not be measuring.
  const raw = (name) => {
    const m = css.match(new RegExp(`--app-${name}:\\s*([^;]+);`));
    return m ? m[1].trim() : null;
  };
  const px = (name, depth = 0) => {
    const v = raw(name);
    if (v == null || depth > 4) return null;
    let m = v.match(/^([\d.]+)px$/);
    if (m) return parseFloat(m[1]);
    m = v.match(/^var\(--app-([a-z0-9-]+)\)$/);
    if (m) return px(m[1], depth + 1);
    m = v.match(/^calc\(\s*var\(--app-([a-z0-9-]+)\)\s*\*\s*([\d.]+)\s*\)$/);
    if (m) {
      const base = px(m[1], depth + 1);
      return base == null ? null : base * parseFloat(m[2]);
    }
    m = v.match(/^([\d.]+)rem$/);
    if (m) return parseFloat(m[1]) * 16;
    return null;
  };

  const sm = px('radius-sm');
  const control = px('radius-control');
  const surface = px('radius-surface');
  const image = px('radius-image');
  const pad = px('pad-surface');

  const findings = [];

  // --- 1. the steps ---------------------------------------------------------
  const steps = [['radius-sm', sm], ['radius-control', control], ['radius-surface', surface]]
    .filter(([, v]) => v != null && v < PILL);

  for (let i = 1; i < steps.length; i++) {
    const [an, a] = steps[i - 1];
    const [bn, b] = steps[i];
    if (a === 0 && b === 0) continue; // a product with square corners everywhere
    // BOTH, not either. The first version used `or`, and 4px against 6px slipped
    // through on the ratio alone — which is the exact pair a reader described as
    // "one radius by mistake". A ratio is the right shape for large values and
    // says nothing at small ones, where two pixels is invisible however you
    // divide it.
    // A RATIO ALWAYS, AND AN ABSOLUTE GAP ONLY ONCE THE VALUES ARE BIG ENOUGH
    // FOR ONE TO MATTER.
    //
    // Two iterations to get here, in both directions. `or` let 4px and 6px pass
    // on the ratio alone — the exact pair a reader called "one radius by
    // mistake". `and` then flagged 2px against 4px, which is a doubling and
    // perfectly legible, because those live on a 16px checkbox and a 40px button
    // where the same two pixels are a much larger share of the corner.
    //
    // So: the ratio is the rule, and below 4px it is the only rule.
    const enough = b >= a * 1.5 && (a < 4 || b - a >= 3);
    if (!enough) {
      findings.push(
        `${bold(`${an} ${a}px`)} and ${bold(`${bn} ${b}px`)} are the same radius to the eye.\n` +
          `    A scale whose steps are not steps is one value written twice. Either separate\n` +
          `    them — ${b >= a ? `${bn} at ${Math.max(a * 1.5, a + 3)}px or more` : 'check the order'} — or drop one and say the product has fewer.`
      );
    }
  }

  // --- 2. concentric --------------------------------------------------------
  // ONLY WHERE THE CORNERS CAN SEE EACH OTHER. The first version reported on
  // every product in the repository, all of them 18 to 22 pixels flatter than
  // ideal, which is not eight design failures — it is the rule being applied
  // where it does not bite. With 24px of padding the button sits nowhere near
  // the card corner and the two arcs never come close enough to disagree.
  //
  // The relationship is visible when the gap is small: a dense panel, a thumbnail
  // in a tile, an input inside a compact container. Above about 12px the eye has
  // no reference and the ideal is arithmetic without a reader.
  const CONCENTRIC_VISIBLE_PAD = 12;
  if (control != null && surface != null && pad != null && pad <= CONCENTRIC_VISIBLE_PAD && surface < PILL) {
    const ideal = control + pad;
    const gapPx = ideal - surface;
    if (Math.abs(gapPx) > 2) {
      console.log(
        `\n${bold('Concentric corners')} ${dim(`— ${dir}`)}\n` +
          `  a ${control}px control inside ${pad}px of padding is concentric at ` +
          `${bold(`${ideal}px`)}; radius-surface is ${surface}px ` +
          dim(`(${gapPx > 0 ? `${gapPx}px flatter than ideal` : `${-gapPx}px rounder than ideal`})`) +
          `\n  ${dim('A report, not a rule. Being flatter than concentric is a legitimate look;')}` +
          `\n  ${dim('being much flatter is what makes nested corners read as slightly off.')}`
      );
    }
  }

  // --- the image is allowed to differ, but say so ---------------------------
  if (image != null && control != null && image === control && surface !== control) {
    console.log(
      `\n  ${dim(`radius-image equals radius-control (${image}px). Legitimate — a photograph`)}` +
        `\n  ${dim('is a control-sized object here — but it is a decision worth having made.')}`
    );
  }

  if (findings.length) {
    console.log(`\n${bold('The radius scale has no steps')} ${dim(`— ${dir}`)}\n`);
    for (const x of findings) console.log(`  ${x}`);
    problems += findings.length;
  }
}

if (!problems) {
  console.log('check-radius: ok — every radius scale has distinguishable steps.');
  process.exit(0);
}
console.log(`\n${bold(`${problems} finding(s).`)}`);
if (gate) process.exit(1);

// scripts/check-pair-contrast.mjs

// =============================================================================
// THE LAYER 3 CROSSING GUARD
// =============================================================================
//
//     node scripts/check-pair-contrast.mjs dist/ds.css [--gate]
//
// A fill and the ink on it are a PAIR. Layer 2 declares them as one — `bg-accent`
// with `fg-on-accent`, `bg-danger` with `fg-on-danger` — and `emit-theme()`
// measures every one of those pairs before it will compile. That gate is real
// and it is not enough, because layer 3 can point the two halves at DIFFERENT
// pairs and nothing downstream notices.
//
// The foundation has known about this hole for as long as it has had a name for
// it. `$nav-tab-fg-active` carries the note:
//
//     "Pointing the two at each other put white on white and measured 1.03:1 in
//      a real build; the contrast gate never saw it, because it measures layer 2
//      pairs and this is a layer 3 crossing."
//
// It happened again, in a shipping product, the same way both times. A product
// moved the FILL of a chosen nav item out of the accent family and into the
// neutral one — a good decision, made for good reasons — and left the ink
// pointing at `fg-on-accent`, which is the white measured against the accent.
// The result compiled, passed every check, and rendered white text on a light
// tan fill at 1.75:1.
//
// Neither half is wrong on its own. That is the whole difficulty: `bg-neutral-
// subtle-active` is a correct fill, `fg-on-accent` is a correct ink, layer 2
// measured both against their own partners, and the bug lives only in the
// sentence that put them together.
//
// -----------------------------------------------------------------------------
// WHERE IT LOOKS, AND WHY THERE
// -----------------------------------------------------------------------------
//
// The COMPILED CSS, because that is the first place the crossing is visible as
// a crossing. In Sass the two are separate variables in separate files; in the
// output they are two declarations in one rule, which is exactly the shape a
// reader would spot by eye and exactly the shape a script can find.
//
// A rule's declarations are grouped by the prefix they share once `-bg` or
// `-color` is stripped, so `--cui-nav-pills-link-active-bg` and
// `--cui-nav-pills-link-active-color` become one pair. Both halves are then
// resolved through the theme blocks — every theme the file declares, because a
// pair that clears 4.5:1 on cream and fails on charcoal is still a failure.
//
// -----------------------------------------------------------------------------
// WHAT IT DELIBERATELY DOES NOT DO
// -----------------------------------------------------------------------------
//
// It skips anything it cannot resolve to two literal colours. A dangling
// reference is `check-dangling-refs`' job and a value behind a `color-mix()` is
// nobody's yet; guessing at either would make this fire on files it does not
// understand, and a guard that cries wolf gets switched off.
//
// `*-border-color` is not ink. It pairs with nothing here and is measured by
// `check-ladder` against a different floor — 3:1 for what identifies a control,
// and less for a decorative divider.
//
// DISABLED IS EXEMPT, and by the specification rather than by leniency. WCAG
// 1.4.3 excludes text that is part of an inactive component, and `fg-disabled`
// is a token whose entire job is to fail contrast — that is what "you cannot
// use this" looks like. On the first run this guard reported nine pairs and all
// nine were disabled states, which is the shape of a check about to be switched
// off for being wrong nine times out of nine.
// =============================================================================

import { readFileSync, existsSync } from 'node:fs';
import { parseColour, contrast } from './lib/oklch.mjs';

const args = process.argv.slice(2);
const gate = args.includes('--gate');
const file = args.find((a) => a.endsWith('.css'));

if (!file || !existsSync(file)) {
  console.error('check-pair-contrast: pass the compiled css, e.g. dist/ds.css');
  process.exit(1);
}

const css = readFileSync(file, 'utf8');

// -----------------------------------------------------------------------------
// THE THEMES
// -----------------------------------------------------------------------------
//
// Every block that declares `--app-bg-page` is a theme: `emit-theme()` writes
// one per theme name and that token is in all of them. The selector is kept as
// the label, so a failure says which theme it failed in.
const themes = [];
for (const m of css.matchAll(/([^{}]+)\{([^{}]*--app-bg-page:[^{}]*)\}/g)) {
  const tokens = new Map();
  for (const d of m[2].split(';')) {
    const i = d.indexOf(':');
    if (i < 0) continue;
    const name = d.slice(0, i).trim();
    if (name.startsWith('--app-')) tokens.set(name, d.slice(i + 1).trim());
  }
  themes.push({ label: m[1].trim().split(',')[0].trim(), tokens });
}

if (!themes.length) {
  console.error('check-pair-contrast: no theme block found — is this a token build?');
  process.exit(1);
}

// A value is either a literal or one `var(--app-…)` hop. Two hops do happen —
// `--app-ring` is a shorthand of three — but never for a fill or an ink, so a
// single resolution is the whole vocabulary here.
const resolve = (value, tokens, depth = 0) => {
  if (depth > 4) return null;
  const v = value.trim();
  const ref = v.match(/^var\(\s*(--app-[a-z0-9-]+)\s*\)$/);
  if (ref) {
    const next = tokens.get(ref[1]);
    return next === undefined ? null : resolve(next, tokens, depth + 1);
  }
  try {
    return parseColour(v);
  } catch {
    return null;
  }
};

// -----------------------------------------------------------------------------
// THE PAIRS
// -----------------------------------------------------------------------------
const problems = [];
const seen = new Set();

for (const rule of css.matchAll(/([^{}]+)\{([^{}]+)\}/g)) {
  const selector = rule[1].trim();
  if (selector.startsWith('@')) continue;

  const byPrefix = new Map();
  for (const d of rule[2].split(';')) {
    const i = d.indexOf(':');
    if (i < 0) continue;
    const name = d.slice(0, i).trim();
    const value = d.slice(i + 1).trim();
    if (!name.startsWith('--')) continue;

    // `-border-color` is a line, not ink. `-bg-*` suffixes past the fill —
    // `-bg-subtle`, `-bg-opacity` — are not the fill either.
    let kind = null;
    if (name.endsWith('-bg')) kind = 'bg';
    else if (name.endsWith('-color') && !name.endsWith('-border-color')) kind = 'fg';
    if (!kind) continue;

    const prefix = name.slice(0, name.lastIndexOf('-'));
    if (!byPrefix.has(prefix)) byPrefix.set(prefix, {});
    byPrefix.get(prefix)[kind] = { name, value };
  }

  for (const [prefix, pair] of byPrefix) {
    if (!pair.bg || !pair.fg) continue;
    // See the header: an inactive control has no contrast requirement, and the
    // token on it is designed to fail one.
    if (/disabled/.test(prefix)) continue;

    for (const theme of themes) {
      const bg = resolve(pair.bg.value, theme.tokens);
      const fg = resolve(pair.fg.value, theme.tokens);
      if (!bg || !fg) continue;

      const ratio = contrast(fg, bg);
      if (ratio >= 4.5) continue;

      const key = `${prefix}|${theme.label}`;
      if (seen.has(key)) continue;
      seen.add(key);

      problems.push({
        selector,
        theme: theme.label,
        ratio,
        bg: `${pair.bg.name}: ${pair.bg.value}`,
        fg: `${pair.fg.name}: ${pair.fg.value}`
      });
    }
  }
}

const bold = (s) => `[1m${s}[0m`;
const dim = (s) => `[2m${s}[0m`;

if (!problems.length) {
  console.log(
    'check-pair-contrast: ok — every fill bound beside its ink clears 4.5:1, in every theme.'
  );
  process.exit(0);
}

problems.sort((a, b) => a.ratio - b.ratio);

console.error(
  `\ncheck-pair-contrast: ${problems.length} pair(s) below 4.5:1.\n\n` +
    'A fill and the ink on it are ONE decision. Layer 2 measures the pairs it\n' +
    'declares; these were assembled at layer 3 from two different pairs, so both\n' +
    'halves are individually correct and the combination was never measured.\n\n' +
    'The fix is not a new colour. It is to point the ink at the partner of the\n' +
    'fill that is actually there.\n'
);

for (const p of problems) {
  console.error(`  ${bold(p.ratio.toFixed(2) + ':1')}  ${p.selector}  ${dim(p.theme)}`);
  console.error(`      ${p.bg}`);
  console.error(`      ${p.fg}\n`);
}

process.exit(gate ? 1 : 0);

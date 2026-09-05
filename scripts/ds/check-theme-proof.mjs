// scripts/check-theme-proof.mjs

// =============================================================================
// THEME-PROOF GUARD — declarations that no token can reach
// =============================================================================
//
// Every other check in this repo asks whether a VALUE came from the right
// layer. This one asks a different question, and it exists because a whole
// class of CSS answers the first question perfectly and still ships a broken
// theme:
//
//     .field__label {
//       color: var(--app-fg-muted);   /* correct, from layer 2 */
//       mix-blend-mode: multiply;     /* and now it is black anyway */
//     }
//
// -----------------------------------------------------------------------------
// WHY THIS IS THE WORST FAILURE SHAPE SO FAR
// -----------------------------------------------------------------------------
//
// Blend modes and filters are ARITHMETIC ON THE BACKDROP, not colours.
// `multiply` is `source x backdrop`. On a cream page the backdrop is ~0.98 and
// the source survives; on a near-black page the backdrop is ~0.02 and EVERY
// source collapses to black — text, icons, SVG illustrations, chips, labels.
//
// So when the theme flips:
//
//   - the computed `color` is still the correct near-white
//   - the contrast gate still passes, measuring colours that really are fine
//   - `check-orphan-reads` and `check-dangling-refs` are green
//   - grepping the source for a dark value finds NOTHING, because nothing set
//     one — which is exactly what the person debugging it reports: "I cannot
//     find any line making it black"
//
// This was found by eye, in a shipped dark theme, in nine places at once. Seven
// automated checks had nothing to say about it. That is the argument for the
// eighth.
//
// -----------------------------------------------------------------------------
// THE RULE
// -----------------------------------------------------------------------------
//
// A blend or filter that is written as a literal has baked in an assumption
// about how light the backdrop is. Route it through a token instead, so the
// theme gets a say:
//
//     mix-blend-mode: var(--app-blend-ink);
//
// The foundation emits `--app-blend-ink` from the same measurement that decides
// `color-scheme`: `multiply` on a light theme, `screen` — multiply's exact dual
// — on a dark one. Nothing to configure, and correct in themes that do not
// exist yet.
//
// `normal` / `none` are always allowed: they assume nothing.
//
//     node scripts/check-theme-proof.mjs <dir> [more dirs …]
// =============================================================================

import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const args = process.argv.slice(2);
const dirs = args.filter((a) => !a.startsWith('--'));
if (dirs.length === 0) {
  console.error('usage: check-theme-proof.mjs <dir> [more …] [--skip=name,…]');
  process.exit(2);
}

// `src` is the foundation itself, which is where the token is DEFINED.
//
// `--skip` is for VENDORED code — a library's own example CSS sitting in the
// tree. Bootstrap's shipped examples use `backdrop-filter: saturate(180%)`, and
// a guard that fails on somebody else's file teaches people to pass `|| true`.
const SKIP = new Set([
  'node_modules',
  '.next',
  'dist',
  'src',
  ...args
    .filter((a) => a.startsWith('--skip='))
    .flatMap((a) => a.slice('--skip='.length).split(',').filter(Boolean)),
]);

const files = [];
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) {
      // `src` is the foundation itself, which is where the token is DEFINED.
      if (SKIP.has(e.name)) continue;
      walk(p);
      continue;
    }
    // FILES are skippable too, not only directories, and this became necessary
    // the day a product started compiling its own copy of the library beside its
    // own stylesheets. `dist/` was skipped as a directory; a per-product library
    // build has no directory to skip, only a name.
    if (SKIP.has(e.name)) continue;
    if (/\.(scss|css)$/.test(e.name)) files.push(p);
  }
};
dirs.forEach(walk);

// Properties whose value is arithmetic against whatever is behind the element,
// AND that reach the element's content.
//
// `background-blend-mode` is deliberately NOT here, and the distinction is the
// whole reason this guard can be trusted: it blends an element's own background
// layers with each other and with its own background-color. It never touches
// the text or the children. The paper-fibre texture in this repo is two noise
// layers blended `screen, multiply` against the surface fill, and it degrades
// gracefully on a dark theme — light speckle over dark paper is still fibre.
//
// A guard that flagged it would be crying wolf on the one file most likely to
// be read by someone deciding whether to trust the guard at all.
const BACKDROP_PROPS = /^(mix-blend-mode|backdrop-filter|filter)$/;

// Values that assume nothing about the backdrop.
const NEUTRAL = /^(normal|none|inherit|initial|unset|revert)$/;

// `filter` has plenty of theme-independent uses — `blur()`, `drop-shadow()`
// with a token colour. Only the ones that rewrite lightness or colour are a
// theme problem.
const LIGHTNESS_FILTERS = /\b(invert|brightness|contrast|grayscale|sepia|saturate|hue-rotate)\s*\(/;

const problems = [];

for (const f of files) {
  const src = readFileSync(f, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p) => p + ' '.repeat(m.length - p.length));

  src.split('\n').forEach((line, i) => {
    const m = line.match(/^\s*([a-z-]+)\s*:\s*([^;{]+);?\s*$/);
    if (!m) return;

    const [, prop, rawValue] = m;
    if (!BACKDROP_PROPS.test(prop)) return;

    const value = rawValue.trim();

    // Already routed through a token — the theme can answer.
    if (value.includes('var(')) return;
    // Interpolated Sass: the value is decided at build time from a variable
    // that itself points at a token. `check-custom-prop-interpolation` covers
    // whether that interpolation is well-formed.
    if (value.includes('#{')) return;
    if (NEUTRAL.test(value)) return;

    if (prop === 'filter' || prop === 'backdrop-filter') {
      if (!LIGHTNESS_FILTERS.test(value)) return;
    }

    problems.push({
      file: relative(process.cwd(), f).replace(/\\/g, '/'),
      line: i + 1,
      prop,
      value,
    });
  });
}

if (problems.length === 0) {
  console.log(
    'check-theme-proof: ok — no blend or filter bakes in an assumption about the backdrop.'
  );
  process.exit(0);
}

console.error(
  `check-theme-proof: ${problems.length} declaration(s) a theme cannot reach.\n\n` +
    'These are arithmetic against the backdrop, not colours, so swapping layer 2\n' +
    'does not change them. On a dark theme `multiply` crushes every source to\n' +
    'black while the computed `color` stays correct and every other check passes.\n\n' +
    'Route it through a token — the foundation emits `--app-blend-ink`, which is\n' +
    '`multiply` on a light theme and `screen` on a dark one:\n\n' +
    '    mix-blend-mode: var(--app-blend-ink);\n'
);
for (const p of problems) {
  console.error(`  ${p.file}:${p.line}`);
  console.error(`      ${p.prop}: ${p.value}\n`);
}
process.exit(1);

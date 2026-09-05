// scripts/check-collisions.mjs

// =============================================================================
// ADAPTER COLLISION GUARD
// =============================================================================
//
// Two adapters can declare the same custom property with different meanings,
// and nothing about that is visible in either file. It happened here: daisyUI
// uses `--border` for a WIDTH, Preline uses it for a COLOUR, and compiling both
// left daisyUI's inputs with `border-width: 0`. The CSS was valid, the build was
// silent, and only a browser showed it.
//
// A library that namespaces its variables (`--bs-*`, `--pico-*`, `--bulma-*`)
// cannot collide. One that uses bare names — Preline — or borrows a shared
// namespace like Tailwind's `--color-*` can, and the adapter has no way to
// avoid it: the names belong to the library.
//
// So this runs on every build and fails when two enabled adapters disagree
// about a name. Same value from two adapters is fine (`--color-success` from
// both daisyUI and Flowbite resolves to the same token); two different values
// is the bug.
//
//     node scripts/check-collisions.mjs dist/ds.css
// =============================================================================

import { readFileSync } from 'node:fs';

const file = process.argv[2] ?? 'dist/ds.css';
const css = readFileSync(file, 'utf8');

// Only the adapter layer can collide — layers 1-3 are prefixed by construction.
const start = css.indexOf('@layer vendor-config');
if (start < 0) {
  console.log('check-collisions: no adapter layer in ' + file + ', nothing to check.');
  process.exit(0);
}

// Group declarations by (selector block, property). Blocks are shallow here:
// the adapter emits `:root, [data-theme], [data-surface] { … }` and a few
// component rules, so splitting on braces is enough.
const region = css.slice(start);
const seen = new Map();

for (const block of region.split('}')) {
  const brace = block.indexOf('{');
  if (brace < 0) continue;
  const selector = block.slice(0, brace).split('{').pop().trim();
  const body = block.slice(brace + 1);

  for (const m of body.matchAll(/(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+)/g)) {
    const key = selector + ' ~ ' + m[1];
    const value = m[2].trim();
    if (!seen.has(key)) seen.set(key, new Set());
    seen.get(key).add(value);
  }
}

const clashes = [...seen.entries()].filter(([, values]) => values.size > 1);

if (clashes.length === 0) {
  console.log('check-collisions: ok — no adapter declares a name twice with different values.');
  process.exit(0);
}

console.error('\ncheck-collisions: two adapters disagree about the same custom property.\n');
for (const [key, values] of clashes) {
  const [selector, prop] = key.split(' ~ ');
  console.error('  ' + prop + '   in   ' + selector);
  for (const v of values) console.error('      ' + v);
}
console.error(
  '\nThis is not fixable inside an adapter — the names belong to the libraries.\n' +
    'Pick one of them in `$adapters` (src/_config.scss). An application should\n' +
    'load one component library anyway; see the note in that file.\n'
);
process.exit(1);

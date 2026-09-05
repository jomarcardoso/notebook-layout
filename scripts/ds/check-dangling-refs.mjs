// scripts/check-dangling-refs.mjs

// =============================================================================
// DANGLING REFERENCE GUARD
// =============================================================================
//
// A `var(--app-x)` with no fallback, where `--app-x` is never declared, is not
// a warning in CSS. It makes the WHOLE declaration invalid at computed-value
// time, and the browser drops it silently. The stylesheet is valid, the build
// is green, and the property simply never arrives.
//
// This is not hypothetical. The notebook-layout adapter shipped ten of them at
// once — `--card-border-radius`, `--card-border`, `--field-bg`, `--chip-border`
// and six more — all pointing at LAYER 3 tokens. Layer 3 is deliberately not
// emitted (`$emit-component-vars: false`), because the three-level fallback
// chain is supposed to resolve it:
//
//     var(--app-surface-radius, var(--app-radius-surface))
//      ^ layer 3, absent          ^ layer 2, always present
//
// Written WITHOUT the second half, the reference dangles. Four visible
// regressions in the consuming app — cards losing their border, losing their
// corner radius, headers flattening into their body, fields losing their
// background — were all this one mistake, and every one of them looked like a
// design decision rather than a bug.
//
// Binding the layer 3 Sass variable — `#{component.$button-bg}` — produces the
// correct form, because the variable already holds a live layer 2 reference.
// This script is what makes forgetting it fail the build instead of the page.
//
//     node scripts/check-dangling-refs.mjs dist/ds.css
// =============================================================================

// -----------------------------------------------------------------------------
// PASS THE CONSUMERS TOO
// -----------------------------------------------------------------------------
//
//     node scripts/check-dangling-refs.mjs dist/ds.css [app.css …]
//
// The first file is the token build. Any further files are CONSUMERS — the
// compiled component and application CSS — and this matters more than it looks.
//
// With only the token build, the guard sees the declarations and the references
// that live in the same file. A component reading `var(--app-fg-brand)` when the
// theme never defined it is invisible: the read is in one file, the (missing)
// declaration would be in another, and the check reports ok.
//
// That happened. A new semantic role was added to the generator, three
// components were written against it, and the file was never copied into the
// product — so `.section-title`, an icon and a table accent all carried a dead
// declaration while this script reported success. Naming the consumers is what
// closes it.
import { readFileSync } from 'node:fs';

const files = process.argv.slice(2);
if (files.length === 0) files.push('dist/ds.css');

const sources = files.map((f) => ({ file: f, css: readFileSync(f, 'utf8') }));

// A name declared in ANY of the files counts as declared: the token build and
// its consumers are loaded together in the browser.
const declared = new Set();
for (const { css } of sources) {
  for (const m of css.matchAll(/(--[\w-]+)\s*:/g)) declared.add(m[1]);
}

const css = sources.map((s) => s.css).join('\n');

// Every reference, with a note on whether it carries a fallback. A `var()` with
// a comma has somewhere to go; one without does not.
//
// The regex takes the variable name and then looks at the very next
// non-whitespace character: `,` means a fallback follows, `)` means none.
const dangling = new Map();

for (const m of css.matchAll(/var\(\s*(--[\w-]+)\s*([,)])/g)) {
  const [, name, next] = m;
  if (next === ',') continue; // has a fallback — cannot dangle
  if (declared.has(name)) continue; // declared somewhere — resolves

  // Only OUR namespace is checkable. A bare `var(--cui-btn-bg)` may legitimately
  // be declared by the library's own CSS, which is not in this file.
  if (!name.startsWith('--app-')) continue;

  dangling.set(name, (dangling.get(name) ?? 0) + 1);
}

if (dangling.size === 0) {
  console.log(
    'check-dangling-refs: ok — every unfallbacked --app-* reference resolves.'
  );
  process.exit(0);
}

const total = [...dangling.values()].reduce((a, b) => a + b, 0);

console.error(
  `check-dangling-refs: ${dangling.size} name(s) referenced without a fallback ` +
    `and never declared, across ${total} declaration(s).\n\n` +
    'Each one silently voids the declaration that contains it. If the name is a\n' +
    'layer 3 component token, bind its Sass variable — `component.$button-bg` —\n' +
    'which resolves at build time to that token\'s layer 2 default, so the CSS\n' +
    'carries one live reference instead of a name nothing declares.\n'
);

for (const [name, count] of [...dangling].sort((a, b) => b[1] - a[1])) {
  console.error(`  ${name}   ${count}×`);
}

process.exit(1);

// scripts/check-fallback-values.mjs

// =============================================================================
// FALLBACK VALUE GUARD
// =============================================================================
//
// A `var()` fallback must be a VALUE. This is not:
//
//     background-color: var(--section-card-body-bg, --color-white);
//                                                   ^ a NAME, not a value
//
// It needed `var(--color-white)`. Written this way the declaration is invalid
// at computed-value time and the browser drops it, so the element falls back to
// whatever it inherited — in the case that produced this script, a panel whose
// background went white and whose border vanished.
//
// The failure mode is the worst kind available in CSS: it looks like a
// considered decision, it compiles without complaint, no linter objects,
// and the only symptom is that the rule quietly does nothing.
//
// This also catches the second shape of the same mistake — a fallback that is a
// bare colour LITERAL:
//
//     color: var(--app-fg-brand, #5f3212);
//
// which is valid CSS and still wrong here, because it hides a colour decision
// inside a fallback where no contrast check will ever measure it. A fallback
// belongs to the token chain: layer 3 falls through to layer 2, and layer 2 is
// where colour is decided and measured.
//
//     node scripts/check-fallback-values.mjs <file.css> [more.css …]
// =============================================================================

import { readFileSync } from 'node:fs';

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('usage: check-fallback-values.mjs <file.css> [more.css …]');
  process.exit(2);
}

const NAMED = new Set([
  'white', 'black', 'red', 'green', 'blue', 'gray', 'grey', 'silver',
  'maroon', 'olive', 'lime', 'aqua', 'teal', 'navy', 'fuchsia', 'purple',
  'orange', 'yellow', 'pink', 'brown', 'gold', 'beige', 'ivory', 'tan',
]);

const problems = [];

for (const file of files) {
  const css = readFileSync(file, 'utf8');

  // `var(--x, <fallback>)` — capture the fallback up to the matching depth.
  for (const m of css.matchAll(/var\(\s*(--[\w-]+)\s*,([^;{}]*)/g)) {
    const [, name, rawTail] = m;

    // Trim at the paren that closes this var(), so a nested chain is not
    // mistaken for this fallback's content.
    let depth = 1, out = '';
    for (const ch of rawTail) {
      if (ch === '(') depth++;
      else if (ch === ')') { depth--; if (depth === 0) break; }
      out += ch;
    }
    const fallback = out.trim();
    if (!fallback) continue;

    const line = css.slice(0, m.index).split('\n').length;

    // 1. A bare custom-property NAME: the mistake that renders as nothing.
    if (/^--[\w-]+$/.test(fallback)) {
      problems.push({
        file, line, name, fallback,
        why: 'a bare custom-property name is not a value — wrap it in var()',
      });
      continue;
    }

    // 2. A colour literal: valid, and still a colour decided outside layer 2.
    if (/^#[0-9a-fA-F]{3,8}$/.test(fallback) ||
        /^(rgba?|hsla?|oklch|color-mix)\(/.test(fallback) ||
        NAMED.has(fallback.toLowerCase())) {
      problems.push({
        file, line, name, fallback,
        why: 'a colour literal in a fallback is never measured by the contrast gate',
      });
    }
  }
}

if (problems.length === 0) {
  console.log('check-fallback-values: ok — every var() fallback is a value from the token chain.');
  process.exit(0);
}

console.error(`check-fallback-values: ${problems.length} bad fallback(s).\n`);
for (const p of problems) {
  console.error(`  ${p.file}:${p.line}`);
  console.error(`      var(${p.name}, ${p.fallback})`);
  console.error(`      ${p.why}\n`);
}
process.exit(1);

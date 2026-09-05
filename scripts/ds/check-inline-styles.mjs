// scripts/check-inline-styles.mjs

// =============================================================================
// INLINE COLOUR GUARD  (JSX / TSX)
// =============================================================================
//
// Stylelint cannot see a colour in `style={{ background: '#87695e' }}` because
// it does not parse TSX. That blind spot is not a small one: an inline style is
// the single strongest declaration in CSS — it beats every cascade layer
// unconditionally — so a colour written there is the one colour in the codebase
// that no token, no adapter, no theme and no contrast gate can reach.
//
// The measurement that produced this script: one application had 57 of them,
// including `#87695e` in three separate places — a brown NEAR the brand cocoa
// and not equal to it. Two components had hand-rolled the chip the design system
// already ships, and the "selected" state of both drifted from the palette while
// looking entirely deliberate.
//
// -----------------------------------------------------------------------------
// WHAT IT FLAGS AND WHAT IT DOES NOT
// -----------------------------------------------------------------------------
//
// FLAGGED: a colour LITERAL in a style object — hex, rgb(), hsl(), or a named
// colour. There is no legitimate reason for one: if the value should follow the
// theme it is a token, and if it should not, it belongs in layer 1.
//
// NOT FLAGGED: `style={{ background: 'var(--app-bg-brand)' }}`, and dimensions,
// transforms and positions. An inline style computed at runtime — a position
// from a measurement, a width from data — is what the attribute is for. Colour
// is not.
//
//     node scripts/check-inline-styles.mjs <dir> [more dirs …]
// =============================================================================

import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const dirs = process.argv.slice(2);
if (dirs.length === 0) {
  console.error('usage: check-inline-styles.mjs <dir> [more dirs …]');
  process.exit(2);
}

const SKIP = new Set(['node_modules', '.next', 'dist', 'build']);

const files = [];
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) {
      if (SKIP.has(e.name)) continue;
      walk(p);
      continue;
    }
    if (/\.(tsx|jsx)$/.test(e.name)) files.push(p);
  }
};
dirs.forEach(walk);

// Properties whose value is a colour. Anything else in a style object is
// geometry, and geometry computed at runtime is the attribute's real job.
const COLOUR_PROP =
  /\b(background|backgroundColor|color|borderColor|borderTopColor|borderRightColor|borderBottomColor|borderLeftColor|outlineColor|fill|stroke|boxShadow|textShadow|caretColor|accentColor|columnRuleColor|textDecorationColor)\b/;

const NAMED = new Set([
  'white', 'black', 'red', 'green', 'blue', 'gray', 'grey', 'silver',
  'maroon', 'olive', 'lime', 'aqua', 'teal', 'navy', 'fuchsia', 'purple',
  'orange', 'yellow', 'pink', 'brown', 'gold', 'beige', 'ivory', 'tan',
]);

const LITERAL = /#[0-9a-fA-F]{3,8}\b|\b(rgba?|hsla?|oklch)\s*\(/;

const problems = [];

for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const rel = relative(process.cwd(), f).replace(/\\/g, '/');

  // `prop: 'value'` or `prop: cond ? 'a' : 'b'` inside a style object. Matching
  // the property/value pair rather than trying to parse JSX keeps this readable
  // and, more importantly, keeps it from reporting things it cannot understand.
  for (const m of src.matchAll(/(\w+)\s*:\s*([^,;\n}]+)/g)) {
    const [, prop, rawValue] = m;
    if (!COLOUR_PROP.test(prop)) continue;

    const value = rawValue.trim();
    const strings = [...value.matchAll(/'([^']*)'|"([^"]*)"/g)].map(
      (s) => s[1] ?? s[2]
    );
    if (strings.length === 0) continue;

    for (const s of strings) {
      const bare = s.trim().toLowerCase();
      if (!LITERAL.test(s) && !NAMED.has(bare)) continue;
      const line = src.slice(0, m.index).split('\n').length;
      problems.push({ rel, line, prop, value: s });
    }
  }
}

if (problems.length === 0) {
  console.log('check-inline-styles: ok — no colour literals in style objects.');
  process.exit(0);
}

console.error(`check-inline-styles: ${problems.length} colour literal(s) in inline styles.\n`);
console.error(
  'An inline style beats every cascade layer, so these are the only colours in\n' +
    'the codebase that no token, theme, adapter or contrast check can reach.\n' +
    'Use var(--app-<token>) — or a component that already carries the state.\n'
);

const byFile = new Map();
for (const p of problems) {
  if (!byFile.has(p.rel)) byFile.set(p.rel, []);
  byFile.get(p.rel).push(p);
}
for (const [file, list] of [...byFile].sort((a, b) => b[1].length - a[1].length)) {
  console.error(`  ${file}  (${list.length})`);
  for (const p of list.slice(0, 4)) {
    console.error(`      :${p.line}  ${p.prop}: '${p.value}'`);
  }
  if (list.length > 4) console.error(`      … ${list.length - 4} more`);
}

process.exit(1);

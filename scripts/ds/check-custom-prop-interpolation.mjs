// scripts/check-custom-prop-interpolation.mjs

// =============================================================================
// CUSTOM PROPERTY INTERPOLATION GUARD
// =============================================================================
//
// Sass does not evaluate SassScript inside a custom property. This:
//
//     --cui-btn-border-radius: component.$button-radius;
//
// compiles to the literal text `component.$button-radius`, which is not a
// length, so the browser drops the declaration. The button loses its corners.
//
// The value has to be interpolated:
//
//     --cui-btn-border-radius: #{component.$button-radius};
//
// -----------------------------------------------------------------------------
// WHY THIS NEEDS A GUARD RATHER THAN CARE
// -----------------------------------------------------------------------------
//
// Nothing complains. Sass compiles it, the stylesheet is valid CSS by the
// parser's reckoning, every other check passes, and the only symptom is one
// property quietly not applying. It is the same silent-failure shape as a
// dangling `var()` and a `var(--x, --y)` fallback, and it arrived the same way:
// a mechanical migration rewrote `component.ref-chain('button-radius')` — which
// was inside `#{}` — into `component.$button-radius`, which was not.
//
// The rule is easy to state and impossible to remember at 3pm: a `--custom-prop`
// value is TEXT. Sass variables, functions and operators need `#{}` to survive.
//
//     node scripts/check-custom-prop-interpolation.mjs <dir> [more dirs …]
// =============================================================================

import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const dirs = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (dirs.length === 0) {
  console.error('usage: check-custom-prop-interpolation.mjs <dir> [more …]');
  process.exit(2);
}

const SKIP = new Set(['node_modules', '.next', 'dist']);

const files = [];
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) {
      if (SKIP.has(e.name)) continue;
      walk(p);
      continue;
    }
    if (/\.scss$/.test(e.name)) files.push(p);
  }
};
dirs.forEach(walk);

const problems = [];

for (const f of files) {
  const src = readFileSync(f, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p) => p + ' '.repeat(m.length - p.length));

  const lines = src.split('\n');
  lines.forEach((line, i) => {
    const m = line.match(/^\s*(--[\w-]+)\s*:\s*(.+?);?\s*$/);
    if (!m) return;
    const [, name, rawValue] = m;

    // Strip every interpolation; whatever SassScript remains is unevaluated.
    const outside = rawValue.replace(/#\{[^}]*\}/g, '');

    // A bare `$variable`, a namespaced `module.$variable`, or a Sass function
    // call left outside `#{}`.
    const bare = outside.match(/(?:[\w-]+\.)?\$[\w-]+/);
    if (!bare) return;

    problems.push({
      file: relative(process.cwd(), f).replace(/\\/g, '/'),
      line: i + 1,
      name,
      found: bare[0],
    });
  });
}

if (problems.length === 0) {
  console.log(
    'check-custom-prop-interpolation: ok — every custom property value is text or interpolated.'
  );
  process.exit(0);
}

console.error(
  `check-custom-prop-interpolation: ${problems.length} unevaluated SassScript value(s).\n\n` +
    'A custom property value is TEXT to Sass. These compile to the literal name\n' +
    'of the variable, which the browser then drops — silently.\n' +
    'Wrap the value in `#{…}`.\n'
);
for (const p of problems) {
  console.error(`  ${p.file}:${p.line}`);
  console.error(`      ${p.name}: ${p.found}   ->   ${p.name}: #{${p.found}}\n`);
}
process.exit(1);

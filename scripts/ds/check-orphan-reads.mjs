// scripts/check-orphan-reads.mjs

// =============================================================================
// ORPHAN READ GUARD
// =============================================================================
//
// Component code may read exactly two kinds of custom property:
//
//   1. `--app-*`      the design system's contract
//   2. one it DECLARES ITSELF in the same file — a local knob
//
// Anything else is an orphan: a name from a vocabulary that no longer exists,
// or one that lives somewhere this file cannot see.
//
// -----------------------------------------------------------------------------
// WHY THIS IS NOT COVERED BY THE OTHER GUARDS
// -----------------------------------------------------------------------------
//
// `check-dangling-refs` inspects the `--app-*` namespace only, because that is
// the namespace whose declarations it can account for. `stylelint` blocks a
// list of KNOWN foreign namespaces — `--color-*`, `--cui-*`, `--bs-*` — which
// catches a library variable but not a home-grown name like `--field__label-bg`.
//
// So a whole class sat between them, and it cost real features. Deleting the
// legacy variables file left six declarations on the field label reading
// `--field__label-bg`, `--field__label-color`, `--field__label-padding` and
// three more. Every one was invalid, every one was dropped, and the label lost
// its fill, its colour and its padding — a signature detail of the product —
// with a clean build and five green checks.
//
// It also catches the inverse, which is subtler: a state DECLARING the old name
// while the consumer reads the new one.
//
//     .field--focused.field--multiline { --field-line-color: … }
//     .field__input { background: …  var(--app-field-line-color) … }
//
// Valid CSS, no orphan read, and the focus state never arrives. That check is
// `--shadowed`, below.
//
//     node scripts/check-orphan-reads.mjs <dir> [more dirs …] [--shadowed]
// =============================================================================

import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const args = process.argv.slice(2);
const dirs = args.filter((a) => !a.startsWith('--'));
if (dirs.length === 0) {
  console.error('usage: check-orphan-reads.mjs <dir> [more dirs …]');
  process.exit(2);
}

const SKIP = new Set(['node_modules', '.next', 'dist', 'ds']);

const files = [];
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) {
      if (SKIP.has(e.name)) continue;
      walk(p);
      continue;
    }
    // `.svg` is on this list because it was NOT, and that cost 925 reads.
    //
    // Inline SVG carries `style="fill: var(--color-dark-main)"` and reads custom
    // properties exactly the way a stylesheet does. Six illustrations held 925
    // of them, every one naming the retired vocabulary, and no migration pass
    // and no guard had ever opened a `.svg` file — so the line work simply
    // stopped being drawn while every check stayed green.
    if (/\.(scss|css|svg)$/.test(e.name)) files.push(p);
  }
};
dirs.forEach(walk);

const orphans = [];
const shadowed = [];
const appReads = new Set();

// Comments are blanked rather than removed, so reported line numbers still
// point at the real line. Without this the guard reports every token quoted in
// a doc block — and these files explain their own history at length, so that
// was most of the first run's output.
const decomment = (s) =>
  s
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p) => p + ' '.repeat(m.length - p.length));

const parsed = files.map((f) => {
  const src = decomment(readFileSync(f, 'utf8'));
  const declared = new Set(
    [...src.matchAll(/^\s*(--[\w-]+)\s*:/gm)].map((m) => m[1])
  );
  for (const m of src.matchAll(/var\(\s*(--app-[\w-]+)/g)) appReads.add(m[1]);
  return { f, src, declared };
});

for (const { f, src, declared } of parsed) {
  const rel = relative(process.cwd(), f).replace(/\\/g, '/');

  // A FALLBACK is the difference between a bug and a design.
  //
  // `var(--dialog-keyboard-inset, 0px)` names a property set from JavaScript at
  // runtime. Nothing in CSS declares it and nothing should: the fallback is
  // what keeps the rule valid before the script runs, and that is the correct
  // way to read a value the DOM supplies. Flagging it taught nobody anything
  // and would have got this guard switched off.
  //
  // Without a fallback the same read is fatal — the declaration is dropped and
  // the feature silently disappears, which is how the field label lost its fill
  // and the user box lost its border.
  //
  // So: only unfallbacked orphan reads fail.
  for (const m of src.matchAll(/var\(\s*(--[\w-]+)\s*([,)])/g)) {
    const [, name, next] = m;
    if (next === ',') continue; // has somewhere to go
    if (name.startsWith('--app-')) continue;
    // A library namespace is stylelint's business, and legal inside an adapter.
    if (/^--(cui|bs|pico|bulma|tw)-/.test(name)) continue;
    if (declared.has(name)) continue; // a local knob
    const line = src.slice(0, m.index).split('\n').length;
    orphans.push({ rel, line, name });
  }

  // The inverse: declaring the old name when the read has moved.
  for (const m of src.matchAll(/^\s*(--(?!app-)[\w-]+)\s*:/gm)) {
    const name = m[1];
    if (/^--(cui|bs|pico|bulma|tw)-/.test(name)) continue;
    const moved = '--app-' + name.slice(2);
    if (!appReads.has(moved)) continue;
    const line = src.slice(0, m.index).split('\n').length;
    shadowed.push({ rel, line, name, moved });
  }
}

if (orphans.length === 0 && shadowed.length === 0) {
  console.log(
    'check-orphan-reads: ok — every read is --app-* or a knob the file declares.'
  );
  process.exit(0);
}

if (orphans.length) {
  console.error(`check-orphan-reads: ${orphans.length} orphan read(s).\n`);
  console.error(
    'These name a vocabulary nothing declares. Each one voids the declaration\n' +
      'that contains it, silently.\n'
  );
  for (const o of orphans) console.error(`  ${o.rel}:${o.line}  var(${o.name})`);
  console.error('');
}

if (shadowed.length) {
  console.error(`check-orphan-reads: ${shadowed.length} shadowed declaration(s).\n`);
  console.error(
    'These DECLARE the old name while the consumer reads the --app-* one, so\n' +
      'the value never reaches anything.\n'
  );
  for (const s of shadowed) {
    console.error(`  ${s.rel}:${s.line}  ${s.name}  ->  should be ${s.moved}`);
  }
}

process.exit(1);

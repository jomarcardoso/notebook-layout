// scripts/verify-patterns.mjs

// =============================================================================
// PATTERN VERIFICATION — does this code stay inside the vocabulary?
// =============================================================================
//
// Reads `patterns/patterns.json` and checks source files against it.
//
//     node scripts/verify-patterns.mjs <path> [--library bootstrap]
//
// Two outputs, and the second is the point of the exercise:
//
//   1. VIOLATIONS — a class in a governed namespace that no allowed pattern
//      produces. Exit code 1, so this can gate a build.
//   2. MATURITY — how many patterns are still `raw`, and how often each is
//      used. This is the number that should move between releases. A vocabulary
//      that stays 100% `raw` forever is a library with extra steps.
//
// WHAT THIS DELIBERATELY DOES NOT DO
//
// It does not resolve computed class names. `className={cx(base, isActive &&
// 'btn-warning')}` yields its literal string fragments and nothing more, and a
// class assembled from variables is invisible to it. That is a real limit, and
// the honest response is that a static check catches the common case cheaply —
// not that it should grow an evaluator. Where dynamic classes matter, the
// pattern is due for promotion out of `raw` anyway, which removes the string
// from the call site entirely.
// =============================================================================

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, relative, sep } from 'node:path';

const SCANNABLE = new Set([
  '.html', '.htm', '.jsx', '.tsx', '.vue', '.svelte', '.astro', '.php', '.erb', '.twig', '.hbs'
]);
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'build', 'coverage', 'vendor']);

// `class="…"`, `className="…"`, and the static parts of `class={`…`}`.
const CLASS_ATTR = /\b(?:class|className|class:list)\s*=\s*(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\}|\{"([^"]*)"\}|\{'([^']*)'\})/g;

const args = process.argv.slice(2);
let library = null;
let ledgerPath = null;
const targets = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--library') { library = args[++i]; continue; }
  if (args[i] === '--ledger') { ledgerPath = args[++i]; continue; }
  if (args[i].startsWith('--')) continue;
  targets.push(args[i]);
}
const root = targets[0] ?? '.';

// The ledger belongs to the PROJECT, not to this tool. There is no vocabulary
// shipped here to fall back on — a default ledger would be this tool deciding
// what a product may build, which is the one thing it must not do.
ledgerPath ??= 'patterns/patterns.json';

let ledger;
try {
  ledger = JSON.parse(readFileSync(ledgerPath, 'utf8'));
} catch (err) {
  console.error(
    `\nNo pattern ledger at ${ledgerPath}.\n\n` +
    `  Pass one with --ledger <path>, or create one for this project by\n` +
    `  copying the plugin's patterns/patterns.template.json and filling in\n` +
    `  the vocabulary. The template ships empty on purpose: which variants a\n` +
    `  product allows is the product's decision.\n`
  );
  process.exit(2);
}

if (!ledger.libraries?.length) {
  console.error(
    `\n${ledgerPath} has no libraries and no vocabulary — this is the unfilled\n` +
    `template. Add the library you build with and the patterns you allow.\n`
  );
  process.exit(2);
}
if (ledger.version !== 1) {
  console.error(`patterns.json is version ${ledger.version}; this verifier understands 1.`);
  process.exit(2);
}

const lib = library ?? ledger.libraries[0];
if (!ledger.libraries.includes(lib)) {
  console.error(`"${lib}" is not in the ledger's libraries (${ledger.libraries.join(', ')}).`);
  process.exit(2);
}

// -----------------------------------------------------------------------------
// Validate the ledger itself
// -----------------------------------------------------------------------------
//
// `patterns.schema.json` documents the shape, but a schema nobody runs is a
// comment. These are the invariants that make the ledger USABLE rather than
// merely well-formed, so they are enforced here where they cannot be skipped:
// a refusal with no alternative just moves the problem, and a promoted state
// with an empty slot tells an agent to emit nothing at all.

const ledgerErrors = [];
for (const [cName, c] of Object.entries(ledger.components)) {
  if (!c.namespace?.[lib]) {
    ledgerErrors.push(`${cName}: no namespace for library "${lib}"`);
  }
  for (const [pName, p] of Object.entries(c.patterns)) {
    const at = `${cName}.${pName}`;
    if (!p.intent) ledgerErrors.push(`${at}: missing intent — the field a library swap depends on`);
    if (p.state === 'forbidden') {
      if (!p.reason) ledgerErrors.push(`${at}: forbidden without a reason`);
      if (!p.instead) ledgerErrors.push(`${at}: forbidden without an alternative`);
    } else if ((p.state === 'styled' || p.state === 'own') && !p.styled) {
      ledgerErrors.push(`${at}: state is "${p.state}" but the class slot is empty`);
    } else if (p.state === 'wrapped' && !p.wrapped?.component) {
      ledgerErrors.push(`${at}: state is "wrapped" but no component is named`);
    } else if (p.state === 'raw' && !p.raw?.[lib]) {
      ledgerErrors.push(`${at}: state is "raw" but there are no ${lib} classes`);
    }
  }
}

if (ledgerErrors.length) {
  console.error('\npatterns.json is not usable:\n');
  for (const e of ledgerErrors) console.error(`  ${e}`);
  console.error('');
  process.exit(2);
}

// -----------------------------------------------------------------------------
// Compile the ledger into something matchable
// -----------------------------------------------------------------------------
//
// An allowed pattern becomes a SET of classes rather than a string, because the
// order a developer writes them in carries no meaning and comparing strings
// would report `btn-primary btn` as a violation of `btn btn-primary`.

const components = Object.entries(ledger.components).map(([name, c]) => {
  const nsSource = c.namespace?.[lib];
  const rootSource = c.root?.[lib];
  const allowed = [];
  const forbidden = [];

  // What counts as correct markup depends on the pattern's STATE, which is the
  // whole reason state is a field. A promoted pattern is not "also still fine
  // as library classes" — the point of promotion is that the call site stops
  // naming the library. So the old composition becomes a violation with its own
  // message, which is what makes a migration finishable instead of perpetual.
  const stale = [];

  for (const [patternName, p] of Object.entries(c.patterns)) {
    if (p.state === 'forbidden') {
      for (const cls of p.matches?.[lib] ?? []) {
        forbidden.push({ cls, pattern: patternName, reason: p.reason, instead: p.instead });
      }
      continue;
    }

    let expected = null;
    if (p.state === 'raw') expected = p.raw?.[lib];
    // `styled` may name more than one class: a base plus its modifier
    // (`cm-stat cm-stat--critical`) is one pattern, not two, and forcing it
    // into a single class would push products toward inventing a second base.
    // `own` matches exactly like `styled` — the markup carries the project's
    // class either way. The states differ in what they CLAIM, not in what the
    // page looks like: `styled` says a library component is underneath and
    // `own` says nothing is. That distinction is invisible in the HTML and very
    // visible in the maturity table, which is the point of separating them.
    else if (p.state === 'styled' || p.state === 'own') expected = p.styled ? p.styled.trim().split(/\s+/) : null;
    else if (p.state === 'wrapped') expected = p.styled ? p.styled.trim().split(/\s+/) : p.raw?.[lib];

    if (expected) allowed.push({ pattern: patternName, state: p.state, set: new Set(expected) });

    if (p.state !== 'raw' && p.raw?.[lib]) {
      stale.push({ pattern: patternName, state: p.state, set: new Set(p.raw[lib]), use: p.styled });
    }
  }

  const modifiers = [];
  for (const [modName, m] of Object.entries(c.modifiers ?? {})) {
    for (const [optName, o] of Object.entries(m.options ?? {})) {
      for (const cls of o.libraries?.[lib] ?? []) {
        modifiers.push({ cls, modifier: modName, option: optName });
      }
    }
    for (const [optName, f] of Object.entries(m.forbidden ?? {})) {
      for (const cls of f.matches?.[lib] ?? []) {
        forbidden.push({ cls, pattern: `${modName}: ${optName}`, reason: f.reason, instead: f.instead });
      }
    }
  }

  return {
    name,
    namespace: nsSource ? new RegExp(nsSource) : null,
    // Falls back to the namespace: with an unambiguous prefix the two are the
    // same question, and only shared-modifier libraries need them separated.
    root: new RegExp(rootSource ?? nsSource ?? '$^'),
    allowed,
    forbidden,
    stale,
    modifiers
  };
}).filter((c) => c.namespace);

// -----------------------------------------------------------------------------
// Walk and check
// -----------------------------------------------------------------------------

const files = [];
const walk = (dir) => {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name) && !e.name.startsWith('.')) walk(join(dir, e.name));
    } else if (SCANNABLE.has(extname(e.name))) {
      files.push(join(dir, e.name));
    }
  }
};

if (statSync(root).isDirectory()) walk(root);
else files.push(root);

const violations = [];
const usage = new Map(); // "component/pattern" -> count

// Blank out comments before scanning, preserving length so line numbers stay
// true. Documentation routinely quotes the markup it is warning against — this
// file's own examples do — and reporting those as violations trains people to
// ignore the output.
const decomment = (src) =>
  src
    .replace(/<!--[\s\S]*?-->/g, (m) => ' '.repeat(m.length))
    .replace(/\/\*[\s\S]*?\*\//g, (m) => ' '.repeat(m.length));

for (const file of files) {
  const src = decomment(readFileSync(file, 'utf8'));
  for (const m of src.matchAll(CLASS_ATTR)) {
    const raw = m[1] ?? m[2] ?? m[3] ?? m[4] ?? m[5] ?? '';
    const classes = raw.split(/\s+/).filter(Boolean);
    if (!classes.length) continue;

    const line = src.slice(0, m.index).split('\n').length;

    for (const c of components) {
      // Is this element the component at all? Without this check a shared
      // modifier — Bulma's `is-fullwidth` on a `.select` — reads as a button
      // with an unknown variant.
      if (!classes.some((cl) => c.root.test(cl))) continue;

      const ns = classes.filter((cl) => c.namespace.test(cl));
      if (!ns.length) continue;

      // Peel off allowed modifiers first — they combine with any pattern, so
      // leaving them in would make every sized button an unknown composition.
      const mods = c.modifiers.filter((mo) => ns.includes(mo.cls));
      const core = new Set(ns.filter((cl) => !mods.some((mo) => mo.cls === cl)));

      const hit = c.allowed.find(
        (a) => a.set.size === core.size && [...a.set].every((cl) => core.has(cl))
      );

      if (hit) {
        const key = `${c.name}/${hit.pattern}`;
        usage.set(key, (usage.get(key) ?? 0) + 1);
        continue;
      }

      // A composition that WAS correct before this pattern was promoted. Worth
      // its own message: the fix is mechanical and the developer is not wrong
      // about the design, only about the phase.
      const outdated = c.stale.find(
        (s) => s.set.size === core.size && [...s.set].every((cl) => core.has(cl))
      );

      if (outdated) {
        violations.push({
          file: relative(process.cwd(), file).split(sep).join('/'),
          line,
          component: c.name,
          found: ns.join(' '),
          pattern: outdated.pattern,
          reason: `"${outdated.pattern}" was promoted to ${outdated.state}. Library classes at the call site are what promotion removes — leaving them means the library cannot be replaced without editing markup again.`,
          instead: outdated.use,
          options: c.allowed.map((a) => a.pattern)
        });
        continue;
      }

      // Name the failure as precisely as the ledger allows.
      const named = c.forbidden.find((f) => ns.includes(f.cls));
      violations.push({
        file: relative(process.cwd(), file).split(sep).join('/'),
        line,
        component: c.name,
        found: ns.join(' '),
        pattern: named?.pattern ?? null,
        reason: named?.reason ?? 'Not in the vocabulary: no allowed pattern produces this combination.',
        instead: named?.instead ?? null,
        options: c.allowed.map((a) => a.pattern)
      });
    }
  }
}

// -----------------------------------------------------------------------------
// Report
// -----------------------------------------------------------------------------

const bold = (s) => `[1m${s}[0m`;
const dim = (s) => `[2m${s}[0m`;

console.log(`\n${bold('Pattern check')} ${dim(`— library: ${lib}, ${files.length} files under ${root}`)}\n`);

if (violations.length) {
  for (const v of violations) {
    console.log(`  ${bold(v.file + ':' + v.line)}  ${v.component} — ${v.found}`);
    if (v.pattern) console.log(`    forbidden pattern "${v.pattern}"`);
    console.log(dim(`    ${v.reason}`));
    console.log(`    use ${v.instead ? bold(v.instead) : 'one of: ' + v.options.join(', ')}\n`);
  }
} else {
  console.log('  No violations.\n');
}

// Maturity: the number this whole exercise exists to move.
console.log(bold('Vocabulary maturity'));
for (const [name, c] of Object.entries(ledger.components)) {
  const states = { raw: 0, styled: 0, own: 0, wrapped: 0, forbidden: 0 };
  for (const p of Object.values(c.patterns)) states[p.state]++;
  const live = states.raw + states.styled + states.own + states.wrapped;
  const pct = (n) => (live ? Math.round((n / live) * 100) : 0);
  console.log(
    `  ${name.padEnd(10)} ${live} allowed  ` +
    `${dim('raw')} ${states.raw} (${pct(states.raw)}%)  ` +
    `${dim('styled')} ${states.styled} (${pct(states.styled)}%)  ` +
    `${dim('own')} ${states.own} (${pct(states.own)}%)  ` +
    `${dim('wrapped')} ${states.wrapped} (${pct(states.wrapped)}%)  ` +
    `${dim('forbidden')} ${states.forbidden}`
  );
}

// PLANNED PROMOTIONS.
//
// Reported beside maturity rather than buried in the JSON, because the whole
// point of a trajectory is that somebody sees it. A ledger records the adequate
// present and a mapped future: `state` is today and `trajectory` is the plan,
// and a `raw` with no trajectory reads as a permanent choice rather than a
// starting point.
//
// This is also the answer to "the vocabulary is 100% raw, so it is a library
// theme". It is — today — and the difference between a starting point and a
// resting point is whether the next move is written down.
const planned = [];
for (const [name, c] of Object.entries(ledger.components)) {
  for (const [p, v] of Object.entries(c.patterns)) {
    if (v.trajectory) planned.push([`${name}/${p}`, v.state, v.trajectory]);
  }
}

if (planned.length) {
  console.log(`\n${bold('Planned')}`);
  for (const [key, from, t] of planned) {
    console.log(`  ${key.padEnd(22)} ${dim(from)} → ${t.to}`);
    console.log(`  ${' '.repeat(22)} ${dim('when')} ${t.when}`);
    if (t.blocked) console.log(`  ${' '.repeat(22)} ${dim('blocked')} ${t.blocked}`);
  }
}

if (usage.size) {
  console.log(`\n${bold('Call sites')}`);
  for (const [key, n] of [...usage].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(4)}  ${key}`);
  }
}

console.log(
  `\n${violations.length ? bold(`${violations.length} violation(s).`) : 'Inside the vocabulary.'}\n`
);
process.exit(violations.length ? 1 : 0);

// scripts/check-derived.mjs

// =============================================================================
// CHECK-DERIVED — no library colour reaches a class the ledger allows
// =============================================================================
//
//     node scripts/check-derived.mjs <product-dir> --library dist/coreui.css
//
// THE INVARIANT THIS EXISTS TO ENFORCE
//
// A library variable can hold two very different things, and the difference
// decides who owns the design:
//
//     $primary: #005bac              a literal. The library's own functions run
//                                    on it — shade-color() invents the hover —
//                                    and the design system has lost that value.
//
//     $card-bg: var(--app-bg-surface) a reference. No function runs, the string
//                                    travels through the compiler intact, and
//                                    the token still owns it at runtime.
//
// Literals are unavoidable: without `$primary` set, every corner the adapter
// does not rebind ships the library's factory indigo. The bargain is that those
// literals must never be what a user actually sees — the adapter is supposed to
// overwrite each one on the variant class, later in the cascade.
//
// That bargain was a promise nobody could check. This is the check.
//
// -----------------------------------------------------------------------------
// WHY IT CANNOT BE DONE IN A BROWSER
// -----------------------------------------------------------------------------
//
// The obvious version — open the page, read every `--cui-*` off a rendered
// element — does not work, and it took a wasted attempt to see why.
// `getComputedStyle().getPropertyValue()` returns the SUBSTITUTED value, so a
// property correctly pointing at `var(--app-fg-default)` comes back as
// `#2b261e`, indistinguishable from a literal the library baked in. Every
// property looked like a leak.
//
// The question is about the DECLARATION, not the value, so it has to be asked
// of the stylesheet text.
// =============================================================================

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
const libFlag = process.argv.indexOf('--library');
const libPath = libFlag > -1 ? process.argv[libFlag + 1] : 'dist/coreui.css';
const prefix = /--(cui|bs)-/;

if (!dir || !existsSync(join(dir, 'ds.css'))) {
  console.error('check-derived: pass a product directory holding ds.css');
  process.exit(1);
}

// -----------------------------------------------------------------------------
// A very small CSS reader
// -----------------------------------------------------------------------------
//
// Enough to get selector + declarations, and to ignore at-rules that change
// nothing about which declaration wins for the light theme: `@media` for dark,
// `@supports`, and the `@layer` wrappers, whose order is handled by the order
// the two files are read in.

// Brace-tracking rather than a single regex, and the first version was a regex.
// It read `([^{}]+)\{([^{}]*)\}` and then took the LAST LINE of the prelude to
// drop whatever came before — which silently truncated every multi-line
// selector. The adapter's root block is
//
//     :root,
//     [data-theme],
//     [data-coreui-theme],
//     [data-surface] {
//
// so it was read as `[data-surface]` alone, the root bindings came back empty,
// and the check reported forty properties as unowned that the adapter owns
// perfectly well. A parser that is wrong in the direction of MORE findings is
// the dangerous kind: the output looks like diligence.
function rules(css) {
  const out = [];
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  let i = 0, depth = 0, start = 0;
  const stack = [];
  while (i < css.length) {
    const ch = css[i];
    if (ch === '{') {
      const prelude = css.slice(start, i).trim().replace(/\s+/g, ' ');
      stack.push(prelude);
      depth++;
      start = i + 1;
    } else if (ch === '}') {
      const prelude = stack.pop();
      const body = css.slice(start, i);
      // Only a leaf block holds declarations; an at-rule wrapper holds rules.
      if (prelude && !prelude.startsWith('@') && !body.includes('{')) {
        const decls = [];
        for (const d of body.split(';')) {
          const c = d.indexOf(':');
          if (c < 0) continue;
          const prop = d.slice(0, c).trim();
          if (!prefix.test(prop)) continue;
          decls.push([prop, d.slice(c + 1).trim()]);
        }
        if (decls.length) out.push({ sel: prelude, decls });
      }
      depth--;
      start = i + 1;
    }
    i++;
  }
  return out;
}

// Does this selector apply to an element carrying exactly `classes`, on its own?
//
// Deliberately conservative. A descendant selector (`.card .btn`) depends on
// ancestors this check cannot know, so it is SKIPPED rather than guessed at —
// which means the check can miss a leak, never invent one. A guard that cries
// wolf gets switched off, and then it protects nothing.
function appliesTo(sel, classes) {
  return sel.split(',').some((part) => {
    const one = part.trim();
    if (/[ >+~]/.test(one)) return false;
    // Drop pseudo-classes and pseudo-elements: `:hover`, `::before`,
    // `:not(.x)`. States are separate declarations of the same property and are
    // checked on their own rules where those rules are simple.
    const bare = one.replace(/::?[a-z-]+(\([^)]*\))?/gi, '');
    if (!bare) return false;
    const found = [...bare.matchAll(/\.([A-Za-z0-9_-]+)/g)].map((m) => m[1]);
    if (!found.length) return false;
    const rest = bare.replace(/\.[A-Za-z0-9_-]+/g, '');
    if (rest && !/^[a-z][a-z0-9]*$/i.test(rest)) return false;
    return found.every((c) => classes.has(c));
  });
}

// `transparent`, `none`, `inherit` and `currentcolor` are structural answers
// rather than colours — a filled button removing its border writes
// `transparent`, and that is the system speaking, not the library.
const structural = (v) =>
  !v.trim() || /^(transparent|none|inherit|initial|unset|currentcolor|0)$/i.test(v.trim());

// ONLY THE THREE PROPERTIES THAT PAINT. Shadows and `-rgb` triplets were in this
// list for one run and produced pages of noise: this build sets
// `$enable-shadows: false`, so `--cui-btn-box-shadow` is declared and never
// read, and the focus triplet is overridden by the adapter as a PROPERTY rather
// than a variable, which this reader cannot see. A guard whose output has to be
// skimmed for the real entries is a guard nobody runs.
const CARRIES_COLOUR = /-(bg|color|border-color)$/;

// EXEMPTIONS, each with a reason, because a guard with a silent allowlist is a
// guard that will one day be silenced by someone in a hurry. Add to this only
// when the colour in the value is genuinely not painted.
const EXEMPT = new Map([
  [
    '--cui-navbar-toggler-icon-bg',
    'An SVG data URI. A var() inside one is never substituted, so the ink cannot ' +
      'be a token — the adapter uses the URI as a MASK and paints with ' +
      'background-color instead, which makes the colour inside it inert. The ' +
      'variable still reads as a colour to this check and no longer is one.'
  ]
]);

// -----------------------------------------------------------------------------
// ONE MORE HOP
// -----------------------------------------------------------------------------
//
// `--cui-btn-color: var(--cui-link-color)` is NOT a leak. The adapter binds
// `--cui-link-color: var(--app-fg-link)` at the root, so the design system owns
// it one level down — and that indirection is the library's own way of keeping
// a component tied to a global, which is worth preserving rather than flattening.
//
// So a value is owned when it names an `--app-*` token, or when every `--cui-*`
// it names is itself owned. Resolved against the root block the adapter emits.
// The test is PROVENANCE, not shape, and the first version got that wrong.
//
// It insisted every hop end in an `--app-*` reference, and so reported eleven
// properties that are perfectly ours. The navbar reads
// `rgba(var(--cui-emphasis-color-rgb), .65)`, and a triplet cannot BE a token
// reference — so the adapter computes `--cui-emphasis-color-rgb` from the theme
// map and redeclares it inside every theme block. That is a literal, and it is
// entirely ours: it moves when the theme moves, which is the only property that
// matters here.
function declaredBy(fileRules) {
  const set = new Set();
  for (const r of fileRules) for (const [prop] of r.decls) set.add(prop);
  return set;
}

// So a value is owned when it names an `--app-*` token, or when every `--cui-*`
// it names is a property the ADAPTER declares somewhere. Anything else, on a
// property that paints, came from the library.
function owned(v, ours) {
  if (/var\(--app-/.test(v)) return true;
  const refs = [...v.matchAll(/var\(\s*(--cui-[a-z0-9-]+)/g)].map((m) => m[1]);
  return refs.length > 0 && refs.every((r) => ours.has(r));
}

// -----------------------------------------------------------------------------

const files = [
  { name: libPath, rules: rules(readFileSync(libPath, 'utf8')) },
  { name: join(dir, 'ds.css'), rules: rules(readFileSync(join(dir, 'ds.css'), 'utf8')) }
];

const ledgerPath = join(dir, 'patterns.json');
const ledger = JSON.parse(readFileSync(ledgerPath, 'utf8'));

const combos = [];
for (const [fam, c] of Object.entries(ledger.components ?? {})) {
  for (const [name, p] of Object.entries(c.patterns ?? {})) {
    if (p.state === 'forbidden') continue;
    const cls = p.raw?.coreui ?? (p.styled ? p.styled.trim().split(/\s+/) : null);
    if (cls) combos.push({ id: `${fam}/${name}`, classes: new Set(cls) });
  }
}

const ours = declaredBy(files[1].rules);

const leaks = [];
for (const combo of combos) {
  // Last write wins: the files are read in cascade order and `vendor-config`
  // comes after `vendor`, so a later declaration of the same property is the
  // one that reaches the screen.
  const winner = new Map();
  for (const f of files) {
    for (const r of f.rules) {
      if (!appliesTo(r.sel, combo.classes)) continue;
      for (const [prop, val] of r.decls) winner.set(prop, { val, sel: r.sel, file: f.name });
    }
  }
  for (const [prop, w] of winner) {
    if (!CARRIES_COLOUR.test(prop) || EXEMPT.has(prop)) continue;
    if (structural(w.val) || owned(w.val, ours)) continue;
    leaks.push({ pattern: combo.id, prop, ...w });
  }
}

const bold = (s) => `[1m${s}[0m`;
const dim = (s) => `[2m${s}[0m`;

if (!leaks.length) {
  console.log(
    `check-derived: ok — ${combos.length} allowed patterns, every colour property ` +
      'they resolve resolves to an --app-* token.'
  );
  process.exit(0);
}

console.log(`\n${bold('Library colour reaching an allowed pattern')} ${dim(`— ${dir}`)}\n`);
const byPattern = new Map();
for (const l of leaks) {
  if (!byPattern.has(l.pattern)) byPattern.set(l.pattern, []);
  byPattern.get(l.pattern).push(l);
}
for (const [p, list] of byPattern) {
  console.log(`  ${bold(p)}  ${dim(`${list.length} propert${list.length === 1 ? 'y' : 'ies'}`)}`);
  for (const l of list.slice(0, 8)) {
    console.log(`    ${l.prop}: ${l.val}   ${dim(`${l.sel} — ${l.file}`)}`);
  }
  if (list.length > 8) console.log(dim(`    …and ${list.length - 8} more`));
}
console.log(`
Each of these is a value the LIBRARY chose, reaching a class the ledger allows.
The adapter is meant to overwrite every one of them on the variant class. Where
it does not, the colour on screen came from the library's own defaults — and
for anything derived by \`shade-color()\` or \`tint-color()\`, from the library's
opinion about what a hover should be.

Fix by binding the property in the adapter, or by removing the pattern from the
ledger if the product does not actually use it.
`);
console.log(`${bold(`${leaks.length} leak(s).`)}`);
process.exit(1);

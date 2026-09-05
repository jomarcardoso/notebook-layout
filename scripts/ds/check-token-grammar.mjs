// scripts/check-token-grammar.mjs

// =============================================================================
// LAYER 3 NAME GRAMMAR
// =============================================================================
//
// The component layer is meant to be LARGE — one entry for every knob any
// library exposes — and almost always empty at runtime, because every entry is
// optional and resolves to its layer 2 default until someone sets it.
//
// A large optional vocabulary only stays usable if it is predictable. Nobody
// reads 130 token names; they GUESS one and expect to be right. So the names
// follow a grammar, and this script is what keeps them following it as the layer
// grows past the point where anyone can hold it in their head.
//
//     --app-<component>[-<element>]-<property>[-<state>]
//
//              component   button, field, nav, table, chip, dropdown, …
//              element     the part inside it: label, link, item, row, track,
//                          thumb, header, divider, fill, tab, placeholder
//              property    what is being set
//              state       when it applies
//
// -----------------------------------------------------------------------------
// WHERE THE GRAMMAR COMES FROM
// -----------------------------------------------------------------------------
//
// Salesforce SLDS styling hooks — the most rigorously specified component layer
// in public use — name theirs
// `--slds-c-<component>-<element>-<category>-<property>-<state>`, e.g.
// `--slds-c-accordion-heading-text-color`. Nathan Curtis's taxonomy, which
// Spectrum and Style Dictionary both follow, decomposes a token into object
// (component + element), category, property, variant and state, in that order.
//
// This grammar is that shape with one deliberate difference: `bg` and `fg`
// instead of `color-background` and `text-color`. Layer 2 already speaks that
// way, and consistency inside one system beats matching another system's
// spelling — a reader who has learned `--app-bg-action` should not have to
// learn a second convention to use `--app-card-bg`.
//
//     node scripts/check-token-grammar.mjs src/_component.scss
// =============================================================================

import { readFileSync } from 'node:fs';

const file = process.argv[2] ?? 'src/_component.scss';
const src = readFileSync(file, 'utf8');

// The closed set of properties. Closed on purpose: an open set is how you end up
// with `bg`, `background` and `background-color` all meaning the same thing.
const PROPERTIES = new Set([
  'bg', 'fg', 'border-color', 'border-width', 'border-style',
  'radius', 'shadow', 'opacity',
  'pad', 'pad-x', 'pad-y', 'gap', 'height', 'min-height', 'width', 'size',
  'font-size', 'font-weight', 'line-height', 'letter-spacing', 'font-family',
  'backdrop', 'divider', 'divider-color', 'ring', 'ring-width', 'width-active',
  // Composed shorthand, matching layer 2, which also ships a composed `border`
  // alongside its width/style/colour atoms.
  'border',
  // Decorative rules: a dashed notebook line has a length, a gap and an offset,
  // and none of them is a border on a box.
  'offset', 'offset-x', 'dash-length', 'dash-gap',
]);

// The closed set of states.
const STATES = new Set([
  'hover', 'active', 'focus', 'selected', 'checked', 'disabled', 'visited',
  'pressed', 'striped', 'on-active', 'on-selected',
  // Disclosure. A footer that slides up, an accordion panel, a dropdown — the
  // state ARIA spells `aria-expanded` and Bootstrap spells `.show`. It was
  // missing because the closed sets were drawn from what libraries expose as
  // THEMING hooks, and a library themes its open panel without naming the
  // state in the variable.
  'open',
]);

// Entries that predate the grammar and are kept for a stated reason.
const EXEMPT = new Set([
  // A categorical chart palette is indexed, not described. `chart-1` has no
  // property because the token IS the colour.
  'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5',
  // The action ramp, exposed for a library that needs steps rather than roles.
  ...Array.from({ length: 11 }, (_, i) =>
    `action-${[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950][i]}`),
  // Heading levels are numbered, like the chart series.
  'heading-1-fg', 'heading-2-fg', 'heading-3-fg', 'heading-4-fg',
  'heading-5-fg', 'heading-6-fg',
  // `accent` is a role a few libraries expose directly; it has no component.
  'tertiary-bg', 'tertiary-fg', 'tertiary-bg-hover', 'tertiary-bg-subtle',
  'tertiary-fg-on-subtle',
]);

// Layer 3 is Sass variables now, not a map. `$button-bg: var(--app-bg-action)
// !default;` — the name is the variable, and the value is a pointer at layer 2.
const names = [...src.matchAll(/^\$([a-z0-9-]+)\s*:/gm)].map((m) => m[1]);

const bad = [];

for (const name of names) {
  if (EXEMPT.has(name)) continue;

  // Peel an optional state off the end, then a property, and whatever is left
  // is component (+ element).
  let rest = name;
  let state = null;
  for (const s of [...STATES].sort((a, b) => b.length - a.length)) {
    if (rest.endsWith('-' + s)) {
      state = s;
      rest = rest.slice(0, -(s.length + 1));
      break;
    }
  }

  let property = null;
  for (const p of [...PROPERTIES].sort((a, b) => b.length - a.length)) {
    if (rest === p || rest.endsWith('-' + p)) {
      property = p;
      rest = rest === p ? '' : rest.slice(0, -(p.length + 1));
      break;
    }
  }

  if (!property) {
    bad.push({ name, why: 'no recognised property segment' });
    continue;
  }
  if (rest === '') {
    bad.push({ name, why: 'names a property with no component' });
    continue;
  }
}

if (bad.length === 0) {
  console.log(
    `check-token-grammar: ok — ${names.length} layer 3 names follow ` +
      '<component>[-<element>]-<property>[-<state>].'
  );
  process.exit(0);
}

console.error(`check-token-grammar: ${bad.length} name(s) off the grammar.\n`);
console.error(
  'Layer 3 is meant to be guessable: someone reaches for a name they have not\n' +
    'read and expects to be right. That only works while every name is\n' +
    '<component>[-<element>]-<property>[-<state>], with the property and state\n' +
    'drawn from the closed sets in this script.\n'
);
for (const b of bad) console.error(`  ${b.name.padEnd(34)} ${b.why}`);
process.exit(1);

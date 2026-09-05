// scripts/check-adapter-forms.mjs

// =============================================================================
// ADAPTER FORM COVERAGE
// =============================================================================
//
// A library variable often exists in two forms: the colour, `--cui-tertiary-bg`,
// and its channels, `--cui-tertiary-bg-rgb`. Rules that need alpha are written
// as `rgba(var(--X-rgb), var(--bg-opacity))` and consume ONLY the triplet.
//
// So an adapter can bind `--X`, look correct in devtools, and change nothing:
// the rule reading the colour does not exist, and the rule that does exist
// reads a form nobody bound. The library's own default survives a theme flip.
//
// This has now shipped twice. `--cui-link-color` was bound while the anchor
// rule read `--cui-link-color-rgb`; `--cui-tertiary-bg` was bound while
// `.bg-body-tertiary` read `--cui-tertiary-bg-rgb`, which left a recessed card
// carrying CoreUI's own light grey on a dark page. Both were caught by eye,
// months apart. The adapter file warns about the class of failure in prose,
// three hundred lines above the line that repeated it.
//
// -----------------------------------------------------------------------------
// WHAT THIS DOES AND DOES NOT ASSERT
// -----------------------------------------------------------------------------
//
// NOT "declare everything the library consumes". CoreUI reads 648 variables and
// its adapter binds 114 on purpose — the rest are padding, radii and z-indexes
// the theme has no opinion about. Demanding all of them would replace a real
// signal with hundreds of false ones.
//
// The assertion is narrower and is exactly the failure above: **if an adapter
// binds one form of a variable, and the library consumes the OTHER form, the
// adapter has to bind that one too.** Binding `--X` is a statement that this
// system owns X. Leaving `--X-rgb` to the library then means it does not.
// =============================================================================

import { readFileSync, existsSync } from 'node:fs';

// adapter output → the compiled library it is meant to drive.
const PAIRS = [
  ['dist/adapter-bootstrap.css', 'dist/bootstrap.css', '--bs-'],
  ['dist/adapter-coreui.css', 'dist/coreui.css', '--cui-'],
  ['dist/adapter-daisyui.css', 'dist/daisyui.css', '--'],
  ['dist/adapter-pico.css', 'dist/pico.css', '--pico-'],
  ['dist/adapter-bulma.css', 'dist/bulma.css', '--bulma-'],
  ['dist/adapter-flowbite.css', 'dist/flowbite.css', '--'],
  ['dist/adapter-preline.css', 'dist/preline.css', '--']
];

// The forms a value can take. `-rgb` is Bootstrap's and CoreUI's; the others
// appear in libraries that decompose colour for alpha or for HSL maths.
const FORMS = ['-rgb', '-h', '-s', '-l', '-channels'];

const declaredIn = (css, prefix) =>
  new Set(
    [...css.matchAll(new RegExp(`(${prefix}[a-z0-9-]+)\\s*:`, 'g'))].map((m) => m[1])
  );

const consumedIn = (css, prefix) =>
  new Set(
    [...css.matchAll(new RegExp(`var\\(\\s*(${prefix}[a-z0-9-]+)`, 'g'))].map((m) => m[1])
  );

let failures = 0;
let checked = 0;

for (const [adapterPath, libPath, prefix] of PAIRS) {
  if (!existsSync(adapterPath) || !existsSync(libPath)) continue;
  checked += 1;

  const declared = declaredIn(readFileSync(adapterPath, 'utf8'), prefix);
  const consumed = consumedIn(readFileSync(libPath, 'utf8'), prefix);

  const missing = [];
  for (const name of declared) {
    for (const form of FORMS) {
      // ONE DIRECTION ONLY: composed form bound, channel form left loose.
      //
      // The reverse is not a bug and flagging it produced 29 false positives on
      // Bulma alone, which COMPOSES its colours from the channels
      // (`--bulma-primary: hsl(var(--bulma-primary-h) ...)`). Binding the
      // channels there is the complete and correct way to own the colour; the
      // composed variable is the library deriving what it was given.
      if (name.endsWith(form)) continue;
      const other = name + form;
      if (declared.has(other)) continue;
      if (!consumed.has(other)) continue;
      missing.push([name, other]);
    }
  }

  if (missing.length === 0) continue;

  failures += missing.length;
  console.error(`\ncheck-adapter-forms: ${adapterPath}`);
  for (const [bound, unbound] of missing) {
    console.error(
      `  binds ${bound} but not ${unbound}, which ${libPath.split('/').pop()} reads.`
    );
  }
  console.error(
    '  A rule reading the unbound form falls back to the library default, so the'
  );
  console.error(
    '  theme moves and that value does not. Bind both, or neither.'
  );
}

if (failures > 0) {
  console.error(
    `\n${failures} unbound companion form(s). Grep the built library for who ` +
      'CONSUMES a variable, never for who declares it.\n'
  );
  process.exit(1);
}

console.log(
  `check-adapter-forms: ok — ${checked} adapter(s), every bound variable's ` +
    'consumed companion form is bound too.'
);

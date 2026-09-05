// scripts/check-token-axis.mjs

// =============================================================================
// CHECK-TOKEN-AXIS — one naming axis per family
// =============================================================================
//
//     node scripts/check-token-axis.mjs [--gate]
//
// A token name can answer one of four different questions, and mixing two of
// them inside a family is what makes a name unanswerable:
//
//   POSITION     which rung?          1, 7, 11
//   RELATION     where in space?      page, surface, sunken, raised
//   PROMINENCE   how loudly?          subtle, muted, strong, emphasis
//   ROLE         what does it do?     action, selected, divider, interactive
//
// The rule: ONE AXIS PER FAMILY, and never two vocabularies inside one.
//
// -----------------------------------------------------------------------------
// THE DIAGNOSTIC THAT PRODUCED THIS
// -----------------------------------------------------------------------------
//
// It came from a question nobody could answer: "which rung is `sunken`?"
//
// `sunken` is RELATION and `subtle` is PROMINENCE. They are not neighbours on
// any scale, so neither of them is "rung 2" and the question has no answer. The
// wall was not missing knowledge, it was a malformed question — and the sign of
// a malformed question is a name that belongs to an axis without rungs.
//
// Worth keeping as a diagnostic in its own right, because it has now happened
// three times: **when nobody can say which rung a token is, the value is almost
// never the problem. The name belongs to an axis that has no rungs.**
//
// -----------------------------------------------------------------------------
// WHY THIS IS A REPORT AND NOT A GATE, FOR NOW
// -----------------------------------------------------------------------------
//
// The findings it produces are real and the fix is a rename of the public
// contract — layer 2 is the one thing every product, every adapter and every
// vendored copy reads. That is a deliberate migration with a changelog entry,
// not something a build should force on the next person who runs it.
//
// It is wired in as `audit:axis`. When the rename lands, it becomes a gate.
// =============================================================================

import { readFileSync } from 'node:fs';

const gate = process.argv.includes('--gate');

const bold = (s) => `[1m${s}[0m`;
const dim = (s) => `[2m${s}[0m`;

// The vocabulary of each axis. Words that could belong to two axes are listed
// under the one this system means by them.
const AXIS_WORDS = {
  relation: ['page', 'surface', 'raised', 'sunken', 'overlay', 'inset', 'base'],
  prominence: ['subtle', 'subtlest', 'strong', 'muted', 'emphasis', 'soft', 'bold'],
  role: [
    'action', 'selected', 'neutral', 'link', 'accent', 'primary', 'brand',
    'divider', 'interactive', 'focus', 'ring', 'disabled', 'heading', 'default',
    'success', 'warning', 'danger', 'info', 'placeholder'
  ]
};

// STATE is not an axis, it is a suffix that any axis can carry: a role can have
// a hover and so can a relation. Stripped before the test rather than counted as
// a third vocabulary in the name.
const STATES = ['hover', 'active', 'visited', 'checked', 'focus-visible'];

// The families layer 2 emits, and the axis each one is DECLARED to speak.
//
// `bg` is deliberately split: surfaces are planes and are named by relation,
// component fills are objects and are named by role. That distinction is the
// one this whole check exists to protect — an object that takes a plane's name
// is how a chip ends up resolving to the same value as the card it sits in.
const FAMILIES = [
  { name: 'surfaces (bg-)', axis: 'relation', match: /^bg-(page|surface|raised|sunken|overlay|inset|base)/ },
  // PROMINENCE SURVIVES IN ONE PLACE, and the status family is it.
  //
  // `bg-danger` beside `bg-danger-subtle` is settled convention across every
  // system worth copying, and the pair has an unambiguous meaning: the solid
  // fill and the quiet one, same role. Flagging it would be the rule eating a
  // case it was never about.
  //
  // The same argument extends to the accent and neutral families, which is why
  // this check does NOT police compound names at all in the end. What it looks
  // for is redundancy — see below.
  { name: 'component fills (bg-)', axis: 'role', match: /^bg-(?!page|surface|raised|sunken|overlay|inset|base)/, allow: ['subtle', 'subtlest', 'strong', 'muted'] },
  { name: 'ink (fg-)', axis: 'prominence', match: /^fg-(?!on-)/, allow: ['heading', 'default', 'link', 'accent', 'action', 'selected', 'disabled', 'success', 'warning', 'danger', 'info', 'primary', 'brand', 'neutral', 'placeholder'] },
  { name: 'borders', axis: 'role', match: /^border-(?!width|style$)/, allow: ['subtle', 'subtlest', 'strong'] }
];

// Read from a PRODUCT build, not from . The foundation build
// emits structure only — no theme means no colour tokens — so pointed there the
// check passed by having nothing to look at, which is the most flattering way a
// guard can fail.
const src = process.argv.find((a) => a.endsWith('.css')) ?? 'example/recepta-monochrome-coreui/ds.css';
const css = readFileSync(src, 'utf8');
const names = new Set();
for (const m of css.matchAll(/--app-([a-z0-9-]+)\s*:/g)) names.add(m[1]);

const rows = [];
for (const fam of FAMILIES) {
  for (const token of [...names].sort()) {
    if (!fam.match.test(token)) continue;

    // Strip the family prefix and any trailing state, then look at what is left.
    let rest = token.replace(/^(bg|fg|border)-/, '');
    for (const st of STATES) rest = rest.replace(new RegExp(`-${st}$`), '');
    const words = rest.split('-').filter(Boolean);

    const foreign = [];
    for (const w of words) {
      if (fam.allow?.includes(w)) continue;
      for (const [axis, list] of Object.entries(AXIS_WORDS)) {
        if (axis === fam.axis) continue;
        if (list.includes(w)) foreign.push({ w, axis });
      }
    }
    if (foreign.length) rows.push({ token, fam, foreign });
  }
}

// A DUPLICATE-BY-VALUE DETECTOR LIVED HERE AND WAS DELETED, which is worth
// recording because the idea sounds better than it turned out to be.
//
// It reported every pair of tokens in one family resolving to the same value, on
// the theory that two names for one decision is the real harm. It found
// thirty-one, and almost all of them were THE SCHOOL WORKING: monochrome
// deliberately collapses info onto the accent, and `$accent-wash: false`
// deliberately routes the accent wash onto the neutral. A collapse a school
// declares is not a duplication, and a guard that cannot tell the two apart
// reports the design as a defect.
//
// What survives is the axis check, which found nothing once the legitimate
// compounds were allowed — and that is itself the answer to the question that
// prompted the whole exercise. Layer 2 is not badly axis-mixed. It has exactly
// one real case, the border family, and one case does not need a general
// checker: it needs deciding.
//
// So this stays as a REGRESSION guard. It is clean today, which is what lets it
// be a gate: it stops the next `bg-page-subtle` or `border-sunken` from being
// added without anyone noticing which axis it came from.

if (!rows.length) {
  console.log('check-token-axis: ok — every family speaks one axis.');
  process.exit(0);
}

console.log(`\n${bold('Two naming axes inside one family')}\n`);
let current = null;
for (const r of rows) {
  if (r.fam.name !== current) {
    current = r.fam.name;
    console.log(`  ${bold(current)} ${dim(`— declared axis: ${r.fam.axis}`)}`);
  }
  const words = r.foreign.map((f) => `"${f.w}" is ${f.axis}`).join(', ');
  console.log(`    --app-${r.token}   ${dim(words)}`);
}

console.log(`
A family that speaks two axes cannot be read by elimination. Someone reaching for
a border picks between \`border-color-subtle\` and \`border-divider\` by which name
looks closest, and the two answer different questions — one says how loud the
line is, the other says what the line is for. Only one of them carries a legal
requirement.

That is not hypothetical. Two adapters in this repository reached for the general
border where the role border was meant, three days apart, and in both cases the
result was a control outlined at a divider's weight — under the 3:1 that WCAG
1.4.11 asks of the boundary identifying a control.

The fix is a rename, and a rename of layer 2 is a migration rather than a
cleanup: it is the one contract every product, every adapter and every vendored
copy reads. Which is why this reports and does not fail.
`);
console.log(bold(`${rows.length} name(s) on a foreign axis.`));
if (gate) process.exit(1);

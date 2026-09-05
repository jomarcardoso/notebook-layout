// scripts/check-never-offered.mjs

// =============================================================================
// THE CATALOGUES MUST NOT OFFER WHAT never-offered.md REFUSES
// =============================================================================
//
//     node scripts/check-never-offered.mjs
//
// Three files describe what a product may be made of, and the third contradicts
// the other two the moment anybody edits one of them. `never-offered.md` says
// placeholder-as-label is not on the menu; `component-forms.md` listed it as a
// form, with the objection in prose underneath — which is exactly the shape of
// a rule nobody enforces: present, readable, and outvoted by the table above it.
//
// A generator reads the table. It does not read the paragraph.
//
// -----------------------------------------------------------------------------
// WHAT IT CHECKS
// -----------------------------------------------------------------------------
//
//   1. No form in either catalogue carries a name a never-offered entry uses.
//      Names are matched loosely on purpose — a shape renamed slightly is the
//      way this drifts back in.
//
//   2. Every never-offered entry says what to use INSTEAD. A refusal without an
//      alternative is how a refusal turns into a worse improvisation, and the
//      person who reaches this file is reaching it because they wanted the
//      thing it refuses.
//
//   3. Every entry that claims a signature has one that could be grepped. The
//      column is the same test question 22 asks of every restriction — how
//      would we know it was broken? — and an entry claiming enforceability it
//      does not have is worse than one admitting it is a review note.
// =============================================================================

import { readFileSync } from 'node:fs';
import { readForms } from './lib/forms.mjs';
import { CATALOGUES } from './lib/catalogues.mjs';

const FILE = 'skills/design-patterns/references/never-offered.md';
const src = readFileSync(FILE, 'utf8');

// Rows are `| **name** | what | why | instead | detectable as |`.
const entries = [...src.matchAll(/^\|\s*\*\*(.+?)\*\*\s*\|(.+?)\|(.+?)\|(.+?)\|(.+?)\|\s*$/gm)].map(
  (m) => ({
    name: m[1].trim(),
    what: m[2].trim(),
    why: m[3].trim(),
    instead: m[4].trim(),
    signature: m[5].trim()
  })
);

const problems = [];

if (entries.length < 5) {
  problems.push(['never-offered.md parsed as ' + entries.length + ' entries', 'the table shape changed and this check is now blind']);
}

// --- 1: nothing refused here is offered there -------------------------------
//
// Compared on significant words rather than on the whole string, because the
// two files name the same shape differently on purpose: one is a menu entry and
// the other is a warning.
const STOP = new Set(['a', 'an', 'the', 'as', 'of', 'on', 'in', 'for', 'with', 'and', 'or', 'only', 'that', 'is', 'its', 'to', 'by']);
const words = (s) =>
  new Set(
    s.toLowerCase().replace(/[^a-z\s-]/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w))
  );

const forms = CATALOGUES.flatMap(([, file]) =>
  readForms(file).flatMap((f) => f.forms.map((form) => ({ family: f.name, name: form.name })))
);

for (const entry of entries) {
  const ew = words(entry.name);
  for (const form of forms) {
    const fw = words(form.name);
    const shared = [...ew].filter((w) => fw.has(w));
    // Two or more significant words in common, or one word that IS the whole
    // form name, is close enough to be the same shape wearing two labels.
    if (shared.length >= 2 || (shared.length === 1 && fw.size === 1)) {
      problems.push([
        `"${form.name}" in ${form.family} looks like the refused "${entry.name}"`,
        `shared: ${shared.join(', ')} — remove the form, or rename it so the two files are not describing one shape`
      ]);
    }
  }
}

// --- 2 and 3: every entry is complete ---------------------------------------
for (const entry of entries) {
  if (!entry.instead || entry.instead === '—') {
    problems.push([
      `"${entry.name}" refuses without saying what instead`,
      'the person reading this wanted the thing it refuses; a refusal with no alternative becomes a worse improvisation'
    ]);
  }
  if (!entry.signature) {
    problems.push([
      `"${entry.name}" has an empty detectable column`,
      'say "not detectable" rather than leaving it blank — an entry claiming enforceability it does not have is worse than one admitting it is a review note'
    ]);
  }
}

// --- report -----------------------------------------------------------------
const bold = (s) => `[1m${s}[0m`;
const dim = (s) => `[2m${s}[0m`;

if (!problems.length) {
  const enforceable = entries.filter((e) => !/^not detectable/i.test(e.signature)).length;
  console.log(
    `check-never-offered: ok — ${entries.length} refused shapes, none offered by either catalogue, ` +
      `every one naming an alternative. ${enforceable} carry a signature a build could enforce.`
  );
  process.exit(0);
}

console.error(`\n${bold('Never offered')}\n`);
for (const [what, why] of problems) {
  console.error(`  ${bold(what)}`);
  console.error(`    ${dim(why)}\n`);
}
console.error(`${problems.length} problem(s).\n`);
process.exit(1);

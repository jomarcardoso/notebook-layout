// scripts/check-forms-reachable.mjs

// =============================================================================
// CAN THE ANSWERS REACH EVERY FORM, AND DOES EVERY FAMILY HAVE ONE?
// =============================================================================
//
//     node scripts/check-forms-reachable.mjs
//
// The two catalogues state a rule they have no way to keep — *every form must be
// reachable if the answers lead there* — and no way at all to ask the more
// expensive question in the other direction.
//
// -----------------------------------------------------------------------------
// THE TWO CHECKS, AND WHY THE SECOND ONE MATTERS MORE
// -----------------------------------------------------------------------------
//
//   1. UNREACHABLE FORM — a form whose conditions contradict each other, or
//      whose `avoid` cancels its own `fits`. It is in the catalogue and no
//      interview can ever produce it. Dead vocabulary: cheap to write, and it
//      makes the file look richer than it is.
//
//   2. EMPTY FAMILY — a combination of answers for which some family has NO
//      fitting form. This is the one that costs something. A generator reaching
//      a family with nothing to propose does not stop; it takes what the
//      component library ships, because a library default is the only concrete
//      thing available. That is the exact failure the 0.8.0 release was written
//      against, and nothing could see it until this.
//
// -----------------------------------------------------------------------------
// WHAT IT DOES NOT CHECK
// -----------------------------------------------------------------------------
//
// Whether a form is a GOOD answer for those conditions. That is judgement and
// it belongs to review. This checks that the catalogue has an answer at all.
//
// Content conditions — "a count, read-only", "few large options" — are always
// satisfiable, because they are the half the interview cannot decide either
// way. A family whose only forms are content-conditioned is therefore never
// empty, and that is correct: whoever builds the screen supplies that half.
// =============================================================================

import { AXES, readForms } from './lib/forms.mjs';
import { buildAxes, coverFamily, describeHoles } from './lib/coverage.mjs';
import { CATALOGUES, AXIS_SHAPED, COHERENT } from './lib/catalogues.mjs';

export const loadFamilies = () =>
  CATALOGUES.flatMap(([kind, file]) => readForms(file).map((f) => ({ ...f, kind })));

const families = loadFamilies().filter((f) => !AXIS_SHAPED.has(f.name));
const axes = buildAxes(families, AXES);

const problems = [];
let formCount = 0;
let biggest = 0;

for (const family of families) {
  // Every family declares whether it legitimately carries more than one
  // treatment. Silence is not "one" — it is a family nobody thought about, and
  // the accretion this rule exists to catch happens exactly there. Nobody
  // decides to have two primary buttons; a second one arrives on a page
  // somebody built in a hurry. See derivations.md section U.
  if (!family.multiplicity) {
    problems.push([
      family.name + " does not say how many treatments it may have",
      "add \"**One per product.**\" or \"**Several — <why>**\" under the heading"
    ]);
  }

  const { local, total, fitting, holes } = coverFamily(family, axes, COHERENT);
  biggest = Math.max(biggest, total);

  for (const form of family.forms) {
    formCount++;
    if (!fitting.get(form.name)) {
      problems.push([
        `${family.name} — "${form.name}" is unreachable`,
        'no combination of answers satisfies its conditions without triggering its own "avoid"'
      ]);
    }
  }

  if (holes.count) {
    problems.push([
      `${family.name} has no fitting form`,
      `${holes.count} of ${total} combinations of the ${local.length} answers it reads — ` +
        describeHoles(local, holes.seen)
    ]);
  }
}

// --- report -----------------------------------------------------------------
const bold = (s) => `[1m${s}[0m`;
const dim = (s) => `[2m${s}[0m`;

if (!problems.length) {
  const byKind = (k) => families.filter((f) => f.kind === k).length;
  console.log(
    `check-forms-reachable: ok — ${formCount} forms in ${byKind('component')} component ` +
      `and ${byKind('layout')} layout families, every one reachable, none empty. ` +
      `Each family searched over the answers it reads, up to ${biggest} combinations. ` +
      `${[...AXIS_SHAPED].join(', ')} skipped: axis matrix, not a form table.`
  );
  process.exit(0);
}

console.error(`\n${bold('Form coverage')}\n`);
for (const [what, why] of problems) {
  console.error(`  ${bold(what)}`);
  console.error(`    ${dim(why)}\n`);
}
console.error(`${problems.length} problem(s).\n`);
process.exit(1);

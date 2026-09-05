// scripts/check-forms-exclusive.mjs

// =============================================================================
// WHEN TWO FORMS COEXIST, SOMETHING HAS TO SAY WHICH ONE TO REACH FOR
// =============================================================================
//
//     node scripts/check-forms-exclusive.mjs
//
// `multiplicity` says how many treatments a family may have. It does not say
// WHICH forms can stand beside each other, and that is the question a person
// building a screen actually has:
//
//   > I have a product where three card forms all fit. Which do I use here?
//
// Two forms in one family are in one of three states, and every pair must be in
// a state the catalogue has named:
//
//   EXCLUDED    a `**Never both:**` line says they cannot coexist. Choosing one
//               rules out the other for this product — two metaphors, one
//               product, and it would read as two products.
//
//   SEPARATED   they coexist, and each carries a CONTENT condition saying when
//               it applies: "a count, read-only" against "filters the user
//               applied". A person can tell which they are holding.
//
//   AMBIGUOUS   they coexist and nothing distinguishes them. This is the bug.
//               The catalogue offers two shapes for the same situation and
//               whoever is building picks by taste — which is the failure this
//               whole release is about, arriving one level lower down.
//
// -----------------------------------------------------------------------------
// WHY ANSWER CONDITIONS DO NOT COUNT AS SEPARATION
// -----------------------------------------------------------------------------
//
// Two forms both fitting `quiet` are not separated by `quiet`. The answers are
// fixed for the whole product, so if both fit, both fit everywhere and every
// time — the answer half cannot break a tie it did not create. Only the content
// half can, because only it varies from screen to screen.
// =============================================================================

import { readForms, AXES } from './lib/forms.mjs';
import { buildAxes, coverFamily } from './lib/coverage.mjs';
import { CATALOGUES, AXIS_SHAPED, COHERENT } from './lib/catalogues.mjs';

const families = CATALOGUES.flatMap(([kind, file]) =>
  readForms(file).map((f) => ({ ...f, kind }))
).filter((f) => !AXIS_SHAPED.has(f.name));

const axes = buildAxes(families, AXES);

const problems = [];
let pairs = 0;
let excluded = 0;
let separated = 0;

for (const family of families) {
  const { local, fitting } = coverFamily(family, axes, COHERENT);

  // Two forms can only clash where both actually fit. Rather than intersect
  // their condition sets symbolically, re-walk the family's own small space and
  // record which pairs are ever live together — exact, and the space is tiny.
  const live = new Set();
  const names = family.forms.map((f) => f.name);
  const { overlaps } = coOccurrence(family, local);
  for (const key of overlaps) live.add(key);

  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const a = names[i];
      const b = names[j];
      if (!live.has(`${i}|${j}`)) continue;
      pairs++;

      if (isExcluded(family, a, b)) {
        excluded++;
        continue;
      }

      const ca = family.forms[i].fits.content.length + family.forms[i].avoid.content.length;
      const cb = family.forms[j].fits.content.length + family.forms[j].avoid.content.length;
      if (ca && cb) {
        separated++;
        continue;
      }

      problems.push([
        `${family.name}: "${a}" and "${b}" both fit and nothing says which`,
        (ca || cb
          ? 'one of them names the content it needs and the other does not'
          : 'neither names the content it needs') +
          ' — add a `**Never both:**` line, or give each a content condition'
      ]);
    }
  }
  void fitting;
}

/** Does a `**Never both:**` line cover this pair? */
function isExcluded(family, a, b) {
  for (const [x, y] of family.excludes ?? []) {
    if ((x === a && y === b) || (x === b && y === a)) return true;
  }
  return false;
}

/** Which pairs of forms are ever live in the same combination. */
function coOccurrence(family, local) {
  const overlaps = new Set();
  const idx = new Map(local.map((a, i) => [a.key, i]));

  const compile = (cond) =>
    cond.all
      .map((alts) =>
        alts
          .map((s) => {
            const [k, v] = s.split('=');
            const ai = idx.get(k);
            return ai === undefined ? null : [ai, local[ai].values.indexOf(v)];
          })
          .filter((p) => p && p[1] >= 0)
      )
      .filter((p) => p.length);

  const forms = family.forms.map((f) => ({
    fits: compile(f.fits),
    avoid: compile(f.avoid)
  }));

  const combo = new Int16Array(local.length);
  const holds = (c) => c.every((alts) => alts.some(([ai, vi]) => combo[ai] === vi));

  const only = (family.only ?? [])
    .map((v) => {
      for (const [i, ax] of local.entries()) {
        const vi = ax.values.indexOf(v);
        if (vi >= 0) return [i, vi];
      }
      return null;
    })
    .filter(Boolean);

  const named = {};
  const keys = local.map((a) => a.key);
  const rules = COHERENT.filter((r) => r.reads.every((k) => keys.includes(k)));

  const rec = (i) => {
    if (i === local.length) {
      if (only.length && !only.some(([ai, vi]) => combo[ai] === vi)) return;
      for (let k = 0; k < local.length; k++) named[keys[k]] = local[k].values[combo[k]];
      if (!rules.every((r) => r.test(named))) return;

      const on = [];
      forms.forEach((f, n) => {
        if (!holds(f.fits)) return;
        if (f.avoid.length && holds(f.avoid)) return;
        on.push(n);
      });
      for (let x = 0; x < on.length; x++)
        for (let y = x + 1; y < on.length; y++) overlaps.add(`${on[x]}|${on[y]}`);
      return;
    }
    for (let v = 0; v < local[i].values.length; v++) {
      combo[i] = v;
      rec(i + 1);
    }
  };
  rec(0);
  return { overlaps };
}

// --- report -----------------------------------------------------------------
const bold = (s) => `[1m${s}[0m`;
const dim = (s) => `[2m${s}[0m`;

if (!problems.length) {
  console.log(
    `check-forms-exclusive: ok — ${pairs} co-occurring form pairs, ` +
      `${excluded} ruled out by a "Never both" line, ${separated} separated by content.`
  );
  process.exit(0);
}

console.error(`\n${bold('Ambiguous forms')} ${dim(`— ${pairs} co-occurring pairs`)}\n`);
for (const [what, why] of problems) {
  console.error(`  ${bold(what)}`);
  console.error(`    ${dim(why)}\n`);
}

console.error(`${problems.length} ambiguous pair(s) of ${pairs}.\n`);
process.exit(1);

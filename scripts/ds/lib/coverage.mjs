// scripts/lib/coverage.mjs

// =============================================================================
// WALKING THE ANSWER SPACE, ONE FAMILY AT A TIME
// =============================================================================
//
// Shared by `check-forms-reachable` and `docs-forms-map`, which ask the same
// question and differ only in what they do with the answer.
//
// -----------------------------------------------------------------------------
// WHY IT IS PER-FAMILY, WHICH IS THE WHOLE TRICK
// -----------------------------------------------------------------------------
//
// The obvious implementation enumerates every combination of every answer and
// tests every family against each. Over the component catalogue alone that was
// 8,640 combinations and finished instantly. Adding the layout catalogue
// brought four more axes, the product reached **18.9 million**, and the run
// stopped finishing at all.
//
// Optimising the loop was the wrong instinct, and it is worth writing down why:
// the product was never the right space to search. **Whether a family has a
// fitting form depends only on the axes its own forms mention.** A family whose
// conditions name `posture` and `colourStrategy` cannot be made empty by the
// frame, the dwell or the imagery — those axes are free, and enumerating them
// is asking the same question nine thousand times.
//
// So each family gets its own local space, usually a few dozen combinations.
// The result is exact rather than sampled: nothing is skipped, the irrelevant
// dimensions are simply not multiplied out.
//
// COHERENCE RULES apply only when every axis they read is in the local set. A
// rule pairing elevation with separation says nothing useful to a family that
// mentions one and not the other — all three separations are reachable under
// some elevation, so leaving the rule out keeps every genuinely reachable
// combination and invents none.
// =============================================================================

/** Every axis any condition mentions, with the values it can take. */
export function buildAxes(families, AXES) {
  const referenced = new Map();
  for (const f of families)
    for (const form of f.forms)
      for (const cond of [form.fits, form.avoid])
        for (const alts of cond.all)
          for (const a of alts) {
            const [k, v] = a.split('=');
            if (!referenced.has(k)) referenced.set(k, new Set());
            referenced.get(k).add(v);
          }

  // An axis needs an "anything else" member only when the catalogues do NOT
  // name every value it can take. Otherwise that member is a combination no
  // interview can produce, and every family looks empty in it — a checker
  // manufacturing its own bugs. On the first run it buried four real holes
  // under fourteen thousand phantom ones.
  return [...referenced.entries()].map(([key, vs]) => {
    const known = AXES[key] ?? [];
    const namesAll = known.length > 0 && known.every((v) => vs.has(v));
    return { key, values: namesAll ? [...vs] : [...vs, `other:${key}`] };
  });
}

/** Which axes one family's forms actually depend on. */
export function familyAxes(family, axes) {
  const used = new Set();
  for (const form of family.forms)
    for (const cond of [form.fits, form.avoid])
      for (const alts of cond.all) for (const a of alts) used.add(a.split('=')[0]);
  return axes.filter((a) => used.has(a.key));
}

/** Compile a parsed condition against a LOCAL axis list. */
function compile(cond, local) {
  const index = new Map(local.map((a, i) => [a.key, i]));
  const out = [];
  for (const alts of cond.all) {
    const pairs = [];
    for (const a of alts) {
      const [k, v] = a.split('=');
      const ai = index.get(k);
      if (ai === undefined) continue;
      const vi = local[ai].values.indexOf(v);
      if (vi >= 0) pairs.push([ai, vi]);
    }
    if (pairs.length) out.push(pairs);
  }
  return out;
}

const holds = (cond, combo) => cond.every((alts) => alts.some(([ai, vi]) => combo[ai] === vi));

/**
 * Walk one family's own answer space.
 *
 * `onCombo(combo, forms)` receives the SAME array each call — read it, never
 * keep it. Returns `{ total, fitting }` where `fitting` counts, per form, how
 * many local combinations reach it.
 */
export function coverFamily(family, axes, coherent) {
  const local = familyAxes(family, axes);
  const keys = local.map((a) => a.key);
  const forms = family.forms.map((form) => ({
    ...form,
    fitsC: compile(form.fits, local),
    avoidC: compile(form.avoid, local)
  }));

  // Only the rules whose every axis is present here; see the header.
  const rules = coherent.filter((r) => (r.reads ?? []).every((k) => keys.includes(k)));

  const combo = new Int16Array(local.length);
  const named = {};
  const fitting = new Map(forms.map((f) => [f.name, 0]));
  const holes = { count: 0, seen: local.map(() => new Set()) };
  let total = 0;

  // A family may declare itself CONDITIONAL — an aside is not a shape a
  // single-column page can take. Combinations outside the precondition are not
  // counted at all, rather than counted as holes: reporting them would say the
  // catalogue is missing an aside for products that correctly have none, and a
  // report full of that teaches its reader to skip it.
  const only = (family.only ?? []).map((v) => {
    for (const [i, ax] of local.entries()) {
      const vi = ax.values.indexOf(v);
      if (vi >= 0) return [i, vi];
    }
    return null;
  }).filter(Boolean);

  const rec = (i) => {
    if (i === local.length) {
      if (only.length && !only.some(([ai, vi]) => combo[ai] === vi)) return;
      for (let k = 0; k < local.length; k++) named[keys[k]] = local[k].values[combo[k]];
      if (!rules.every((r) => r.test(named))) return;
      total++;

      let any = false;
      for (const form of forms) {
        if (!holds(form.fitsC, combo)) continue;
        if (form.avoidC.length && holds(form.avoidC, combo)) continue;
        any = true;
        fitting.set(form.name, fitting.get(form.name) + 1);
      }
      if (!any) {
        holes.count++;
        for (let k = 0; k < local.length; k++) holes.seen[k].add(combo[k]);
      }
      return;
    }
    for (let v = 0; v < local[i].values.length; v++) {
      combo[i] = v;
      rec(i + 1);
    }
  };
  rec(0);

  return { local, total, fitting, holes };
}

/** Render the smallest description shared by every hole in a family. */
export function describeHoles(local, seen) {
  const shared = [];
  seen.forEach((vs, i) => {
    if (vs.size !== 1) return;
    const v = local[i].values[[...vs][0]];
    if (!String(v).startsWith('other:')) shared.push(`${local[i].key}=${v}`);
  });
  return shared.length ? shared.join(' and ') : 'any combination';
}

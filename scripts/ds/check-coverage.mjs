// scripts/check-coverage.mjs

// =============================================================================
// CHECK-COVERAGE — every class the ledger allows exists in the compiled CSS
// =============================================================================
//
//     node scripts/check-coverage.mjs <product-dir> --library dist/coreui.css
//
// `verify:patterns` asks one direction: does the markup use a class the ledger
// does not allow? This asks the other: does the ledger allow a class the build
// does not produce?
//
// THAT DIRECTION HAS NO SYMPTOM. If `$theme-colors` loses `warning`, the
// library does not warn — `.btn-warning` simply stops existing, and the markup
// renders a base `.btn`, grey, silently. Same for a component the entry stopped
// importing. The page still loads, the checks still pass, and the button is
// just wrong.
//
// This is the guard that makes pruning safe. Prune `$theme-colors`, prune the
// adapter's role map, prune the component imports — and this fails the build the
// moment the pruning takes something the ledger still promises. Without it,
// every byte saved is bought with a silent failure mode, which inverts the
// order of priorities the project actually holds: the design system being right
// comes before the bundle being small.
// =============================================================================

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
const libFlag = process.argv.indexOf('--library');
const libPath = libFlag > -1 ? process.argv[libFlag + 1] : 'dist/coreui.css';

if (!dir || !existsSync(join(dir, 'patterns.json'))) {
  console.error('check-coverage: pass a product directory holding patterns.json');
  process.exit(1);
}

// Everything the built CSS defines. The product's own stylesheets count too:
// a pattern in the `own` state is the product's class and lives in `app.css`.
const sources = [libPath, join(dir, 'ds.css'), join(dir, 'app.css')].filter((p) => existsSync(p));
const defined = new Set();
for (const p of sources) {
  const css = readFileSync(p, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of css.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) defined.add(m[1]);
}

const ledger = JSON.parse(readFileSync(join(dir, 'patterns.json'), 'utf8'));

const missing = [];
let checked = 0;
for (const [fam, c] of Object.entries(ledger.components ?? {})) {
  for (const [name, p] of Object.entries(c.patterns ?? {})) {
    // A forbidden pattern is a refusal. Its classes SHOULD be absent, and
    // demanding they exist would be asking the build to ship what the ledger
    // exists to keep out.
    if (p.state === 'forbidden') continue;

    const groups = [];
    if (p.raw) for (const [lib, cls] of Object.entries(p.raw)) groups.push([`raw.${lib}`, cls]);
    if (p.styled) groups.push(['styled', p.styled.trim().split(/\s+/)]);

    for (const [where, cls] of groups) {
      for (const cl of cls) {
        checked++;
        if (!defined.has(cl)) missing.push({ id: `${fam}/${name}`, where, cl, state: p.state });
      }
    }

    // A modifier the ledger offers is a promise too — `btn-sm` missing is a
    // dense row that silently renders at full height.
    for (const mod of Object.values(c.modifiers ?? {})) {
      for (const opt of Object.values(mod.options ?? {})) {
        for (const cls of Object.values(opt.libraries ?? {})) {
          for (const cl of cls) {
            checked++;
            if (!defined.has(cl)) missing.push({ id: `${fam}/${name}`, where: 'modifier', cl, state: p.state });
          }
        }
      }
    }
  }
}

const bold = (s) => `[1m${s}[0m`;
const dim = (s) => `[2m${s}[0m`;

if (!missing.length) {
  console.log(
    `check-coverage: ok — ${checked} class references across ${sources.length} stylesheet(s), ` +
      'every one defined.'
  );
  process.exit(0);
}

const seen = new Set();
console.log(`\n${bold('The ledger promises a class the build does not define')} ${dim(`— ${dir}`)}\n`);
for (const m of missing) {
  const key = `${m.id}:${m.cl}`;
  if (seen.has(key)) continue;
  seen.add(key);
  console.log(`  ${bold(`.${m.cl}`)}  ${dim(`${m.id} — ${m.where}, state "${m.state}"`)}`);
}
console.log(`
This is the failure mode that has no symptom on the page. The library does not
error on a variant it was not asked to generate; the class simply does not
exist, the markup falls back to the base component, and it looks plausible.

Two ways out, and the choice is a design decision rather than a build one:

  - the product DOES use it, so the build has to generate it again: put the
    role back in the theme-colour list, or the component back in the import.
  - the product does NOT use it, so the ledger should say so: change the
    pattern to \`forbidden\` with a \`reason\` and an \`instead\`. Removing a
    variant is a vocabulary decision and belongs in the ledger, not in a
    build-size tweak.
`);
console.log(bold(`${seen.size} missing class(es).`));
process.exit(1);

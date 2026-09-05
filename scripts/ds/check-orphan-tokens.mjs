// scripts/check-orphan-tokens.mjs

// =============================================================================
// WHICH TOKENS NOTHING READS — A REPORT, NOT A GATE
// =============================================================================
//
//     node scripts/check-orphan-tokens.mjs example/<product>
//
// Layer 2 is a public contract, so a token nobody uses YET is legitimate and
// this never fails a build. The client asked for it in exactly those terms:
//
//   > não precisa todos os tokens serem usados, mas temos que ter um relatório
//   > do que ficou de fora para verificar se não é por erro
//
// That is the right shape. An orphan is a QUESTION — is this a rung nobody
// implemented, or a name waiting for its first consumer? — and only a person
// can answer it. What the tool owes is the list.
//
// -----------------------------------------------------------------------------
// WHY THE LIST IS WORTH HAVING
// -----------------------------------------------------------------------------
//
// The monochrome school runs on a twelve-rung ladder where each rung has a job,
// and the failure mode is skipping one. **Rung 3 — the resting fill under every
// badge, chip, tag and secondary button — is the most forgotten of all**, and a
// system that skips it is the one that looks technically monochrome and
// generically Bootstrap. That skip is invisible to every other check in this
// repository: the token exists, the contract promises it, the contrast audit
// measures it, and nothing on any screen reads it.
//
// `check-dangling-refs` asks the opposite question — a reference with no
// declaration. This asks: a declaration with no reference.
// =============================================================================

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
if (!dir || !existsSync(join(dir, 'ds.css'))) {
  console.error('check-orphan-tokens: pass a product directory holding ds.css');
  process.exit(1);
}

// Tokens whose consumer is legitimately elsewhere, or which exist to be read by
// a person rather than by CSS. Listed rather than inferred, so that a token
// added here and forgotten is reported instead of quietly excused.
const EXPECTED_UNREAD = new Map(
  Object.entries({
    'z-base': 'the floor of the layering scale; a product sets it and rarely names it',
    'opacity-disabled': 'read by whichever library styles :disabled, which may compile it away',
    'ratio-thumb': 'square by construction; a product with no avatars never names it'
  })
);

const declared = new Map();
const css = readFileSync(join(dir, 'ds.css'), 'utf8');

for (const m of css.matchAll(/(--app-[a-z0-9-]+)\s*:/g)) {
  declared.set(m[1], (declared.get(m[1]) ?? 0) + 1);
}

// Everything that could READ a token: the adapter's own output, the product's
// stylesheets, and the markup. The declarations themselves do not count as
// reads, so a token defined in terms of another is not a consumer of it — a
// chain that ends inside the contract has still not reached a screen.
const readers = readdirSync(dir)
  .filter((f) => /\.(css|html|scss)$/.test(f))
  .map((f) => readFileSync(join(dir, f), 'utf8'))
  .join('\n');

const used = new Set();
for (const m of readers.matchAll(/var\(\s*(--app-[a-z0-9-]+)/g)) used.add(m[1]);
// A Sass product reads layer 2 through `core.ref('bg-page')` as well.
for (const m of readers.matchAll(/core\.ref\(\s*['"]?([a-z0-9-]+)/g)) used.add(`--app-${m[1]}`);

const orphans = [...declared.keys()].filter((t) => !used.has(t)).sort();

// --- group, because a flat list of ninety names is not a report --------------
const GROUPS = [
  ['the ladder', /^--app-bg-(page|surface|raised|sunken|overlay)/],
  ['quiet fills — the rungs a generic build skips', /^--app-bg-[a-z]+-subtle/],
  ['interactive fills and their states', /^--app-bg-.*(hover|active)/],
  ['ink', /^--app-fg-/],
  ['other fills', /^--app-bg-/],
  ['lines', /^--app-border/],
  ['focus', /^--app-ring/],
  ['shape and proportion', /^--app-(radius|ratio)/],
  ['space and size', /^--app-(space|pad|gap|size)/],
  ['type', /^--app-(font|line-height|letter)/],
  ['motion', /^--app-(duration|ease)/],
  ['depth and layering', /^--app-(shadow|z)/]
];

const grouped = new Map(GROUPS.map(([name]) => [name, []]));
const rest = [];
for (const t of orphans) {
  const g = GROUPS.find(([, re]) => re.test(t));
  (g ? grouped.get(g[0]) : rest).push(t);
}

// --- report ------------------------------------------------------------------
const bold = (s) => `[1m${s}[0m`;
const dim = (s) => `[2m${s}[0m`;

const total = declared.size;
const pct = Math.round((orphans.length / total) * 100);

console.log(
  `\n${bold('Tokens nothing reads')} ${dim(`— ${dir}`)}\n\n` +
    `  ${orphans.length} of ${total} declared tokens (${pct}%) are never read by this ` +
    `product's CSS, markup or theme.\n\n` +
    dim('  This is a report and never a failure. Layer 2 is a public contract, so a\n') +
    dim('  token with no consumer yet is legitimate. What matters is reading the list:\n') +
    dim('  an orphan is either a name waiting for its first use, or a RUNG NOBODY\n') +
    dim('  IMPLEMENTED — and rung 3, the resting fill under every badge, chip and\n') +
    dim('  secondary button, is the one most often skipped. A system that skips it\n') +
    dim('  looks technically monochrome and generically like its library.\n')
);

for (const [name, list] of grouped) {
  if (!list.length) continue;
  console.log(`  ${bold(name)}`);
  for (const t of list) {
    const note = EXPECTED_UNREAD.get(t.replace('--app-', ''));
    console.log(`    ${t}${note ? dim('  — ' + note) : ''}`);
  }
  console.log('');
}
if (rest.length) {
  console.log(`  ${bold('everything else')}`);
  for (const t of rest) console.log(`    ${t}`);
  console.log('');
}

if (!orphans.length) console.log(`  ${dim('Nothing. Every declared token has a consumer.')}\n`);
process.exit(0);

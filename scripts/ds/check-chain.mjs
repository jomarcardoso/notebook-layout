// scripts/check-chain.mjs

// =============================================================================
// THE CHAIN — answer → derivation → token → pattern → markup
// =============================================================================
//
//     node scripts/check-chain.mjs example/<product>
//
// Walks one product's artefacts in order and reports where the chain BREAKS.
// Not whether the design is good — whether each layer still refers to the one
// before it.
//
// -----------------------------------------------------------------------------
// WHY A SCRIPT AND NOT A DOCUMENT
// -----------------------------------------------------------------------------
//
// The four files of a finished product agree with each other on the day they
// are written and drift afterwards, one edit at a time: an answer changes and
// the derivation is not regenerated; a token is renamed and `DERIVED.md` keeps
// citing the old name; a pattern is promoted to `own` and the class it names is
// never written. Every one of those is invisible to `npm run verify`, which
// checks that the BUILD is well-formed and has no idea the documents exist.
//
// What this cannot check is the interesting half — whether a derivation is the
// RIGHT derivation for an answer. That is judgement, and it belongs to
// `references/review.md`. This checks the mechanical half: that nothing in the
// chain points at something that is no longer there.
//
// -----------------------------------------------------------------------------
// THE FOUR LINKS
// -----------------------------------------------------------------------------
//
//   1. every ANSWER produced something          front matter → DERIVED.md
//   2. every DERIVATION names a real token      DERIVED.md   → ds.css
//   3. every COMPOSITION binding resolves       patterns.json → ds.css
//   4. every promoted PATTERN has its class     patterns.json → the product CSS
// =============================================================================

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { keys as frontMatterKeys } from './lib/frontmatter.mjs';

const dir = process.argv[2];
if (!dir || !existsSync(dir)) {
  console.error('check-chain: pass a product directory.\n  node scripts/check-chain.mjs example/<product>');
  process.exit(1);
}

const read = (f) => (existsSync(join(dir, f)) ? readFileSync(join(dir, f), 'utf8') : null);

const language = read('DESIGN_LANGUAGE.md');
const derived = read('DERIVED.md');
const ledgerRaw = read('patterns.json');
const css = read('ds.css');

const missing = ['DESIGN_LANGUAGE.md', 'DERIVED.md', 'patterns.json', 'ds.css'].filter(
  (f, i) => ![language, derived, ledgerRaw, css][i]
);
if (missing.length) {
  console.error(`check-chain: ${dir} is missing ${missing.join(', ')}.`);
  process.exit(1);
}

const problems = [];

// --- link 1: every answer produced something --------------------------------
//
// Keys the interview collects that legitimately derive NOTHING visual. Listed
// rather than inferred, so adding a key to the front matter and forgetting to
// derive from it is reported instead of silently tolerated.
const INERT = new Set([
  'toolVersion', 'archetype', 'archetypeNote', 'platform', 'accessibility',
  'voice', 'voiceExceptions', 'ctaMood', 'deviations', 'overrides',
  'guardrails', 'resolutions', 'elevationCarrier',
  // Block 2 collects these to DERIVE from; they name no token of their own.
  // They are listed rather than inferred, so that adding a key and forgetting
  // to derive from it is still reported.
  'dwell', 'protagonist', 'colorCriticalWorkspace'
]);

// Parsed properly rather than by splitting on the first `---`, which the
// template's own banner comments contain. That read 28 of this document's 39
// keys and reported "continuous" the whole time — see lib/frontmatter.mjs.
const keys = frontMatterKeys(language);

for (const key of keys) {
  if (INERT.has(key)) continue;
  if (!derived.includes(key)) {
    problems.push([
      `${key} is answered and never derived from`,
      'DESIGN_LANGUAGE.md → DERIVED.md',
      'An answer that produced nothing is either inert — and belongs in the ' +
        'inert list in this script — or the derivation forgot it.'
    ]);
  }
}

// --- link 2 and 3: every named token exists ---------------------------------
const declared = new Set([...css.matchAll(/(--[a-z]+-[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
const prefix = [...declared][0]?.match(/^(--[a-z]+)-/)?.[1] ?? '--app';

const checkTokens = (text, where, label) => {
  for (const m of text.matchAll(/`(--[a-z]+-[a-z0-9-]+)`/g)) {
    if (!declared.has(m[1])) {
      problems.push([`${m[1]} is named but never emitted`, where, label]);
    }
  }
};

checkTokens(derived, 'DERIVED.md → ds.css', 'A derivation citing a token the build does not produce.');

const ledger = JSON.parse(ledgerRaw);
const comp = ledger.composition ?? {};
const bare = [
  ...Object.values(comp.typeRoles ?? {}),
  ...Object.values(comp.rhythm ?? {}),
  ...(comp.surfaces ?? [])
].join(' ');

for (const name of bare.split(/\s+/).filter(Boolean)) {
  if (!declared.has(`${prefix}-${name}`)) {
    problems.push([
      `composition names "${name}", which is not a token`,
      'patterns.json → ds.css',
      'A composition binding the build cannot resolve. Ad-hoc screens read this block.'
    ]);
  }
}

// --- link 4: a promoted pattern has its class -------------------------------
//
// Read from every stylesheet in the product rather than only `ds.css`, because
// a promoted pattern's class is product CSS and belongs in the app entry.
const styles = readdirSync(dir)
  .filter((f) => f.endsWith('.css'))
  .map((f) => readFileSync(join(dir, f), 'utf8'))
  .join('\n');

for (const [cname, c] of Object.entries(ledger.components)) {
  for (const [pname, p] of Object.entries(c.patterns)) {
    if (p.state !== 'styled' && p.state !== 'own') continue;
    if (!p.styled) {
      problems.push([
        `${cname}/${pname} is ${p.state} with no class named`,
        'patterns.json',
        'The state promises a class of this product\'s own and does not say which.'
      ]);
      continue;
    }
    if (!styles.includes(`.${p.styled}`)) {
      problems.push([
        `${cname}/${pname} promises .${p.styled}, which no stylesheet defines`,
        'patterns.json → the product CSS',
        'A promotion the ledger records and the code never received.'
      ]);
    }
  }
}

// --- report -----------------------------------------------------------------
const bold = (s) => `[1m${s}[0m`;
const dim = (s) => `[2m${s}[0m`;

console.log(`\n${bold('Chain check')} ${dim(`— ${dir}`)}`);

if (problems.length === 0) {
  const planned = Object.values(ledger.components)
    .flatMap((c) => Object.values(c.patterns))
    .filter((p) => p.trajectory).length;
  console.log(
    `\n  Continuous. ${keys.length} answers, ${declared.size} tokens, ` +
      `${Object.keys(ledger.components).length} components, ${planned} planned promotion(s).\n`
  );
  process.exit(0);
}

for (const [what, where, why] of problems) {
  console.error(`\n  ${bold(what)}`);
  console.error(`    ${dim(where)}`);
  console.error(`    ${why}`);
}
console.error(`\n${problems.length} break(s) in the chain.\n`);
process.exit(1);

// scripts/check-dumb-components.mjs

// =============================================================================
// DUMB COMPONENT GUARD — a product's own components must read layer 3
// =============================================================================
//
//     node scripts/check-dumb-components.mjs <dir> [more dirs …]
//
// `check-layer3-bypass` asks the same question of ADAPTERS, and recognises a
// binding by the LIBRARY variable being assigned (`--cui-btn-bg`, `--bs-*`). It
// therefore had, by construction, nothing to say about a product styling its
// own components — and its name did not advertise that limit. A product can
// route every adapter through layer 3, pass that check, and still have every
// one of its own components reading layer 2 directly.
//
// Which is what happened here. First measured at "212 layer-2 reads against 18
// layer-3 reads, green build" — and that first number was wrong in an
// instructive way. Classifying the reads properly gives three populations:
//
//     108  genuine layer-2 bypass          the defect this guard is for
//      95  the product's OWN layer 3       custom properties from its theme
//      18  the contract's layer 3          Sass variables, the target shape
//
// So the components were never as dumb as intended, and never as broken as the
// raw grep implied. Half of them do go through a layer 3 — just a second one,
// with a vocabulary that does not line up with the contract's.
//
// -----------------------------------------------------------------------------
// WHY IT MATTERS MORE THAN IT SOUNDS
// -----------------------------------------------------------------------------
//
// Reading layer 2 from a component is not a style violation, it is a broken
// promise. Layer 3 declares `$avatar-size` and `$avatar-radius`; the component
// rendered `height: 80px` and `border-radius: var(--app-radius-surface)`. Both
// tokens existed, both were documented, and setting either changed nothing on
// screen. A knob that does nothing is worse than a missing knob, because after
// finding one, nobody trusts the other 186.
//
// The second cost is the one the architecture was designed around: a component
// that reads layer 2 cannot diverge. Making one card darker means changing
// `--app-bg-surface`, which moves every surface in the product. Layer 3 is the
// place where one component's anatomy is stated without touching the theme.
//
// -----------------------------------------------------------------------------
// THE RULE
// -----------------------------------------------------------------------------
//
//     .avatar {
//       background-color: component.$avatar-bg;    /* layer 3 → layer 2 */
//       height: component.$avatar-size;
//     }
//
// Layer 2 is read by exactly three kinds of file, and none of them is a
// component: layer 3 itself (`_component.scss`), the theme (which ASSIGNS
// layer 2), and adapters. Those are excluded by path.
//
// Motion is exempt. `--app-duration-base` and `--app-ease` are the product's
// rhythm rather than a component's anatomy — a component wanting its own
// easing is a real thing, but making every transition mint a token would bury
// the layer in entries nobody will ever set.
// =============================================================================

import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const args = process.argv.slice(2);
const dirs = args.filter((a) => !a.startsWith('--'));
if (dirs.length === 0) {
  console.error('usage: check-dumb-components.mjs <dir> [more …] [--allow=n]');
  process.exit(2);
}

// A budget, so the guard can be wired into the build DURING a migration that
// is too large to land in one commit. It ratchets: lower it as files land, and
// it can never silently drift upward, because exceeding it fails.
const allowArg = args.find((a) => a.startsWith('--allow='));
const allow = allowArg ? Number(allowArg.slice('--allow='.length)) : 0;

// The layer 3 vocabulary, read from the contract itself.
//
// This distinction matters, and getting it wrong produced a wrong number
// before it was made: a component reading `var(--app-field-border-radius)` is
// NOT bypassing layer 3. It is reading layer 3 through the mechanism layer 3
// used to have — a custom property — from before the layer became Sass
// `!default` variables. Same destination, obsolete road.
//
// Reported separately, because folding it into the bypass count both inflates
// the number and sends someone to rewrite a line that already honours the
// contract.
const contract = new Set();
try {
  const src = readFileSync(
    process.env.DS_CONTRACT || 'styles/ds/src/_component.scss',
    'utf8'
  );
  for (const m of src.matchAll(/^\$([a-z0-9-]+)\s*:/gm)) contract.add(m[1]);
} catch {
  /* no contract in reach; every read counts as a bypass */
}

// A product can ALSO have a layer 3 of its own, emitted as custom properties
// from its theme file. That is the older shape of the layer, and a product part
// way through the migration has both — with two vocabularies that do not line
// up: the contract says `$field-radius`, the product says
// `--app-field-border-radius`.
//
// Collected so those reads are named for what they are. They are not a bypass;
// they are a second layer 3 running in parallel, which is its own problem and a
// different fix (reconcile the vocabularies) from the one this guard is about.
const productLayer3 = new Set();
// The default is a product path, and it went stale the moment that product
// split `theme.scss` into one file per theme. A missing file is swallowed by
// the `catch` below, so the set silently emptied and every read of a
// product-declared token — `--app-pad-surface`, `--app-size-bar` — reclassified
// itself as a layer-2 bypass. Failing loudly on a rename is fine; reclassifying
// in silence is not, which is why the paths are listed rather than guessed at.
const DEFAULT_PRODUCT_TOKENS = [
  'styles/ds/semantic/_structure.scss',
  'styles/ds/semantic/_surfaces.scss'
].join(',');

for (const f of (process.env.DS_PRODUCT_TOKENS || DEFAULT_PRODUCT_TOKENS).split(',')) {
  try {
    const src = readFileSync(f.trim(), 'utf8');
    for (const m of src.matchAll(/^\s*--app-([a-z0-9-]+)\s*:/gm)) productLayer3.add(m[1]);
  } catch {
    /* optional */
  }
}

const SKIP = new Set(['node_modules', '.next', 'dist']);
// Files that legitimately speak layer 2.
const EXEMPT = /(_component|tokens|theme|palette|_config|_core|_semantic|_base|_themes|_derive)\.scss$|[\\/]adapters[\\/]/;

// Ambient rather than anatomical.
//
// `(-|$)` and not `-`: the scale has both `--app-ease-out` and a bare
// `--app-ease`, and requiring the trailing hyphen let the bare one through as a
// bypass. Three transitions were queued for a token they should never have.
//
// `blend-ink` is here for a different reason. It is not a component's anatomy
// at all — it is the theme telling the page which direction ink blends, decided
// from the page's own luminance. Minting `$card-blend` would invite someone to
// override it per component, which is precisely the hardcoded-backdrop
// assumption `check-theme-proof` exists to prevent.
const AMBIENT = /^--app-(duration|ease|z)(-|$)|^--app-blend-/;

const files = [];
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) {
      if (SKIP.has(e.name)) continue;
      walk(p);
      continue;
    }
    if (/\.scss$/.test(e.name) && !EXEMPT.test(p)) files.push(p);
  }
};
dirs.forEach(walk);

const byFile = new Map();
let total = 0;
let legacy = 0;
let parallel = 0;

for (const f of files) {
  const src = readFileSync(f, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p) => p + ' '.repeat(m.length - p.length));

  src.split('\n').forEach((line, i) => {
    for (const m of line.matchAll(/var\((--app-[a-z0-9-]+)/g)) {
      if (AMBIENT.test(m[1])) continue;
      const bare = m[1].slice('--app-'.length);
      if (contract.has(bare)) {
        legacy += 1;
        continue;
      }
      if (productLayer3.has(bare)) {
        parallel += 1;
        continue;
      }
      const key = relative(process.cwd(), f).replace(/\\/g, '/');
      if (!byFile.has(key)) byFile.set(key, []);
      byFile.get(key).push({ line: i + 1, token: m[1] });
      total += 1;
    }
  });
}

const ranked = [...byFile].sort((a, b) => b[1].length - a[1].length);

if (parallel) {
  console.log(
    `check-dumb-components: note — ${parallel} read(s) go to a SECOND layer 3, the` +
      String.fromCharCode(10) + "  one the product emits as custom properties from its theme file. Not a" +
      String.fromCharCode(10) + "  bypass; two parallel vocabularies for the same layer, which is its own fix."
  );
}

if (legacy) {
  console.log(
    `check-dumb-components: note — ${legacy} read(s) reach a layer 3 name via a\n` +
      '  custom property (`var(--app-field-radius)`) rather than the Sass variable.\n' +
      '  Those honour the contract, through the mechanism layer 3 had before it\n' +
      '  became Sass `!default`. Migrating them is tidying, not a fix.'
  );
}

if (total <= allow) {
  console.log(
    `check-dumb-components: ok — ${total} layer-2 read(s) in components` +
      (allow ? ` (budget ${allow}).` : '.')
  );
  if (total > 0) {
    console.log('  remaining, most first:');
    for (const [f, hits] of ranked.slice(0, 10)) {
      console.log(`    ${String(hits.length).padStart(3)}  ${f}`);
    }
  }
  process.exit(0);
}

console.error(
  `check-dumb-components: ${total} layer-2 read(s) in component files` +
    (allow ? ` — over the budget of ${allow}.` : '.') +
    '\n\nA component must read layer 3, which points at layer 2:\n\n' +
    '    background-color: component.$avatar-bg;   /* not var(--app-bg-raised) */\n\n' +
    'Reading layer 2 directly means the layer 3 token for that property has no\n' +
    'consumer: it is declared, documented, and does nothing when set.\n'
);
for (const [f, hits] of ranked) {
  console.error(`  ${String(hits.length).padStart(3)}  ${f}`);
  for (const h of hits.slice(0, 3)) console.error(`         :${h.line}  ${h.token}`);
  if (hits.length > 3) console.error(`         … ${hits.length - 3} more`);
}
process.exit(1);

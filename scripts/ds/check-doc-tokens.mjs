// scripts/check-doc-tokens.mjs

// =============================================================================
// CHECK-DOC-TOKENS — a document may not name a token the build does not emit
// =============================================================================
//
//     node scripts/check-doc-tokens.mjs <product-dir> [more …] [--gate]
//
// THE FAILURE IT CATCHES, WHICH IS THE MIRROR OF ONE ALREADY GUARDED
//
// `check-decisions-applied` asks whether a decision that was RECORDED actually
// reaches the CSS. This asks the other direction: whether a decision that
// CHANGED was ever re-recorded.
//
// The prompt was a paragraph in a product's design language reading "hierarchy
// is carried by `border-color`, and the border is the thing that has to be
// strong". True of the first build. False of every build since the surface
// model was answered, because the card lost its border and the tone took over.
// The document went on being read as authority for weeks while the build had
// moved, and nothing was looking: the claim lives in prose, and prose is not
// something a build can evaluate.
//
// -----------------------------------------------------------------------------
// WHAT IT CAN AND CANNOT DO
// -----------------------------------------------------------------------------
//
// It cannot read the sentence. What it CAN do is check every `--app-*` token a
// document names against the tokens the product actually emits — which catches
// the whole class of documents referring to a token that was renamed, retired or
// never existed. That is the narrow version of the problem and it is cheap.
//
// The wide version stays a reading habit, and it is worth stating plainly
// because a guard that people think covers more than it does is worse than
// none: WHEN A DERIVED KEY CHANGES, THE PROSE THAT EXPLAINS IT HAS TO BE
// RE-READ, NOT JUST THE CSS.
//
// Fenced code blocks are read like anything else. A token in an example is still
// a token someone will copy.
// =============================================================================

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const gate = args.includes('--gate');
const dirs = args.filter((a) => !a.startsWith('--'));
if (!dirs.length) {
  console.error('check-doc-tokens: pass one or more product directories holding ds.css');
  process.exit(1);
}

const bold = (s) => `[1m${s}[0m`;
const dim = (s) => `[2m${s}[0m`;

// Names that are DELIBERATELY spoken about without being emitted: a document
// explaining why a token does not exist has to be able to say its name.
const RETIRED_OK = /\b(retired|no longer|used to|never existed|does not exist|was removed|is gone)\b/i;

let problems = 0;

for (const dir of dirs) {
  const cssPath = join(dir, 'ds.css');
  if (!existsSync(cssPath)) continue;

  const emitted = new Set();
  for (const file of ['ds.css', 'coreui.css', 'tw.css', 'app.css']) {
    const p = join(dir, file);
    if (!existsSync(p)) continue;
    const css = readFileSync(p, 'utf8');
    for (const m of css.matchAll(/--app-([a-z0-9-]+)\s*:/g)) emitted.add(m[1]);
  }
  if (!emitted.size) continue;

  const docs = readdirSync(dir).filter((f) => f.endsWith('.md'));
  const rows = [];

  for (const doc of docs) {
    const text = readFileSync(join(dir, doc), 'utf8');
    const lines = text.split(/\r?\n/);
    lines.forEach((line, i) => {
      for (const m of line.matchAll(/--app-([a-z0-9-]+\*?)/g)) {
        const name = m[1];
        if (emitted.has(name)) continue;

        // A FAMILY, not a token. Prose says `--app-ring-*` to mean the group,
        // and reading that as a token called "ring-" produced a finding that was
        // the document being clear rather than wrong. A trailing dash or star is
        // satisfied by any emitted token with that prefix.
        const stem = name.replace(/[-*]+$/, '');
        if (name !== stem && [...emitted].some((t) => t.startsWith(stem + '-'))) continue;

        // A token discussed in the past tense is not a broken reference, it is
        // a record. Checking the sentence around it rather than the token is
        // the only way to tell the two apart, and a two-line window is enough
        // in practice — the explanation always sits next to the name.
        const around = [lines[i - 1], line, lines[i + 1]].filter(Boolean).join(' ');
        if (RETIRED_OK.test(around)) continue;

        rows.push({ doc, line: i + 1, name });
      }
    });
  }

  if (!rows.length) continue;
  console.log(`\n${bold('A document names a token the build does not emit')} ${dim(`— ${dir}`)}\n`);
  for (const r of rows) {
    console.log(`  ${bold(`--app-${r.name}`)}  ${dim(`${r.doc}:${r.line}`)}`);
    problems++;
  }
}

if (!problems) {
  console.log('check-doc-tokens: ok — every token named in a document is emitted.');
  process.exit(0);
}
console.log(`
A design language is read as authority. A token it names that the build does not
emit is either a rename nobody followed through, or a decision that changed while
the paragraph explaining it stayed behind.

If the token was retired on purpose, say so in the sentence — "retired", "no
longer", "used to" — and this stops asking. A record of a decision that was
reversed is worth more than silence, which is why the escape hatch is a phrase
rather than an ignore list.
`);
console.log(bold(`${problems} stale reference(s).`));
if (gate) process.exit(1);

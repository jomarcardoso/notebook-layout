// scripts/check-decisions-applied.mjs

// =============================================================================
// DID THE DECISION ARRIVE IN THE CSS?
// =============================================================================
//
//     node scripts/check-decisions-applied.mjs example/<product>
//
// `check-chain` verifies that every answer produced SOMETHING — that the key is
// named in `DERIVED.md`. It does not verify that the value reached the build,
// and its own header says so about a different gap. This is the gap it did not
// name, and it cost two bugs in one session:
//
//   accentFill: washed        the document said the primary action rests at the
//                             subtle step with dark ink. The adapter painted a
//                             solid accent, because `.btn-primary` was bound
//                             inside a variant loop that layer 3 cannot reach.
//                             (That key is retired now — the question behind it
//                             was wrong — but the layer 3 hook it forced into
//                             the adapter stayed, and so did this check.)
//
//   surfaceSeparation: tones  the document said the card is separated by its
//                             tone. The card was one rung lighter AND ringed,
//                             because CoreUI's card border was still bound.
//
// Both passed every check in the repository. Both were found by opening the
// page and measuring, which is not a method that scales past one example.
//
// -----------------------------------------------------------------------------
// WHAT THIS CAN AND CANNOT DO
// -----------------------------------------------------------------------------
//
// It checks decisions whose CSS consequence is unambiguous — a token that must
// equal another token, a fill that must resolve to a named role, a control that
// must be at least so tall. It cannot check whether a page LOOKS right, and it
// does not try.
//
// **A decision it cannot locate is reported, never passed.** Where the primary
// action's fill cannot be found for a given library, the run says so and the
// line stays unchecked in the open, because a silent skip is how a guard turns
// into decoration.
// =============================================================================

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { value } from './lib/frontmatter.mjs';

const dir = process.argv[2];
if (!dir || !existsSync(join(dir, 'DESIGN_LANGUAGE.md'))) {
  console.error('check-decisions-applied: pass a product directory holding DESIGN_LANGUAGE.md');
  process.exit(1);
}

const doc = readFileSync(join(dir, 'DESIGN_LANGUAGE.md'), 'utf8');

const css = readFileSync(join(dir, 'ds.css'), 'utf8');

const answer = (k) => value(doc, k);

/** The value a `--app-*` token holds, from the first theme that declares it. */
const token = (name) => css.match(new RegExp(`--app-${name}:\\s*([^;]+)`))?.[1]?.trim();

/**
 * Which `--app-*` role a library's primary-button fill points at.
 *
 * Library-agnostic by shape rather than by name: every adapter binds the
 * primary variant as `--<prefix>-btn-bg` (or `--<prefix>-button-background`)
 * inside a rule whose selector names the primary. Where no adapter in the file
 * matches, this returns null and the caller REPORTS rather than passes.
 */
function primaryFill() {
  const rules = [...css.matchAll(/([^{}]*primary[^{}]*)\{([^}]*)\}/gi)];
  for (const [, selector, body] of rules.reverse()) {
    if (/outline|ghost|link|subtle-variant/i.test(selector)) continue;
    const m = body.match(/--[a-z]+-(?:btn|button)-(?:bg|background(?:-color)?):\s*var\(--app-([a-z0-9-]+)\)/i);
    if (m) return m[1];
  }
  return null;
}

const problems = [];
const checked = [];
const skipped = [];

const expect = (label, ok, detail) => {
  if (ok === null) {
    skipped.push(`${label} — ${detail}`);
    return;
  }
  if (ok) checked.push(label);
  else problems.push([label, detail]);
};

// --- surfaceSeparation -------------------------------------------------------
const sep = answer('surfaceSeparation');
if (sep) {
  const card = [...css.matchAll(/--[a-z]+-card-border-(?:color|width):\s*([^;]+)/gi)].map((m) =>
    m[1].trim()
  );
  if (!card.length) {
    expect('surfaceSeparation', null, 'no card border binding found in this library\'s CSS');
  } else {
    const gone = card.some((v) => v === 'transparent' || v === '0' || v === '0px');
    if (sep === 'tones') {
      expect(
        'surfaceSeparation: tones',
        gone,
        `the card still carries a border (${card[0]}). With \`tones\` the card is already ` +
          'a rung lighter than the page, so a rule around it separates the same thing twice.'
      );
    } else if (sep === 'lines') {
      expect(
        'surfaceSeparation: lines',
        !gone,
        'the card border is transparent while the document says the line does the separating'
      );
    }
  }
}

// --- imagery -----------------------------------------------------------------
const imagery = answer('imagery');
if (imagery && imagery !== 'none') {
  const img = token('radius-image');
  const ctrl = token('radius-control');
  const surf = token('radius-surface');
  if (!img) {
    expect('imagery', null, '--app-radius-image is not emitted');
  } else if (imagery === 'supporting') {
    expect(
      'imagery: supporting',
      img === ctrl,
      `--app-radius-image is ${img} and --app-radius-control is ${ctrl}. Supporting imagery ` +
        'sits INSIDE a card rather than being one, so it takes the control radius.'
    );
  } else if (imagery === 'content') {
    expect(
      'imagery: content',
      img === surf,
      `--app-radius-image is ${img} and --app-radius-surface is ${surf}. When the image IS ` +
        'the content it is a surface in its own right.'
    );
  }
}

const ratio = answer('imageRatio');
if (ratio && ratio !== 'auto') {
  const got = token('ratio-media');
  expect(
    `imageRatio: ${ratio}`,
    got !== undefined && Math.abs(Number(got) - Number(ratio)) < 0.01,
    `--app-ratio-media is ${got}, and the document says ${ratio}`
  );
}

// --- platform ----------------------------------------------------------------
const platform = answer('platform');
if (platform === 'mobile-first' || platform === 'multiplatform') {
  const size = token('size-control');
  const px = size?.match(/^(\d+(?:\.\d+)?)px$/)?.[1];
  const calc = size?.match(/\*\s*(\d+)\s*\)/)?.[1];
  const unit = Number(token('space-unit')?.replace('px', '')) || 4;
  const resolved = px ? Number(px) : calc ? Number(calc) * unit : null;
  if (resolved === null) {
    expect('platform target size', null, `--app-size-control is "${size}" and was not resolvable`);
  } else {
    expect(
      `${platform} target size`,
      resolved >= 44,
      `--app-size-control resolves to ${resolved}px. A phone needs at least 44px, and this ` +
        'overrides whatever the archetype wanted — ergonomics outranks personality.'
    );
  }
}

// --- report ------------------------------------------------------------------
const bold = (s) => `[1m${s}[0m`;
const dim = (s) => `[2m${s}[0m`;

if (!problems.length) {
  console.log(
    `check-decisions-applied: ok — ${checked.length} decision(s) reached the CSS in ${dir}` +
      (skipped.length ? `, ${skipped.length} not locatable.` : '.')
  );
  for (const s of skipped) console.log(`  ${dim('unchecked: ' + s)}`);
  process.exit(0);
}

console.error(`\n${bold('Decisions that did not arrive')} ${dim(`— ${dir}`)}\n`);
for (const [what, why] of problems) {
  console.error(`  ${bold(what)}`);
  console.error(`    ${dim(why)}\n`);
}
for (const s of skipped) console.error(`  ${dim('unchecked: ' + s)}`);
console.error(`\n${problems.length} decision(s) recorded in the document and absent from the build.\n`);
process.exit(1);

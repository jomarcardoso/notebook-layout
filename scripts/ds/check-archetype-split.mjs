// scripts/check-archetype-split.mjs

// =============================================================================
// A SECONDARY ARCHETYPE GOVERNS SOUL, NEVER STRUCTURE
// =============================================================================
//
//     node scripts/check-archetype-split.mjs example/<product>
//
// A product is rarely one archetype, and the tool had two bad ways to say so.
// `hybrid` named two and never said which won where, so every later decision
// re-opened the argument. Recording the warm voice of an Editorial product as a
// DEVIATION said a tension existed where none did — the voice was not fighting
// the archetype, it was doing a job the archetype was never asked to do.
//
// So: a PRIMARY governs structure, a SECONDARY governs a closed list of
// domains, and this refuses the two ways that goes wrong.
//
// -----------------------------------------------------------------------------
// WHY THE LIST IS CLOSED
// -----------------------------------------------------------------------------
//
// Without it, "secondary archetype" is a licence to mix everything, and the
// mixing breaks in known places: pill buttons beside 4px cards is not two
// archetypes cooperating, it is a system with no shape. A rounded display face
// does not warm an Editorial product, it removes the thing Editorial was chosen
// for. A secondary that may spend the accent is a second palette arriving one
// component at a time.
//
// A client asking for one of those is asking to change the PRIMARY, which is a
// real conversation worth having plainly rather than granting sideways.
// =============================================================================

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ALLOWED = new Map(
  Object.entries({
    voice: 'the register of the system\'s own messages, and the microcopy',
    illustration: 'decorative drawing — empty states, glyphs beside content',
    warmth: 'the temperature of the neutral ramp, which is neutralPigment',
    motion: 'micro-interactions, and how a state change announces itself',
    marks: 'small artisanal markers — a status dot, a category pill'
  })
);

// Named rather than inferred, so a domain invented later is reported instead of
// quietly accepted. Each carries the reason it belongs to the primary alone.
const REFUSED = new Map(
  Object.entries({
    geometry: 'pill buttons beside 4px cards is a system with no shape',
    radius: 'same as geometry',
    shape: 'same as geometry',
    type: 'a rounded display face removes what the primary was chosen for',
    typography: 'same as type',
    scale: 'the type scale belongs to the primary',
    surfaces: 'the surface model and the ladder are structure',
    ladder: 'same as surfaces',
    density: 'density and control sizing are ergonomics, not soul',
    spacing: 'same as density',
    accent: 'a second archetype spending the accent is a second palette',
    colour: 'the school and the budget belong to the primary',
    color: 'same as colour',
    elevation: 'elevation is structure'
  })
);

const dir = process.argv[2];
if (!dir || !existsSync(join(dir, 'DESIGN_LANGUAGE.md'))) {
  console.error('check-archetype-split: pass a product directory holding DESIGN_LANGUAGE.md');
  process.exit(1);
}

const doc = readFileSync(join(dir, 'DESIGN_LANGUAGE.md'), 'utf8');
const fm = doc.split('---')[1] ?? '';

const primary = fm.match(/^archetype:\s*([\w-]+)/m)?.[1];
const secondary = fm.match(/^archetypeSecondary:\s*([\w-]+)/m)?.[1];
// Comment lines are allowed between the entries, and are how a document says
// WHY each domain was assigned — which is the part worth reading.
const governsBlock =
  fm.match(/^secondaryGoverns:[^\n]*\n((?:[ \t]+(?:-[^\n]*|#[^\n]*)\n)+)/m)?.[1] ?? '';
const governs = [...governsBlock.matchAll(/^\s+-\s+([\w-]+)/gm)].map((m) => m[1]);

const problems = [];

// --- hybrid is retired -------------------------------------------------------
if (primary === 'hybrid') {
  problems.push([
    'archetype is `hybrid`',
    'It names two archetypes and never says which wins where, so every later ' +
      'decision re-opens the argument. Set a primary and an archetypeSecondary ' +
      'with the domains it governs.'
  ]);
}

if (secondary) {
  if (secondary === primary) {
    problems.push([
      'the secondary archetype is the primary',
      'a secondary that repeats the primary governs nothing; remove it'
    ]);
  }
  if (!governs.length) {
    problems.push([
      `archetypeSecondary is \`${secondary}\` and governs nothing`,
      'a secondary with no domains is the `hybrid` problem under a new name — ' +
        'name what it decides, from: ' + [...ALLOWED.keys()].join(', ')
    ]);
  }
  for (const d of governs) {
    if (ALLOWED.has(d)) continue;
    problems.push([
      `the secondary claims \`${d}\``,
      REFUSED.has(d)
        ? `${REFUSED.get(d)}. Wanting this is wanting a different PRIMARY, which is a ` +
          'conversation to have plainly rather than a domain to grant sideways.'
        : 'not a domain a secondary may govern. The closed list is: ' +
          [...ALLOWED.keys()].join(', ')
    ]);
  }
} else if (governs.length) {
  problems.push([
    'secondaryGoverns is set with no archetypeSecondary',
    'domains assigned to nobody'
  ]);
}

// --- the payoff: deviations the secondary already explains -------------------
//
// This is what the model is FOR. A deviation whose decision falls in a domain
// the secondary governs is not a tension — it is the secondary doing its job,
// and leaving it in the list teaches the reader to skip a list that is supposed
// to be short and load-bearing.
const devBlock = doc.match(/^deviations:\s*\n((?:\s+[-\w].*\n|\s*\n(?=\s+-))*)/m)?.[1] ?? '';
const HINT = {
  voice: /\b(voice|tone|message|microcopy|wording|copy)\b/i,
  illustration: /\b(illustration|drawing|glyph|empty state)\b/i,
  warmth: /\b(warm|sepia|pigment|temperature|cream|paper)\b/i,
  motion: /\b(motion|animation|transition|micro-interaction)\b/i,
  marks: /\b(dot|pill|marker|badge|tag)\b/i
};
for (const m of devBlock.matchAll(/-\s+decision:\s*(.+)/g)) {
  const decision = m[1].trim();
  for (const d of governs) {
    if (HINT[d]?.test(decision)) {
      problems.push([
        `"${decision}" is recorded as a deviation and the secondary governs \`${d}\``,
        'Not a tension — the secondary doing its job. Move it out of `deviations`, ' +
          'or the list stops being read.'
      ]);
    }
  }
}

// --- report ------------------------------------------------------------------
const bold = (s) => `[1m${s}[0m`;
const dim = (s) => `[2m${s}[0m`;

if (!problems.length) {
  console.log(
    secondary
      ? `check-archetype-split: ok — ${dir}: ${primary} governs structure, ` +
        `${secondary} governs ${governs.join(', ')}.`
      : `check-archetype-split: ok — ${dir}: ${primary}, no secondary. ` +
        'Most products do not have one.'
  );
  process.exit(0);
}

console.error(`\n${bold('Archetype split')} ${dim(`— ${dir}`)}\n`);
for (const [what, why] of problems) {
  console.error(`  ${bold(what)}`);
  console.error(`    ${dim(why)}\n`);
}
process.exit(1);

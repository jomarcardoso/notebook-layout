// scripts/lib/forms.mjs

// =============================================================================
// READING component-forms.md AS DATA
// =============================================================================
//
// The catalogue is written for people: prose tables, an em-dash and a reason
// after most conditions. That is the right shape for the file and the wrong
// shape for a checker, and the usual repair — a second machine-readable block
// beside each table — puts two sources of truth in one file and lets them drift.
//
// So this reads the prose. The vocabulary turned out to be closed already and
// merely unenforced:
//
//   `quiet`, `monochrome`, `lines`   BACKTICKED — an answer the interview holds
//   Editorial, Playful, Utilitarian  a capitalised archetype, also an answer
//   dense data, quiet fill, reading  plain prose — a fact about the CONTENT
//
// The backtick is the marker, and the distinction it draws is the one the
// catalogue's own introduction describes: two thirds of conditions name an
// answer, decided before anyone opens a screen, and the rest name what the
// element IS, which only whoever builds the screen can know. `dense data` is
// not `density: dense` — it is "a lot of data", and reading it as an answer
// would make a table form unreachable for every comfortable product.
//
// CONTENT CLAUSES ARE ALWAYS SATISFIABLE. The question a coverage check asks is
// whether the ANSWERS ever leave a family with nothing, and content is the half
// the answers cannot decide either way.
//
// The drift report is the clauses that ARE backticked and do not map. Those are
// cells drifting out of the vocabulary, and they are worth fixing rather than
// teaching this file to tolerate.
// =============================================================================

import { readFileSync } from 'node:fs';

export const AXES = {
  archetype: ['tech-minimalist', 'enterprise-solid', 'playful-expressive', 'editorial-premium', 'utilitarian-technical'],
  density: ['dense', 'comfortable', 'generous'],
  platform: ['desktop-first', 'mobile-first', 'multiplatform'],
  dwell: ['seconds', 'minutes', 'hours'],
  protagonist: ['user-content', 'product-content', 'brand', 'tools'],
  radius: ['square', 'subtle', 'rounded', 'pill'],
  elevation: ['borders', 'soft-shadows', 'projected-shadows'],
  surfaceSeparation: ['lines', 'tones', 'shadows'],
  surfaceModel: ['flat', 'elevated', 'recessed'],
  ladderSpend: ['2', '3'],
  iconStyle: ['outline', 'filled', 'mixed'],
  posture: ['quiet', 'balanced', 'loud'],
  frame: ['single-column', 'content-aside', 'app-frame'],
  imagery: ['none', 'supporting', 'content'],
  disclosure: ['progressive', 'exposed'],
  accessibility: ['AA', 'AAA'],
  statusColours: ['traditional', 'brand-adapted'],
  colourStrategy: ['functional', 'brand', 'monochrome'],
  colorCriticalWorkspace: ['true', 'false']
};

// What a backticked token means. Ambiguity is resolved once, here, rather than
// per reader: `brand` is the SCHOOL, because that is how block 4 spells it and
// the catalogue never lists schools and protagonists in the same breath.
const TOKENS = new Map(Object.entries({
  quiet: 'posture=quiet',
  balanced: 'posture=balanced',
  loud: 'posture=loud',
  monochrome: 'colourStrategy=monochrome',
  functional: 'colourStrategy=functional',
  brand: 'colourStrategy=brand',
  lines: 'surfaceSeparation=lines',
  tones: 'surfaceSeparation=tones',
  shadows: 'surfaceSeparation=shadows',
  flat: 'surfaceModel=flat',
  elevated: 'surfaceModel=elevated',
  recessed: 'surfaceModel=recessed',
  dense: 'density=dense',
  comfortable: 'density=comfortable',
  generous: 'density=generous',
  'mobile-first': 'platform=mobile-first',
  'desktop-first': 'platform=desktop-first',
  multiplatform: 'platform=multiplatform',
  progressive: 'disclosure=progressive',
  exposed: 'disclosure=exposed',
  borders: 'elevation=borders',
  'soft-shadows': 'elevation=soft-shadows',
  'projected-shadows': 'elevation=projected-shadows',
  outline: 'iconStyle=outline',
  'elevation: borders': 'elevation=borders',
  'elevation: soft-shadows': 'elevation=soft-shadows',
  'elevation: projected-shadows': 'elevation=projected-shadows',
  'ladderSpend: 2': 'ladderSpend=2',
  'ladderSpend: 3': 'ladderSpend=3',
  'posture: quiet': 'posture=quiet',
  'posture: balanced': 'posture=balanced',
  'posture: loud': 'posture=loud',
  'surfaceModel: flat': 'surfaceModel=flat',
  'surfaceModel: elevated': 'surfaceModel=elevated',
  'surfaceModel: recessed': 'surfaceModel=recessed',
  'surfaceSeparation: lines': 'surfaceSeparation=lines',
  'surfaceSeparation: tones': 'surfaceSeparation=tones',
  'surfaceSeparation: shadows': 'surfaceSeparation=shadows',
  'statusColours: traditional': 'statusColours=traditional',
  'statusColours: brand-adapted': 'statusColours=brand-adapted',
  'imagery: content': 'imagery=content',
  'imagery: supporting': 'imagery=supporting',
  'imagery: none': 'imagery=none',
  'disclosure: progressive': 'disclosure=progressive',
  'disclosure: exposed': 'disclosure=exposed',
  'colourStrategy: monochrome': 'colourStrategy=monochrome',
  'colourStrategy: brand': 'colourStrategy=brand',
  'colourStrategy: functional': 'colourStrategy=functional',
  'accessibility: AAA': 'accessibility=AAA',
  colorCriticalWorkspace: 'colorCriticalWorkspace=true',

  // The frame, the protagonist and the dwell, which layout-forms.md leans on
  // far more than the component catalogue does — a page shape follows from what
  // the page is FOR in a way a badge never does.
  'single-column': 'frame=single-column',
  'content-aside': 'frame=content-aside',
  'app-frame': 'frame=app-frame',
  'user-content': 'protagonist=user-content',
  'product-content': 'protagonist=product-content',
  tools: 'protagonist=tools',
  seconds: 'dwell=seconds',
  minutes: 'dwell=minutes',
  hours: 'dwell=hours',

  // Archetypes spelled as the front matter spells them, for tables naming the
  // value rather than the word a designer says out loud.
  'editorial-premium': 'archetype=editorial-premium',
  'tech-minimalist': 'archetype=tech-minimalist',
  'enterprise-solid': 'archetype=enterprise-solid',
  'playful-expressive': 'archetype=playful-expressive',
  'utilitarian-technical': 'archetype=utilitarian-technical',
  'frame: single-column': 'frame=single-column',
  'frame: content-aside': 'frame=content-aside',
  'frame: app-frame': 'frame=app-frame'
}));

// Archetypes are named, not backticked, because they are proper nouns in the
// prose. Longest first, so "Editorial & Premium" wins over "Editorial".
const ARCHETYPES = [
  ['Editorial & Premium', 'editorial-premium'],
  ['Playful & Expressive', 'playful-expressive'],
  ['Utilitarian & Technical', 'utilitarian-technical'],
  ['Tech Minimalist', 'tech-minimalist'],
  ['Enterprise Solid', 'enterprise-solid'],
  ['Editorial', 'editorial-premium'],
  ['Playful', 'playful-expressive'],
  ['Utilitarian', 'utilitarian-technical'],
  ['Enterprise', 'enterprise-solid']
];

/**
 * One clause of a condition. `any` holds alternatives written with "or", which
 * are satisfied when ANY of them holds; `all` entries must each hold.
 */
function clauseToAnswers(clause) {
  const alternatives = clause.split(/\s+or\s+/i);
  const mapped = [];
  const unmapped = [];

  for (const alt of alternatives) {
    const ticks = [...alt.matchAll(/`([^`]+)`/g)].map((m) => m[1].trim());
    let hit = null;

    for (const t of ticks) {
      if (TOKENS.has(t)) { hit = TOKENS.get(t); break; }
      const kv = t.match(/^([a-zA-Z][a-zA-Z]*)\s*:\s*(.+)$/);
      if (kv && AXES[kv[1]]?.includes(kv[2].trim())) { hit = `${kv[1]}=${kv[2].trim()}`; break; }
    }
    if (!hit) {
      // A bare alternative after "or" inherits its axis from the first hit —
      // "`quiet` or `balanced`" and "Editorial or Tech Minimalist".
      const arch = ARCHETYPES.find(([name]) => new RegExp(`\\b${name}\\b`).test(alt));
      if (arch) hit = `archetype=${arch[1]}`;
    }
    if (hit) mapped.push(hit);
    else if (ticks.length) unmapped.push(alt.trim());
  }

  if (!mapped.length) return { answers: null, unmapped };
  return { answers: mapped, unmapped };
}

export function parseCondition(cell) {
  const all = [];       // each entry is a list of alternatives; ANY satisfies it
  const content = [];
  const unmapped = [];

  // The em-dash reason is written for a reader and never carries a condition.
  const body = cell.replace(/\*\*/g, '').split(/\s+—\s+/)[0].trim();
  if (!body || /^-+$/.test(body)) return { all, content, unmapped };

  for (const raw of body.split(/[;,]|\s+\+\s+|\s+and\s+/i)) {
    const clause = raw.trim().replace(/\s+only$/i, '');
    if (!clause) continue;

    const { answers, unmapped: u } = clauseToAnswers(clause);
    unmapped.push(...u);
    if (answers) all.push(answers);
    else if (!u.length) content.push(clause.replace(/`/g, ''));
  }
  // Two clauses naming the SAME axis are alternatives, never a conjunction:
  // no product is both quiet and balanced, so "`quiet` and `balanced`" is the
  // English "and" that lists options. Merging them here rather than teaching
  // every author to write "or" keeps the prose natural and the logic sound —
  // and an unmerged pair makes a form unreachable, which is a bug the checker
  // would report against the catalogue instead of against this parser.
  const byAxis = new Map();
  const merged = [];
  for (const alts of all) {
    const axesIn = new Set(alts.map((a) => a.split("=")[0]));
    if (axesIn.size !== 1) { merged.push(alts); continue; }
    const axis = [...axesIn][0];
    if (byAxis.has(axis)) {
      for (const a of alts) if (!byAxis.get(axis).includes(a)) byAxis.get(axis).push(a);
    } else {
      const list = [...alts];
      byAxis.set(axis, list);
      merged.push(list);
    }
  }

  return { all: merged, content, unmapped };
}

/** True when an answer map satisfies a parsed condition's ANSWER half. */
export function satisfies(cond, answers) {
  return cond.all.every((alts) =>
    alts.some((a) => {
      const [k, v] = a.split('=');
      return answers[k] === undefined || answers[k] === v;
    })
  );
}

/** True when an answer map definitely TRIGGERS a condition (used for `avoid`). */
export function triggers(cond, answers) {
  if (!cond.all.length) return false;
  return cond.all.every((alts) =>
    alts.some((a) => {
      const [k, v] = a.split('=');
      return answers[k] === v;
    })
  );
}

export function readForms(file = 'skills/design-patterns/references/component-forms.md') {
  const src = readFileSync(file, 'utf8');
  const families = [];
  let current = null;
  let header = null;

  for (const line of src.split(/\r?\n/)) {
    const h = line.match(/^## (.+)$/);
    if (h) {
      const name = h[1].trim();
      const skip = ['How to use it', 'What this file does not decide'];
      current = skip.includes(name) ? null : { name, forms: [] };
      header = null;
      if (current) families.push(current);
      continue;
    }
    if (!current) continue;

    // Multiplicity: whether the family legitimately carries more than one
    // treatment. "Vary across roles, never within a role" — three kinds of card
    // is a system, two kinds of primary button is a bug, and the difference is
    // that a primary button is a single ROLE. See derivations.md section U.
    // `**Never both:** A and B — why.` Two forms one product cannot hold at
    // once: two metaphors that would read as two products. Where no line
    // excludes a pair, they are variants, and check-forms-exclusive then
    // requires each to say WHEN it applies.
    const never = line.match(/^\*\*Never both:\*\*\s*(.+?)\s+and\s+(.+?)(?:\s+—.*)?$/);
    if (never) {
      (current.excludes ??= []).push([never[1].trim(), never[2].trim()]);
      continue;
    }

    const mult = line.match(/^\*\*(One per product|Several)\b/);
    if (mult) {
      current.multiplicity = mult[1] === "Several" ? "per-role" : "one";
      continue;
    }

    // `**Only when ...`value`...**` immediately under the heading.
    const only = line.match(/^\*\*Only when (.+)\*\*/);
    if (only) {
      current.only = [...only[1].matchAll(/`([^`]+)`/g)].map((m) => m[1].trim());
      continue;
    }
    if (!line.startsWith('|')) continue;

    const cells = line.slice(1, line.lastIndexOf('|')).split('|').map((c) => c.trim());
    if (cells.length < 2) continue;
    if (/^:?-+:?$/.test(cells[1])) continue;

    // The header row names the columns; only tables that HAVE a "fits when"
    // column carry forms. The others are reference tables — the badge/tag/chip
    // job table, the label-position matrix — and are skipped rather than
    // guessed at.
    if (cells.some((c) => /^fits when$/i.test(c))) {
      header = cells.map((c) => c.toLowerCase());
      continue;
    }
    if (!header) continue;

    // A family may be CONDITIONAL, the way question 14 is conditional on the
    // school: an aside is not a shape a single-column page can take, and a
    // workspace is not a shape a reading product has. Without this the checker
    // reports those families as empty for every product that legitimately does
    // not have them, which is noise that teaches a reader to ignore the report.
    if (current.only === undefined) current.only = null;
    if (current.multiplicity === undefined) current.multiplicity = null;

    const at = (n) => {
      const i = header.indexOf(n);
      return i >= 0 && cells[i] !== undefined ? cells[i] : '';
    };
    const name = cells[0].replace(/\*\*/g, '').replace(/`/g, '').trim();
    if (!name) continue;

    current.forms.push({
      family: current.name,
      name,
      what: at('what it is'),
      fits: parseCondition(at('fits when')),
      avoid: parseCondition(at('avoid when'))
    });
  }
  return families.filter((f) => f.forms.length);
}

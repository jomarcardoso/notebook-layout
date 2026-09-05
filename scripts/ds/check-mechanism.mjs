// scripts/check-mechanism.mjs

// =============================================================================
// ONE BOUNDARY, ONE MECHANISM
// =============================================================================
//
//     node scripts/check-mechanism.mjs example/<product>
//
// Four mechanisms can carry a boundary — space, tone, line, shadow — and using
// two where one would do is the default library look this whole tool exists to
// avoid. A card with a different background AND a border AND a shadow is not
// three times as clear; it is three times as noisy.
//
// This is the cheapest of the checks the source material calls valuable, and it
// catches the failure mode the accent-driven example actually shipped: a card
// one rung lighter than the page and ALSO ringed, which passed every other
// guard in the repository.
//
// -----------------------------------------------------------------------------
// THE EXCEPTION, WHICH IS NOT A LOOPHOLE
// -----------------------------------------------------------------------------
//
// An interactive element legitimately carries tone AND border: the tone says
// "content fits here" and the border says "clickable", and the border scales
// from rest to hover to focus carrying the state. Two mechanisms doing two jobs
// is not redundancy.
//
// So the check exempts controls by name and reports containers. That list is
// written down rather than inferred, because "is this interactive" cannot be
// read off a custom property.
//
// -----------------------------------------------------------------------------
// WHAT IT READS
// -----------------------------------------------------------------------------
//
// The library variables an adapter binds, grouped by component. If one
// component has a background bound to a surface, a border bound to a visible
// colour, and a shadow bound to anything, that component is spending two
// mechanisms on one boundary. It cannot see what a screen actually renders —
// that needs a browser — so it checks the SYSTEM's intent rather than the
// page's result, which is where the decision is made anyway.
// =============================================================================

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { value } from './lib/frontmatter.mjs';

const dir = process.argv[2];
if (!dir || !existsSync(join(dir, 'ds.css'))) {
  console.error('check-mechanism: pass a product directory holding ds.css');
  process.exit(1);
}

// Interactive by nature: tone and border are two jobs here, not two mechanisms
// for one job. Named rather than inferred — a custom property cannot say
// whether the thing it paints can be clicked.
const INTERACTIVE = new Set([
  'input', 'form-control', 'form-select', 'form-check-input', 'form-switch',
  'btn', 'button', 'select', 'textarea', 'range', 'chip', 'tag-interactive',
  // An ENCLOSED TAB is the same shape as an outlined button: the border draws
  // the tab, and the surface is what brings the chosen one forward out of the
  // track. Two jobs, not two mechanisms — and the alternative reading flags
  // every product that binds CoreUI's or Bootstrap's tab at all, which is a
  // guard reporting the library's anatomy as a design error.
  //
  // The line that had to be drawn before adding this: the CONTAINER around a
  // tab set is not interactive and is not exempt. `nav-tabs` itself — the
  // track — still gets checked; it is `nav-tabs-link`, the tab, that is a
  // control.
  'nav-tabs-link', 'nav-enclosed-link'
]);

// Floating by nature: a shadow is the whole point, and these legitimately carry
// a surface with it.
const FLOATING = new Set([
  'modal', 'dropdown', 'popover', 'tooltip', 'toast', 'offcanvas', 'menu'
]);

const css = readFileSync(join(dir, 'ds.css'), 'utf8');
const doc = existsSync(join(dir, 'DESIGN_LANGUAGE.md'))
  ? readFileSync(join(dir, 'DESIGN_LANGUAGE.md'), 'utf8')
  : '';
const separation = value(doc, 'surfaceSeparation');

// --- gather what each component binds ---------------------------------------
const components = new Map();
const touch = (name) => {
  if (!components.has(name)) components.set(name, { bg: null, border: null, shadow: null });
  return components.get(name);
};

for (const m of css.matchAll(/--[a-z]+-([a-z][a-z0-9-]*?)-(bg|background|border-color|border-width|box-shadow)\s*:\s*([^;}]+)/g)) {
  const [, raw, prop, val] = m;
  const name = raw.replace(/-(hover|active|focus|disabled|checked)$/, '');
  if (/-(hover|active|focus|disabled|checked)-/.test(raw)) continue;
  const c = touch(name);
  const v = val.trim();
  if (prop === 'bg' || prop === 'background') c.bg = v;
  if (prop === 'border-color') c.border = v;
  if (prop === 'border-width') c.width = v;
  if (prop === 'box-shadow') c.shadow = v;
}

const invisible = (v) =>
  !v || v === 'transparent' || v === 'none' || v === '0' || v === '0px' || /^rgba?\([^)]*,\s*0\s*\)$/.test(v);

// A background counts as a MECHANISM only when it is a surface of its own —
// pointing at the page is not a boundary.
const isSurface = (v) =>
  v &&
  /var\(--app-bg-(surface|raised|sunken|neutral-subtle|[a-z]+-subtle)/.test(v) &&
  // A STATE fill is not a resting boundary. The table bound its hover tint and
  // its row hairline, and that read as two mechanisms; it is one boundary and
  // one state, which is the whole point of having states.
  !/-(hover|active|focus|checked|disabled)\)/.test(v);

// A border in the ACCENT is an INDICATOR, not a boundary. The underline on an
// active tab is state — the same job a fill does elsewhere — and reading it as
// separation flags every tab set in every product. The rule generalises: the
// accent never separates, it marks.
const isIndicator = (v) => v && /var\(--app-border-(accent|action|selected|primary)/.test(v);

const problems = [];
let checked = 0;

for (const [name, c] of [...components].sort()) {
  if (INTERACTIVE.has(name)) continue;
  const spends = [];
  if (isSurface(c.bg)) spends.push(`a tone (${c.bg.trim()})`);
  if (!invisible(c.border) && !invisible(c.width ?? '1px') && !isIndicator(c.border))
    spends.push(`a line (${c.border.trim()})`);
  if (!invisible(c.shadow) && !FLOATING.has(name)) spends.push(`a shadow`);
  checked++;

  if (spends.length < 2) continue;

  problems.push([
    `${name} spends ${spends.length} mechanisms on one boundary`,
    spends.join(' and ') +
      '. One boundary, one mechanism — when the second feels necessary, the first is ' +
      'usually too weak, and the fix is to strengthen the first.' +
      (separation ? ` This product answered \`surfaceSeparation: ${separation}\`.` : '')
  ]);
}

const bold = (s) => `[1m${s}[0m`;
const dim = (s) => `[2m${s}[0m`;

if (!problems.length) {
  console.log(
    `check-mechanism: ok — ${checked} container component(s) in ${dir}, none spending two ` +
      'mechanisms on one boundary. Controls and floating surfaces are exempt by name.'
  );
  process.exit(0);
}

console.error(`\n${bold('One boundary, one mechanism')} ${dim(`— ${dir}`)}\n`);
for (const [what, why] of problems) {
  console.error(`  ${bold(what)}`);
  console.error(`    ${dim(why)}\n`);
}
console.error(`${problems.length} redundant boundary(ies).\n`);
process.exit(1);

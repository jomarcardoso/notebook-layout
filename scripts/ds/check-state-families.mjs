// scripts/check-state-families.mjs

// =============================================================================
// STATE FAMILY GUARD
// =============================================================================
//
// The rule:
//
//   A component that can be CHOSEN takes its states from the `selected` family.
//   A component that ACTS takes its states from the `action` family.
//
// Hover is not an independent colour decision — it is a preview of the state
// that comes next. On a menu item the next state is "selected", so its hover
// must be a step of the selection colour. A hover in the action colour promises
// that clicking will DO something, and then the item turns a different colour
// entirely when it turns out to merely be chosen.
//
// This is not a style preference. It is the difference between an interface
// where colour means something and one where it decorates, and it is exactly
// the drift that produced, in a real product:
//
//     --cui-nav-link-hover-bg: var(--action-secondary-bg-active);   /* blue  */
//     [aria-current] { background-color: var(--color-primary-main); } /* brown */
//
// — the same control previewing one colour and committing to another.
//
// -----------------------------------------------------------------------------
// WHAT IT INSPECTS
// -----------------------------------------------------------------------------
//
// The compiled `@layer vendor-config` block, which is where adapters bind. It
// pairs the COMPONENT named in a declaration (its selector or its variable
// name) with the FAMILY the value resolves to, and reports the crossings.
//
// It is deliberately conservative: it only fires when both halves are
// unambiguous. A name it does not recognise is skipped rather than guessed at,
// because a guard that cries wolf gets switched off and then guards nothing.
//
//     node scripts/check-state-families.mjs dist/ds.css
// =============================================================================

import { readFileSync } from 'node:fs';

const file = process.argv[2] ?? 'dist/ds.css';
const css = readFileSync(file, 'utf8');

// Adapters are the only layer that binds a library's components to roles.
const start = css.indexOf('@layer vendor-config');
if (start === -1) {
  console.log('check-state-families: no adapter layer, nothing to check.');
  process.exit(0);
}
const scope = css.slice(start);

// -----------------------------------------------------------------------------
// WHAT COUNTS AS SELECTABLE, AND WHY `button` IS NOT ON THE ACTING LIST
// -----------------------------------------------------------------------------
//
// A selectable control is very often a `<button>`. A tab is
// `<button role="tab" aria-selected>`; a toggle chip is
// `<button aria-pressed>`; a segmented control is a row of buttons. The HTML
// element says "this is operable"; it says nothing about whether operating it
// CHOOSES something or DOES something.
//
// The first version of this script had `button` on the acting list and reported
// two crossings against correct code on its first test — `.tabs
// button[aria-selected]` binding to `bg-selected`, which is precisely right.
// A guard that fires on the correct pattern is worse than no guard, because the
// first thing anyone does is switch it off.
//
// So: `button` is gone from ACTING, which now holds only class-shaped markers
// that name a role rather than an element. And the ARIA selection attributes
// are the STRONGEST selectable signal there is — they are the accessibility
// tree saying, in the markup, that this control's job is to be chosen.
const SELECTABLE =
  /\b(nav|tab|tabs|pill|pills|chip|chips|checkbox|radio|switch|toggle|option|menuitem|menu-item|breadcrumb|accordion|segment|choice)\b|aria-(selected|current|pressed|checked)|role=.?(tab|option|menuitemradio|menuitemcheckbox)/;

// Class-shaped markers only. No bare element names.
const ACTING = /\b(btn|submit|cta|fab)\b/;

// The state slots. `hover` counts: previewing is a state.
const STATE =
  /\b(active|checked|selected|current|hover|pressed)\b|aria-(selected|current|pressed|checked)/;

const ACTION_TOKEN = /var\(\s*--app-(bg|fg|border)-action\b/;
const SELECTED_TOKEN = /var\(\s*--app-(bg|fg|border)-selected\b/;

// -----------------------------------------------------------------------------
// PARSING, THE HARD WAY, BECAUSE THE EASY WAY WAS A NO-OP
// -----------------------------------------------------------------------------
//
// The first version of this scanned line by line: a line that ended in `{` was a
// selector, a line shaped like `--x: y;` was a declaration.
//
// It passed everything, always, and for a reason worth writing down: the build
// compiles with `--style=compressed`, so the entire stylesheet is ONE line. The
// scanner saw no selectors and no declarations and reported success on every
// input. A guard reporting "ok" because it parsed nothing is worse than a guard
// that is missing, because the green tick is evidence of nothing while looking
// like evidence of something.
//
// This walks braces instead, so expanded and compressed output parse the same.
function* declarations(css) {
  const stack = [];
  let buf = '';

  for (let i = 0; i < css.length; i++) {
    const ch = css[i];

    if (ch === '{') {
      stack.push(buf.trim().replace(/\s+/g, ' '));
      buf = '';
    } else if (ch === '}') {
      // A declaration can end at `}` instead of `;` — the last one in a block.
      if (buf.includes(':')) yield [stack.join(' '), buf];
      stack.pop();
      buf = '';
    } else if (ch === ';') {
      if (buf.includes(':')) yield [stack.join(' '), buf];
      buf = '';
    } else {
      buf += ch;
    }
  }
}

const problems = [];

for (const [path, raw] of declarations(scope)) {
  const decl = raw.match(/^\s*(--[\w-]+)\s*:\s*(.+)$/s);
  if (!decl) continue;

  const [, name, value] = decl;

  // At-rule preludes (`@media …`, `@layer …`) are on the stack too; they carry
  // no component identity and only add noise to the match.
  const selector = path
    .split(' ')
    .filter((p) => !p.startsWith('@'))
    .join(' ')
    .trim() || '(root)';

  const context = `${selector} ${name}`.toLowerCase();

  if (!STATE.test(context)) continue;

  // A `neutral`, `surface` or `disabled` target is legal for either kind — a
  // hovered row stepping down the paper ramp says nothing about role.
  //
  // SELECTABLE WINS. The two categories are not symmetric: a `.btn` inside a
  // tab list is a tab, and a `.chip` is never secretly a submit button. So the
  // acting branch only runs when nothing in the context says "chosen", which is
  // what keeps `.tabs .btn[aria-selected]` from being read as a button.
  if (SELECTABLE.test(context)) {
    if (ACTION_TOKEN.test(value)) {
      problems.push({
        kind: 'selectable -> action',
        selector,
        name,
        value: value.trim(),
      });
    }
    continue;
  }

  if (ACTING.test(context) && SELECTED_TOKEN.test(value)) {
    problems.push({
      kind: 'acting -> selected',
      selector,
      name,
      value: value.trim(),
    });
  }
}

if (problems.length === 0) {
  console.log(
    'check-state-families: ok — no selectable component takes an action state, ' +
      'and no button takes a selected one.'
  );
  process.exit(0);
}

console.error(
  `check-state-families: ${problems.length} crossing(s).\n\n` +
    'A component that can be CHOSEN takes its states from `selected`; one that\n' +
    'ACTS takes its states from `action`. Hover is the preview of the state that\n' +
    'comes next, so it belongs to the same family as that state.\n'
);

for (const p of problems) {
  console.error(`  [${p.kind}]  ${p.selector}`);
  console.error(`      ${p.name}: ${p.value}\n`);
}

process.exit(1);

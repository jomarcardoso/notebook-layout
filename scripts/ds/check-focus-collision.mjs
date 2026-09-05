// scripts/check-focus-collision.mjs

// =============================================================================
// CHECK-FOCUS-COLLISION — the accent outline belongs to focus and nothing else
// =============================================================================
//
//     node scripts/check-focus-collision.mjs <product-dir> [more …] [--gate]
//
// THE FAILURE, AND WHY IT IS AN ACCESSIBILITY ONE
//
// A tab marked as selected by a thin accent border around a pale fill is drawn
// in exactly the vocabulary of a focus ring. A keyboard user arriving on that
// tab strip cannot tell "this is the section I am in" from "this is where my
// keyboard is". The two states are then indistinguishable at the moment they
// matter most — while navigating without a pointer — and no amount of
// documentation fixes it, because the reader is not reading documentation.
//
// It is easy to arrive at innocently, and this product did. The washed accent
// for a selected state came out nearly white, because pigment and paper were
// near-complementary; a border was added so the state could be seen at all; the
// only border colour that read as "selected" was the accent. Three reasonable
// steps to a state that impersonates focus.
//
// So the rule is a reservation: **an accent-coloured border is focus.** A
// component that wants a border for a resting or selected state takes a neutral
// one, and carries the selection with fill, weight, position or an indicator.
//
// -----------------------------------------------------------------------------
// WHAT IT READS
// -----------------------------------------------------------------------------
//
// The emitted CSS, looking for a border property that resolves to the accent
// family on a rule that is NOT a focus rule. It reads the adapter's output
// rather than layer 3, because layer 3 is where the intent is and the emitted
// CSS is where the mistake actually lands — including through a library variable
// nobody in this repository named.
//
// `ring-color` is the focus token and is exempt wherever it appears, which is
// the whole point of it being a role of its own rather than an alias of the
// accent. That distinction was already argued for in the adapter; this makes it
// enforceable.
// =============================================================================

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const gate = args.includes('--gate');
const dirs = args.filter((a) => !a.startsWith('--'));
if (!dirs.length) {
  console.error('check-focus-collision: pass one or more product directories holding ds.css');
  process.exit(1);
}

const bold = (s) => `[1m${s}[0m`;
const dim = (s) => `[2m${s}[0m`;

// A border that carries the accent. `border-accent`, `border-action`,
// `border-selected` — the school decides which name is emitted, so all three.
const ACCENT_BORDER = /var\(--app-(border-(accent|action|selected|primary)|bg-(accent|action|selected|primary))\b/;

// ALL FOUR EDGES, and this distinction is the difference between a useful check
// and a noisy one.
//
// A border on ONE side is an INDICATOR — the underline beneath an active tab,
// the bar down the side of a selected row. It cannot be mistaken for a focus
// ring, because a focus ring surrounds. The school says so explicitly: the mark
// under a chosen tab is not a border, it is an indicator of state, and it is
// allowed to be solid accent.
//
// A border on all four is an OUTLINE, and that is the shape focus owns.
const BORDER_PROP = /^border-color$|^border-color-[a-z-]+$|(^|-)btn-border-color$|(^|-)border-color$/;
const SINGLE_EDGE = /border-(top|right|bottom|left|block|inline)(-(start|end))?-color/;

// Rules that are allowed to be accent-edged.
const IS_FOCUS = (sel) => /:focus|focus-visible|focus-ring|\bring\b/.test(sel);

// Components whose SELECTED state legitimately is the accent edge, because they
// have no fill to carry it and no position to imply it. Kept deliberately short,
// and every entry is a decision rather than a convenience:
//
//   the checked checkbox and radio — the accent IS the mark, and the border and
//   the fill are the same colour, so there is no thin outline around a pale
//   field for focus to be confused with.
const EXEMPT_SELECTOR = /form-check-input:checked|form-check-input\[|:checked/;

let problems = 0;

for (const dir of dirs) {
  const path = join(dir, 'ds.css');
  if (!existsSync(path)) continue;
  const css = readFileSync(path, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

  // Brace-tracking, the same reader `check-derived` uses and for the same
  // reason: a regex over the whole file cannot tell which selector a
  // declaration belongs to, and a multi-line selector defeats the naive fix.
  const rows = [];
  let i = 0, start = 0;
  const stack = [];
  while (i < css.length) {
    if (css[i] === '{') {
      stack.push(css.slice(start, i).trim().replace(/\s+/g, ' '));
      start = i + 1;
    } else if (css[i] === '}') {
      const sel = stack.pop();
      const body = css.slice(start, i);
      if (sel && !sel.startsWith('@') && !body.includes('{')) {
        for (const d of body.split(';')) {
          const c = d.indexOf(':');
          if (c < 0) continue;
          const prop = d.slice(0, c).trim();
          const val = d.slice(c + 1).trim();
          const name = prop.replace(/^--(app|cui|bs)-/, '');
          if (!BORDER_PROP.test(name)) continue;
          if (!ACCENT_BORDER.test(val)) continue;
          if (SINGLE_EDGE.test(name)) continue;
          if (IS_FOCUS(sel) || IS_FOCUS(prop) || EXEMPT_SELECTOR.test(sel)) continue;

          // A FILLED element whose border matches its own fill has no visible
          // ring at all — the edge and the middle are one colour, and nothing
          // about it resembles focus. This is every solid button in every
          // adapter, and flagging them buried the two real findings under six.
          // THE FILL FOR THE SAME STATE, not the first fill in the rule.
          //
          // A component block declares several: `--cui-pagination-hover-bg`,
          // `--cui-pagination-active-bg`, `--cui-pagination-disabled-bg`. Taking
          // whichever came first compared the ACTIVE border against the HOVER
          // fill and reported a selected page number — accent border around an
          // accent fill, no visible ring — as a focus collision.
          //
          // So the sibling is constructed: `…-active-border-color` asks for
          // `…-active-bg`, and a plain `border-color` asks for
          // `background-color`.
          const sibling = prop.endsWith('border-color')
            ? prop.replace(/border-color$/, 'bg')
            : 'background-color';
          const fillRe = new RegExp(
            `(?:^|;)\\s*(?:${sibling.replace(/[-]/g, '\\-')}|background-color)\\s*:\\s*([^;]+)`
          );
          const fill = body.match(fillRe);
          if (fill && ACCENT_BORDER.test(fill[1])) continue;

          // AN OUTLINED BUTTON IS THE ONE PLACE THE ACCENT EDGE IS STRUCTURAL.
          //
          // There the border is not marking a state, it is standing in for the
          // fill — the same hierarchical weight as a filled secondary, expressed
          // by another mechanism. It is also unambiguous in a way a selected tab
          // is not: an outlined button looks like that all the time, so its focus
          // ring has to be, and is, a separate ring with an offset outside the
          // border it already had.
          //
          // The rule this exemption respects: focus owns the accent outline as a
          // STATE. A component whose resting appearance is an accent outline has
          // not borrowed anything.
          if (/\bbtn-outline|\boutline-btn|\bbutton--outline/.test(sel)) continue;

          rows.push({ sel, prop, val });
        }
      }
      start = i + 1;
    }
    i++;
  }

  if (!rows.length) continue;
  console.log(`\n${bold('An accent border outside a focus rule')} ${dim(`— ${dir}`)}\n`);
  for (const r of rows) {
    console.log(`  ${bold(r.sel)}\n    ${r.prop}: ${r.val}`);
    problems++;
  }
}

if (!problems) {
  console.log('check-focus-collision: ok — the accent outline is reserved for focus.');
  process.exit(0);
}
console.log(`
A thin accent border around a component is what a focus ring looks like. Where a
component wears one at rest or when selected, a keyboard user cannot tell the two
states apart — and that is precisely the moment when telling them apart matters,
because there is no pointer to say where they are.

Carry the selection with something else. In order of preference:

  a FILL, which is what a chip and a nav item should use;
  POSITION, which a closed contiguous set already provides for free;
  an INDICATOR, a small solid mark, which is the cheapest accent there is;
  WEIGHT, always, as the second cue — a state carried by colour alone is a state
  some readers never receive.

A neutral border is fine. It is the accent that is spoken for.
`);
console.log(bold(`${problems} collision(s).`));
if (gate) process.exit(1);

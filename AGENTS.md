# notebook-layout/AGENTS.md

## Area

This is a public local UI/layout library consumed by the private app.

## Rules

- Treat this as a standalone package.
- Do not move components into `www`.
- Keep public APIs stable where possible.
- Update exports when adding public components.
- Avoid app-specific business logic in this package.
- Components should remain reusable.

## Validation

When changing this package, verify that `www` still builds with the local import.


## Design language

[`DESIGN_LANGUAGE.md`](./DESIGN_LANGUAGE.md) is the contract for every visual
decision in this package and in the app that consumes it: colour, rhythm, px
versus rem, assembly, action, state and the list of prohibitions. **Read it
before changing anything that is seen**, not only when in doubt.

Its front matter is what a tool reads; the prose settles what a token cannot.
When the two disagree the front matter is wrong until proven otherwise, and the
correction goes in BOTH places (§13).

**A change that departs from it is not finished until it is recorded in
`deviations`**, with the reason and, when it is meant to be temporary, a
`revisit`. A deviation that only lives in a commit message is a contract that
silently stopped describing the product.

Two rules that catch most mistakes:

- **The rhythm unit is the only measure in `rem`; everything else is px** (§6).
  Padding, gap, gutter, region width, touch target, breakpoint and container
  query all measure space, not text.
- **Flow space is a multiple of the rhythm unit; inner space has its own scale**
  (§6). Paragraph to paragraph, title to body and item to item are flow.

## CSS

Write CSS in BEM as described in [`BEM.md`](../BEM.md): blocks are global and declared before they are modified, elements belong to their block and are declared before they are modified, modifiers go on the block unless the element itself differs from its siblings, and rules follow the order set there.

### Layout primitives

`styles/layout.scss` carries the `l-*` primitives. They are native CSS reading
layer-2 custom properties, so they survive a change of CSS library untouched —
never rewrite one in a third-party utility grammar.

| primitive | what it resolves | knob |
| --- | --- | --- |
| `l-stack` | vertical flow, space on the joint, named by what the element is: `-container` wraps sections (4 units, two lines), plain `l-stack` is a section (2 units, one line), `-block` is an element of a section with parts of its own (1 unit, half a line) | — |
| `l-measure` | the text measure — body, narrow or apparatus | `--l-measure` |
| `l-rule` | the rule as a separator between blocks | — |
| `l-cluster` | horizontal grouping on the inner space axis | `--l-cluster-gap` |
| `l-columns` | as many columns as fit, each at least the minimum, stacked when none fit | `--l-columns-min`, `--l-columns-gap` (both axes), `--l-columns-row-gap` |
| `l-split` | parts stacked and centred in a narrow container, side by side from 560px of its own width; each part grows by its `--l-grow`, or keeps its content's width with `flex-grow-0` | `--l-grow` (on a part), `--l-split-gap` |
| `l-regions` | margin, content and apparatus, unequal widths | `--l-regions-*` |
| `l-target` | 44px touch area on the element's own box | `--l-target-size` |
| `l-only-wide`, `l-only-narrow` | which copy of a piece enters the screen, by orientation | — |

`l-target` grows the element's OWN box, transparent around what is painted. It
does not draw a bigger overlay: the browser's focus ring outlines the element's
box and not a pseudo-element, so an overlaid target puts the ring around the
drawing instead of around the area that answers to touch. `.-flush` pairs with
`--l-target-painted` to hand the layout back only the painted height, so the
target grows outwards without shoving its neighbours.

`l-only-wide` and `l-only-narrow` are presence, never appearance, one class each
like `d-none`: `l-only-wide` is dropped in portrait and `l-only-narrow` in
landscape, so a piece the assembly keeps in two places —
the apparatus beside the content and the apparatus inside it — shows up in one of
them at a time. It reads orientation because that is what `l-regions` reads; a
width-based `d-md-*` would show both copies on a tablet held upright.

`l-stack` spaces children by markup order, so it skips one hidden child on its own: after a heading, a hidden `l-only-wide`, `l-only-narrow`, `d-none` or `[hidden]` child passes the heading's spacing to the next one, and a hidden first child gives the next one no top margin. Two hidden children in a row, or one hidden by another component's CSS, are not seen; group what changes with the screen into a single child instead.

Modifiers use the repository's `.-modifier` form: `.l-stack.-block`,
`.l-measure.-apparatus`.

Columns are decided by the space the piece has, never by the window. The regions change with orientation, so inside a region the window width says nothing about the room left: the grid's breakpoint classes (`col-md-*`, `row-cols-md-*`, `text-md-*`, `offset-md-*`) are not used there. Columns that fit by room are `l-columns`; a pair that changes its arrangement is `l-split`, or a container query when the arrangement is the component's own.

`l-columns` is for peers of the same kind whose count per line only depends on room: the ingredients beside the method, photo thumbnails, cards. It has no breakpoint: each column takes at least `--l-columns-min`, and the items stack when two no longer fit. Its rows are flow, so they keep the rhythm unit until a gap is given; `--l-columns-gap` sets both axes, and `--l-columns-row-gap` is only for rows that differ from columns.

`l-split` is for different parts that are read side by side when there is room and in sequence when there is not, such as a drawing beside its text or a heading beside its action: stacked they are centred, side by side they start at the start of each part. Each part says its own size, so the rule is the same whichever side and however many parts. By default every part grows by an equal share; `--l-grow` on a part sets its share as a whole number, so `5` and `7` split the line like `col-5` and `col-7`. CoreUI's `flex-grow-0` on a part keeps it at its content's width, up to half the line, and the parts that grow take the rest: a title with its action is `<h2/>` and `<div class="flex-grow-0">`. `--l-grow` is registered as not inherited, so a split inside a part does not take its parent's share.

`l-columns` is a grid, so an item stretches to the height of its row: a `position: sticky` child needs `align-self: start` to have room to slide. `l-split` is its own size container (`container-type: inline-size`), so its width cannot come from its content: inside a box that shrinks to fit (an auto-width flex item, an inline block, an absolutely positioned element without a width) it collapses. Both give every item `min-inline-size: 0`, so a long word, a table or a `<pre>` does not push its column past its parent, and no ancestor needs `overflow: hidden` to hide it.

**A scroller that pads its top declares `--tabs-sticky-inset` from the same value as that padding.** Sticky offsets measure from the scroll container's content box, so `.tabs.-sticky` sits at `top: calc(-1 * var(--tabs-sticky-inset))` to land flush on the edge; an inset that differs from the padding leaves the row hanging below the top with the content scrolling through the gap. The modal body takes both from `$modal-body-pad-top`.

**A grid track is `minmax(0, 1fr)`, never a bare `1fr`.** A bare `1fr` is `minmax(auto, 1fr)`: its minimum is the widest thing inside, at any depth. One image of fixed width, table, carousel or unbroken word several levels down widens the column past its grid, and the page past the screen, through every grid between them. The usual cure, `overflow: hidden` on an ancestor, then breaks `position: sticky` below it. A track that should hold its content's width is `auto` only when that content is short by nature (an icon, a label), and `fit-content(<share>)` when it is not.

Two rules that decide most questions:

- **Flow space comes from `--app-rhythm-*`, inner space from `--app-space-*`.**
  Stacking with `mb-3` mixes the two and the vertical rhythm never closes.
  Anything the eye reads as descending the page belongs to `l-stack`.
- **Space between things belongs to what holds them.** A component sets no
  outer margin, neither its own nor towards a sibling (`.x + .x`), and does not
  repeat the base reset's `margin: 0`. The `l-*` primitives sit in the `utilities`
  layer, after every component, so a stack's joint always wins. A container
  whose spacing changes with orientation or width writes the joint of its own
  children (`&__content > * + *`) instead of using `l-stack`: a custom
  property cannot carry the gap, because nested stacks would inherit it.
- **A component of this package is used with one class, or a few.** Its block and its modifiers carry everything it looks like: `.accordion`, `.alert`, `.btn` and the like never ask the consumer for a second set of classes to look right. Its own markup carries no utility class (`d-flex`, `gap-*`, `m*-*`, `justify-content-*`): the layout of its parts is written in its CSS, where a consumer cannot forget it. The 12-column grid (`row`, `col-*`, `.grid`) and the `l-*` primitives may appear inside a composition that is a layout by nature.
- **Mechanics come from the library, values come from us.** `d-flex`,
  `order-*`, `position-*`, `overflow-*` and the 12-column grid without
  breakpoint suffixes are used directly. Colour, radius, shadow and typography utilities are not used at
  all — either they resolve to a token by configuration, or they leak.

The library's own configuration lives in `styles/coreui-entry.scss`. Spacing
utilities are pinned to the inner scale and rounding is off there, so a guardrail
that used to need watching is now a setting.

`docs/coreui.md` is the inventory of the library: which partials are imported
and where each one is configured, which are left out because a block of this
package already owns the class name, and the decisions still open. Read it
before importing a partial, and update it in the same change.

`docs/composition.md` records how the page is assembled from what already
exists — the box, the description list, the folio and the page compositions — and
the decisions each one depends on.

### The atoms

`styles/atoms/` holds them, `styles/molecules/` holds what assembles them, and
each entry file declares the layer they enter: `ds-overrides`, after the library,
after the adapter, after every component, because most of them undo a decision
the library made.

**The hyphen in `ds-overrides` is load-bearing.** `ds.overrides` would be a
SUBLAYER of `ds`, and a sublayer sorts inside its parent — `ds` is created where
`ds.base` first appears, before `vendor`, so the atoms would sort there too, no
matter where the name sits in the `@layer` statement. The failure is silent and
total: every atom loses to CoreUI and the field ships with the library's
four-sided box instead of the bottom rule, with the whole sheet loaded and doing
nothing. Never give a layer that has to win a dotted name whose parent already
exists earlier.

Three rules decide where a line of atom CSS belongs:

- **A value the library accepts as a variable goes in `coreui-entry.scss`.** Not
  generating CSS and then undoing it beats undoing it. `$input-bg: transparent`
  is a setting; the bottom rule's geometry is not, so it is an atom.
- **A translation between two vocabularies goes in `_coreui.scss`.** The adapter
  exists to say `--cui-modal-bg` is our `overlay-bg`, and nothing else — and only
  for components that have no atom. Where an atom exists it IS the definition and
  reads layer 2 directly, so a layer-3 knob in between would be an indirection
  with one reader. Write a knob the day a consumer needs it, never before: a map
  of knobs for a component the product does not even import looks like work done.
- **A rule of the system goes in `styles/atoms/`.** Native focus, the pressed 1px,
  the ruled sheet, the reader's marks.

An atom component imports no CSS of its own. Where it lands in the cascade is
part of what it is, and `import './x.scss'` enters outside every layer, which
would put it above everything.

### The lists

Every reading list is `line-list` (`styles/molecules/_line-list.scss`): the margin column, the text on the measure, one rhythm line per item. The list is the grid and each item a subgrid of it, which is what aligns the quantity column. The family only decides what the whole list puts in the margin column: nothing (the default), `--prose` (lozenge), `--steps` (numeral), or no margin column at all, `--data`. Everything else is content in slots: the text is `children`, `figure` fills the margin column, `description` goes under the text, `trailing` opens the numeric column at the end. Collection items follow the same names, plus `image` and `excerpt` for a short prose summary. Slot names are the standard vocabulary of list components (Primer, Material), never names from the product: this package does not know what it lists. An item with `href` or `onClick` renders as `a` or `button`, and `:where(a, button).line-list__item` gives it the target and states, with `aria-current` as the selected state. A check box is recognised by `li:has(> .form-check)`. Add a slot before adding a family: two items that only differ in content are the same item.

Collections are `index-list` and `thumb-grid` (`_collections.scss`), two lists and not one item at two widths: an item with an `excerpt` goes to the index, an item without prose may go to the grid. In both the link is the only child of the `li`.

CoreUI's `list-group` is not imported, so it has no adapter entry and no layer-3 knob.

The icons are Phosphor, through `@phosphor-icons/react`, imported one module per icon: `import { HeartIcon } from '@phosphor-icons/react/dist/ssr/Heart'`. A barrel of the whole set is one multi-megabyte file that development builds cannot trim, so it is never imported. `<Name>Icon` is the regular weight; `withWeight(<Name>Icon, 'fill')` from the `Icon` atom is the marked one, and `'bold'` the checks. No second icon package: one silhouette in two weights is what the filled-means-marked rule needs.

## React

Write components as described in [`REACT.md`](../REACT.md): a component extends an HTML element and sends its props to the first element or to the one that matters, builds its class with `generateClasses` including the user's `className`, and is a Server Component unless it needs the browser.

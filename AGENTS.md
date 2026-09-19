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
| `l-stack` | vertical flow in rhythm units, space on the joint | `--l-stack-gap` |
| `l-measure` | the text measure — body, narrow or apparatus | `--l-measure` |
| `l-rule` | the rule as a separator between blocks | — |
| `l-cluster` | horizontal grouping on the inner space axis | `--l-cluster-gap` |
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

Modifiers use the repository's `.-modifier` form: `.l-stack.-tight`,
`.l-measure.-apparatus`.

Two rules that decide most questions:

- **Flow space comes from `--app-rhythm-*`, inner space from `--app-space-*`.**
  Stacking with `mb-3` mixes the two and the vertical rhythm never closes.
  Anything the eye reads as descending the page belongs to `l-stack`.
- **Mechanics come from the library, values come from us.** `d-flex`,
  `order-*`, `position-*`, `overflow-*`, `d-md-none` and the 12-column grid are
  used directly. Colour, radius, shadow and typography utilities are not used at
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

The icons are Phosphor, through `react-icons/pi` — `Pi<Name>` is the regular
weight, `Pi<Name>Fill` the marked one. No second icon package: one silhouette in
two weights is what the filled-means-marked rule needs.

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


## CSS

Use the BEM naming convention: a block, its elements, and modifiers on either.

BEM has two levels, however many the markup has. Do not nest an element inside
another element just because the HTML nests them — the resulting class is an
element of an element, which BEM has no shape for.

```scss
// bad
.app-layout {
  &__aside {
    &-stack {
    }
  }
}

// good when the parent's name is part of what this thing IS
.app-layout {
  &__aside {
  }

  &__aside-stack {
  }
}

// better when it can stand on its own name, even though the markup nests it
.app-layout {
  &__aside {
  }

  &__stack {
  }
}
```

Both good forms declare the same class the bad one compiles to. What the bad
form loses is in the source: `app-layout__aside-stack` no longer exists as text
anywhere, so nobody can find it by searching; the nesting says "only inside the
aside" when it says no such thing; and moving the element elsewhere in the
markup leaves its styles filed under a parent it no longer has.

Two things this does NOT forbid:

- a modifier on an element — `&__aside { &--open { } }` is
  `.app-layout__aside--open`, a shape BEM has;
- a block nested inside another block's element — `&__aside { .modal { &__body
  { } } }` declares `.modal__body`, an element of `.modal`.

`recepta/no-nested-bem-element` in `tools/stylelint/` enforces this. It reads
the direct parent only, which is what makes the two exceptions above pass.

### The order rules are written in

CSS breaks ties by source order, so the order inside a block IS the override
order. Write a block in this order:

```scss
.bloco {
  .outro-bloco {}

  &__elemento-menor {}

  &__elemento-maior {}

  &--modificador {
    .outro-bloco {}

    .bloco__elemento-menor {}

    .bloco__elemento-maior {}
  }

  @media () {
    &--modificador {
      .outro-bloco {}

      .bloco__elemento-menor {}

      .bloco__elemento-maior {}
    }
  }
}
```

Reading down: the other blocks that appear inside this one, then this block's
own elements from the smallest to the largest, then the modifiers repeating the
same order inside, then the media queries with the modifiers inside them.

The point is the modifiers. A modifier exists to change something, and most of
what it changes are the block's own elements, so it has to be able to win
against them. Written after them it wins on source order even at equal weight;
written before them it silently loses to the rule it was meant to override, and
the usual repair is `!important` or a third class, which is the same bug with
more code.

Inside a modifier, write the element's full class rather than `&__elemento`.
`&` there is `.bloco--modificador`, so `&__elemento` compiles to
`.bloco--modificador__elemento` — a class no markup carries. `.bloco__elemento`
compiles to `.bloco--modificador .bloco__elemento`, which is the rule you
wanted, and it stays findable by searching for its own name.

The media queries go last for the same reason: `@media` adds no weight, so a
narrow-screen override only lands if nothing written after it says otherwise.

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

`l-target` grows the element's OWN box, transparent around what is painted. It
does not draw a bigger overlay: the browser's focus ring outlines the element's
box and not a pseudo-element, so an overlaid target puts the ring around the
drawing instead of around the area that answers to touch. `.-flush` pairs with
`--l-target-painted` to hand the layout back only the painted height, so the
target grows outwards without shoving its neighbours.

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

The icons are Phosphor, through `react-icons/pi` — `Pi<Name>` is the regular
weight, `Pi<Name>Fill` the marked one. No second icon package: one silhouette in
two weights is what the filled-means-marked rule needs.

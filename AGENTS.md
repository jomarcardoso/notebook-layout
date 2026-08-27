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

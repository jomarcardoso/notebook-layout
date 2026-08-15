---
# =============================================================================
# Machine-readable decisions. An agent reads THIS; a person reads the prose.
#
# Keep the two in agreement. Tooling trusts the front matter, so a document
# whose YAML contradicts its own text is worse than one with no YAML at all.
#
# This file lives in `notebook-layout` and not in `www`, because the design
# system IS this package. `www` is one consumer and will not be the last; a
# language that lives in a consumer is a language the next consumer re-invents.
# =============================================================================
archetype: editorial-premium

density: comfortable
platform: mobile-first

radius: subtle                    # radius-control 4px, radius-surface 6px
elevation: borders
elevationCarrier: border-color

accessibility: AA
statusColours: traditional        # danger, success, warning, info

# The functional school — Atlassian's. A colour per JOB, not per rank.
#
#   action    slate  #425668  what DOES something
#   selected  cocoa  #5f3212  what has been CHOSEN
#   link      toffee #9a5410  where the text GOES
#   pen       ink    #005bac  what the USER wrote
#
# `primary` and `secondary` are absent on purpose. They are RANKS — which of
# two buttons matters more on a screen — and the product spent months unable to
# answer "which brown is primary" because the question was being asked in a
# vocabulary that had no word for roles. It is not answerable and no longer
# needs to be.
colourStrategy: functional

# Three treatments, ONE colour. Emphasis here is carried by fill, border and
# nothing — never by hue.
#
#   filled   bg-action + fg-on-action
#   outline  border-action + fg-action, no fill
#   ghost    fg-action only, bg-action-subtle on hover
secondaryAction: outline

voice: undecided                  # default applied: warm
voiceExceptions: undecided
ctaMood: undecided                # default applied: infinitive

# Answers that went AGAINST the archetype. An empty list is the normal case.
deviations: []

# Ergonomics that outranked the archetype. Not a compromise — the system
# working as intended.
overrides:
  - decision: size-control 44px, against Editorial's 40px
    because: >
      mobile-first. The app is used one-handed at a counter while cooking, and
      40px is a miss target on a phone.

guardrails:
  - rule: >
      A component that can be CHOSEN takes all of its states from the `selected`
      family; a component that ACTS takes all of its states from `action`.
      Hover is the preview of the state that comes next, not an independent
      colour decision.
    enforcement: build
    signature: scripts/check-state-families.mjs

  - rule: Application and component code reads only layer 2 (`--app-*`)
    enforcement: stylelint
    signature: npm run lint:layers

  - rule: >
      Every `var(--app-*)` reference to a layer 3 token carries its layer 2
      fallback. Without it the declaration is invalid and the browser drops it
      in silence.
    enforcement: build
    signature: scripts/check-dangling-refs.mjs

  - rule: Status colour reports an outcome; it never marks an action
    enforcement: document

  - rule: The paper texture is a surface, never a container for small text
    enforcement: document
---

# Design language — Caderninho de Receitas

A personal recipe notebook: recipes are written, edited and read back on a
phone, often one-handed, often in a kitchen with wet fingers and bad light. The
promise is that it feels like *your* notebook rather than a database with a form
on top — which is why the paper texture, the ruled input lines and the ink
colours are structural decisions and not skin.

**Archetype: Editorial & Premium.** Chosen, not inherited. Serif headings,
near-flat elevation, hierarchy carried by line and whitespace rather than
shadow, generous leading. Every structural value comes from the archetype's own
matrix, with one override: `size-control` rises from 40px to 44px because
mobile-first outranks a stylistic preference. That is the system working, and it
is recorded as an override rather than a deviation for exactly that reason.

There are no deviations. An earlier pass described this product as a *hybrid* —
which was a description of what happened to be running, not a decision. The
difference matters: a hybrid has no defaults to fall back on, so every new
component becomes an argument.

---

## 1. Principles

- **It reads like handwriting, not like a form.** When two options are on the
  table, the one that looks like something a person wrote wins. Ruled lines, ink
  colour and the dashed field border exist for this.
- **The kitchen is a hostile environment.** Glare, distance, one hand, wet
  fingers. A control that is elegant at desk distance and ambiguous at arm's
  length has failed.
- **Blue acts, brown marks, ink is yours.** Colour answers *what kind of thing
  is this*, never *how important is it*.
- **Texture is a surface, never a background for small text.** The noise layer
  costs contrast. Anything below body size sits on a flat surface.

---

## 2. Visual foundations

### Colour

Four hues, four jobs, and the pairs that carry text are measured at build time
by `themes.check-contrast()` — the build refuses to compile below 4.5:1.

| role | value | what it is | worst measured |
|---|---|---|---|
| `action` | `#425668` slate | a button fill | white on it, 7.60:1 |
| `selected` | `#5f3212` cocoa | tab, pill, chip, checked control, active field label | white on it, 10.76:1 |
| `link` | `#9a5410` toffee | where the text goes | 4.85:1 on a pressed surface |
| pen | `#005bac` | field text, and the tick in a checkbox | 6.52:1 on a card |

**The two browns are two colours, not two steps.** Cocoa is dark chocolate —
desaturated, deep. Toffee is milk chocolate — 81% saturated at 33% lightness
against cocoa's 68% at 22%, a 1.87× separation in luminance on top of a
13-point jump in saturation.

**The link value was chosen by the build, not by eye.** `#a25a12` was the first
pick and measured a comfortable 4.99:1 on the page — but 4.42:1 on
`surface-active`, and the contrast gate refused to compile. `#9a5410` is the most
saturated step that clears the floor on all four surfaces a link can sit on.

**Pen has a deliberately narrow scope.** It is the text inside a field and the
tick in a checkbox — a box on paper is ticked, not filled, and the tick is the
user's own mark. It is never an action colour and never a link.

**Status colours are reserved.** A full traditional family, muted toward the
notebook's warmth so a tag never outshouts the photograph beside it. `info`
borrows the pen rather than inventing a fourth blue. A status colour reports an
outcome; it never marks an action that has not happened yet.

### Typography

- **Heading:** Cinzel, serif · **Body:** Dosis, sans · **Display:** the
  handwriting face, declared and waiting to be loaded.
- **Leading 1.7**, the archetype's own.
- Hierarchy comes from size and weight. Headings also carry cocoa, which is
  flavour on top of a hierarchy that already works without it — necessary now
  that a status family exists to compete.
- Font sizes in `rem`, spacing in `px`.

### Spacing and grid

- **Base unit 4px.** Every gap is a multiple.
- Grid from CoreUI, extended locally to 16 columns.
- Space belongs to the **container**, not the item.

### Elevation

- **Borders carry hierarchy.** Two shadows exist and only for the two things
  that genuinely float — a dialog and a menu.
- Paper rules stay soft (`border-subtle`, 1.32:1). That is deliberate and it is
  not a contrast failure: WCAG 1.4.11 governs a control the user must be able to
  FIND, not the line between two rows of a list. The one border that *is* a
  control's entire visible boundary — the outline button's — is `border-action`
  at 7.23:1.

---

## 3. Voice

**Undecided.** Nothing in the code records how the product talks; the applied
default is `warm` with infinitive CTAs. Recorded as a gap rather than invented,
so it stays visible.

---

## 4. Interaction and motion

- **States.** Every interactive element has `default`, `hover`, `focus-visible`,
  `active` and `disabled`. `focus-visible` is the only state a keyboard user
  has and is not a redundant `hover`.
- **Hover belongs to the same family as the state it precedes.** This is the
  guardrail with a script behind it, and it exists because the product shipped
  the inversion: a nav item previewed the action colour on hover and committed
  to the selection colour on click.
- **Focus ring:** `--app-ring-*`, pen blue.
- **Durations and easing** come from `--app-duration-*` and `--app-ease`.
- **`prefers-reduced-motion` is not yet honoured.** Two illustration animations
  still run unconditionally. Known gap.

---

## 5. Composition — do and don't

### Do

- Put cocoa on things that are *chosen*: active tab, active pill, active field
  label, section band, checked control.
- Use one action colour at three emphases — filled, outline, ghost.
- Keep small text off the textured surface.

### Don't

- Don't use cocoa for a call to action.
- Don't read a library variable (`--cui-*`, `--bs-*`) from component code.
- Don't add a third elevation step.

### Enforced by the build

| Rule | Where | What fails |
|---|---|---|
| States stay in one family | `check-state-families.mjs` | `npm run build:tokens` |
| Only layer 2 in components | `stylelint.config.cjs` | `npm run lint:layers` |
| No dangling layer 3 refs | `check-dangling-refs.mjs` | `npm run build:tokens` |
| No two adapters disagreeing | `check-collisions.mjs` | `npm run build:tokens` |
| Every colour pair ≥ 4.5:1 | `themes.check-contrast()` | Sass will not compile |

---

## Known debt

Counted rather than described, because a number gets fixed and an adjective does
not.

- **29 declarations** in this library's components still read the old
  `var(--color-*)` vocabulary or a colour literal. `npm run lint:layers` lists
  them. They keep working — the adapter shims the old names onto layer 2 — and
  the lint stops new ones being added.
- **`www` still reads the old vocabulary** across roughly 30 stylesheets. Same
  shim, same retirement path: replace at the call site, then delete the shim
  line.
- `utils/theme-white/_variables.scss` still mixes palette, role assignment and
  component geometry. Only the geometry belongs there now.
- Voice is undecided.
- `prefers-reduced-motion` is not honoured.

---

*Generated from the discovery interview, run as a conversion against an existing
system, on 2026-08-10. Revised 2026-08-11 when the archetype was decided rather
than described.*

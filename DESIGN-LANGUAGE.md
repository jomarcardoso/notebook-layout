---
# =============================================================================
# Machine-readable decisions. An agent reads THIS; a person reads the prose.
# Keep the two in agreement. Tooling trusts the front matter, so a document
# whose YAML contradicts its own text is worse than one with no YAML at all.
#
# This file lives in `notebook-layout` and not in `www`, because the design
# system IS this package. `www` is one consumer and will not be the last; a
# language that lives in a consumer is a language the next consumer re-invents.
# =============================================================================
archetype: hybrid

# A hybrid normally has no default to fall back on, which is why the previous
# pass of this document rejected the label. This one earns it: the product is
# not one style loosely mixed, it is TWO REGISTERS with a rule that says which
# screen gets which. A screen with no instruction is `livro` — so there is
# always a default, and `caderno` is the marked case that has to be asked for.
archetypeNote: >
  ONE look, at two degrees of rusticity — not two themes. Same palette, same
  faces, same components everywhere; what changes is HOW MANY notebook
  elements a screen carries and how much imperfection it allows. `caderno`
  is the most hand-filled end: taped photographs, things slightly out of true,
  ruled space waiting to be written on. `livro` is the same notebook printed
  more carefully — fewer marks, less tilt, tidier alignment. A reader must
  never wonder whether they are still in the same product; they should only
  feel that one page was filled in by hand and another was set properly.

# Extension to the template's schema, and the most load-bearing block here.
# An agent decides register FIRST, then reads the rest of this file through it.
registers:
  caderno:
    pages: [home / my recipes, recipe create and edit]
    feels: >
      A guided but hand-filled notebook page: ruled space to write, marked
      space to paste a photo. Modelled, not blank. Tape on the photographs,
      things a degree or two out of true — the imperfections of something a
      person organised themselves.
  livro:
    pages: [recipe detail, explore, search, settings]
    feels: >
      The SAME notebook, printed more carefully. Not another product and not
      another theme: same paper, same board, same ink. Fewer marks, no tape,
      nothing crooked. Rustic is a dial, and this is it turned down.

density: comfortable
platform: mobile-first

# Every screen is one of three kinds, and the kind decides its chrome. It is a
# STACK: a primary page is the ground, a contextual page sits on it, an edit
# page sits on that. "meu caderninho -> receita -> cozinha".
#
#   primary      the ground. My recipes, Explore. Stable header, no back.
#   contextual   opened FROM somewhere. Search results, a recipe. Has back.
#   editing      the deepest, and the only one that can be abandoned. Recipe
#                writing. Cancel and save rather than navigation.
#
# An agent deciding what a page's header and nav should hold answers this
# question first.
pageKinds: [primary, contextual, editing]

radius: subtle                    # radius-control 4px, radius-surface 6px
elevation: borders
elevationCarrier: border-color

accessibility: AA
statusColours: brand-adapted

# The functional school — Atlassian's. A colour per JOB, not per rank.
#
#   action    ink    #403831  what DOES something
#   selected  cocoa  #5f3212  what has been CHOSEN
#   link      toffee #9a5410  where the text GOES
#   pen       blue   #005bac  what the USER wrote
#
# `primary` and `secondary` are absent on purpose. They are RANKS — which of
# two buttons matters more on a screen — and the product spent months unable to
# answer "which brown is primary" because the question was being asked in a
# vocabulary that had no word for roles.
colourStrategy: functional

# VALUES ARE NOT FROZEN, and this is a decision rather than an omission. The
# brown is here because a recipe notebook's cover is cardboard — recycled,
# unbleached, warm — and that association is what must survive. Which browns,
# and how much of the product is brown, may move for a better result. What may
# NOT move is the role structure above: whatever the values become, `action`,
# `selected`, `link` and `pen` stay four distinguishable jobs.
colourPolicy: roles-fixed-values-open

secondaryAction: outline

voice: warm
voiceExceptions: undecided        # see Known gaps
ctaMood: infinitive

# Answers that went against the DEFAULT register (`livro`). Each one is scoped
# to `caderno` — that scope is what stops them leaking across the product, and
# it is why they are deviations rather than a second archetype.
deviations:
  - decision: Physical treatments — taped photograph, sticker-weight action, cover-like nav
    against: livro / editorial restraint
    scope: caderno
    reason: >
      The promise is that it feels like YOUR notebook. An earlier attempt
      applied these everywhere and was abandoned as visually heavy — the fault
      was the spread, not the idea. A real notebook has three or four physical
      touches on a page, not a page made of them.
    accepted: 2026-08-15

  - decision: Paper texture on the sheet surface
    against: livro / flat surfaces
    scope: caderno
    reason: >
      Paper fibre, not grain. The previous texture was `feTurbulence`
      fractal noise — granulated, which is the thing that was rejected. Never
      behind small text; see guardrails.
    accepted: 2026-08-15

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

  - rule: >
      NO FREE HORIZONTAL SCROLLING ON DESKTOP. A sideways shelf is a phone
      pattern: it works with a thumb and it is hostile with a mouse, where
      reaching the hidden items means dragging a scrollbar or shift-wheeling.
      On a wide screen a collection WRAPS — the width is there, so use it.
      Free sideways scrolling remains available in portrait only.

      THE EXCEPTION IS A CAROUSEL WITH CONTROLS. What makes a shelf hostile
      with a mouse is the absence of an affordance, not the sideways motion —
      so a track with visible previous/next buttons is allowed on desktop,
      because the pointer has something to click. A carousel without buttons
      is just a shelf and is still refused.
    enforcement: document
    signature: overflow-x in a landscape/min-width query with no paging control beside it

  - rule: >
      ON A PHONE, ACTIONS BELONG IN THE LOWER THIRD. The screen is held in one
      hand and the thumb sweeps an arc at the bottom; a primary action at the
      top of a tall page is a two-handed control. Exceptions are allowed for
      things that are deliberately hard to reach — destructive actions earn
      their distance — but they are exceptions and should be stated as such.
    enforcement: document

  - rule: >
      THE NAVBAR CARRIES NAVIGATION ON A PRIMARY PAGE AND ACTIONS ON A
      CONTEXTUAL ONE. On a recipe, the only navigation is "back"; everything
      else — edit, share, delete — is something you do to what is on screen.
      Repeating the site's sections there wastes the one strip of chrome that
      is always within the thumb's reach.
    enforcement: document

  - rule: Status colour reports an outcome; it never marks an action
    enforcement: document

  - rule: The paper texture is a surface, never a container for small text
    enforcement: document

  - rule: >
      Ink prints INTO the paper. An illustration or a printed mark on the sheet
      composites with `mix-blend-mode: multiply` so the fibre still shows
      through it, and never sits on top as an opaque block.
    enforcement: document

  - rule: >
      Physical treatments belong to `caderno` and are refused everywhere else.
      Which components may carry them is not yet settled — see Known gaps.
    enforcement: document
---

# Design language — Caderninho de Receitas

A personal recipe notebook. Recipes are written, edited and read back on a
phone, often one-handed, often in a kitchen with wet fingers and bad light. The
promise is not "a recipe manager" — it is that the user is holding *their own
notebook*: the one they would have filled by hand, kept nice because they like
it that way, with photographs taped in slightly crooked.

The app is *o meu caderninho de receitas*, and the notebook is the home. Every
journey leaves it, turns some pages elsewhere, and comes back.

**Archetype: hybrid, and deliberately so.** Two registers, `caderno` and
`livro`, assigned per screen in the front matter. This is not indecision
between two styles — it is the product's own argument made visual. The app
exists to show that a plain scribbled text can become something professional,
so the personal register and the published register both have to be real, and
the distance between them has to be visible. A product that rendered the
scribble and the publication in the same clothes would have nothing to
demonstrate.

The previous pass of this document recorded `editorial-premium` with no
deviations. That was accurate about the code and wrong about the product: it
described the flat, sober system that happened to be running, and every
notebook instinct — the sticker button, the paper texture, the crooked
photograph — read as a violation of it. The instincts were not the problem.

---

## 1. Principles

- **Everything returns to the notebook.** *My recipes* is the centre, not one
  page among several. When a flow ends, it ends there; when navigation is
  ambiguous, the answer is the notebook. The user should always feel they
  stepped out, turned some pages, and are on their way back.
  The in-page navigation for this is `notebook-tabs` — the index tabs of a ring
  binder, down the side of the sheet. It is the product's answer to a
  section nav with scroll spy, and it is a notebook element that carries its
  own mechanism: the grips you reach for to land on a page fast.
- **A recipe is private until its owner says otherwise.** Reading one requires
  either owning it or arriving with a share token in the URL. The token is the
  point: it says *you were given this link* rather than *you guessed an id*, so
  a private recipe can be handed to one person without being published to
  everyone. Any surface that lists other people's recipes has to respect that,
  which is why discovery cannot simply read the recipe endpoint.
- **The register decides before anything else does.** Before choosing a
  spacing, a shadow or a photograph treatment, answer: is this screen the
  user's notebook, or a publication? Both answers are available; picking
  neither is what produces a screen that belongs to no product.
- **Ink tints the paper, it does not cover it.** A printed mark soaks in — it
  colours the sheet while the fibre still reads through, and it stays quiet
  enough to leave the pen's own writing in front. This is why printed
  illustration composites with `multiply` rather than sitting on top.
- **The kitchen is a hostile environment.** Glare, distance, one hand, wet
  fingers. A control that is elegant at desk distance and ambiguous at arm's
  length has failed, in either register.
- **Physical touches are rationed, not sprinkled.** A page gets a few. The
  first attempt at this product put weight everywhere and had to be torn out;
  the rule that replaces it is that each physical treatment is named, placed,
  and refused everywhere else.
- **Every notebook element must be the thing it imitates, mechanically.** Not a
  picture of it. The ruled field line is where you write; the spiral holes are
  a punch through the sheet, so they carry a recess and a lit edge; the
  `notebook-tabs` are the index tabs of a ring binder — the grips you reach for
  to land on a page fast — so they behave like a jump, not like a decoration
  that happens to look like one. An element that imitates the look without the
  mechanism is the kind of weight that got the first attempt abandoned.

---

## 2. Visual foundations

The tokens live in `styles/ds/`. This section is the **rules for using them**.

### Colour

- **Roles, not values, are the contract.** `action` ink `#403831`, `selected`
  cocoa `#5f3212`, `link` toffee `#9a5410`, `pen` blue `#005bac`.
- **The brown is a cover, not a theme.** It carries the association of
  cardboard — recycled, unbleached, warm — and that is what has to survive. It
  does not follow that everything is brown, nor that nothing may be. Values may
  move for a better result; the four distinguishable jobs may not.
- **One blue, and it belongs to the cook.** `pen` is the text inside a field
  and the tick in a checkbox — a box on paper is ticked, not filled, and the
  tick is the user's own mark. `info` borrows it rather than inventing a fourth
  blue. `action` was itself a second blue (`slate #425668`) until 2026-08-15,
  which is exactly the mistake this rule exists to prevent.
- **Status colours are adapted**, pulled toward the notebook's warmth so a tag
  never outshouts the photograph beside it — hue family unchanged, because a
  green that is not green stops meaning "it worked".
- **Contrast:** WCAG AA, gated at build time by `themes.check-contrast()`. Not
  an advisory: the theme does not compile below the floor.

### Typography

- **Heading:** Cinzel, serif · **Body:** Dosis, sans · **Display:** the
  handwriting face — **declared and still unfound**, see Known gaps.
- **Leading 1.7.**
- Hierarchy comes from size and weight. Headings also carry cocoa, which is
  flavour on top of a hierarchy that already works without it.
- Font sizes in `rem`, spacing in `px`.

### Spacing and grid

- **Base unit 4px.** Every gap is a multiple.
- Grid from CoreUI, extended locally to 16 columns.
- Space belongs to the **container**, not the item.
- **Spacing steps UP with the viewport, never down.** `--app-pad-surface` and
  `--app-gap-section` both open as the screen grows. A phone has less room to
  give, so it gets the tighter rhythm; the utilities that did the reverse
  (`mt-5 mt-md-3`) are the shape of the mistake to watch for.

### The same job, two devices

A component is not "the mobile one" or "the desktop one" — it is a JOB, and the
job has a different best answer on a thumb than on a pointer. This table is the
product's own mapping, and it is what to consult before building a responsive
variant of anything.

| the job | phone | desktop |
|---|---|---|
| move between sections of a page | scroll spy | tabs (`notebook-tabs`) |
| group related content | panels / sections | panels / sections |
| hide secondary detail | "see more" | accordion / `details`, sticky header |
| interrupt for a decision | modal | side sheet, or a modal in the aside |
| show a set you can page through | carousel, one at a time | carousel, several at a time, **with controls** |
| show a collection | grid, max 2 columns | grid, max 4 columns |

Two of these are load-bearing enough to have their own guardrail above: the
carousel's controls are what make a sideways track acceptable with a mouse, and
the column caps are what stop a grid from becoming a wall.

### Elevation

- **Default is flat.** Borders carry hierarchy, and `livro` has nothing else.
- **`caderno` may be physical, from a closed list.** The list is not settled —
  see Known gaps. Until it is, a new physical treatment is a conversation, not
  a default.
- Paper rules stay soft (`border-subtle`). WCAG 1.4.11 governs a control the
  user must be able to FIND, not the line between two rows of a list. The one
  border that *is* a control's whole visible boundary — the outline button's —
  is `border-action`.

---

## 2b. The notebook's vocabulary

The devices this product may reach for when a screen needs to feel like the
object it imitates. **It is a menu, not a checklist** — the rationing rule
still applies, and a page that used ten of these would be the visual weight
that got the first attempt torn out.

Each one is only worth using if it carries its own mechanism. A picture of a
spiral binding was removed for exactly this reason; the ruled field line stayed
because it is where you write.

**In use today**

- ruled lines — the empty state that invites instead of reporting
- the dashed field border — a written line, not a box
- pen blue — the text the user types, the tick in a checkbox
- cardboard — the cover, carried by the `brand` surface
- the taped photograph — `--taped`, opt-in, deliberately not the default
- the pasted print — mount, lift and a half-degree of tilt
- index tabs — `notebook-tabs`, the grips that jump you to a page

**Available, not yet used**

- sticker-album page with marked spaces to paste into
- stickers, and the stuck-on star
- pencil drawing, alongside pen writing
- highlighter, underline, a change of pen colour
- the teacher's tick and cross when marking exercises
- weak ink that lets the paper's texture show through
- office paper glued onto the page — the sheet the teacher printed
- a page run through a copier or mimeograph
- the "bom dia" drawing you make when the notebook is new
- the space at the top for the date
- recycled paper
- **the cover's softly rounded corner.** The thing to get right is that a
  notebook's corner is *worn* — it has thickness, and an inner shadow is what
  reads as thickness. That is not a ban on `border-radius`; the radius is part
  of the shape. The warning is only against reaching for a radius alone and
  expecting it to feel like a cover.

---

## 3. Voice

Warm, and specifically the warmth of helping someone fill in their own
notebook rather than of a product being charming at them. The app already
speaks this way — *"tomei a liberdade de incluir duas para ti"* — and that is
the register to keep.

The line to hold: the user is the author. The product hands them the pen; it
does not narrate their cooking back to them.

- **Action labels: infinitive** — *"Escrever receita"*, *"Adicionar nova
  lista"*. This was delegated rather than answered, and the reasoning is worth
  recording so it can be overturned knowingly: an imperative (*"Escreva sua
  receita"*) is the app instructing the user, which contradicts the premise
  that the notebook is theirs. An infinitive reads as a list of things they
  can do — a table of contents, which is what a notebook has.
- **Errors say what to do next.** Naming the failure leaves the reader where
  they were.
- **Never blame the user.**

The per-situation register table is **undecided** — see Known gaps.

---

## 4. Interaction and motion

- **States.** Every interactive element has `default`, `hover`, `focus-visible`,
  `active` and `disabled`. `focus-visible` is the only state a keyboard user
  has and is not a redundant `hover`.
- **Hover belongs to the same family as the state it precedes.** The guardrail
  with a script behind it, and it exists because the product shipped the
  inversion: a nav item previewed the action colour and committed to the
  selection colour.
- **Focus ring:** `--app-ring-*`, pen blue.
- **Durations and easing** come from `--app-duration-*` and `--app-ease`.
- **`prefers-reduced-motion` is not yet honoured.** Two illustration animations
  still run unconditionally. Known gap.

---

## 5. Composition — do and don't

### Do

- **Let the recipe card change with its context.** It is one component with
  different jobs: in the notebook it shows what the cook needs to recognise
  their own recipe, and in search it should show the author and how often it
  has been copied — facts that only matter about someone else's. Fat and fibre
  earn their place on a page about eating and not on a page about finding.
- **Style breadcrumbs as the notebook's date line** — the space at the top of a
  page where you write the day. A trail of where you are is the same gesture.
- Put cocoa on things that are *chosen*: active tab, active pill, active field
  label, section band, checked control.
- Use one action colour at three emphases — filled, outline, ghost.
- Keep small text off the textured surface.
- Return the user to the notebook when a flow ends.

### Don't

- Don't use cocoa for a call to action.
- Don't read a library variable (`--cui-*`, `--bs-*`) from component code.
- Don't add a third elevation step.
- Don't carry a `caderno` treatment into a `livro` screen.

### Enforced by the build

| Rule | Where | What fails |
|---|---|---|
| States stay in one family | `check-state-families.mjs` | `npm run build:tokens` |
| Only layer 2 in components | `stylelint.config.cjs` | `npm run lint:layers` |
| No dangling layer 3 refs | `check-dangling-refs.mjs` | `npm run build:tokens` |
| No two adapters disagreeing | `check-collisions.mjs` | `npm run build:tokens` |
| Every colour pair ≥ 4.5:1 | `themes.check-contrast()` | Sass will not compile |
| No colour literal in a stylesheet | `stylelint.config.cjs` | `npm run lint:layers` |
| No colour literal in an inline style | `check-inline-styles.mjs` | `npm run lint:layers` |

---

## Known gaps

Recorded rather than invented. Each one is a question that was asked and not
yet answered; none of them has a value quietly standing in for the answer.

- **Which components may carry a physical treatment.** The register rule says
  `caderno` only. *Which* components — the primary action, the photograph, the
  cover nav, the list label — was not decided. Until it is, the closed list
  cannot be written into `patterns.json`, so the guardrail is `document` and
  not `ledger`.
- **Stickers.** Whether the sticker-weight button returns at all, and on what.
  Not yet considered.
- **The handwriting face.** Searched for repeatedly and not found. The
  constraint is all three at once: legible at body size in bad light, genuinely
  handwritten in feel, and beautiful. `font-family-display` is declared and
  waiting; until a face clears all three, display falls back to the heading
  face.
- **Voice boundaries.** Where warmth drops to plain. The likely answer is
  anything that risks losing what the user wrote, but it was not confirmed.
- **Destructive confirmation and form saving.** Whether deleting a recipe takes
  a modal, a toast with undo, or a typed confirmation; and whether a form saves
  on blur or on submit. In a notebook, writing IS saving — which argues for
  blur — but it has a real cost and was not settled.
- **Visual restrictions.** What the system must never do, and how a build would
  detect it. Not yet considered, so `patterns.json` has no `forbidden` entries
  from this interview.
- **`prefers-reduced-motion`.**
- **The recipe editor is a wizard** and is intended to become a single flowing
  page with cards as separators. Recorded because it changes which screens
  carry the `caderno` register and how much.

---

## How this file is used

**By an agent.** Read `registers` first and decide which one the screen is in;
everything else is read through that. The front matter is read before
generating markup or CSS. When this document and the code disagree, the
document is the intent and the code is the bug — unless the decision has
genuinely changed, in which case update this file in the same commit.

**By a person.** It is the answer to "why is it like that".

**What it is not.** Not the token reference, and not the component vocabulary.

---

*Rewritten from a fresh discovery interview on 2026-08-15, replacing a document
generated on 2026-08-10 as a conversion against the running code. That first
pass described what existed; this one records what was decided. Undecided
answers are marked as gaps rather than filled with defaults, so they stay
visible.*

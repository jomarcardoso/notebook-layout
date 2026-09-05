---
name: compose-monochrome
description: Composes screens in a product whose design system uses the monochrome (accent-driven) colour school — one chromatic pigment, everything else a neutral ladder. Use this when writing or reviewing any page, component or layout in such a product, including "build this screen", "add a section", "why does this look generic", "which button goes here", "should this card have a border". It teaches which mechanism carries which boundary and which treatment carries which role. It does NOT create tokens or run interviews — the design system already exists and this skill spends it.
license: MPL-2.0
---

<!-- skills/compose-monochrome/SKILL.md -->

# Composing a screen in the monochrome school

This skill is for the agent **building pages** in a product whose design system
is already generated. It does not decide anything about the system; it spends
what the system decided, correctly.

Two other skills produced that system: `design-language` chose the pigment, the
ladder and the archetype; `design-patterns` chose which component forms exist.
This one is what runs afterwards, every day, on every screen.

**The long version is `design-language/references/monochrome.md`**, in the
repository that generated the system: the twelve rungs and their jobs, the two
numbering systems that get confused, elevation against excavation, the cross
contrast test, and what that tool does and does not yet enforce. Read it when
this file is not enough; it is the source everything here is compressed from.

## Read this first, in one paragraph

There is exactly **one chromatic pigment** in this product. Everything else is a
ladder of neutrals tinted with a little of that pigment's hue. The colour is
spent with parsimony, and its scarcity is the only reason it means anything: if
one thing on the screen is coloured, that thing is important without needing any
other cue. **Every time you reach for the accent, you are spending the budget
that makes the rest of the screen legible.**

## The rule that decides most questions

> **Treatment replaces hue.**

In other schools "primary action" is blue and "selected" is purple. Here both
are the same pigment, so the difference lives in **how** the pigment is applied.
If two roles come out looking the same, one of them is wrong — and the fix is
never a second colour, because there is no second colour.

| treatment | means | ink |
|---|---|---|
| **filled chromatic** | an INVITATION — something happens if you press | inverted |
| **washed chromatic** | a CONDITION — the interface IS this right now | the accent's text step |
| **filled neutral** | the supporting action | the page's ink |
| **ghost** | tertiary, or anything repeated many times | ink, no fill |

**One filled chromatic per viewport.** One per floating surface. Two solid
accent buttons side by side destroy the hierarchy, because the user gets no
signal about which way forward is expected. If you think you need two, one of
them is secondary and does not know it yet.

**The secondary action is NEUTRAL, never a washed accent.** In a brand-led
product a washed-brand secondary is normal because the brand colour is already
everywhere. Here it steals the scarcity.

**Washed with accent ink for one to three words. Washed with neutral ink for a
sentence or more.** Reading a paragraph in a chromatic colour is tiring, and the
accent's text step is calibrated for a label. A whole callout in blue on pale
blue is the classic version of this mistake.

## Which mechanism carries which boundary

Four mechanisms, in order of visual cost:

| | cost | |
|---|---|---|
| **space** | viewport | Gestalt. Zero attention, zero bytes |
| **tone** | one rung of the ladder | quieter than a line, and groups better |
| **line** | one more stroke the eye processes | cheap in space, expensive in noise |
| **shadow** | it simulates physics, and a lie about physics is uncomfortable without anyone being able to say why | the most expensive |

> **One boundary, one mechanism.**

A card with a different background AND a border AND a shadow is the default
library look you are trying to avoid. When you feel the need for the second
mechanism, it is usually because the first is too weak — strengthen the first.

**The legitimate exception:** an interactive element often needs tone AND
border, because the tone carries identity (this is a field) and the border
carries state (rest → hover → focus). Two mechanisms with two jobs is not
redundancy.

### Start with space. Escalate only when space fails.

Space fails in five recognisable situations, and only these:

- the content is **infinite or scrolling**, so there is no natural end for space
  to mark;
- the items are **heterogeneous** — a chart beside a paragraph beside a table.
  Proximity groups things that are alike;
- the product is **dense** by nature. Dashboards run out of viewport before they
  run out of content, which is why Grafana is made of lines and Medium is made
  of space;
- the block is **clickable as a whole**, and a click target needs visible
  limits;
- the grouping must **survive a different background** — the same card appearing
  on the page and inside a modal.

**If space failed, the next mechanism is tone, not line.** And tone has a limit
nobody documents: **two, at most three levels** before you run out of usable
contrast. Adjacent surfaces sit between 1.05:1 and 1.3:1. Stack four and the
fourth disappears. Depth past level two changes mechanism: the card in tone, and
sections inside it by space.

**Line enters when tone is not visible enough** — which happens most in dark
mode, where the same lightness difference reads as less separation.

**Shadow only for what is temporary and genuinely floats.** Modal, popover,
dropdown. A header and a sidebar do not float; they are fixed chrome. The
healthy ceiling is one permanent level and one temporary.

## Where a border goes, and where it does not

The unifying rule: **a border on an interactive element is affordance and is
required. A border on a container is separation and is the last resort.**

| element | border? | why |
|---|---|---|
| filled button, primary or secondary | no | the fill already delimits it |
| outlined button | yes | structural — it replaces the fill |
| tertiary / ghost button | no, not even on hover | |
| chip | no by default | only when its tone matches the surface it sits on |
| tab | a divider on the rail | the active indicator is not a border |
| segmented control | no | a recessed track with a raised segment |
| card with an image | **no** | the photograph is already the boundary |
| card without an image | tone **or** border | one of the two, never both |
| **input, select, textarea** | **always** | affordance, and 3:1 is required |
| checkbox, radio, switch | yes | same family as inputs |
| washed badge | no | the tone carries it |
| outlined badge | yes | when many sit together and the fills read as patches |
| list divider, header, footer | a hairline | decorative |
| **focus, on anything** | `outline`, never `border` | it never replaces the resting border |

**Form fields are the one place a border is not negotiable**, because without it
a user does not know where to click to type. And note what a field does: a
recessed fill AND a border — the tone says "content fits here", the border says
"clickable", and it scales from rest to hover to focus carrying the state.

**A washed fill is never on its own a signal of interactivity.** Tone reads as
state or as ambience, not as affordance. A clickable washed chip needs a second
cue.

## Contrast: three different requirements, not one

They are different legal requirements, not aesthetic preferences.

| pair | target | |
|---|---|---|
| text on its surface | **4.5:1** | WCAG 1.4.3 |
| what identifies a CONTROL | **3:1** | WCAG 1.4.11 — the boundary of a button, a field, a focus ring |
| a decorative divider | **1.2–1.5:1** | outside 1.4.11. Push every divider to 3:1 and the page becomes striped |
| an interactive border at rest | 1.6–2:1 | |

**A washed fill can sit at 1.1–1.3:1 against the page** and still be correct —
if a 1px border carries the 3:1 that identifies the control. Fill and boundary
are two independent calculations, and the subtle look survives because the
border does the identifying, not the fill.

**And the WCAG ratio is the wrong instrument at the bottom of the ladder.** The
formula is logarithmic and compresses everything near 1.0: the difference
between 1.06 and 1.12 is large to the eye and almost nothing in the number. For
surfaces and dividers measure **ΔL in OKLCH**, which is linear in perception:

| pair | ΔL |
|---|---|
| adjacent surfaces | 0.02 – 0.04 |
| component fill against the page | 0.05 – 0.07 |
| divider | 0.10 – 0.14 |
| interactive border | 0.18 – 0.24 |

Use ΔL for the pale end and contrast ratio for the dark end.

## Status colour is untouched

`success`, `warning`, `danger` and `info` stay chromatic **in every school**. A
destructive confirmation is red. Making danger monochrome trades a universal
convention for aesthetic coherence, and it is not worth it.

## Before you add anything

**Check whether the content already solved it.** Photographs, charts, avatars
and code blocks bring their own surface. A recipe card with a photo needs space
between cards and a consistent corner radius, and nothing else — adding a
border, a fill and a shadow around a photograph is the purest example of
redundant mechanisms.

## Two tests to run on any screen you build

**The grey test.** Force the accent to neutral and look. Does the hierarchy
survive? Can you still tell where to click? If not, colour was doing a job that
belonged to space and typography, and you have built a brand-led product wearing
monochrome clothes.

**The redundancy test.** Find any element that simultaneously has a background
different from its parent, a visible border, and a shadow. That count should be
zero.

Those two cover the school's two failure modes: false hierarchy and excess.

## Typography carries what colour no longer carries

Four levers: **size, weight, neutral rung, space.** Use at most **two per
hierarchy level** — bigger AND heavier AND darker AND more spaced is the same
redundancy error as the borders.

- **Two neighbouring levels sit two steps apart on the scale, never one.**
  Adjacent steps on a 1.2 ratio differ by 20%, which the eye reads as a mistake
  rather than as hierarchy.
- **Two weights, at most three.** Bold and semibold together are
  indistinguishable at a glance and spend a lever for nothing.
- **Never use `opacity` for secondary text.** It multiplies against whatever is
  behind, so the same "secondary" has different contrast on every surface and
  the audit stops meaning anything. Use the declared rung.
- **Tabular numerals** on anything that stacks numbers.
- **Space is directional.** A heading belongs to what comes after it, so the
  margin above is larger than the margin below — typically 2× or 3×.
- **Space between groups is at least 1.5× the space inside a group.** When a
  screen is called confusing and the reflex is to add lines, this ratio is
  almost always the real fault.

## What this skill does not do

It does not add tokens, invent colours, or change the theme. If a screen needs
something the system has no token for, that is a finding for `design-patterns`
and the ledger, not a literal value in a stylesheet. **A product writing CSS
that overrides its own library is evidence that a variable was not set.**

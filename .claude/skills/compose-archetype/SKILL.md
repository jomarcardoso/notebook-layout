---
name: compose-archetype
description: Keeps a screen in character with its product's archetype — Editorial & Premium, Tech Minimalist, Enterprise Solid, Playful & Expressive or Utilitarian & Technical — and with its secondary archetype where one is recorded. Use it when writing or reviewing a page and deciding shape, spacing, typography, motion or which component form to reach for, and when a screen is described as "off", "generic" or "not like the rest of the product". It reads DESIGN_LANGUAGE.md and spends what the archetype already decided; it never chooses the archetype.
license: MPL-2.0
---

<!-- skills/compose-archetype/SKILL.md -->

# Staying in character

Companion to `compose-monochrome`. That one governs colour and boundary; this
one governs **shape, rhythm and voice** — the part of a screen that says which
product it belongs to.

**This skill is deliberately less finished than its companion.** The monochrome
material is settled and measured; the archetype material is thinner and some of
it is judgement wearing a table. Where a row here is a preference rather than a
consequence, it says so. Better an honest gap than a confident guess.

## The first thing to do

Open `DESIGN_LANGUAGE.md` and read four lines:

```yaml
archetype:            # the primary — governs STRUCTURE
archetypeSecondary:   # optional — governs SOUL
secondaryGoverns:     # the closed list of what the secondary decides
deviations:           # what already went against the archetype, and why
```

**Everything you write is measured against the primary.** The secondary governs
only what `secondaryGoverns` names, and never anything structural.

## Primary governs structure, secondary governs soul

A product is rarely one archetype. A recipe notebook is the structure of a
printed cookbook and the warmth of something kept in a kitchen drawer.

| | governs |
|---|---|
| **primary** | everything not listed below |
| **secondary** | only what it is explicitly assigned |

A secondary may govern exactly five things: `voice`, `illustration`, `warmth`,
`motion`, `marks`.

It may **never** govern geometry, the type pairing or the scale, the surface
model, the ladder, density, spacing, the accent budget or elevation. Those are
the primary's, and the reasons are known:

- **Pill buttons beside 4px cards is not two archetypes cooperating**, it is a
  system with no shape.
- **A rounded display face does not warm an Editorial product**, it removes the
  thing Editorial was chosen for.
- **A secondary that may spend the accent** is a second palette arriving one
  component at a time.

If a screen seems to need one of those, the conversation is about changing the
PRIMARY, and it is worth having plainly rather than granting sideways.

## What each archetype actually changes

Read this as what the product already IS, not as a menu.

| | shape | space | type | motion |
|---|---|---|---|---|
| **Editorial & Premium** | 4 / 8px, never pills | generous, asymmetric | a serif pairing; big scale steps | almost none |
| **Tech Minimalist** | 6 / 10px | even, disciplined | one sans, restrained scale | short, functional |
| **Enterprise Solid** | 4 / 8px | efficient, predictable | one sans, small steps | short |
| **Playful & Expressive** | 12 / 20px, pills allowed | loose, bouncy | rounded or display faces | visible and deliberate |
| **Utilitarian & Technical** | 2px, square | tight | small, dense, often monospace | none |

**Editorial's real signature is asymmetric space, not the serif.** A block given
twice the breathing room of its neighbours reads as more important with no other
cue — hierarchy for free, and the archetype's main tool. Teams reach for the
serif and forget the space, and then the page reads as a template with a nice
font.

**Utilitarian and Enterprise pay for borders where Editorial pays for space.**
In high density a border becomes noise: twenty outlined buttons in a toolbar
produce a grid of rectangles. In low density a fill adds visual mass an
Editorial product is selling the absence of. This is the real reason the
secondary action is outlined in one and filled in the other.

## When the secondary shows up

Only in what it governs, and always in small quantities. For a Playful secondary
on an Editorial primary:

- **`voice`** — "Guarde a receita", never "Item salvo com sucesso". The register
  changes; the typography does not.
- **`illustration`** — drawn glyphs beside content, empty states. Never
  photography behind text, and never as chrome.
- **`warmth`** — the pigment in the neutral ladder. A grey ramp would read as an
  office; the sepia is what makes it a notebook.
- **`marks`** — small artisanal markers, a status dot, a category pill.
- **`motion`** — micro-interactions only, and only where the posture allows.

**A screen where the secondary is doing structural work has drifted.** Rounded
corners "because it should feel friendlier" is the secondary reaching into
geometry, and it is the commonest way a two-archetype product loses its primary.

## Posture, which is not an archetype and is often confused with one

`posture: quiet | balanced | loud` decides how loudly the product speaks when
something needs attention, and it is derived from how long a sitting lasts, not
from the archetype.

| `posture` | badges and tags | secondary at rest | divider | control weight |
|---|---|---|---|---|
| `quiet` | quiet fill, muted ink | quiet fill or outline | the faintest step | the body weight |
| `balanced` | quiet fill, body ink | quiet fill | the middle step | the body weight |
| `loud` | solid fill, inverted ink | solid neutral | the strong step | one step heavier |

**A quiet product is one where the content is loudest, not one where the action
is lost.** If the primary action cannot be found on a screen, quiet is being
used as an excuse.

## Deviations are a real answer

An answer that goes against the archetype is allowed and is recorded in
`deviations` with its reason. **What is not allowed is one arriving because
nobody named it.**

Before writing something the archetype's row does not describe, check whether it
is already in `deviations`. If it is, it is settled and you follow it. If it is
not, it is a new one, and it needs a sentence saying why — otherwise the next
person six months from now reads it as a mistake and "corrects" it back.

## What is not settled here

Written down so it is not mistaken for knowledge:

- **The five archetypes are not a taxonomy of every product that can exist.**
  `archetypes.md` says so itself. An expressive dark product — the neon,
  cyberpunk register — is not described by any of the five, and this tool
  cannot currently interview its way there.
- **Motion per archetype is thinner than the rest of this file.** The motion
  rules that ARE solid come from posture, not from the archetype.
- **The shape column is a preset, not a consequence.** Radius is the cheapest
  archetype signal to change and the least argued from first principles: set it,
  look at a real screen, adjust once.

## What this skill does not do

It does not choose the archetype — that is question 3 of the interview, and it
belongs to the client. It does not add tokens. And it does not override
`compose-monochrome` on colour: where the two seem to disagree, colour and
boundary belong to the school and shape and rhythm belong here.

<!-- templates/START.md — copied into a project by scripts/vendor.mjs -->

# You have just vendored a design foundation

Read this once. It is short, and it is the difference between using the system
and fighting it.

---

## What arrived

```
<styles>/            the foundation. Do not edit it — see "the one rule" below
<styles>/templates/  the entry template you copy and then own
<scripts>/           the checks. Every one takes a directory argument
<skills>/            how to write pages in this school, for whoever writes them
VENDORED.json        the commit this came from, a hash per file, and the three
                     roots above — which is why later runs need no arguments
```

The three roots default to `src/styles/ds`, `scripts/ds` and `.claude/skills`,
and a project that keeps its styles somewhere else passes `--styles=`,
`--scripts=` and `--skills=` on the first copy only.

## The one rule

**Do not edit anything under `src/styles/ds/`.** It is a copy, and the next
update overwrites it.

Everything you need to change is reachable without touching it:

| you want to change | you edit |
|---|---|
| a colour | `theme.scss` |
| the pigments the ramp is built from | `palette.scss` |
| what a component reads (layer 3) | `_setup.scss` |
| what the library compiles with | your entry, copied from `templates/` |
| which classes are allowed | `patterns.json` |

If something genuinely needs a change inside `ds/`, make it, and then run the
check FROM THE FOUNDATION'S OWN CHECKOUT — `node scripts/vendor.mjs <this project>
--check` — before every update. The script stays where the foundation is, because
it reads both sides to tell local edits and upstream changes apart, and a copy
of it here would only ever see one. Better still: take the change upstream.

---

## The four layers, in one paragraph each

**Layer 1 — the ramps.** Two pigments and a twelve-step ladder generated from
each. It compiles away entirely; nothing in your application ever names a step.

**Layer 2 — the tokens.** `--app-*`. This is the **only** public contract. Your
components read these and nothing else. A hex value in a component is a bug.

**Layer 3 — the naming contract.** Sass variables that decide *which* layer 2
token a component part reads. Empty by default and free until used. This is how
you say "a badge's ink is the muted one" without writing a badge.

**The adapter.** Binds the library's own variables (`--cui-*`) to layer 2, so a
theme swap moves the library along with your own components.

---

## The one idea that explains most bugs

**A rung is a distance from the surface, not a property of a component.**

A fill calibrated against the page is a different distance inside a card. The
same token is right in one place and invisible in the other, and the symptom is
always the same sentence: *everything inside cards works and everything on the
page looks flat.*

The fix is never per component. Put `data-surface="surface"` (or `"sunken"`, or
`"raised"`) on the container, and every rung inside it shifts by the distance
between the two planes. Text deliberately does not shift — a region that wants
quieter text is choosing a different **role** (`fg-muted`), which is a decision
someone makes, not a context that derives.

---

## Run this first

```bash
node scripts/ds/check-doc-tokens.mjs <your-styles-dir>
node scripts/ds/audit-wash.mjs <your-styles-dir>
node scripts/ds/check-ladder.mjs <your-styles-dir>
```

`audit-wash` is the one to read carefully. It tells you whether your palette can
have a **washed accent** at all — a pale tint meaning "the interface is currently
in this state". Three things decide it, and they are physics rather than taste:
chroma against the neutral beneath, the sRGB gamut ceiling for that hue at that
lightness, and hue distance from the neutral. Past about 150° a pale patch of the
accent reads as a stain on the page rather than a tint of it.

If it says **unavailable**, that is not a downgrade. Set `$accent-wash: false` and
every subtle slot routes to the neutral family, while the accent lives where a
near-complementary pair has always been good: solid fills, dark ink, and small
solid indicators. Cream paper and blue ink is that pairing, and it has been a
good idea for four hundred years — as navy on a page, never as pale blue on cream.

---

## The checks, and what each one is for

Every one takes a directory and most take `--gate` to fail a build.

| check | the question it asks |
|---|---|
| `check-derived` | does any colour a **library** chose reach a class your ledger allows? |
| `check-coverage` | does the build define every class your ledger promises? |
| `check-ladder` | does every fill separate from the surface it sits on? |
| `check-focus-collision` | is the accent outline reserved for focus? |
| `check-radius` | is there a radius scale, or one value written three times? |
| `check-token-axis` | does each token family speak one naming axis? |
| `check-doc-tokens` | does a document name a token the build does not emit? |
| `audit-wash` | can this palette have a washed accent at all? |
| `audit-contrast` | does every text pair clear AA, in every theme? |

They exist because each one caught something no human review did. Wire the ones
that pass into your build as gates on the day they pass, not later.

---

## Two habits that are worth more than any check

**Open the page and measure.** Every serious finding in this system's history
came from rendering something and reading a computed value, not from reading
code. A guard blind to part of its input reads exactly like a guard that passes.

**When a decision changes, re-read the prose that explains it.** `check-doc-tokens`
catches the narrow version — a document naming a token that no longer exists —
and cannot catch a paragraph that is simply now untrue. That one is on you.

---

## If this is Recepta

The design language already exists and you are not starting an interview. The
palette, the theme, the layer 3 configuration and the ledger come straight from
`example/recepta-monochrome-coreui` in the foundation's own repository: cream
paper, ballpoint blue, the Editorial & Premium archetype with a playful secondary,
`colourStrategy: monochrome` and `$accent-wash: false`.

Copy those five files, point the entry at them, and the first real work is the
ledger: an application built from React components has patterns in the `wrapped`
state where a static page had them `raw`, and that transition is exactly what the
ledger was built to record.

// scripts/lib/catalogues.mjs

// =============================================================================
// WHAT THE TWO CATALOGUES ARE, AND WHICH ANSWERS CAN COEXIST
// =============================================================================
//
// Shared by the checker and the map generator. It lives here rather than in the
// checker because importing a SCRIPT to borrow its constants runs the script —
// which it did, and the map generator printed the checker's report instead of a
// map. A module that only declares is safe to import; a module that also acts
// is not.
// =============================================================================

// `layout-forms.md` was written second and deliberately in the same table
// shape, so the checker needed no second implementation and a page shape cannot
// drift out of the vocabulary while a component shape stays in it.
export const CATALOGUES = [
  ['component', 'skills/design-patterns/references/component-forms.md'],
  ['layout', 'skills/design-patterns/references/layout-forms.md']
];

// Families written as an axis matrix rather than a form catalogue. Listed so
// they are reported as skipped rather than silently dropped — a family that
// vanishes from a coverage report is the worst outcome available here.
export const AXIS_SHAPED = new Set(['Table']);

// Answers the questionnaire and the derivations fix to each other. Enumerating
// the raw product would invent combinations no interview can produce and then
// report holes in them, which is a checker manufacturing its own bugs.
//
// Each rule declares which axes it READS, so it can be left out for a family
// that does not mention them all: a rule pairing elevation with separation says
// nothing useful to a family naming one and not the other, since all three
// separations are reachable under some elevation.
export const COHERENT = [
  {
    reads: ['elevation', 'surfaceSeparation'],
    test: (a) =>
      (a.elevation === 'borders') ===
      (a.surfaceSeparation === 'lines' || a.surfaceSeparation === 'tones')
  },
  {
    reads: ['surfaceSeparation', 'surfaceModel'],
    // Tone as the separator needs a rung to spend it on.
    test: (a) => !(a.surfaceSeparation === 'tones' && a.surfaceModel === 'flat')
  },
  {
    reads: ['colorCriticalWorkspace', 'surfaceModel'],
    // derivations.md §S: a lit chrome is the thing the flag exists to prevent.
    test: (a) => !(a.colorCriticalWorkspace === 'true' && a.surfaceModel === 'elevated')
  }
];

// scripts/check-utilities.mjs

// =============================================================================
// UTILITY CHECK — a Tailwind class that generates nothing
// =============================================================================
//
// Tailwind only emits a utility when the theme has a matching key. Write
// `text-fg-selected` with no `--color-fg-selected` in the `@theme` block and
// you get no rule, no warning, and an element that silently inherits.
//
// That is a nastier failure than a wrong colour, because a wrong colour is
// visible. This was found when an icon that should have turned orange on card
// hover stayed black — the class was there, the token was there, and the BRIDGE
// between them was not.
//
// The check is deliberately dumb: collect the colour-ish utilities the markup
// uses, and assert each one appears as a selector in the compiled CSS.
//
//     node scripts/check-utilities.mjs <html-file> <css-file> [more-css…]
// =============================================================================

import { readFileSync } from 'node:fs';

const [htmlPath, ...cssPaths] = process.argv.slice(2);

if (!htmlPath || !cssPaths.length) {
  console.error('usage: check-utilities.mjs <html> <css…>');
  process.exit(2);
}

const html = readFileSync(htmlPath, 'utf8');
const css = cssPaths.map((p) => readFileSync(p, 'utf8')).join('\n');

// Only the families that take a THEME key. `flex`, `p-4` and `text-left` do
// not, and including them would make this cry wolf.
const THEMED = /^(?:[a-z-]+:)*(?:bg|text|border|border-[xytrbles]|fill|stroke|ring|outline|caret|divide|shadow|from|via|to|accent|decoration|placeholder)-[a-z][a-z0-9-]*$/;

// Values that are Tailwind's own, not this design system's, plus the
// non-colour utilities that share a prefix.
const BUILT_IN = /-(?:transparent|current|inherit|white|black|none|auto|left|right|center|justify|start|end|wrap|nowrap|balance|pretty|ellipsis|clip|top|bottom|solid|dashed|dotted|hidden|\d+(?:\.\d+)?|xs|sm|base|lg|xl|\dxl)$/;

const used = new Set();
for (const m of html.matchAll(/class="([^"]+)"/g)) {
  for (const cls of m[1].split(/\s+/)) {
    if (!cls || !THEMED.test(cls)) continue;
    if (BUILT_IN.test(cls)) continue;
    if (cls.includes('/')) continue; // opacity modifiers resolve differently
    used.add(cls);
  }
}

// A generated utility appears as an escaped selector: `.hover\:bg-page:hover`.
const escapeForSelector = (cls) => cls.replace(/[.:/[\]]/g, (c) => '\\\\?' + c);

const missing = [...used].filter((cls) => {
  const re = new RegExp('\\.' + escapeForSelector(cls) + '(?![a-z0-9-])');
  return !re.test(css);
});

const label = htmlPath.split(/[\\/]/).slice(-2).join('/');

if (missing.length) {
  console.error(`\n${label}: ${missing.length} class(es) generate no CSS\n`);
  for (const m of missing.sort()) console.error(`  ${m}`);
  console.error(
    '\nEach of these is a no-op in the browser. Either the theme key is missing\n' +
      'from the `@theme` block, or the class is a typo. Both look identical on\n' +
      'screen: the element just inherits.\n'
  );
  process.exit(1);
}

console.log(`${label}: ${used.size} themed utilities, all generated.`);

// scripts/export-tokens.mjs

// =============================================================================
// DTCG EXPORT — the token layer as a W3C Design Tokens document
// =============================================================================
//
//     node scripts/export-tokens.mjs
//
// Produces two files, both additive: nothing in the CSS build reads them, and
// deleting them changes nothing.
//
//   dist/tokens.json     the tokens, in the Design Tokens Format Module
//                        (CG-FINAL, 2025-10-28)
//   dist/resolver.json   themes and surfaces as modifiers with contexts, in
//                        the Resolver Module (CG-FINAL, 2025-10-28)
//
// -----------------------------------------------------------------------------
// WHY EXPORT AT ALL, GIVEN NOTHING HERE CONSUMES IT
// -----------------------------------------------------------------------------
//
// Because the token layer is the one part of this system that other tools want.
// A designer editing colour in Figma via Tokens Studio, a native app that needs
// the same palette, a documentation site that wants to render swatches — all of
// them speak DTCG and none of them speak Sass. The CSS build stays the source
// of truth; this is a second, machine-readable face of the same decisions.
//
// -----------------------------------------------------------------------------
// WHAT IT READS
// -----------------------------------------------------------------------------
//
// The compiled CSS, not the Sass source. That is deliberate: the compiled output
// is what the system actually ships, so an exporter reading it cannot drift from
// reality the way one reading the source could. The cost is that references are
// already resolved — see the note on `$value` below.
//
// TWO files, because the foundation ships no theme. `dist/ds.css` carries
// structure; `dist/demo-themes.css` carries the demonstration pages' three
// palettes. An export of structure alone reports zero themes and zero surfaces
// — true of the tool, and useless as a token file. A product points this at its
// own build instead.
// =============================================================================

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const CSS = ['dist/ds.css', 'dist/demo-themes.css'];
const PREFIX = '--app-';

for (const file of CSS) {
  if (!existsSync(file)) {
    console.error(`${file} not found — run \`npm run build:tokens\` first.`);
    process.exit(2);
  }
}

const css = CSS.map((file) => readFileSync(file, 'utf8')).join('\n');

// -----------------------------------------------------------------------------
// Parse
// -----------------------------------------------------------------------------

// Declarations under `:root` (or the default theme's `:root, [data-theme=x]`)
// are the base set; each `[data-theme="…"]` block is a theme; each
// `[data-surface="…"]` block is a surface context.
const blocks = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({
  selector: m[1].trim(),
  body: m[2]
}));

const declarationsOf = (body) =>
  Object.fromEntries(
    [...body.matchAll(/(--app-[a-z0-9-]+)\s*:\s*([^;]+)/g)].map((d) => [
      d[1].slice(PREFIX.length),
      d[2].trim()
    ])
  );

const base = {};
const themes = {};
const surfaces = {};

for (const { selector, body } of blocks) {
  const decls = declarationsOf(body);
  if (!Object.keys(decls).length) continue;

  const theme = selector.match(/\[data-theme=["']?([a-z0-9-]+)/i);
  const surface = selector.match(/\[data-surface=["']?([a-z0-9-]+)/i);

  if (surface) {
    surfaces[surface[1]] = { ...(surfaces[surface[1]] ?? {}), ...decls };
  } else if (theme) {
    themes[theme[1]] = { ...(themes[theme[1]] ?? {}), ...decls };
    // The default theme also lands on `:root`; those declarations belong to the
    // theme, not to the structural base.
    if (/(^|,)\s*:root\s*(,|$)/.test(selector)) continue;
  } else if (/(^|,)\s*:root\s*(,|$)/.test(selector)) {
    Object.assign(base, decls);
  }
}

// Structural tokens are the ones no theme redefines: spacing, radius,
// typography, motion. Colour is theme-dependent by definition.
const themedNames = new Set(Object.values(themes).flatMap(Object.keys));
const structure = Object.fromEntries(
  Object.entries(base).filter(([k]) => !themedNames.has(k))
);

// -----------------------------------------------------------------------------
// Type inference
// -----------------------------------------------------------------------------
//
// `$type` is required by the spec, directly or inherited. It is inferred from
// the value rather than from a hand-written table, so a token added to layer 2
// is exported correctly without anyone remembering to update this file.

const OKLCH = /^oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*(?:\/\s*([\d.]+))?\s*\)$/i;
const HEX = /^#([0-9a-f]{3,8})$/i;
const RGBA = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\s*\)$/i;
const DIMENSION = /^(-?[\d.]+)(px|rem)$/;
const DURATION = /^(-?[\d.]+)(ms|s)$/;
const NUMBER = /^-?[\d.]+$/;

const hexOf = (r, g, b) =>
  '#' + [r, g, b].map((n) => Math.round(n).toString(16).padStart(2, '0')).join('');

function colourValue(raw) {
  const ok = raw.match(OKLCH);
  if (ok) {
    // The spec's oklch lightness is 0–1; CSS writes it as a percentage.
    const value = {
      colorSpace: 'oklch',
      components: [
        +(parseFloat(ok[1]) / (raw.includes('%') ? 100 : 1)).toFixed(4),
        parseFloat(ok[2]),
        parseFloat(ok[3])
      ]
    };
    if (ok[4] !== undefined) value.alpha = parseFloat(ok[4]);
    return value;
  }

  const hx = raw.match(HEX);
  if (hx) {
    const h = hx[1].length === 3 ? [...hx[1]].map((c) => c + c).join('') : hx[1];
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
    return {
      colorSpace: 'srgb',
      components: [+(r / 255).toFixed(4), +(g / 255).toFixed(4), +(b / 255).toFixed(4)],
      hex: '#' + h.slice(0, 6)
    };
  }

  const rg = raw.match(RGBA);
  if (rg) {
    const [r, g, b] = [rg[1], rg[2], rg[3]].map(Number);
    const value = {
      colorSpace: 'srgb',
      components: [+(r / 255).toFixed(4), +(g / 255).toFixed(4), +(b / 255).toFixed(4)],
      hex: hexOf(r, g, b)
    };
    if (rg[4] !== undefined) value.alpha = parseFloat(rg[4]);
    return value;
  }

  return null;
}

// A CSS shadow list back into the DTCG composite. The parts were written as
// parts in layer 1 (`$shadow-parts`) precisely so this is a faithful
// round-trip rather than a guess: `0 4px 6px -1px rgba(…)` is offsetX, offsetY,
// blur, spread, colour, and the spec models exactly those five plus `inset`.
const SHADOW_LAYER =
  /^(inset\s+)?(-?[\d.]+(?:px|rem)?)\s+(-?[\d.]+(?:px|rem)?)(?:\s+(-?[\d.]+(?:px|rem)?))?(?:\s+(-?[\d.]+(?:px|rem)?))?\s+(.+)$/;

const dimensionOf = (s) => {
  if (s === undefined) return { value: 0, unit: 'px' };
  const m = String(s).match(/^(-?[\d.]+)(px|rem)?$/);
  return m ? { value: parseFloat(m[1]), unit: m[2] ?? 'px' } : { value: 0, unit: 'px' };
};

function shadowValue(raw) {
  if (raw === 'none') return null;

  // Split on commas that are not inside a colour function.
  const layers = [];
  let depth = 0;
  let current = '';
  for (const ch of raw) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      layers.push(current.trim());
      current = '';
    } else current += ch;
  }
  if (current.trim()) layers.push(current.trim());

  const parsed = [];
  for (const layer of layers) {
    const m = layer.match(SHADOW_LAYER);
    if (!m) return null;
    const colour = colourValue(m[6].trim());
    if (!colour) return null;

    const shadow = {
      color: colour,
      offsetX: dimensionOf(m[2]),
      offsetY: dimensionOf(m[3]),
      blur: dimensionOf(m[4]),
      spread: dimensionOf(m[5])
    };
    if (m[1]) shadow.inset = true;
    parsed.push(shadow);
  }

  return parsed.length === 1 ? parsed[0] : parsed;
}

const CUBIC = /^cubic-bezier\(\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*\)$/;
const STROKE = /^(solid|dashed|dotted|double|groove|ridge|outset|inset)$/;

// A bare `var(--app-x)` is not an unrepresentable value — it is an ALIAS, and
// the format has first-class syntax for one: `"$value": "{group.token}"`.
//
// Missing this was a real defect in the first version of this exporter. Eleven
// tokens — `pad-surface`, `gap-stack`, every token the inverted surface
// redefines — were being written out verbatim and labelled unrepresentable,
// when they are the exact thing the reference syntax exists for. The lesson is
// the one this project keeps relearning: check whether the thing you are about
// to call a limitation is actually a case you failed to handle.
const ALIAS = /^var\(\s*--app-([a-z0-9-]+)\s*\)$/;

function aliasFor(raw, groupPath, structureNames) {
  const m = raw.match(ALIAS);
  if (!m) return null;
  const target = m[1];
  // Structural tokens live in one group; anything else is in the group being
  // written, so a theme's alias resolves within that theme.
  return structureNames.has(target)
    ? `{structure.${target}}`
    : `{${groupPath}.${target}}`;
}

function tokenFor(name, raw, groupPath, structureNames) {
  const alias = aliasFor(raw, groupPath, structureNames);
  if (alias) return { $value: alias };

  const colour = colourValue(raw);
  if (colour) return { $type: 'color', $value: colour };

  // `border` is a composite the format models: colour, width and style. Ours is
  // the CSS shorthand built from three tokens, so it exports as three aliases.
  if (name === 'border') {
    const parts = [...raw.matchAll(/var\(\s*--app-([a-z0-9-]+)\s*\)/g)].map((p) => p[1]);
    if (parts.length === 3) {
      const [width, style, color] = parts;
      return {
        $type: 'border',
        $value: {
          width: `{structure.${width}}`,
          style: `{structure.${style}}`,
          color: `{${groupPath}.${color}}`
        }
      };
    }
  }

  if (name.startsWith('shadow-')) {
    const shadow = shadowValue(raw);
    if (shadow) return { $type: 'shadow', $value: shadow };
  }

  const cubic = raw.match(CUBIC);
  if (cubic) {
    return { $type: 'cubicBezier', $value: cubic.slice(1, 5).map(Number) };
  }

  if (STROKE.test(raw)) return { $type: 'strokeStyle', $value: raw };

  const dim = raw.match(DIMENSION);
  if (dim) {
    return { $type: 'dimension', $value: { value: parseFloat(dim[1]), unit: dim[2] } };
  }

  const dur = raw.match(DURATION);
  if (dur) {
    return { $type: 'duration', $value: { value: parseFloat(dur[1]), unit: dur[2] } };
  }

  if (NUMBER.test(raw)) return { $type: 'number', $value: parseFloat(raw) };

  if (name.startsWith('font-')) {
    return {
      $type: 'fontFamily',
      $value: raw.split(',').map((s) => s.trim().replace(/^["']|["']$/g, ''))
    };
  }

  if (name.startsWith('weight-')) {
    return { $type: 'fontWeight', $value: NUMBER.test(raw) ? parseFloat(raw) : raw };
  }

  // Anything left is a value the format has no type for: a `calc()` expression,
  // a multi-layer shadow string, a border shorthand. Exported verbatim with an
  // extension recording why, rather than silently mistyped or dropped.
  //
  // `calc()` is the interesting case and it is not a defect: `--app-space-md`
  // is `calc(var(--app-space-unit) * 4)`, which is what makes ONE variable
  // drive the whole spacing scale and lets a density context rescale the frame
  // at runtime. The `dimension` type is a static number and a unit — it cannot
  // hold a reference or arithmetic. Resolving it here would export a number
  // that is correct for exactly one density and lose the mechanism.
  return {
    $value: raw,
    $extensions: {
      'com.designsystem.ds': {
        unrepresentable: true,
        reason: raw.includes('calc(')
          ? 'A calc() expression over another token. The dimension type holds a static number and unit, so exporting a resolved value would lose the runtime density knob.'
          : 'A composite CSS value with no single DTCG type.'
      }
    }
  };
}

// -----------------------------------------------------------------------------
// Build the documents
// -----------------------------------------------------------------------------

const structureNames = new Set(Object.keys(structure));

const groupOf = (flat, groupPath) => {
  const out = {};
  for (const [name, raw] of Object.entries(flat)) {
    out[name] = tokenFor(name, raw, groupPath, structureNames);
  }
  return out;
};

const tokens = {
  $description:
    'Layer 2 of a four-layer CSS token foundation. Structural tokens are ' +
    'theme-independent; each theme is a complete set of colour decisions and ' +
    'each surface is a partial override that inherits the rest.',
  structure: groupOf(structure, 'structure'),
  theme: Object.fromEntries(
    Object.entries(themes).map(([n, t]) => [n, groupOf(t, `theme.${n}`)])
  ),
  surface: Object.fromEntries(
    Object.entries(surfaces).map(([n, t]) => [n, groupOf(t, `surface.${n}`)])
  )
};

// The Resolver document. Sets are unconditional; modifiers are conditional and
// their contexts are the options. `resolutionOrder` is what a consumer walks:
// structure first, then a theme, then optionally a surface — which is exactly
// the order the CSS cascade applies them in.
const resolver = {
  name: 'design-system',
  description:
    'Themes and surfaces as resolver modifiers. Note that the CSS build does ' +
    'NOT resolve one permutation: it emits every theme into one stylesheet and ' +
    'switches with [data-theme], because a surface context has to be able to ' +
    'nest inside a themed page — both sets must be present at once.',
  sets: {
    structure: {
      description: 'Spacing, radius, typography and motion. Theme-independent.',
      sources: [{ $ref: 'tokens.json#/structure' }]
    }
  },
  modifiers: {
    theme: {
      description: 'A complete set of colour decisions.',
      contexts: Object.fromEntries(
        Object.keys(themes).map((n) => [n, [{ $ref: `tokens.json#/theme/${n}` }]])
      ),
      default: Object.keys(themes)[0]
    },
    surface: {
      description:
        'A partial override for a band within a page. Inherits every token it ' +
        'does not mention.',
      contexts: {
        default: [],
        ...Object.fromEntries(
          Object.keys(surfaces).map((n) => [n, [{ $ref: `tokens.json#/surface/${n}` }]])
        )
      },
      default: 'default'
    }
  },
  resolutionOrder: [
    { $ref: '#/sets/structure' },
    { $ref: '#/modifiers/theme' },
    { $ref: '#/modifiers/surface' }
  ]
};

writeFileSync('dist/tokens.json', JSON.stringify(tokens, null, 2) + '\n');
writeFileSync('dist/resolver.json', JSON.stringify(resolver, null, 2) + '\n');

const count = (o) => Object.keys(o).length;
const allTokens = [
  ...Object.values(tokens.structure),
  ...Object.values(tokens.theme).flatMap(Object.values),
  ...Object.values(tokens.surface).flatMap(Object.values)
];
const aliases = allTokens.filter((t) => typeof t.$value === 'string' && t.$value.startsWith('{')).length;
const untyped = allTokens.filter((t) => !t.$type && t.$extensions).length;

console.log(
  `dist/tokens.json — ${count(structure)} structural, ` +
    `${Object.keys(themes).length} themes, ${Object.keys(surfaces).length} surfaces` +
    `, ${aliases} aliases` + (untyped ? `, ${untyped} unrepresentable (see $extensions)` : '')
);
console.log(
  `dist/resolver.json — ${Object.keys(themes).length} x ` +
    `${Object.keys(surfaces).length + 1} = ` +
    `${Object.keys(themes).length * (Object.keys(surfaces).length + 1)} permutations`
);

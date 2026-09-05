// scripts/check-layer3-bypass.mjs

// =============================================================================
// LAYER 3 BYPASS GUARD
// =============================================================================
//
// An adapter binds a library's variable to this system's tokens. When the
// library variable belongs to a COMPONENT, the binding must go through layer 3:
//
//     --cui-breadcrumb-item-active-color:
//         var(--app-breadcrumb-item-fg-selected, var(--app-fg-selected));
//          ^ layer 3, the user's override point   ^ layer 2, the default
//
// Bound straight to layer 2 —
//
//     --cui-breadcrumb-item-active-color: var(--app-fg-selected);
//
// — the component token has no consumer. Someone reads the contract, sets
// `--app-breadcrumb-item-fg-selected`, reloads, and nothing happens. The token
// exists, the documentation promises it, and the screen ignores it. That is
// worse than not offering the token at all, because the user now distrusts
// every other one.
//
// The whole point of an adapter is that a person theming the product never has
// to know a library is under there. That only holds if every knob the system
// documents actually reaches the library.
//
// -----------------------------------------------------------------------------
// HOW A COMPONENT BINDING IS RECOGNISED
// -----------------------------------------------------------------------------
//
// By the library variable's own name. Every library in scope namespaces its
// component variables by the component: `--bs-btn-bg`, `--cui-nav-link-color`,
// `--pico-card-background-color`. The first segment after the prefix is the
// component, which is the same convention SLDS, Spectrum and Bootstrap all use.
//
// A variable naming a THEME concept — `--bs-body-bg`, `--cui-primary`,
// `--bulma-link-text` — is layer 2's business and `core.ref()` is correct there.
//
//     node scripts/check-layer3-bypass.mjs src/adapters
// =============================================================================

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dirs = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (dirs.length === 0) {
  console.error('usage: check-layer3-bypass.mjs <adapters-dir> [more …]');
  process.exit(2);
}

// Component words, taken from what the libraries actually ship. Anything whose
// first segment is one of these is a component-level variable.
const COMPONENTS = new Set([
  'accordion', 'alert', 'avatar', 'badge', 'breadcrumb', 'breadcrumbs', 'btn',
  'button', 'callout', 'card', 'carousel', 'chip', 'chips', 'close', 'code',
  'collapse', 'dialog', 'dropdown', 'field', 'file', 'footer', 'form', 'header',
  'hero', 'icon', 'input', 'label', 'list', 'menu', 'message', 'modal', 'nav',
  'navbar', 'notification', 'offcanvas', 'pagination', 'panel', 'popover',
  'progress', 'range', 'select', 'sidebar', 'skeleton', 'slider', 'spinner',
  'switch', 'tab', 'table', 'tabs', 'tag', 'textarea', 'toast', 'toggle',
  'tooltip', 'checkbox', 'radio',
]);

const PREFIX = /^--(bs|cui|bulma|pico|sl|tw|daisy)-/;

const problems = [];

for (const dir of dirs) {
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.scss'))) {
    const path = join(dir, f);
    const src = readFileSync(path, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
      .replace(/(^|[^:])\/\/[^\n]*/g, (m, p) => p + ' '.repeat(m.length - p.length));

    // `--lib-thing: #{core.ref('token')};` with NO second argument — a bind
    // straight to layer 2.
    //
    // `core.ref('surface-pad', core.ref('pad-surface'))` is NOT flagged. It is
    // the runtime fallback chain written by hand — layer 3 first, layer 2 as the
    // fallback — which is the shape this system used before layer 3 became Sass
    // `!default` variables. It still reaches the right value, so flagging it
    // would report correct code and get the guard switched off.
    //
    // It is nonetheless the OLD form. `#{component.$surface-pad}` resolves the
    // same choice at build time and emits one reference instead of two.
    for (const m of src.matchAll(
      /(--[\w-]+)\s*:\s*#\{\s*core\.ref\(\s*'([^']+)'\s*\)\s*\}/g
    )) {
      const [, libVar, token] = m;

      // A token name carrying an interpolation — `bg-#{$role}` — is generated
      // inside a VARIANT LOOP, and that is the one place layer 3 cannot reach.
      //
      // Bootstrap and CoreUI build `.btn-primary`, `.btn-danger` and the rest
      // from one `@each` over their theme map. A Sass variable holds a single
      // value per compilation, so a layer 3 hook inside that loop would paint
      // every variant the same colour. Reading layer 2 per role is the correct
      // binding there, not a bypass.
      //
      // Layer 3 still governs everything the loop does not touch — the radius,
      // the padding, the focus ring.
      if (token.includes('#{')) continue;

      const bare = libVar.replace(PREFIX, '');
      const component = bare.split('-')[0];
      if (!COMPONENTS.has(component)) continue;

      const line = src.slice(0, m.index).split('\n').length;
      problems.push({ file: path.replace(/\\/g, '/'), line, libVar, token, component });
    }
  }
}

if (problems.length === 0) {
  console.log('check-layer3-bypass: ok — every component binding goes through layer 3.');
  process.exit(0);
}

const byComponent = new Map();
for (const p of problems) {
  if (!byComponent.has(p.component)) byComponent.set(p.component, []);
  byComponent.get(p.component).push(p);
}

console.error(
  `check-layer3-bypass: ${problems.length} component binding(s) skip layer 3.\n\n` +
    'Each one is a component token the system documents and the screen ignores.\n\n' +
    'Bind the layer 3 Sass variable instead:\n\n' +
    '    --cui-btn-bg: #{component.$button-bg};\n\n' +
    'It resolves at build time to that token\'s layer 2 default, so the emitted\n' +
    'CSS is a single clean `var(--app-bg-action)` with no fallback chain.\n' +
    'The `#{}` is not optional: Sass does not evaluate SassScript inside a\n' +
    'custom property, so without it the literal text ships and the browser\n' +
    'drops the declaration.\n'
);

// `--all` prints every binding rather than three per component. The summary is
// for reading; this is for fixing.
const showAll = process.argv.includes('--all');

for (const [comp, list] of [...byComponent].sort((a, b) => b[1].length - a[1].length)) {
  console.error(`  ${comp}  (${list.length})`);
  for (const p of showAll ? list : list.slice(0, 3)) {
    console.error(`      ${p.file}:${p.line}  ${p.libVar} -> ${p.token}`);
  }
  if (!showAll && list.length > 3) console.error(`      … ${list.length - 3} more`);
}

process.exit(1);

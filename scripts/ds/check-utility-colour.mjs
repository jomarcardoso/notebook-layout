// scripts/check-utility-colour.mjs

// =============================================================================
// CHECK-UTILITY-COLOUR — the colour utilities, measured before anyone uses them
// =============================================================================
//
//     node scripts/check-utility-colour.mjs <product-dir> [more …] [--gate]
//       --themes=light,dark    which themes to flip through
//       --min=4.5              the contrast floor for text
//       --port=4174            the port the probe page is served on
//
// -----------------------------------------------------------------------------
// THE GAP THIS FILLS
// -----------------------------------------------------------------------------
//
// The sibling file `check-utilities.mjs` asks whether a utility a page USES was
// ever GENERATED — a Tailwind class with no theme key behind it, which produces
// no rule at all. This asks the next question, about the utilities that were
// generated: is the value any good? Two halves of one complaint, and they are
// separate files because they measure different things — that one reads source
// text, this one needs a browser.
//
// `audit-contrast` renders the demo pages and measures what is on them. That is
// the strongest check here and it has one blind spot, which is structural
// rather than a bug: A UTILITY NOBODY HAS USED YET IS UNMEASURED. It ships
// anyway — a library emits every `.bg-*`, `.text-*` and `.border-*` in its role
// map whether or not a page uses one — and it is used tomorrow, by hand, in an
// application, by someone who reasonably assumes a class the design system
// compiled is a class the design system stands behind.
//
// The prompt was a developer reporting that CoreUI's utilities "did nothing" in
// an application and asking whether the values would even be right. Both halves
// of that question are answerable by measurement, and neither was being asked
// by anything in this repository.
//
// What the measuring found on the first run, in a build where every other gate
// was green:
//
//   `.border`, dark theme, 10.4:1 against the page — a white line across a
//   black page. `border-divider` and `border-interactive` had been added to
//   layer 2 without a rule in `derive.dark()`, so they fell through to the
//   base-fill branch and were lifted to the far end of the ramp. Nothing else
//   could see it: a border is not text, so the contrast gates ignore it, and
//   `check-ladder` measures fills.
//
//   `.text-warning`, light theme, 1.14:1 — pale amber ink on cream paper. The
//   library builds `.text-*` from the SOLID FILL of each role, which is a
//   reasonable default for a palette whose roles are all dark and wrong for any
//   palette with a light one in it.
//
// -----------------------------------------------------------------------------
// THE FOUR QUESTIONS
// -----------------------------------------------------------------------------
//
//   DANGLING     the class declares a colour and the colour computes to
//                transparent — a `var()` nothing defines. This is the literal
//                "I used it and nothing happened".
//   INERT        the value is there and is indistinguishable from the ground
//                behind it. Same experience, different cause.
//   UNREADABLE   a text utility below the floor on a ground the ledger says the
//                product actually uses.
//   INVERTED     the value is quiet in one theme and loud in the other. A
//                divider that reads as a hairline in the light and as a rule in
//                the dark has been reclassified by the derivation, and this is
//                the only shape of that bug a machine can recognise without
//                being told what the token means.
//
// -----------------------------------------------------------------------------
// WHAT IT DELIBERATELY DOES NOT ASK
// -----------------------------------------------------------------------------
//
// Whether `.bg-danger` is readable with the page's default ink. It is not, and
// it is not meant to be — pairing a fill with its own label is what
// `.text-bg-*` exists for, and that pair IS measured. Asking the other question
// would report every solid fill in every library as a failure and teach people
// to skip the output.
//
// And the ABSOLUTE names are exempt from everything except DANGLING.
// `.bg-light`, `.text-dark`, `.border-white` are palette entries rather than
// theme roles: they promise not to invert, so measuring them for inversion is
// measuring them for keeping their promise. Three adapters in this repository
// have been broken by someone binding one of these to a role.
//
// -----------------------------------------------------------------------------
// THE GATE FIRES ON USE, NOT ON EXISTENCE
// -----------------------------------------------------------------------------
//
// Everything is reported. Only a class the LEDGER allows fails the build, plus
// DANGLING anywhere — a dangling variable is a build defect whoever uses it.
// This is `audit-wash`'s rule, for the same reason: a library ships utilities
// for roles a product never adopted, and failing on those is failing on someone
// else's decisions.
// =============================================================================

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { serve } from './lib/serve.mjs';

const args = process.argv.slice(2);
const gate = args.includes('--gate');
const dirs = args.filter((a) => !a.startsWith('--'));
const opt = (n, d) => {
  const hit = args.find((a) => a.startsWith(`--${n}=`));
  return hit ? hit.slice(n.length + 3) : d;
};
const THEMES = opt('themes', 'light,dark').split(',');
const MIN = Number(opt('min', '4.5'));
const PORT = Number(opt('port', '4174'));

if (!dirs.length) {
  console.error('check-utility-colour: pass one or more product directories holding app.css');
  process.exit(1);
}

const bold = (s) => `[1m${s}[0m`;
const dim = (s) => `[2m${s}[0m`;

// -----------------------------------------------------------------------------
// WHICH CLASSES EXIST
// -----------------------------------------------------------------------------
//
// Brace tracking rather than a regex over whole rules. A regex that matches
// `([^{]+)\{([^}]*)\}` truncates a multi-line selector list to its last line,
// which in this repository once turned a 40-property block into a finding about
// a selector that was never there. A parser that errs toward MORE findings is
// the dangerous kind: its output looks like work.
// The SHORTHANDS count. `.border` is written `border: <width> <style>
// var(--cui-border-color)` rather than as a `border-color`, and it is the
// single most-reached-for border utility there is — the one a product types by
// hand around a panel. Matching only the longhand missed it entirely, which is
// how the divider bug in `derive.dark()` survived the first draft of this file.
const COLOUR_PROP =
  /^(color|background|background-color|border|border-(top|right|bottom|left|inline|block)(-(start|end))?|border(-(top|right|bottom|left|inline|block)(-(start|end))?)?-color)$/;

function utilities(css) {
  const found = new Map();
  let depth = 0;
  let buf = '';
  let selector = '';

  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (ch === '{') {
      depth++;
      if (depth === 1 || (depth > 1 && !buf.trim().startsWith('@'))) selector = buf.trim();
      buf = '';
      continue;
    }
    if (ch === '}') {
      depth--;
      if (selector) record(found, selector, buf);
      buf = '';
      selector = '';
      continue;
    }
    buf += ch;
  }
  return found;
}

function record(found, selector, body) {
  const props = new Set();
  for (const decl of body.split(';')) {
    const name = decl.split(':')[0]?.trim();
    if (!name || !COLOUR_PROP.test(name)) continue;
    // Normalised to the three things that can be MEASURED on an element: what
    // paints behind it, what paints its edge, and what paints its text.
    if (name.startsWith('border')) props.add('border');
    else if (name.startsWith('background')) props.add('background-color');
    else props.add('color');
  }
  if (!props.size) return;

  // The class has to BE the whole simple selector. `.text-primary:hover` and
  // `.dark\:text-primary` are different classes with different jobs, and
  // measuring a hover rule on an element nobody is hovering reports the rest
  // state under the hover's name.
  // The hyphen is optional so that bare `.border`, `.border-top` and their
  // siblings are collected. They carry the DEFAULT border colour, which is the
  // one token in the whole family that every panel on a page depends on.
  for (const m of selector.matchAll(/(?:^|[\s,>+~])\.((?:bg|text|border|link)(?:-[a-z0-9-]+)?)(?=$|[\s,])/g)) {
    const cls = m[1];
    if (!found.has(cls)) found.set(cls, new Set());
    for (const p of props) found.get(cls).add(p);
  }
}

// -----------------------------------------------------------------------------
// THE CLASSES THAT ARE EXEMPT, AND WHY EACH ONE IS
// -----------------------------------------------------------------------------
//
// Stripping the family prefix and the modifier suffix leaves the ROLE, which is
// the part that says whether the class is making a claim this check can test.
const FAMILY = /^(text-bg-|border-(top|bottom|start|end)-|bg-|text-|border-|link-)/;
const MODIFIER = /-(subtle|emphasis|inverse|\d{2})$/;

// ABSOLUTE: a palette entry rather than a theme role. `.bg-light`, `.text-dark`,
// `.border-white` promise NOT to invert, so measuring them for inversion is
// measuring them for keeping their promise, and measuring `.bg-light` against a
// light page is measuring it for being what it says. Three adapters in this
// repository have been broken by someone binding one of these to a role.
const ABSOLUTE = new Set(['white', 'black', 'light', 'dark', 'transparent']);

// The library's own emphasis scale, which is absolute in the same way for two
// different reasons.
//
// `-inverse` is FOR the opposite ground by definition; reading it against the
// page it will never sit on reports it for being correct.
//
// `disabled` is the one text role WCAG exempts, because a control that is out
// of play is meant to read as out of play. A floor applied to it would push it
// back up to looking available, which is the failure the exemption exists to
// prevent.
const NOT_FOR_THIS_GROUND = /(^|-)(inverse|disabled)$/;

function role(cls) {
  return cls.replace(FAMILY, '').replace(MODIFIER, '');
}
function exempt(cls) {
  return ABSOLUTE.has(role(cls)) || NOT_FOR_THIS_GROUND.test(cls);
}

// -----------------------------------------------------------------------------

const PROBE = (classes, grounds) => `<!doctype html>
<html lang="en" data-theme="light"><head><meta charset="utf-8"><title>probe</title>
<link rel="stylesheet" href="./app.css">
<style>
  /* Transitions make a reading taken just after a theme flip land mid-flight,
     on a colour that exists for 150ms and belongs to neither theme. */
  *, *::before, *::after { transition: none !important; animation: none !important; }
  .__ground { padding: 4px; }
  .__probe { border-style: solid; border-width: 1px; display: block; }
</style></head><body>
<div id="root"></div>
<script>
const CLASSES = ${JSON.stringify(classes)};
const GROUNDS = ${JSON.stringify(grounds)};
const root = document.getElementById('root');
const cells = {};
for (const g of GROUNDS) {
  const box = document.createElement('div');
  box.className = '__ground';
  if (g.surface) box.setAttribute('data-surface', g.surface);
  box.style.background = 'var(--app-' + g.token + ')';
  const control = document.createElement('span');
  control.className = '__probe';
  control.textContent = 'x';
  box.appendChild(control);
  const probes = {};
  for (const c of CLASSES) {
    const el = document.createElement('span');
    el.className = '__probe ' + c;
    el.textContent = 'x';
    box.appendChild(el);
    probes[c] = el;
  }
  root.appendChild(box);
  cells[g.name] = { box, control, probes };
}
window.__measure = () => {
  const styled = getComputedStyle(document.documentElement)
    .getPropertyValue('--app-bg-page').trim() !== '';
  const out = { styled, grounds: {} };
  for (const g of GROUNDS) {
    const { box, control, probes } = cells[g.name];
    const cs = getComputedStyle(control);
    const row = {
      ground: getComputedStyle(box).backgroundColor,
      control: { color: cs.color, bg: cs.backgroundColor, border: cs.borderTopColor },
      probes: {}
    };
    for (const c of CLASSES) {
      const p = getComputedStyle(probes[c]);
      row.probes[c] = { color: p.color, bg: p.backgroundColor, border: p.borderTopColor };
    }
    out.grounds[g.name] = row;
  }
  return out;
};
</script></body></html>`;

// -----------------------------------------------------------------------------

const rgba = (css) => {
  const m = String(css).match(/-?[\d.]+/g);
  if (!m) return null;
  const [r, g, b, a = 1] = m.map(Number);
  return [r, g, b, a];
};
const over = (fg, bg) => {
  if (!fg || !bg) return fg;
  const a = fg[3];
  if (a >= 1) return fg;
  return [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a)).concat(1);
};
const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
const ratio = (f, b) => {
  if (!f || !b) return null;
  const [a, c] = [lum(f), lum(b)].sort((x, y) => y - x);
  return +((a + 0.05) / (c + 0.05)).toFixed(2);
};

// Every class the ledger allows, so the gate fires on adoption rather than on
// what the library happened to compile.
function ledgerClasses(dir) {
  const p = join(dir, 'patterns.json');
  if (!existsSync(p)) return null;
  const out = new Set();
  const led = JSON.parse(readFileSync(p, 'utf8'));
  for (const c of Object.values(led.components ?? {})) {
    for (const pat of Object.values(c.patterns ?? {})) {
      if (pat.state === 'forbidden') continue;
      for (const cls of Object.values(pat.raw ?? {})) for (const cl of cls) out.add(cl);
      if (pat.styled) for (const cl of pat.styled.trim().split(/\s+/)) out.add(cl);
    }
    for (const mod of Object.values(c.modifiers ?? {})) {
      for (const o of Object.values(mod.options ?? {})) {
        for (const cls of Object.values(o.libraries ?? {})) for (const cl of cls) out.add(cl);
      }
    }
  }
  return out;
}

// `composition.surfaces` names the planes the product actually composes on, in
// layer 2 token names. It was previously a list nothing read, which made it
// ambiguous enough to be mistaken for a list of CLASSES — `bg-surface` is not
// one, and reaching for it is another way to get nothing to happen.
const SURFACE_OF = { 'bg-page': null, 'bg-surface': 'surface', 'bg-sunken': 'sunken', 'bg-raised': 'raised' };

function groundsFor(dir) {
  const p = join(dir, 'patterns.json');
  const declared = existsSync(p)
    ? (JSON.parse(readFileSync(p, 'utf8')).composition?.surfaces ?? [])
    : [];
  const list = declared.filter((t) => t in SURFACE_OF);
  const use = list.length ? list : ['bg-page'];
  return use.map((token) => ({ name: token, token, surface: SURFACE_OF[token] }));
}

// -----------------------------------------------------------------------------

let puppeteer;
try { puppeteer = (await import('puppeteer')).default; } catch {}
if (!puppeteer) {
  console.log('check-utility-colour: puppeteer not installed — skipping (this check needs a browser).');
  process.exit(0);
}

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

let failures = 0;
let reported = 0;

for (const dir of dirs) {
  if (!existsSync(join(dir, 'app.css'))) continue;

  const classes = new Map();
  for (const f of ['coreui.css', 'ds.css', 'app.css', 'tw.css']) {
    const p = join(dir, f);
    if (!existsSync(p)) continue;
    for (const [cls, props] of utilities(readFileSync(p, 'utf8'))) {
      if (!classes.has(cls)) classes.set(cls, new Set());
      for (const pr of props) classes.get(cls).add(pr);
    }
  }
  if (!classes.size) continue;

  const names = [...classes.keys()].sort();
  const grounds = groundsFor(dir);
  const allowed = ledgerClasses(dir);
  const route = `/${dir.replace(/\\/g, '/').replace(/\/$/, '')}/__utilities-probe.html`;

  const { origin, close } = await serve({
    root: ROOT, port: PORT, routes: { [route]: PROBE(names, grounds) }
  });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(origin + route, { waitUntil: 'networkidle0' });

  const readings = {};
  for (const theme of THEMES) {
    await page.evaluate((t) => { document.documentElement.dataset.theme = t; }, theme);

    // Two identical consecutive readings, not a fixed number of frames. A fixed
    // wait is a guess, and a chained `var()` cascade can take more than one
    // frame to settle after a flip.
    let r = null;
    let previous = null;
    for (let i = 0; i < 20; i++) {
      await page.evaluate(() => new Promise((res) => requestAnimationFrame(res)));
      r = await page.evaluate('window.__measure()');
      const fp = JSON.stringify(r);
      if (fp === previous) break;
      previous = fp;
    }
    readings[theme] = r;
  }

  await browser.close();
  await close();

  if (!readings[THEMES[0]]?.styled) {
    console.log(`\n${bold('NO STYLESHEET')} ${dim(`— --app-bg-page is undefined at ${route}`)}`);
    console.log('An unstyled page is black on white and passes everything. Nothing was measured.');
    failures++;
    continue;
  }

  // ---------------------------------------------------------------------------
  const findings = [];
  const add = (kind, cls, where, detail) =>
    findings.push({ kind, cls, where, detail, allowed: allowed ? allowed.has(cls) : false });

  for (const cls of names) {
    const props = classes.get(cls);
    const absolute = exempt(cls);
    const isText = cls.startsWith('text-') || cls.startsWith('link-');
    const pair = /^text-bg-/.test(cls);

    for (const theme of THEMES) {
      for (const g of grounds) {
        const row = readings[theme].grounds[g.name];
        const ground = rgba(row.ground);
        const p = row.probes[cls];
        const control = row.control;
        const where = `${theme}/${g.token}`;

        const own = over(rgba(p.bg), ground);
        const fgOn = pair ? own : ground;

        // A class whose ROLE names the plane it is being measured against is
        // saying the true thing when it disappears. `.bg-body` on the page IS
        // the page, and an absolute name over a ground that happens to match it
        // — `.bg-white` on near-white paper — is the palette entry keeping its
        // promise rather than a token failing to separate.
        const namesGround = absolute || (role(cls) === 'body' && g.token === 'bg-page');

        if (props.has('background-color')) {
          const raw = rgba(p.bg);
          if (raw && raw[3] === 0 && !/transparent/.test(cls)) {
            add('dangling', cls, where, 'background-color computes to transparent');
          } else {
            const r = ratio(own, ground);
            if (r != null && r < 1.1 && !namesGround) {
              add('inert', cls, where, `fill is ${r}:1 against the ground it sits on`);
            }
          }
        }

        if (props.has('border')) {
          const bd = over(rgba(p.border), ground);
          const r = ratio(bd, ground);
          if (r != null && r < 1.1 && !namesGround) {
            add('inert', cls, where, `border is ${r}:1 against the ground`);
          }
        }

        if (props.has('color') && !absolute) {
          const fg = over(rgba(p.color), fgOn);
          const r = ratio(fg, fgOn);
          if (r != null && r < MIN) {
            add(pair ? 'pair' : 'unreadable', cls, where,
              `${r}:1 ${pair ? 'against its own fill' : 'against the ground'} (floor ${MIN})`);
          }
        }
      }
    }

    // INVERTED. Quiet in one theme, loud in the other, on the same ground.
    //
    // LINES ONLY, and the restriction is the difference between a finding and
    // noise. A FILL that is pale in the light and bright in the dark is an
    // ordinary inverted pair — an amber close to cream paper, a role that has to
    // brighten on a dark page to keep its dark label — and reporting every one
    // of those would bury the case this test exists for.
    //
    // A LINE has no such excuse. It is read against the plane it divides and
    // carries about the same weight in both themes, so a hairline in one and a
    // rule in the other means the derivation filed it under the wrong family.
    // That is exactly what happened to `border-divider` and `border-interactive`
    // — see the note on `$_lines` in `src/_derive.scss`.
    const lineOnly = props.has('border') && !props.has('background-color');
    if (!absolute && lineOnly && THEMES.length > 1) {
      for (const g of grounds) {
        const byTheme = THEMES.map((theme) => {
          const row = readings[theme].grounds[g.name];
          const ground = rgba(row.ground);
          const p = row.probes[cls];
          const v = over(rgba(p.border), ground);
          return { theme, r: ratio(v, ground) };
        }).filter((x) => x.r != null);
        if (byTheme.length < 2) continue;
        const lo = byTheme.reduce((a, b) => (a.r < b.r ? a : b));
        const hi = byTheme.reduce((a, b) => (a.r > b.r ? a : b));
        if (lo.r < 2 && hi.r > 4) {
          add('inverted', cls, g.token,
            `${lo.r}:1 in ${lo.theme}, ${hi.r}:1 in ${hi.theme} — the same token, two different jobs`);
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  if (!findings.length) {
    console.log(
      `check-utility-colour: ok — ${names.length} colour utilities, ` +
      `${grounds.length} ground(s) × ${THEMES.length} theme(s), in ${dir}.`
    );
    continue;
  }

  const ORDER = ['dangling', 'inverted', 'unreadable', 'pair', 'inert'];
  const TITLE = {
    dangling: 'A colour utility resolves to nothing',
    inverted: 'A utility is quiet in one theme and loud in the other',
    unreadable: 'A text utility is below the floor on a ground the product uses',
    pair: 'A fill and its own label are below the floor',
    inert: 'A utility is indistinguishable from the ground behind it'
  };

  console.log(`\n${bold(dir)}  ${dim(`${names.length} colour utilities measured`)}`);
  for (const kind of ORDER) {
    const rows = findings.filter((f) => f.kind === kind);
    if (!rows.length) continue;
    console.log(`\n  ${bold(TITLE[kind])}`);
    const seen = new Set();
    for (const f of rows) {
      const key = `${f.cls}|${f.detail.replace(/[\d.]+/g, '')}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const mark = f.allowed || kind === 'dangling' ? bold('LEDGER') : dim('  --  ');
      console.log(`    ${mark} .${f.cls.padEnd(28)} ${dim(f.where.padEnd(20))} ${f.detail}`);
      reported++;
      if (f.allowed || kind === 'dangling') failures++;
    }
  }
}

if (!reported) process.exit(0);

console.log(`
${bold('LEDGER')} marks a class this product's patterns.json actually allows. Those fail
the build. The rest are utilities the library compiled for roles the product may
never adopt — reported so the decision is made rather than discovered, and not
gated, because failing on another library's role map teaches people to skip this
output.

Three fixes, in the order they are usually right:

  the token is wrong          a line derived as a fill, a subtle that is not
                              subtle. Fix it in the theme or in derive.dark(),
                              where it is one value rather than one utility.
  the utility means something the library builds .text-* from a role's SOLID
  else                        FILL. Where a role's fill is light, its readable
                              ink is .text-*-emphasis, and that is the class the
                              ledger should allow.
  the product never uses it   say so by leaving it out of the ledger, which is
                              what the unmarked rows already assume.
`);
console.log(bold(`${reported} finding(s), ${failures} of them gating.`));
process.exit(gate && failures ? 1 : 0);

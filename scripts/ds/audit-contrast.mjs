// scripts/audit-contrast.mjs

// =============================================================================
// CONTRAST AUDIT — every demo page, every theme, in a real browser
// =============================================================================
//
// The build-time check in `_semantic.scss` measures TOKEN pairs. It cannot see
// what a library actually renders: a filter, a state rule the adapter clobbers,
// or a fill whose foreground comes from markup. Three real bugs in this project
// were invisible to it and visible here.
//
// Run against a served copy of the repo:
//
//     npx serve -p 4173 .
//     node scripts/audit-contrast.mjs
//
// Needs a Chromium; uses Puppeteer if present, otherwise prints the snippet to
// paste into devtools. Kept dependency-free on purpose — this is a check you
// should be able to run by hand.
// =============================================================================

const THEMES = ['light', 'dark', 'brand'];

// A page is either a name under `example/` carrying the DEMO themes (which live
// in `example/demo/`, not in the tool — the foundation ships none), or an
// object naming its own.
//
// The example PRODUCTS each ship a single theme of their own and never load the
// demo ones, so driving them through `light`/`dark`/`brand` would
// set an attribute nothing defines and measure undefined tokens. They still
// belong in this audit — they are the most realistic pages here, full of
// navbars, menus, tables and forms rather than component galleries, and they
// are where a contrast bug would actually reach a user.
const PAGES = [
  'coexistence', 'theme-brand', 'daisyui', 'pico', 'bulma',
  'tailwind', 'flowbite', 'preline', 'water', 'mvp', 'coreui',
  // Trailing slash, not `/index.html`. The dev server rewrites an explicit
  // index to an extensionless directory URL WITHOUT a slash, at which point
  // every relative href loses a path segment and the page loads with no CSS
  // at all. It still measured cleanly and reported ok — see the styled guard
  // below, which exists because of this.
  { path: 'ds-hot-tone-bootstrap-phase1/', themes: ['hot-tone'] },
  { path: 'ds-cyberpunk-bulma-phase2/', themes: ['cyberpunk'] },
  { path: 'ds-carmageddon-nescss-phase3/', themes: ['carmageddon'] },
  // The generated documentation is audited too: it renders every composition
  // live, so a contrast bug in a component nobody put on the main page still
  // gets caught.
  { path: 'ds-carmageddon-nescss-phase3/docs.html', themes: ['carmageddon'] },
  { path: 'ds-meu-caderninho-daisyui-phase3/', themes: ['caderninho'] },
  // Floor 3, not 4.5, and it matches `config.$contrast-min` in that
  // product's ds.scss. The brand's primary fill is #FF6200 with a white label
  // — 3.00:1, which is AA for the large bold type the button actually uses and
  // is a decision the bank shipped. Recorded in two places on purpose: a build
  // gate and a rendered gate that disagree are worse than either alone.
  { path: 'ds-itau-shadcn-phase3/', themes: ['itau'], min: 3 },
  { path: 'ds-meu-caderninho-daisyui-phase3/docs.html', themes: ['caderninho'] },
  { path: 'ds-booking-bulma/', themes: ['booking'] },
  { path: 'ds-caderno-accent-driven/', themes: ['light', 'dark'] },
  { path: 'recepta-monochrome-coreui/', themes: ['light', 'dark'] }
];

export const SNIPPET = `(() => {
  const isOpaque = (css) => {
    if (!css || css === 'transparent') return false;
    const m = css.match(/^(?:rgba?|oklch|oklab|color)\\(([^)]*)\\)/);
    if (!m) return true;
    const a = m[1].split('/')[1] ?? m[1].split(',')[3];
    return a === undefined || parseFloat(a) > 0.9;
  };
  const rgb = (css) => {
    const c = document.createElement('canvas'); c.width = c.height = 1;
    const x = c.getContext('2d', { willReadFrequently: true });
    x.fillStyle = '#000'; x.fillRect(0, 0, 1, 1);
    x.fillStyle = css; x.fillRect(0, 0, 1, 1);
    const d = x.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2]];
  };
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lum = (c) => { const [r, g, b] = rgb(c).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const ratio = (f, b) => { const [a, c] = [lum(f), lum(b)].sort((x, y) => y - x); return +((a + 0.05) / (c + 0.05)).toFixed(2); };

  // Find filled elements STRUCTURALLY, not by class name.
  //
  // Looking for \`.btn, .badge, .alert\` only works for libraries that ship
  // component classes. Flowbite, Preline and the Tailwind bridge compose
  // everything from utilities, so a class-based scan measured five elements on
  // a page with thirty — and reported "all pass" on almost nothing.
  //
  // The structural definition of a thing whose contrast matters is TWO cases,
  // and for a long time this only had the first:
  //
  //   1. it paints an opaque background different from its parent's  (a fill)
  //   2. it paints a text colour different from its parent's         (a label)
  //
  // Case 2 was the blind spot, and it hid an entire category. Every library
  // ships variants that colour the TEXT and leave the background transparent —
  // \`.btn-outline-*\`, \`.is-outlined\`, \`.btn-ghost\`, \`.outline\`, link buttons.
  // Those have no fill, so case 1 skipped them silently and the audit reported
  // "all pass" while never having looked at them once. They are exactly the
  // variants where a foreground chosen to sit on a fill gets reused over the
  // page background, which is the most common way this goes wrong.
  //
  // Case 2 needs the nearest OPAQUE ancestor, not the parent: the parent of an
  // outline button is usually a transparent wrapper, and flattening onto a
  // transparent colour silently yields black.
  const effectiveBg = (el) => {
    for (let n = el.parentElement; n; n = n.parentElement) {
      const c = getComputedStyle(n).backgroundColor;
      if (isOpaque(c)) return c;
    }
    const html = getComputedStyle(document.documentElement).backgroundColor;
    return isOpaque(html) ? html : 'rgb(255,255,255)';
  };

  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);

    // Transparent TEXT, not just a transparent background. Bulma's
    // \`is-loading\` sets \`color: rgba(0,0,0,0)\` and swaps in a spinner, so
    // measuring its contrast asks what a colour nobody can see reads like.
    if (!isOpaque(cs.color)) continue;

    // Not rendered: a collapsed \`<details>\`, a closed dropdown. A computed
    // style still resolves for these, so without this they get measured and
    // reported as failures nobody can see.
    if (!el.getClientRects().length) continue;

    // WCAG 1.4.3 exempts disabled controls, and every library deliberately
    // dims them. Measuring them turns a design decision into a false alarm.
    // …and that check has to walk ANCESTORS, not just the element.
    //
    // The first version looked only at the element itself, so a disabled
    // <input> was skipped and the <span> next to it holding the label was not.
    // The Itaú page has exactly that shape — a switch row where the control is
    // disabled and the text beside it is styled with the disabled ink — and the
    // audit reported the LABEL at 2.85:1 as a failure. WCAG exempts the whole
    // inactive component, not just the focusable node inside it.
    let inactive = false;
    for (let n = el; n; n = n.parentElement) {
      if (n.disabled || n.getAttribute?.('aria-disabled') === 'true') { inactive = true; break; }
    }
    if (inactive) continue;

    const parent = el.parentElement;
    const parentBg = parent ? getComputedStyle(parent).backgroundColor : '';
    const parentFg = parent ? getComputedStyle(parent).color : '';

    const paintsFill = isOpaque(cs.backgroundColor) && cs.backgroundColor !== parentBg;
    const paintsText = cs.color !== parentFg;
    if (!paintsFill && !paintsText) continue;

    const against = paintsFill ? cs.backgroundColor : effectiveBg(el);

    // Direct text only — otherwise a card counts its children's paragraphs.
    const own = [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim())
      .join(' ')
      .trim();
    // Only these input types render their \`value\` as visible text. A checkbox
    // reports \`value === "on"\` by default, which made every switch look like a
    // filled element with 1.47:1 text on it — a control that has no text at all.
    // \`String()\` because \`<progress>\` and \`<meter>\` expose a NUMERIC value.
    const showsValue = el.tagName === 'INPUT'
      && ['submit', 'reset', 'button'].includes(el.type);
    const label = (showsValue ? String(el.value ?? '').trim() : '') || own;
    if (!label) continue;

    out.push({
      label: label.slice(0, 16),
      kind: paintsFill ? 'fill' : 'text',
      ratio: ratio(cs.color, against)
    });
  }
  out.sort((a, b) => a.ratio - b.ratio);

  // Did the page's CSS actually load?
  //
  // Every page here is driven by the token layer, so an empty \`--app-bg-page\`
  // means no stylesheet arrived. An unstyled page is BLACK ON WHITE, which
  // passes every contrast check ever written — so without this the audit
  // reports its most confident "ok" precisely when it has measured nothing.
  const styled = getComputedStyle(document.documentElement)
    .getPropertyValue('--app-bg-page').trim() !== '';

  return { theme: document.documentElement.dataset.theme, measured: out.length,
           styled, worst: out.slice(0, 6),
           worstRatio: out.length ? out[0].ratio : null };
})()`;

let puppeteer;
try { puppeteer = (await import('puppeteer')).default; } catch {}

if (!puppeteer) {
  console.log('puppeteer not installed — paste this into devtools on each page:\n');
  console.log(SNIPPET);
  process.exit(0);
}

// Serve the repo ourselves when nothing is already listening.
//
// This used to be a two-step ritual documented in the header: start a server,
// then run the script. Anyone who ran only the second step got
// ERR_CONNECTION_REFUSED, and anyone automating it had to know about the first.
// A verification step with a setup ritual is a verification step that gets
// skipped, so the ritual is gone.
const PORT = 4173;
const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

const alreadyServing = await fetch(`http://localhost:${PORT}/`)
  .then(() => true)
  .catch(() => false);

let server = null;

if (!alreadyServing) {
  const { createServer } = await import('node:http');
  const { readFile } = await import('node:fs/promises');
  const { join, extname, normalize } = await import('node:path');

  const TYPES = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
    '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2'
  };

  server = createServer(async (req, res) => {
    // Strip the query and refuse to escape the repo root.
    let path = decodeURIComponent(req.url.split('?')[0]);
    if (path.endsWith('/')) path += 'index.html';
    const file = join(ROOT, normalize(path).replace(/^(\.\.[/\\])+/, ''));

    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });

  await new Promise((r) => server.listen(PORT, r));
}

const browser = await puppeteer.launch();
const page = await browser.newPage();
let failures = 0;

for (const entry of PAGES) {
  const name = typeof entry === 'string' ? entry : entry.path;
  const themes = typeof entry === 'string' ? THEMES : entry.themes;
  const label = name.replace(/\/index$/, '');

  const url = typeof entry === 'string'
    ? `http://localhost:4173/example/${name}.html`
    : `http://localhost:4173/example/${entry.path}`;

  await page.goto(url, { waitUntil: 'networkidle0' });

  // Kill transitions before measuring anything.
  //
  // Several of these libraries transition `background-color`, so a snapshot
  // taken a frame or two after a theme flip lands MID-TRANSITION and reports a
  // colour that exists for 150ms and belongs to neither theme. That produced a
  // different set of "failures" on every run — the giveaway that the
  // measurement was wrong rather than the CSS.
  await page.addStyleTag({
    content: '*, *::before, *::after { transition: none !important; animation: none !important; }'
  });

  for (const theme of themes) {
    await page.evaluate((t) => { document.documentElement.dataset.theme = t; }, theme);

    // Wait for the reading to STABILISE rather than for a fixed number of
    // frames. A fixed wait is a guess, and it was wrong: Bulma resolves colour
    // through a dozen chained `var()` levels and takes more than one frame to
    // settle after a theme flip, which produced a different set of "failures"
    // on every run and once reported 1.06:1 on a button that measures 13:1.
    //
    // Two identical consecutive readings is the actual signal that the cascade
    // has finished.
    let r = null;
    let previous = null;
    for (let attempt = 0; attempt < 20; attempt++) {
      await page.evaluate(() => new Promise((res) => requestAnimationFrame(res)));
      r = await page.evaluate(SNIPPET);
      const fingerprint = JSON.stringify(r.worst) + r.measured;
      if (fingerprint === previous) break;
      previous = fingerprint;
    }
    // The floor is the PAGE's, not a constant. A product that lowered
    // `config.$contrast-min` for a recorded reason would otherwise fail here
    // for the same pair its own build deliberately accepts — two gates
    // disagreeing about the same decision, which teaches people to ignore one.
    const min = (typeof entry === 'string' ? 4.5 : entry.min) ?? 4.5;
    const pass = r.styled && r.worstRatio !== null && r.worstRatio >= min;
    const mark = pass ? 'ok ' : 'FAIL';
    console.log(`  ${mark} ${label.padEnd(30)} ${theme.padEnd(9)} ${String(r.measured).padStart(3)} fills, worst ${r.worst[0]?.ratio ?? '-'}${min !== 4.5 ? ` (floor ${min})` : ''}`);

    if (!r.styled) {
      failures++;
      console.log(`        NO STYLESHEET — --app-bg-page is undefined at ${url}.`);
      console.log('        Nothing was measured; an unstyled page is black on white and passes everything.');
    } else if (!pass) {
      failures++;
      console.log('        ' + JSON.stringify(r.worst));
    }
  }
}

await browser.close();
if (server) await new Promise((r) => server.close(r));
console.log(failures ? `\n${failures} page/theme combinations below AA.` : '\nAll pages pass AA in all themes.');
process.exit(failures ? 1 : 0);

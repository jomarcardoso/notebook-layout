// scripts/lib/serve.mjs

// =============================================================================
// A STATIC SERVER FOR THE CHECKS THAT NEED A REAL BROWSER
// =============================================================================
//
// Two of the checks here measure RENDERED values rather than source text, and a
// rendered value needs an origin: `file://` makes every relative stylesheet a
// cross-origin request and computed styles come back as the initial values, so
// a check run that way measures nothing and reports ok.
//
// `serve()` returns a `{ origin, close }` and reuses whatever is already
// listening on the port, so a check can be run on its own or alongside a dev
// server without a setup ritual. A verification step with a setup ritual is a
// verification step that gets skipped.
//
// `routes` lets a caller answer specific paths from memory. That is what makes
// a PROBE page possible: a generated page has to sit at the product's own URL
// for `./app.css` to resolve, and writing it to disk would leave litter in the
// product directory every time a run was interrupted.
//
// `scripts/audit-contrast.mjs` carries its own copy of this and predates it. It
// is left alone deliberately: it is a passing gate, and the reason to unify
// would be tidiness rather than correctness.
// =============================================================================

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';

const TYPES = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2'
};

export async function serve({ root, port = 4173, routes = {} } = {}) {
  const origin = `http://localhost:${port}`;

  const taken = await fetch(origin + '/').then(() => true).catch(() => false);
  if (taken && !Object.keys(routes).length) return { origin, close: async () => {} };

  // A port already in use with routes to serve is not recoverable: the probe
  // page would 404 against somebody else's server and the check would measure
  // an unstyled page, which passes everything. Better to say so.
  if (taken) {
    throw new Error(
      `port ${port} is already serving something. This check has to answer its own\n`
      + 'probe URL, so it cannot share a port. Stop the other server, or pass --port.'
    );
  }

  const server = createServer(async (req, res) => {
    const path = decodeURIComponent(req.url.split('?')[0]);

    if (routes[path] != null) {
      res.writeHead(200, { 'content-type': 'text/html' }).end(routes[path]);
      return;
    }

    const p = path.endsWith('/') ? path + 'index.html' : path;
    const file = join(root, normalize(p).replace(/^(\.\.[/\\])+/, ''));

    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });

  await new Promise((r) => server.listen(port, r));
  return { origin, close: () => new Promise((r) => server.close(r)) };
}

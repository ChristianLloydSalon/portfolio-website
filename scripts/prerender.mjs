// Post-build step: prerender every route (/, /about…, /projects/:id) into its own HTML
// file, inject JSON-LD, and write robots.txt + sitemap.xml for the configured site URL.
// Firebase serves /about from about.html and /projects/x from projects/x.html (cleanUrls).
// Runs after `vite build` (client) and `vite build --ssr src/entry-server.tsx --outDir .ssr`.
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const dist = resolve(root, 'dist');
const ssrDir = resolve(root, '.ssr');

const { render, pages, structuredData, SITE_URL } = await import(pathToFileURL(resolve(ssrDir, 'entry-server.js')).href);

const indexPath = resolve(dist, 'index.html');
const template = await readFile(indexPath, 'utf8');
if (!template.includes('<div id="root"></div>')) throw new Error('prerender: <div id="root"></div> not found in dist/index.html');

// Escape "<" so the JSON can never close the script tag.
const json = JSON.stringify(structuredData()).replace(/</g, '\\u003c');
const shell = template.replace('</head>', () => `    <script type="application/ld+json">${json}</script>\n  </head>`);

const attr = (v) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Swaps the site-wide head tags for a project page's own title, description and URL. */
function withMeta(html, { title, description, url }) {
  const t = attr(title);
  const d = attr(description);
  const set = (re, value) => {
    if (!re.test(html)) throw new Error(`prerender: head tag not found: ${re}`);
    html = html.replace(re, () => value);
  };
  set(/<title>[^<]*<\/title>/, `<title>${t}</title>`);
  set(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${d}"`);
  set(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}"`);
  set(/<meta property="og:type" content="[^"]*"/, '<meta property="og:type" content="article"');
  set(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${url}"`);
  set(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${t}"`);
  set(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${d}"`);
  set(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${t}"`);
  set(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${d}"`);
  return html;
}

// The client does a fresh createRoot render (no hydration), so React's
// "useLayoutEffect does nothing on the server" warnings are irrelevant here.
const consoleError = console.error;
console.error = (msg, ...rest) => {
  if (typeof msg === 'string' && msg.includes('useLayoutEffect does nothing on the server')) return;
  consoleError(msg, ...rest);
};

let homeKb = 0;
const all = pages();
for (const { path, meta } of all) {
  const appHtml = render(path);
  if (path === '/') homeKb = appHtml.length / 1024;
  let html = shell.replace('<div id="root"></div>', () => `<div id="root">${appHtml}</div>`);
  // Section pages are the same one-page site, so they keep the home page's canonical URL.
  if (meta) html = withMeta(html, meta);
  const file = path === '/' ? indexPath : resolve(dist, `${path.slice(1)}.html`);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}
console.error = consoleError;

const today = new Date().toISOString().slice(0, 10);
await writeFile(
  resolve(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${['/', ...all.filter((p) => p.meta).map((p) => p.path)]
  .map((path) => `  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
  .join('\n')}
</urlset>
`,
);
await writeFile(resolve(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

await rm(ssrDir, { recursive: true, force: true });
console.log(`prerender: ${all.length} pages (home ${homeKb.toFixed(1)} kB of HTML), JSON-LD, sitemap.xml and robots.txt for ${SITE_URL}`);

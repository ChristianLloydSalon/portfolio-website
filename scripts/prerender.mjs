// Post-build step: prerender the app into dist/index.html, inject JSON-LD,
// and write robots.txt + sitemap.xml for the configured site URL.
// Runs after `vite build` (client) and `vite build --ssr src/entry-server.tsx --outDir .ssr`.
import { readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const dist = resolve(root, 'dist');
const ssrDir = resolve(root, '.ssr');

const { render, structuredData, SITE_URL } = await import(pathToFileURL(resolve(ssrDir, 'entry-server.js')).href);

const indexPath = resolve(dist, 'index.html');
let html = await readFile(indexPath, 'utf8');

// The client does a fresh createRoot render (no hydration), so React's
// "useLayoutEffect does nothing on the server" warnings are irrelevant here.
const consoleError = console.error;
console.error = (msg, ...rest) => {
  if (typeof msg === 'string' && msg.includes('useLayoutEffect does nothing on the server')) return;
  consoleError(msg, ...rest);
};
const appHtml = render();
console.error = consoleError;
if (!html.includes('<div id="root"></div>')) throw new Error('prerender: <div id="root"></div> not found in dist/index.html');
html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

// Escape "<" so the JSON can never close the script tag.
const json = JSON.stringify(structuredData()).replace(/</g, '\\u003c');
html = html.replace('</head>', `    <script type="application/ld+json">${json}</script>\n  </head>`);

await writeFile(indexPath, html);

const today = new Date().toISOString().slice(0, 10);
await writeFile(
  resolve(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
  </url>
</urlset>
`,
);
await writeFile(resolve(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

await rm(ssrDir, { recursive: true, force: true });
console.log(`prerender: ${(appHtml.length / 1024).toFixed(1)} kB of HTML, JSON-LD, sitemap.xml and robots.txt for ${SITE_URL}`);

/**
 * Build-time prerender entry (not shipped to the browser). scripts/prerender.mjs
 * renders the app to static HTML for every route so crawlers and link-preview bots
 * see real content, and injects the JSON-LD built from src/data.
 */
import { renderToString } from 'react-dom/server';
import { Router } from 'wouter';
import { App } from '@/app/App';
import { structuredData } from '@/seo/structuredData';
import { SITE_URL, site } from '@/seo/site';
import { navigation } from '@/data/navigation';
import { projects } from '@/data/projects';
import { projectPath, sectionPath } from '@/app/routes';

export function render(path = '/') {
  return renderToString(
    <Router ssrPath={path}>
      <App />
    </Router>,
  );
}

/** Every prerendered page: its path and, for project pages, the head tags to swap in. */
export function pages() {
  return [
    ...navigation.map((n) => ({ path: sectionPath(n.id), meta: null })),
    ...projects.map((p) => ({
      path: projectPath(p.id),
      meta: {
        projectId: p.id,
        title: `${p.title} | ${site.name}`,
        description: p.summary,
        url: `${SITE_URL}${projectPath(p.id)}`,
      },
    })),
  ];
}

export { structuredData, SITE_URL };

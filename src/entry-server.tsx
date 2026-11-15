/**
 * Build-time prerender entry (not shipped to the browser). scripts/prerender.mjs
 * renders the app to static HTML so crawlers and link-preview bots see real content,
 * and injects the JSON-LD built from src/data.
 */
import { renderToString } from 'react-dom/server';
import { App } from '@/app/App';
import { structuredData } from '@/seo/structuredData';
import { SITE_URL } from '@/seo/site';

export function render() {
  return renderToString(<App />);
}

export { structuredData, SITE_URL };

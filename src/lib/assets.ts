import type { ThemeName } from '@/types';

/**
 * Asset registry. Every image/video placed under src/assets/ is discovered at
 * build time; components ask for a logical key and get a URL (or undefined, in
 * which case they render the procedural artwork instead).
 *
 * Theme variants: name files `<theme>-<name>.<ext>` or `<name>-<theme>.<ext>`.
 *   e.g. hero/sunrise-hero.webp, hero/dusk-hero.webp, projects/story-framework.webp
 */
const files = import.meta.glob('/src/assets/**/*.{webp,png,jpg,jpeg,svg,avif,gif,mp4,webm}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const index = new Map<string, string>();
for (const [path, url] of Object.entries(files)) {
  const key = path.replace('/src/assets/', '').replace(/\.[a-z0-9]+$/i, '').toLowerCase();
  // Prefer the first format found per key, with modern formats sorted first.
  if (!index.has(key) || /\.(webp|avif)$/i.test(path)) index.set(key, url);
}

/**
 * Resolve an asset. `key` is `folder/name`, e.g. `hero/hero`.
 * With a theme, tries `folder/<theme>-name`, `folder/name-<theme>`, then `folder/name`.
 */
export function asset(key: string, theme?: ThemeName): string | undefined {
  const k = key.toLowerCase();
  if (theme) {
    const slash = k.lastIndexOf('/');
    const dir = k.slice(0, slash + 1);
    const name = k.slice(slash + 1);
    return index.get(`${dir}${theme}-${name}`) ?? index.get(`${dir}${name}-${theme}`) ?? index.get(k);
  }
  return index.get(k);
}

export function isVideo(url: string) {
  return /\.(mp4|webm)(\?|$)/i.test(url);
}

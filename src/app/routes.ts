/**
 * URL scheme (no hash fragments):
 *   /                 hero
 *   /about, /impact…  a section of the one-page site (kept in sync while scrolling)
 *   /projects/:id     a project's case study (opens the presentation overlay)
 */
import { LEGACY_SECTIONS, navigation } from '@/data/navigation';
import { projects } from '@/data/projects';

export const PROJECT_ROUTE = '/projects/:id';

const SECTION_IDS = new Set(navigation.map((n) => n.id));

export const sectionPath = (id: string) => (id === 'home' ? '/' : `/${id}`);
export const projectPath = (id: string) => `/projects/${id}`;

export const isProjectPath = (path: string) => /^\/projects\/[^/]+\/?$/.test(path);

export type RouteTarget =
  | { kind: 'section'; id: string; anchor?: string }
  | { kind: 'project'; id: string }
  | { kind: 'none' };

/** What a pathname points at. Unknown paths resolve to 'none'. */
export function resolvePath(path: string): RouteTarget {
  const clean = path.replace(/\/+$/, '') || '/';
  if (clean === '/') return { kind: 'section', id: 'home' };
  const project = clean.match(/^\/projects\/([^/]+)$/);
  if (project) {
    const id = decodeURIComponent(project[1]);
    return projects.some((p) => p.id === id) ? { kind: 'project', id } : { kind: 'none' };
  }
  const section = clean.slice(1);
  if (SECTION_IDS.has(section)) return { kind: 'section', id: section };
  // Old /build and /inventory links: their content now lives in About and Projects.
  const legacy = LEGACY_SECTIONS[section];
  return legacy ? { kind: 'section', id: legacy.section, anchor: legacy.anchor } : { kind: 'none' };
}


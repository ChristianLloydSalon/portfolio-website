import { profile } from '@/data/profile';
import { missions } from '@/data/experience';
import { skillCategories } from '@/data/skills';
import { projects } from '@/data/projects';
import { projectPath } from '@/app/routes';
import { asset } from '@/lib/assets';
import { SITE_URL, site } from './site';

const abs = (path: string) => (/^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`);

/**
 * schema.org JSON-LD, built from src/data so it never drifts from what the page shows.
 * Injected at build time. Home: Person + WebSite + ProfilePage. A project page
 * (/projects/:id): Person + WebSite + that page's WebPage and the project as a CreativeWork.
 */
export function structuredData(projectId?: string) {
  const personId = `${SITE_URL}/#person`;
  const websiteId = `${SITE_URL}/#website`;
  const current = missions.find((m) => m.status === 'active' && !/BS |Bachelor/i.test(m.position));
  const school = missions.find((m) => /BS |Bachelor/i.test(m.position));
  const portrait = asset('portraits/portrait');

  const person = {
    '@type': 'Person',
    '@id': personId,
    name: profile.name,
    givenName: profile.firstName,
    familyName: profile.lastName,
    jobTitle: profile.role,
    description: site.description,
    url: site.url,
    image: portrait ? abs(portrait) : site.image,
    address: { '@type': 'PostalAddress', addressRegion: 'Bohol', addressCountry: 'PH' },
    ...(current && { worksFor: { '@type': 'Organization', name: current.company } }),
    ...(school && { alumniOf: { '@type': 'CollegeOrUniversity', name: school.company.replace(/\s+[—–-]\s.*$/, '') } }),
    knowsAbout: skillCategories.flatMap((c) => c.skills.map((s) => s.name)),
    sameAs: profile.socials.filter((s) => /^https?:\/\//.test(s.href)).map((s) => s.href),
  };

  const website = {
    '@type': 'WebSite',
    '@id': websiteId,
    url: site.url,
    name: site.name,
    description: site.description,
    inLanguage: 'en',
    publisher: { '@id': personId },
  };

  const project = projectId ? projects.find((p) => p.id === projectId) : undefined;
  if (projectId && !project) throw new Error(`structuredData: unknown project "${projectId}"`);
  if (project) {
    const url = `${SITE_URL}${projectPath(project.id)}`;
    const art = asset(`projects/${project.id}`);
    const workId = `${url}#work`;
    return {
      '@context': 'https://schema.org',
      '@graph': [
        website,
        {
          '@type': 'WebPage',
          '@id': `${url}#webpage`,
          url,
          name: `${project.title} | ${site.name}`,
          description: project.summary,
          isPartOf: { '@id': websiteId },
          mainEntity: { '@id': workId },
          author: { '@id': personId },
          ...(art && { primaryImageOfPage: { '@type': 'ImageObject', url: abs(art) } }),
          inLanguage: 'en',
        },
        {
          '@type': 'CreativeWork',
          '@id': workId,
          name: project.title,
          description: project.summary,
          url,
          ...(art && { image: abs(art) }),
          keywords: project.stack.join(', '),
          // Company work: I contributed as one engineer; the product is the employer's.
          ...(project.employer
            ? { contributor: { '@id': personId }, producer: { '@type': 'Organization', name: project.employer } }
            : { creator: { '@id': personId } }),
          ...(project.github && { sameAs: [project.github] }),
        },
        person,
      ],
    };
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      website,
      {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/#profilepage`,
        url: site.url,
        name: site.title,
        isPartOf: { '@id': websiteId },
        mainEntity: { '@id': personId },
        primaryImageOfPage: { '@type': 'ImageObject', url: site.image, width: 1200, height: 630 },
        inLanguage: 'en',
      },
      person,
    ],
  };
}

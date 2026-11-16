import { profile } from '@/data/profile';
import { missions } from '@/data/experience';
import { skillCategories } from '@/data/skills';
import { asset } from '@/lib/assets';
import { SITE_URL, site } from './site';

const abs = (path: string) => (/^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`);

/**
 * schema.org JSON-LD for the home page (Person + WebSite + ProfilePage), built from
 * src/data so it never drifts from what the page shows. Injected at build time.
 */
export function structuredData() {
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

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: site.url,
        name: site.name,
        description: site.description,
        inLanguage: 'en',
        publisher: { '@id': personId },
      },
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

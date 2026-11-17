import type { Profile } from '@/types';

/** Personal details. Source: resume (Nov 2026). */
export const profile: Profile = {
  name: 'Christian Lloyd Salon',
  firstName: 'Christian Lloyd',
  lastName: 'Salon',
  role: 'Senior Flutter & Full-Stack Engineer',
  pitch:
    'I turn business problems into production-ready software. From customer-facing mobile apps to backend systems and automation, I help teams launch faster, run more efficiently and build technology that scales.',
  tagline: ['5+ years in production', 'Live on 3 app stores', 'Mobile to backend to cloud'],
  location: 'Bohol, PH',
  email: 'christianlloyd.b.salon@gmail.com',
  resumeUrl: '/resume.pdf',
  socials: [
    {
      kind: 'linkedin',
      label: 'LinkedIn',
      handle: 'in/christian-lloyd-salon',
      href: 'https://www.linkedin.com/in/christian-lloyd-salon',
    },
    {
      kind: 'github',
      label: 'GitHub',
      handle: '@ChristianLloydSalon',
      href: 'https://github.com/ChristianLloydSalon',
    },
    { kind: 'resume', label: 'Resume', handle: 'PDF download', href: '/resume.pdf' },
  ],
};

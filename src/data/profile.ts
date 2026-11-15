import type { Profile } from '@/types';

/** Personal details. Source: resume (Nov 2026). */
export const profile: Profile = {
  name: 'Christian Lloyd Salon',
  firstName: 'Christian Lloyd',
  lastName: 'Salon',
  role: 'Software Engineer',
  tagline: ['Builder', 'Creator', 'Problem Solver'],
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

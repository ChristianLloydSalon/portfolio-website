import type { Profile } from '@/types';

/** Personal details. Source: resume (Nov 2026). */
export const profile: Profile = {
  name: 'Christian Lloyd Salon',
  firstName: 'Christian Lloyd',
  lastName: 'Salon',
  role: 'Flutter & Full-Stack Engineer',
  pitch:
    'Five years building production software. I\u2019ve led Flutter development for apps on iOS, Android and Huawei, and owned features across the Angular admin portals, NestJS services and AWS behind them.',
  tagline: ['5+ years in production', 'Live on 3 app stores', 'Mobile, web & backend'],
  location: 'Bohol, PH',
  email: 'christianlloyd.b.salon@gmail.com',
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
  ],
};

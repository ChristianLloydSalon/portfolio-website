import type { Mission } from '@/types';

/**
 * Career timeline, newest first. Source: resume (Nov 2026). White Cloak: Aug 2021 to present.
 * Project-specific results (metrics, features) live in the Personal Collection case study, not here.
 */
export const missions: Mission[] = [
  {
    id: 'white-cloak',
    company: 'White Cloak Technologies, Inc.',
    position: 'Journeyman Software Engineer II',
    progression: ['Junior Software Engineer', 'Journeyman Software Engineer II'],
    period: 'Aug 2021 – Present',
    location: 'Pasig City, PH · Remote',
    status: 'active',
    summary:
      'Five years and counting building production software for White Cloak\u2019s clients, growing from junior engineer to mobile lead. I shipped Flutter apps to three app stores, carried features across Angular, NestJS and AWS, and stepped into technical and frontend leadership when the team needed it.',
    responsibilities: [],
    contributions: [],
    groups: [
      {
        title: 'Ownership & delivery',
        items: [
          'Production Flutter apps for iOS, Android and Huawei, from first screen to store release',
          'Full-stack features carried end to end across Flutter, Angular admin portals and NestJS services',
          'Marketplace features on Splurge Art: real-time chat, live bidding, in-app purchases and subscriptions',
          'Production support with Sentry, Dynatrace and AWS CloudWatch',
        ],
      },
      {
        title: 'Technical design & architecture',
        items: [
          'Technical design and implementation plans for new features',
          'Architecture decisions: Clean Architecture with BLoC/Cubit, Riverpod and Provider',
          'Event-driven processing with AWS EventBridge, Lambda and SQS',
          'A design system of 15+ reusable UI components, translated from Figma',
        ],
      },
      {
        title: 'Delivery pipelines & quality',
        items: [
          'Mobile CI/CD automating builds, tests, code signing and releases to three app stores',
          'Automated end-to-end testing for critical user journeys',
          'Profiling and rendering optimization for smoother apps',
        ],
      },
      {
        title: 'Leadership & collaboration',
        items: [
          'Mobile lead on the Personal Collection dealer app',
          'Interim technical lead for six months after the team\u2019s tech lead left',
          'Frontend leadership responsibilities on the web side of the team',
          'Mentoring and knowledge transfer, backed by architecture, API, workflow and CI/CD documentation',
          'Agile delivery with product owners, client stakeholders, QA and engineering',
        ],
      },
    ],
    achievements: [
      'Junior → Journeyman Software Engineer II',
      'Mobile lead · Interim tech lead (6 months)',
      'Shipped to Google Play, App Store and Huawei AppGallery',
    ],
    stack: ['Flutter', 'Dart', 'BLoC / Riverpod', 'Angular', 'NestJS', 'GraphQL', 'AWS', 'GitLab CI', 'Sentry', 'Dynatrace'],
  },
  {
    id: 'bisu-instructor',
    company: 'Bohol Island State University – Main Campus',
    position: 'Instructor (Part-time)',
    period: 'Feb 2021 – Jan 2023',
    location: 'Tagbilaran City, Bohol',
    status: 'complete',
    summary: 'Taught software development to the next generation of developers at my alma mater, alongside my engineering work.',
    responsibilities: ['Teach software development courses', 'Guide students through hands-on coding work'],
    contributions: ['Created lectures, coding exercises and practical course materials'],
    achievements: ['Two years teaching while shipping production software'],
    stack: ['Software Development', 'Teaching', 'Course Design'],
  },
  {
    id: 'bisu-degree',
    company: 'Bohol Island State University – Main Campus',
    position: 'BS Computer Engineering',
    period: 'Graduated 2020',
    location: 'Tagbilaran City, Bohol',
    status: 'complete',
    summary: 'The origin story: a Computer Engineering degree completed as a DOST scholar.',
    responsibilities: ['Computer engineering fundamentals: hardware, software and systems'],
    contributions: ['Foundation for a career in software engineering'],
    achievements: ['DOST Scholar'],
    stack: ['Computer Engineering'],
  },
];

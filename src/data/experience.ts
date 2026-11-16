import type { Mission } from '@/types';

/** Career timeline, newest first. Source: resume (Nov 2026). */
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
      'Building and supporting production iOS and Android apps in Flutter, along with the Angular admin tools, NestJS services and AWS infrastructure behind them. Mobile lead on the Personal Collection dealer app, and its interim technical lead for six months.',
    responsibilities: [],
    contributions: [],
    groups: [
      {
        title: 'Mobile engineering',
        items: [
          'Production Flutter apps for iOS, Android and Huawei',
          'Marketplace features: real-time chat, live bidding, in-app purchases and subscriptions over REST and GraphQL',
          'Responsive Flutter interfaces translated from Figma designs',
          'Profiling and rendering optimization for smoother apps',
          'QR check-in with geofencing for incentive-linked events',
        ],
      },
      {
        title: 'Backend & cloud',
        items: [
          'Event-driven eKYC reward processing with AWS EventBridge and Lambda',
          'CSV bulk-import worker on AWS SQS and S3 with cache-based locking',
          'Schema-driven survey management across Flutter, Angular and backend services',
          'Production support with Sentry, Dynatrace and AWS CloudWatch',
        ],
      },
      {
        title: 'Architecture & design systems',
        items: [
          'Clean Architecture with BLoC/Cubit, Riverpod and Provider',
          'Design system of 15+ reusable UI components',
        ],
      },
      {
        title: 'CI/CD & automation',
        items: ['Mobile CI/CD automating builds, tests, code signing and releases to three app stores'],
      },
      {
        title: 'Technical leadership',
        items: [
          'Mobile lead for the Personal Collection dealer app',
          'Interim technical lead for six months after the team\u2019s tech lead left',
          'Technical documentation: architecture, APIs, workflows, CI/CD and knowledge transfer',
          'Agile delivery with product, client, QA and engineering teams',
        ],
      },
    ],
    achievements: [
      'Mobile lead for the Personal Collection dealer app',
      'Interim technical lead for six months',
      'Shipped to Google Play, App Store and Huawei AppGallery',
      'QR check-in with geofencing for 600+ event attendees',
      'Design system of 15+ reusable UI components',
    ],
    stack: ['Flutter', 'Dart', 'BLoC / Riverpod', 'NestJS', 'Angular', 'GraphQL', 'AWS', 'Sentry', 'Dynatrace'],
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

import type { Mission } from '@/types';

/** Career timeline, newest first. Source: resume (Nov 2026). */
export const missions: Mission[] = [
  {
    id: 'white-cloak',
    company: 'White Cloak Technologies, Inc.',
    position: 'Software Engineer',
    period: 'Aug 2021 — Present',
    location: 'Pasig City, PH · Remote',
    status: 'active',
    summary:
      'Building and supporting production iOS and Android apps in Flutter, along with the Angular admin tools, NestJS services and AWS infrastructure behind them. Grew from Junior to Journeyman engineer.',
    responsibilities: [
      'Apply Clean Architecture with BLoC/Cubit, Riverpod and Provider for maintainable features',
      'Translate Figma designs into responsive Flutter interfaces',
      'Profile apps and optimize performance and rendering',
      'Support production mobile, web and backend systems with Sentry, Dynatrace and CloudWatch',
      'Write technical documentation: architecture, APIs, workflows, CI/CD and knowledge transfer',
      'Work in Agile delivery with product, client, QA and engineering teams',
    ],
    contributions: [
      'Delivered marketplace features: real-time chat, live bidding, in-app purchases and subscriptions over REST and GraphQL',
      'Engineered mobile CI/CD automating builds, tests, code signing and releases',
      'Built event-driven eKYC reward processing with AWS EventBridge and Lambda',
      'Designed a CSV bulk-import worker on AWS SQS and S3 with cache-based locking',
      'Developed schema-driven survey management across Flutter, Angular and backend services',
    ],
    achievements: [
      'Mobile lead for the Personal Collection dealer app',
      'Shipped to Google Play, App Store and Huawei AppGallery',
      'QR check-in with geofencing for 600+ event attendees',
      'Design system of 15+ reusable UI components',
    ],
    stack: ['Flutter', 'Dart', 'BLoC / Riverpod', 'NestJS', 'Angular', 'GraphQL', 'AWS', 'Sentry'],
  },
  {
    id: 'bisu-instructor',
    company: 'Bohol Island State University — Main Campus',
    position: 'Instructor (Part-time)',
    period: 'Feb 2021 — Jan 2023',
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
    company: 'Bohol Island State University — Main Campus',
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

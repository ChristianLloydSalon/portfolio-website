import type { Mission } from '@/types';

/**
 * Career timeline, newest first. Source: resume (Nov 2026). White Cloak: Aug 2021 to present.
 * This section covers responsibilities, ownership, leadership, collaboration and progression only.
 * Project results, metrics, named project roles and store releases belong to the case studies
 * (src/data/projects.ts) and the Impact section (src/data/business.ts). Don't repeat them here.
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
      'Five years and counting building production software for White Cloak\u2019s clients. The role grew from shipping features as a junior engineer to owning them across mobile, web and backend, shaping technical design, and leading mobile and frontend work for the team.',
    responsibilities: [],
    contributions: [],
    groups: [
      {
        title: 'Responsibilities',
        items: [
          'Build and maintain production Flutter apps for client products',
          'Carry features across the stack: Flutter clients, Angular admin portals and NestJS services',
          'Support live apps: monitor, triage and fix issues with Sentry, Dynatrace and AWS CloudWatch',
        ],
      },
      {
        title: 'Technical ownership',
        items: [
          'Write technical designs and implementation plans for new features',
          'Choose app architecture: Clean Architecture with BLoC/Cubit, Riverpod or Provider',
          'Backend services and event-driven processing on AWS',
          'A shared design system of reusable UI components, translated from Figma',
          'Mobile release pipelines and the test strategy behind them',
          'Profiling and rendering performance',
        ],
      },
      {
        title: 'Leadership',
        items: [
          'Lead mobile development and set technical direction for the mobile team',
          'Cover technical leadership during team transitions',
          'Frontend leadership responsibilities on the web side of the team',
          'Mentor engineers and run knowledge transfer, backed by architecture, API, workflow and CI/CD documentation',
        ],
      },
      {
        title: 'Collaboration',
        items: [
          'Agile delivery with product owners, client stakeholders, QA and engineering',
          'Clarify requirements directly with clients before work starts',
        ],
      },
    ],
    achievements: [],
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

import type { Mission } from '@/types';

/**
 * Career timeline, newest first. Source: resume (Nov 2026). White Cloak: Aug 2021 to Sept 2026.
 * This section covers progression, ownership, leadership and awards only.
 * Awards: confirmed by me (Nov 2026). Keep the names and years exactly as awarded.
 * Project results, metrics, named project roles and store releases belong to the case studies
 * (src/data/projects.ts) and the Impact section (src/data/business.ts). Don't repeat them here.
 */
export const missions: Mission[] = [
  {
    id: 'white-cloak',
    company: 'White Cloak Technologies, Inc.',
    position: 'Journeyman Software Engineer II',
    progression: ['Software Engineer', 'Journeyman Software Engineer II'],
    period: 'Aug 2021 – Sept 2026',
    location: 'Pasig City, PH · Remote',
    status: 'complete',
    summary:
      'Five years building production software for White Cloak\u2019s clients. The role grew from shipping features as a junior engineer to owning them across mobile, web and backend, shaping technical design, and leading mobile and frontend work for the team.',
    responsibilities: [],
    contributions: [],
    groups: [
      {
        title: 'Key contributions',
        items: [
          'Led Flutter development for client apps on iOS, Android and Huawei, and set technical direction for the mobile team',
          'Owned features end to end across Flutter clients, Angular admin portals and NestJS services, from technical design and implementation plan to release',
          'Built event-driven backend processing on AWS, and the mobile release pipelines, automated tests and automated code review behind each release',
          'Built a shared design system of 15+ reusable Flutter UI components, translated from Figma',
          'Supported live apps: monitored, triaged and fixed production issues with Sentry, Dynatrace and AWS CloudWatch',
        ],
      },
      {
        title: 'Leadership',
        items: [
          'Mobile Team Lead for a team of 3 engineers and 1 UI/UX designer, running sprints, code reviews and store releases',
          'Interim technical lead for six months after the team’s tech lead left',
          'Frontend leadership responsibilities on the web side of the team',
          'Mentored engineers and ran knowledge transfer, backed by architecture, API, workflow and CI/CD documentation',
          'Clarified requirements directly with client stakeholders, and worked with product owners and QA in Agile delivery',
        ],
      },
    ],
    achievements: [],
    awards: [
      { title: 'Excellence Award', issuer: 'White Cloak Technologies, Inc.', years: '2023 and 2024' },
      { title: 'Most Valuable Developer', issuer: 'White Cloak Technologies, Inc.', years: '2021–2024' },
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
    summary: 'Taught software development part-time at my alma mater, alongside my engineering work.',
    responsibilities: [],
    contributions: [],
    groups: [
      {
        title: 'Responsibilities',
        items: [
          'Taught software development courses and guided students through hands-on coding work',
          'Created lectures, coding exercises and practical course materials',
        ],
      },
    ],
    achievements: [],
    stack: ['Software Development', 'Teaching', 'Course Design'],
  },
  {
    id: 'bisu-degree',
    company: 'Bohol Island State University – Main Campus',
    position: 'BS Computer Engineering',
    period: 'Graduated 2020',
    location: 'Tagbilaran City, Bohol',
    status: 'complete',
    summary: 'Computer engineering fundamentals across hardware, software and systems, completed as a DOST scholar.',
    responsibilities: [],
    contributions: [],
    achievements: ['DOST Scholar'],
    stack: ['Computer Engineering'],
  },
];

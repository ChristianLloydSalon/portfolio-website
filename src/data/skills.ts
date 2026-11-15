import type { SkillCategory } from '@/types';

/** Technical loadout. Source: resume (Nov 2026), plus web skills from the original brief. */
export const skillCategories: SkillCategory[] = [
  {
    id: 'mobile',
    name: 'Mobile Development',
    short: 'Mobile',
    icon: 'smartphone',
    description: 'Production iOS and Android apps, from first screen to store release.',
    skills: [
      { name: 'Flutter & Dart', mono: 'Fl', note: '5+ years of production iOS and Android apps' },
      { name: 'Kotlin & Swift', mono: 'Kt', note: 'Native platform integration and modules' },
      { name: 'In-app Purchases', mono: 'Ip', note: 'Purchases and subscription flows' },
      { name: 'Push Notifications', mono: 'Pn', note: 'Engagement and real-time updates' },
      { name: 'Store Releases', mono: 'Sr', note: 'Google Play, App Store and Huawei AppGallery' },
    ],
  },
  {
    id: 'frontend',
    name: 'Frontend & UI',
    short: 'Frontend',
    icon: 'layout',
    description: 'Interfaces that match the design and stay fast.',
    skills: [
      { name: 'Figma to Flutter', mono: 'Fg', note: 'Responsive interfaces from design files' },
      { name: 'Design Systems', mono: 'Ds', note: '15+ reusable UI components' },
      { name: 'Angular', mono: 'Ng', note: 'Admin dashboards and back-office tools' },
      { name: 'React & Next.js', mono: 'Re', note: 'Web apps and interactive sites' },
      { name: 'Performance Profiling', mono: 'Pf', note: 'Rendering optimization and responsiveness' },
    ],
  },
  {
    id: 'backend',
    name: 'Backend & Integration',
    short: 'Backend',
    icon: 'server',
    description: 'APIs and services that hold up in production.',
    skills: [
      { name: 'NestJS & TypeScript', mono: 'Ns', note: 'Modular, testable services' },
      { name: 'REST & GraphQL', mono: 'Gq', note: 'API design and client integration' },
      { name: 'PostgreSQL', mono: 'Pg', note: 'Relational data modeling' },
      { name: 'Firebase & Firestore', mono: 'Fb', note: 'Auth, real-time data and messaging' },
      { name: 'Event-driven Architecture', mono: 'Ev', note: 'Decoupled workflows and microservices' },
      { name: 'Real-time Features', mono: 'Rt', note: 'Chat, live bidding and marketplace flows' },
    ],
  },
  {
    id: 'cloud',
    name: 'Cloud & CI/CD',
    short: 'Cloud',
    icon: 'cloud',
    description: 'Ship often, deploy safely, sleep at night.',
    skills: [
      { name: 'AWS', mono: 'Aw', note: 'SQS, S3, SNS, Lambda and EventBridge' },
      { name: 'Docker & Terraform', mono: 'Dk', note: 'Reproducible environments and infrastructure' },
      { name: 'GitLab CI & GitHub Actions', mono: 'Ci', note: 'Automated builds and tests' },
      { name: 'Codemagic & Fastlane', mono: 'Cm', note: 'Mobile code signing and store releases' },
      { name: 'Monitoring', mono: 'Mn', note: 'Sentry, Dynatrace and AWS CloudWatch' },
    ],
  },
  {
    id: 'architecture',
    name: 'Architecture & Quality',
    short: 'Architecture',
    icon: 'boxes',
    description: 'Structure that keeps codebases changeable for years.',
    skills: [
      { name: 'Clean Architecture', mono: 'Ca', note: 'Clear boundaries between layers' },
      { name: 'BLoC, Riverpod & Provider', mono: 'Bl', note: 'Predictable state management' },
      { name: 'MVVM & Modular Architecture', mono: 'Mv', note: 'Features as independent modules' },
      { name: 'Repository Pattern & DI', mono: 'Di', note: 'Testable data and dependencies' },
      { name: 'Automated Testing', mono: 'At', note: 'Maestro, Playwright and Jest' },
    ],
  },
];

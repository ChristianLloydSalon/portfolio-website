import type { SkillCategory } from '@/types';

/**
 * Technical loadout in 8 disciplines. Source: resume (Nov 2026), plus React from the
 * original brief and MongoDB (Splurge Art, a few months) confirmed by me.
 * Tiers (production / working / familiar): confirmed by Christian (Nov 2026).
 */
export const skillCategories: SkillCategory[] = [
  {
    id: 'mobile',
    name: 'Mobile Development',
    short: 'Mobile',
    icon: 'smartphone',
    description: 'Production iOS and Android apps, from first screen to store release.',
    skills: [
      { name: 'Flutter & Dart', mono: 'Fl', note: '5+ years of production iOS and Android apps', tier: 'production' },
      { name: 'Kotlin & Swift', mono: 'Kt', note: 'Native platform integration', tier: 'production' },
      { name: 'Push Notifications', mono: 'Pn', note: 'Engagement and real-time updates', tier: 'production' },
      { name: 'In-app Purchases', mono: 'Ip', note: 'Purchases and subscription flows', tier: 'production' },
      { name: 'Store Releases', mono: 'Sr', note: 'App Store, Google Play and Huawei AppGallery', tier: 'production' },
    ],
  },
  {
    id: 'architecture',
    name: 'Architecture & State',
    short: 'Architecture',
    icon: 'boxes',
    description: 'Structure that keeps codebases changeable for years.',
    skills: [
      { name: 'Clean Architecture', mono: 'Ca', note: 'Clear boundaries between layers', tier: 'production' },
      { name: 'MVVM & Modular Architecture', mono: 'Mv', note: 'Features as independent modules', tier: 'production' },
      { name: 'Repository Pattern & DI', mono: 'Di', note: 'Testable data and dependencies', tier: 'production' },
      { name: 'BLoC / Cubit', mono: 'Bl', note: 'Predictable, event-driven state', tier: 'production' },
      { name: 'Riverpod & Provider', mono: 'Rp', note: 'Lightweight, testable state', tier: 'production' },
    ],
  },
  {
    id: 'frontend',
    name: 'Frontend & UI',
    short: 'Frontend',
    icon: 'layout',
    description: 'Interfaces that match the design and stay fast.',
    skills: [
      { name: 'Angular', mono: 'Ng', note: 'Admin portals and back-office tools', tier: 'production' },
      { name: 'React & Next.js', mono: 'Re', note: 'Web apps and interactive sites', tier: 'production' },
      { name: 'TypeScript', mono: 'Ts', note: 'Typed code from UI to API', tier: 'production' },
      { name: 'Design Systems', mono: 'Ds', note: '15+ reusable UI components, Figma to Flutter', tier: 'production' },
      { name: 'Performance Profiling', mono: 'Pf', note: 'Rendering optimization and responsiveness', tier: 'production' },
    ],
  },
  {
    id: 'backend',
    name: 'Backend & APIs',
    short: 'Backend',
    icon: 'server',
    description: 'APIs and services that hold up in production.',
    skills: [
      { name: 'NestJS', mono: 'Ns', note: 'Modular, testable services on Node.js', tier: 'production' },
      { name: 'REST & GraphQL', mono: 'Gq', note: 'API design and client integration', tier: 'production' },
      { name: 'Event-driven Architecture', mono: 'Ev', note: 'Decoupled workflows and microservices', tier: 'production' },
      { name: 'Real-time Features', mono: 'Rt', note: 'Chat, live bidding and marketplace flows', tier: 'production' },
    ],
  },
  {
    id: 'data',
    name: 'Databases',
    short: 'Data',
    icon: 'database',
    description: 'Data modeled for the way the product uses it.',
    skills: [
      { name: 'PostgreSQL', mono: 'Pg', note: 'Relational data modeling', tier: 'working' },
      { name: 'Firebase & Cloud Firestore', mono: 'Fb', note: 'Auth, real-time data and messaging', tier: 'production' },
      { name: 'MongoDB', mono: 'Mg', note: 'Used on Splurge Art', tier: 'working' },
    ],
  },
  {
    id: 'cloud',
    name: 'Cloud & Infrastructure',
    short: 'Cloud',
    icon: 'cloud',
    description: 'Serverless and containerized infrastructure on AWS.',
    skills: [
      { name: 'AWS Lambda & EventBridge', mono: 'La', note: 'Event-driven processing', tier: 'production' },
      { name: 'AWS SQS, SNS & S3', mono: 'Sq', note: 'Queues, notifications and storage', tier: 'production' },
      { name: 'Docker', mono: 'Dk', note: 'Reproducible environments', tier: 'working' },
      { name: 'Terraform', mono: 'Tf', note: 'Infrastructure as code', tier: 'production' },
    ],
  },
  {
    id: 'cicd',
    name: 'CI/CD & Monitoring',
    short: 'CI/CD',
    icon: 'workflow',
    description: 'Ship often, deploy safely, see problems first.',
    skills: [
      { name: 'GitLab CI & GitHub Actions', mono: 'Ci', note: 'Automated builds and tests', tier: 'production' },
      { name: 'Codemagic & Fastlane', mono: 'Cm', note: 'Mobile code signing and store releases', tier: 'production' },
      { name: 'Store Consoles', mono: 'Sc', note: 'App Store Connect, Play Console, AppGallery', tier: 'production' },
      { name: 'Sentry, Dynatrace & CloudWatch', mono: 'Mn', note: 'Production monitoring', tier: 'production' },
    ],
  },
  {
    id: 'testing',
    name: 'Testing & Quality',
    short: 'Testing',
    icon: 'flask',
    description: 'Automated checks that make releases boring.',
    skills: [
      { name: 'Maestro', mono: 'Ma', note: 'Mobile end-to-end flows', tier: 'production' },
      { name: 'Playwright', mono: 'Pw', note: 'Web end-to-end tests', tier: 'production' },
      { name: 'Jest', mono: 'Je', note: 'Unit and integration tests', tier: 'production' },
      { name: 'SonarQube', mono: 'So', note: 'Code quality gates', tier: 'production' },
    ],
  },
];

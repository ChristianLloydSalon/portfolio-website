import type { SkillCategory } from '@/types';

/**
 * Technical loadout in 8 disciplines. Source: resume (Nov 2026), plus React from the
 * original brief and MongoDB (Splurge Art, a few months) confirmed by me.
 * Tiers (production / working / familiar): confirmed by Christian (Nov 2026). Labels shown
 * on the site: Production experience / Working knowledge / Familiar. No percentages.
 * Production-tier skills are always visible; the rest sit behind a "More tools" toggle.
 * Keep notes short and specific, and list each technology in one category only.
 */
export const skillCategories: SkillCategory[] = [
  {
    id: 'mobile',
    name: 'Mobile Development',
    short: 'Mobile',
    icon: 'smartphone',
    description: 'Flutter apps for iOS, Android and Huawei, from first screen to store release.',
    skills: [
      { name: 'Flutter & Dart', mono: 'Fl', note: '5+ years of production apps', tier: 'production' },
      { name: 'Kotlin & Swift', mono: 'Kt', note: 'Native platform integration', tier: 'production' },
      { name: 'Push Notifications', mono: 'Pn', note: 'Firebase Cloud Messaging and Huawei Push Kit', tier: 'production' },
      { name: 'In-app Purchases', mono: 'Ip', note: 'Purchases and subscriptions', tier: 'production' },
    ],
  },
  {
    id: 'frontend',
    name: 'Frontend Development',
    short: 'Frontend',
    icon: 'layout',
    description: 'Angular admin portals and React / Next.js web apps.',
    skills: [
      { name: 'Angular', mono: 'Ng', note: 'Admin portals', tier: 'production' },
      { name: 'React & Next.js', mono: 'Re', note: 'Web apps, including Brightrail and this site', tier: 'production' },
      { name: 'TypeScript', mono: 'Ts', note: 'Frontend and backend', tier: 'production' },
      { name: 'Design Systems', mono: 'Ds', note: '15+ reusable Flutter components from Figma', tier: 'production' },
      { name: 'Performance Profiling', mono: 'Pf', note: 'Rendering performance', tier: 'production' },
    ],
  },
  {
    id: 'backend',
    name: 'Backend Development',
    short: 'Backend',
    icon: 'server',
    description: 'NestJS services, APIs and the data stores behind the apps.',
    skills: [
      { name: 'NestJS', mono: 'Ns', note: 'Services behind the apps and admin portals', tier: 'production' },
      { name: 'REST & GraphQL', mono: 'Gq', note: 'API design and client integration', tier: 'production' },
      { name: 'Real-time Features', mono: 'Rt', note: 'Chat and live bidding', tier: 'production' },
      { name: 'Firebase & Cloud Firestore', mono: 'Fb', note: 'Auth, real-time data and messaging', tier: 'production' },
      { name: 'PostgreSQL', mono: 'Pg', note: 'Brightrail, with row-level security', tier: 'working' },
      { name: 'MongoDB', mono: 'Mg', note: 'Used on Splurge Art', tier: 'working' },
    ],
  },
  {
    id: 'cloud',
    name: 'Cloud & Infrastructure',
    short: 'Cloud',
    icon: 'cloud',
    description: 'Serverless and queue-based processing on AWS.',
    skills: [
      { name: 'AWS Lambda & EventBridge', mono: 'La', note: 'Event-driven processing', tier: 'production' },
      { name: 'AWS SQS & Dead Letter Queues', mono: 'Sq', note: 'Bulk imports and notification processing', tier: 'production' },
      { name: 'AWS SNS', mono: 'SN', note: 'Event notifications and message publishing', tier: 'production' },
      { name: 'AWS S3', mono: 'S3', note: 'Object storage and file management', tier: 'production' },
      { name: 'Terraform', mono: 'Tf', note: 'Infrastructure as code', tier: 'working' },
      { name: 'Docker', mono: 'Dk', note: 'Reproducible environments', tier: 'working' },
    ],
  },
  {
    id: 'architecture',
    name: 'Architecture & System Design',
    short: 'Architecture',
    icon: 'boxes',
    description: 'How I structure apps and services.',
    skills: [
      { name: 'Clean Architecture', mono: 'Ca', note: 'Separate data, domain and presentation layers', tier: 'production' },
      { name: 'Event-driven Architecture', mono: 'Ev', note: 'Queue- and event-based workflows', tier: 'production' },
      { name: 'MVVM & Modular Architecture', mono: 'Mv', note: 'Features as independent modules', tier: 'production' },
      { name: 'Repository Pattern & DI', mono: 'Di', note: 'Swappable data sources and dependencies', tier: 'production' },
      { name: 'BLoC / Cubit, Riverpod & Provider', mono: 'Bl', note: 'Flutter state management', tier: 'production' },
    ],
  },
  {
    id: 'cicd',
    name: 'DevOps & CI/CD',
    short: 'DevOps',
    icon: 'workflow',
    description: 'Builds, store releases and production monitoring.',
    skills: [
      { name: 'GitLab CI & GitHub Actions', mono: 'Ci', note: 'Automated builds and tests', tier: 'production' },
      { name: 'Codemagic & Fastlane', mono: 'Cm', note: 'Code signing and releases to App Store, Google Play and AppGallery', tier: 'production' },
      { name: 'Sentry, Dynatrace & CloudWatch', mono: 'Mn', note: 'Production monitoring and triage', tier: 'production' },
    ],
  },
  {
    id: 'testing',
    name: 'Testing & Quality Engineering',
    short: 'Testing',
    icon: 'flask',
    description: 'Automated tests and automated code review in the delivery workflow.',
    skills: [
      { name: 'Maestro', mono: 'Ma', note: 'Mobile end-to-end tests for critical user journeys', tier: 'production' },
      { name: 'Playwright', mono: 'Pw', note: 'Web end-to-end tests', tier: 'production' },
      { name: 'Jest', mono: 'Je', note: 'Unit and integration tests', tier: 'production' },
      { name: 'SonarQube', mono: 'So', note: 'Code quality gates', tier: 'production' },
      { name: 'Claude Code Review', mono: 'Cr', note: 'Automated merge request reviews using Claude, providing feedback on code quality, architectural conventions, and potential issues', tier: 'production' },
    ],
  },
  {
    id: 'tooling',
    name: 'Developer Tooling',
    short: 'Tooling',
    icon: 'wrench',
    description: 'Packages, scaffolding and documentation for other developers.',
    skills: [
      { name: 'Package Authoring (pub.dev)', mono: 'Pd', note: 'story_framework on pub.dev', tier: 'production' },
      { name: 'Mason Bricks', mono: 'Mb', note: 'Scaffolding for Flutter feature modules', tier: 'production' },
      { name: 'Shell & CLI Scripting', mono: 'Sh', note: 'Release-notes tooling', tier: 'working' },
      { name: 'Technical Documentation', mono: 'Dc', note: 'Architecture, APIs, workflows and CI/CD', tier: 'production' },
    ],
  },
];

import type { SkillCategory } from '@/types';

/**
 * Technical loadout in 8 disciplines. Source: resume (Nov 2026), plus React from the
 * original brief and MongoDB (Splurge Art, a few months) confirmed by me.
 * Tiers (production / working / familiar): confirmed by Christian (Nov 2026). Labels shown
 * on the site: Production experience / Working knowledge / Familiar. No percentages.
 */
export const skillCategories: SkillCategory[] = [
  {
    id: 'mobile',
    name: 'Mobile Development',
    short: 'Mobile',
    icon: 'smartphone',
    description: 'Production iOS, Android and Huawei apps, from first screen to store release.',
    skills: [
      { name: 'Flutter & Dart', mono: 'Fl', note: '5+ years of production iOS and Android apps', tier: 'production' },
      { name: 'Kotlin & Swift', mono: 'Kt', note: 'Native platform integration', tier: 'production' },
      { name: 'Push Notifications', mono: 'Pn', note: 'Firebase Cloud Messaging and Huawei Push Kit', tier: 'production' },
      { name: 'In-app Purchases', mono: 'Ip', note: 'Purchases and subscription flows', tier: 'production' },
      { name: 'Store Releases', mono: 'Sr', note: 'App Store, Google Play and Huawei AppGallery', tier: 'production' },
    ],
  },
  {
    id: 'frontend',
    name: 'Frontend Development',
    short: 'Frontend',
    icon: 'layout',
    description: 'Admin portals and web apps that match the design and stay fast.',
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
    name: 'Backend Development',
    short: 'Backend',
    icon: 'server',
    description: 'APIs, services and data models that hold up in production.',
    skills: [
      { name: 'NestJS', mono: 'Ns', note: 'Modular, testable services on Node.js', tier: 'production' },
      { name: 'REST & GraphQL', mono: 'Gq', note: 'API design and client integration', tier: 'production' },
      { name: 'Real-time Features', mono: 'Rt', note: 'Chat, live bidding and marketplace flows', tier: 'production' },
      { name: 'Firebase & Cloud Firestore', mono: 'Fb', note: 'Auth, real-time data and messaging', tier: 'production' },
      { name: 'PostgreSQL', mono: 'Pg', note: 'Relational data modeling', tier: 'working' },
      { name: 'MongoDB', mono: 'Mg', note: 'Used on Splurge Art', tier: 'working' },
    ],
  },
  {
    id: 'cloud',
    name: 'Cloud & Infrastructure',
    short: 'Cloud',
    icon: 'cloud',
    description: 'Serverless and queue-based infrastructure on AWS.',
    skills: [
      { name: 'AWS Lambda & EventBridge', mono: 'La', note: 'Event-driven processing', tier: 'production' },
      { name: 'AWS SQS & Dead Letter Queues', mono: 'Sq', note: 'Asynchronous bulk and notification processing', tier: 'production' },
      { name: 'AWS SNS & S3', mono: 'S3', note: 'Notifications and storage', tier: 'production' },
      { name: 'Terraform', mono: 'Tf', note: 'Infrastructure as code', tier: 'production' },
      { name: 'Docker', mono: 'Dk', note: 'Reproducible environments', tier: 'working' },
    ],
  },
  {
    id: 'architecture',
    name: 'Architecture & System Design',
    short: 'Architecture',
    icon: 'boxes',
    description: 'Structure that keeps codebases changeable for years.',
    skills: [
      { name: 'Clean Architecture', mono: 'Ca', note: 'Clear boundaries between layers', tier: 'production' },
      { name: 'Event-driven Architecture', mono: 'Ev', note: 'Decoupled, asynchronous workflows', tier: 'production' },
      { name: 'MVVM & Modular Architecture', mono: 'Mv', note: 'Features as independent modules', tier: 'production' },
      { name: 'Repository Pattern & DI', mono: 'Di', note: 'Testable data and dependencies', tier: 'production' },
      { name: 'BLoC / Cubit, Riverpod & Provider', mono: 'Bl', note: 'Predictable, testable state', tier: 'production' },
    ],
  },
  {
    id: 'cicd',
    name: 'DevOps & CI/CD',
    short: 'DevOps',
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
    name: 'Testing & Quality Engineering',
    short: 'Testing',
    icon: 'flask',
    description: 'Automated checks that make releases boring.',
    skills: [
      { name: 'Maestro', mono: 'Ma', note: 'Mobile end-to-end tests for critical journeys', tier: 'production' },
      { name: 'Playwright', mono: 'Pw', note: 'Web end-to-end tests', tier: 'production' },
      { name: 'Jest', mono: 'Je', note: 'Unit and integration tests', tier: 'production' },
      { name: 'SonarQube', mono: 'So', note: 'Code quality gates', tier: 'production' },
      { name: 'Claude Code Review', mono: 'Cr', note: 'Automatic merge request reviews: best practices, architecture, security', tier: 'production' },
    ],
  },
  {
    id: 'tooling',
    name: 'Developer Tooling',
    short: 'Tooling',
    icon: 'wrench',
    description: 'Tools that make the rest of the team faster.',
    skills: [
      { name: 'Package Authoring (pub.dev)', mono: 'Pd', note: 'story_framework: published, versioned, documented', tier: 'production' },
      { name: 'Mason Bricks', mono: 'Mb', note: 'Scaffolding for consistent Flutter feature modules', tier: 'production' },
      { name: 'Shell & CLI Scripting', mono: 'Sh', note: 'Release-notes tooling and workflow scripts', tier: 'working' },
      { name: 'Technical Documentation', mono: 'Dc', note: 'Architecture, APIs, workflows and CI/CD', tier: 'production' },
    ],
  },
];

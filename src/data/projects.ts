import type { Project } from '@/types';

/**
 * Featured projects. To use real artwork, drop an image into
 * src/assets/projects/ named <id>.webp (or <id>-sunrise.webp / <id>-dusk.webp).
 * Add `github` / `demo` URLs to show the link buttons, and `year` to show a year.
 *
 * Order: flagships first (Personal Collection, Story Framework), then own work, company work.
 * Splurge Art and Personal Collection: company projects at White Cloak (resume, the public
 * Personal Collection page and Play Store listing, and details confirmed by me, Nov 2026).
 * Story Framework, Brightrail: from their GitHub READMEs and live sites (Nov 2026).
 * AI Requirements Analyst, Souls-like demo (a Flutter Scene experiment): in development;
 * planned features from the original brief. TODO: update as they take shape.
 */
export const projects: Project[] = [
  {
    id: 'personal-collection',
    index: '01',
    title: 'Personal Collection',
    codename: 'The Network',
    category: 'Retail & Dealer Platform',
    summary: 'The dealer app for Personal Collection, live on the App Store, Google Play and Huawei AppGallery. I lead its mobile development at White Cloak, and served as interim technical lead.',
    description:
      'Personal Collection\u2019s app for its dealers and employees: credit tracking, invoices, transactions, events, surveys and promotions in one place, with customer features planned next. It is built by a team at White Cloak Technologies, where I lead mobile development of the Flutter app and contribute to the Angular administration and the NestJS backend. When the team\u2019s technical lead left, I stepped in as interim technical lead for six months.',
    stack: ['Flutter', 'Angular', 'NestJS', 'TypeScript', 'AWS', 'Dynatrace'],
    features: [
      'Lead mobile development of the Flutter app for iOS, Android and Huawei',
      'Interim technical lead for six months after the team\u2019s tech lead left',
      'Bulk upload, survey management and event management, end to end',
      'Product management, announcements and customer-engagement features',
      'Requirements clarified directly with client stakeholders',
    ],
    role: 'Mobile lead · Interim tech lead (6 mo)',
    employer: 'White Cloak Technologies',
    links: [
      { label: 'App Store', href: 'https://apps.apple.com/ph/app/personal-collection/id6751012612' },
      { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=app.pcdsi.superapp' },
      { label: 'AppGallery', href: 'https://appgallery.huawei.com/app/C114971443' },
      { label: 'Website', href: 'https://pcapp.pcdsi.ph/' },
    ],
    caseStudy: {
      results: [
        { value: '10K+', label: 'Downloads on Google Play', source: 'Public Play Store listing' },
        { value: '3', label: 'App stores: App Store, Google Play, AppGallery' },
        { value: '600+', label: 'Attendees checked in at incentive events' },
      ],
      architecture: [
        { title: 'Clients', items: ['Flutter dealer app (iOS, Android, Huawei)', 'Angular admin portal'] },
        { title: 'API', items: ['NestJS backend', 'REST APIs'] },
        { title: 'Cloud', items: ['AWS S3 storage', 'AWS SQS background workers'] },
        { title: 'Delivery', items: ['CI/CD to three app stores'] },
      ],
      architectureNote: 'High-level view only. The client\u2019s internal architecture stays private.',
      challenges: [
        {
          title: 'Bulk upload',
          problem: 'Large CSV imports had to run without blocking the app, and two uploads starting at once could collide.',
          solution: 'A background worker on AWS SQS and S3 processes imports asynchronously, with cache-based locking so only one upload runs at a time.',
        },
        {
          title: 'Survey management',
          problem: 'Surveys change often and had to look and behave the same in the dealer app, the admin portal and the backend.',
          solution: 'Schema-driven surveys: a survey is defined once as a schema and rendered consistently by the Flutter app, the Angular admin and the backend services.',
        },
        {
          title: 'Event management',
          problem: 'Attendance at incentive-linked events had to be verified, so a scan from outside the venue couldn\u2019t count.',
          solution: 'QR check-in with geofencing validation, which supported 600+ attendees.',
        },
      ],
    },
    motif: 'retail',
    palette: { sunrise: ['#2b9ea6', '#f4a774', '#f6edbb'], dusk: ['#e58db9', '#a78bfa', '#121a36'] },
  },
  {
    id: 'story-framework',
    index: '02',
    title: 'Story Framework',
    codename: 'Stories, Your Way',
    category: 'Open-source Flutter Package',
    summary: 'Instagram-style stories for Flutter: a customizable viewer, a full editor, interactive stickers, video and audio, and export.',
    description:
      'An open-source Flutter package, published on pub.dev, for building Instagram-style stories. Everything sits on one shared document model: a viewer with gesture and keyboard navigation and swappable transitions, a full editor with layers, a timeline and undo/redo, interactive stickers, video and audio through any player, and export. A headless engine and versioned JSON make it easy to build a completely custom experience on top.',
    stack: ['Flutter', 'Dart', 'pub.dev', 'Open Source'],
    features: [
      'Viewer with tap, hold, swipe and keyboard navigation, plus cube, fade, slide and zoom transitions',
      'Editor with snapping, text, sticker, shape and draw tools, layers, a timeline and undo/redo',
      'Interactive content: polls, quizzes, questions, sliders, countdowns, links and product tags',
      'Video and audio through any player, with synced media and preloading',
      'Export as JSON, per-item PNGs or a slideshow video, with versioned JSON and migrations',
      'Headless StoryController for fully custom viewers',
    ],
    role: 'Author & maintainer',
    github: 'https://github.com/ChristianLloydSalon/story_framework',
    packageUrl: 'https://pub.dev/packages/story_framework',
    caseStudy: {
      media: [
        { asset: 'projects/story-framework/demo-viewer', alt: 'A story playing in the Story Framework viewer', caption: 'Viewer: tap, hold and swipe' },
        { asset: 'projects/story-framework/demo-stickers', alt: 'Interactive poll and quiz stickers in a story', caption: 'Interactive stickers' },
        { asset: 'projects/story-framework/demo-editor', alt: 'Editing a story with layers and tools', caption: 'Full editor' },
      ],
      architecture: [
        { title: 'Document', items: ['StoryDocument: groups, items, elements', 'Versioned JSON with migrations'] },
        { title: 'Engine', items: ['Headless StoryController', 'Drift-free timeline'] },
        { title: 'UI', items: ['StoryViewer', 'Story editor'] },
        { title: 'Plug-ins', items: ['Any video or audio player', 'Sticker providers', 'Export: JSON, PNG, video'] },
      ],
      code: [
        { label: 'pubspec.yaml', code: 'dependencies:\n  story_framework: ^0.1.0' },
        {
          label: 'Show a story',
          code: "StoryViewer(\n  document: document,\n  onDismiss: () => Navigator.pop(context),\n  onComplete: () => Navigator.pop(context),\n)",
        },
      ],
    },
    motif: 'graph',
    palette: { sunrise: ['#2b9ea6', '#f6edbb', '#2d4a7a'], dusk: ['#a78bfa', '#6b9ceb', '#0b1230'] },
  },
  {
    id: 'brightrail',
    index: '03',
    title: 'Brightrail',
    codename: 'Stay on the Rails',
    category: 'Workflow Automation Platform',
    summary: 'Visual workflow automation with durable execution: draw a workflow, connect your services, and recover safely when an API fails.',
    description:
      'Brightrail is a workflow automation platform in the same category as n8n and Zapier, built for small technical teams who need automations they can trust in production. Workflows are drawn on a visual canvas and run on a durable engine that survives restarts, retries failures safely with idempotency keys and records every step. When a run fails, an AI assistant explains why and suggests a fix, and a person approves it before anything happens.',
    stack: ['Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Inngest', 'Gemini', 'Vercel'],
    features: [
      'Visual builder with 9 step types: branches, fan-out and joins, nested loops, formulas, durable delays and error handlers',
      'Durable execution: checkpointed steps, backoff retries with idempotency keys, runs that survive redeploys',
      'Connectors for HTTPS, Slack, Discord, Teams, Telegram, Resend, Google Sheets, Notion and Airtable',
      'Run inspector with every attempt, redacted inputs and outputs, structured logs and live updates',
      'AI failure analysis with Gemini, and an approval queue so a person signs off on every recovery',
      'Multi-tenant workspaces: five roles, encrypted credentials, versioned workflows, audit log and TOTP 2FA',
    ],
    role: 'Full-stack developer',
    github: 'https://github.com/ChristianLloydSalon/Brightrail',
    demo: 'https://brightrail.vercel.app',
    caseStudy: {
      results: [
        { value: '9', label: 'Step types in the visual builder' },
        { value: '9', label: 'Connectors, plus any HTTPS API' },
        { value: '~35', label: 'Validation rules checked before publish' },
      ],
      architecture: [
        { title: 'Client', items: ['Next.js UI', 'React Flow builder', 'Run inspector'] },
        { title: 'App (Vercel)', items: ['Server actions', 'REST API + webhooks', 'Workflow engine', 'AI advisor'] },
        { title: 'Orchestration', items: ['Inngest durable steps', 'Sleeps, retries, crons'] },
        { title: 'Data', items: ['Supabase Postgres + RLS', 'Auth + TOTP', 'Realtime'] },
      ],
      challenges: [
        {
          title: 'State that survives restarts',
          problem: 'Inngest replays a function after each step, and a deploy can land mid-run, so run state had to be replay-safe.',
          solution: 'Every unit of work is a memoized step with a stable, unique ID; Postgres holds the durable run record and the walker\u2019s order is deterministic.',
        },
        {
          title: 'Retries without duplicate side effects',
          problem: 'Retrying a whole run would resend emails and re-append rows for steps that had already succeeded.',
          solution: 'Retries resume from the failed node, with per-item idempotency keys inside loops. Failures that can\u2019t succeed on retry are blocked.',
        },
        {
          title: 'Long waits on serverless',
          problem: 'Serverless functions time out in seconds, but workflows can wait for days and schedules must fire exactly once.',
          solution: 'Durable sleeps, one pending tick per schedule claimed atomically in Postgres, and an hourly reconcile that re-arms lost timers.',
        },
      ],
    },
    motif: 'spec',
    palette: { sunrise: ['#e9825a', '#f6edbb', '#18233b'], dusk: ['#ff9f78', '#a78bfa', '#0b1230'] },
  },
  {
    id: 'splurge-art',
    index: '04',
    title: 'Splurge Art',
    codename: 'The Auction House',
    category: 'AI Art Social Marketplace',
    summary: 'A social marketplace for AI-generated art. I contributed mobile and web features as part of the White Cloak team. Now discontinued.',
    description:
      'Splurge Art was a social marketplace that combined networking, AI-generated artwork and marketplace trading. It was built by a team at White Cloak Technologies, where I was one of the engineers contributing mobile and web features, mainly the real-time and commerce flows. The product has since been discontinued.',
    stack: ['Flutter', 'NestJS', 'Next.js', 'Cloud Firestore', 'Firebase', 'MongoDB', 'GraphQL'],
    features: [
      'Real-time chat between buyers, sellers and artists',
      'Live bidding on artwork',
      'In-app purchases and subscription workflows',
      'REST and GraphQL API integration across mobile and web',
    ],
    role: 'Contributor: mobile & web features',
    employer: 'White Cloak Technologies',
    status: 'discontinued',
    motif: 'market',
    palette: { sunrise: ['#e9825a', '#f6edbb', '#2d4a7a'], dusk: ['#e58db9', '#a78bfa', '#10182b'] },
  },
  {
    id: 'ai-requirements-analyst',
    index: '05',
    title: 'AI Requirements Analyst',
    codename: 'Signal From Noise',
    category: 'AI Application',
    summary: 'Turning unstructured requirements into actionable software specifications.',
    description:
      'Currently in development. The goal: meeting notes, chat threads and loose briefs go in, and structured specifications come out. The analyst is being built to extract actors, user stories, acceptance criteria and open questions, flag ambiguity, and produce a spec a team can estimate and build from, with a human reviewing every step.',
    stack: ['TypeScript', 'NestJS', 'LLM APIs'],
    features: [
      'Ingests free-form notes, transcripts and documents',
      'Generates user stories with acceptance criteria',
      'Detects contradictions, gaps and ambiguous wording',
      'Exports a structured spec the team can build from',
    ],
    role: 'Solo developer',
    status: 'in-development',
    motif: 'spec',
    palette: { sunrise: ['#4f86b8', '#f6edbb', '#7c72bd'], dusk: ['#6b9ceb', '#e58db9', '#10182b'] },
  },
  {
    id: 'souls-like-demo',
    index: '06',
    title: 'Souls-like Game Demo',
    codename: 'Flutter Scene Experiment',
    category: '3D Action RPG',
    summary: 'A souls-like 3D action RPG built on Flutter Scene, the 3D game engine on Flutter GPU.',
    description:
      'Currently in development. An experiment with Flutter Scene, the 3D game engine for Flutter built on Flutter GPU: how far can a Flutter app go as a real-time 3D action RPG? The demo is being built around combat, exploration and boss encounters, as a way to learn game loops, animation and real-time performance in Flutter.',
    stack: ['Flutter', 'Dart', 'Flutter Scene', 'Flutter GPU'],
    features: [
      'Built on Flutter Scene, a 3D game engine running on Flutter GPU',
      'Combat and exploration in a 3D world',
      'Boss encounters',
      'Exploring glTF models, animation, PBR lighting, shadows and physics',
    ],
    role: 'Solo developer',
    status: 'in-development',
    motif: 'blade',
    palette: { sunrise: ['#e9825a', '#2b9ea6', '#18233b'], dusk: ['#a78bfa', '#6b9ceb', '#060a17'] },
  },
];

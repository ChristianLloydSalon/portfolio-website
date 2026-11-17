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
 * AI Requirements Analyst (in development) and the Souls-like demo (experimental): planned
 * features from the original brief. TODO: update as they take shape.
 * Personal Collection metrics (confirmed Nov 2026): 15,000+ push users/devices and 600+
 * check-ins are production; 20,000+ records is a load test; the regression-time cut is internal.
 */
export const projects: Project[] = [
  {
    id: 'personal-collection',
    index: '01',
    title: 'Personal Collection',
    codename: 'The Network',
    category: 'Retail & Dealer Platform',
    status: 'production',
    summary:
      'A cross-platform dealer platform live on the App Store, Google Play and Huawei AppGallery. I led its Flutter app and built features end to end across the admin portal, backend and AWS.',
    problem:
      'Dealer operations at scale (bulk data updates, surveys, event attendance and notifications) had to run reliably from one admin portal, without manual workarounds and without slowing the app down.',
    description:
      'Personal Collection’s app for its dealers and employees: credit tracking, invoices, transactions, events, surveys and promotions in one place. The product is built by a team at White Cloak Technologies. I led mobile development of the Flutter app, built several features end to end across the Angular admin portal and the backend, and served as interim technical lead for six months when the team’s tech lead left. The contributions listed here are mine; the product as a whole is the team’s work.',
    stack: ['Flutter', 'Angular', 'NestJS', 'TypeScript', 'AWS SQS', 'Firebase', 'GitLab CI', 'Maestro'],
    features: [
      'Led mobile development of the Flutter app for iOS, Android and Huawei',
      'Interim technical lead for six months after the team’s tech lead left',
      'Built Survey Management end to end: Angular admin portal, backend services and Flutter app',
      'Built Event Management, including QR check-in with geofencing validation',
      'Built asynchronous bulk-import and notification workflows on AWS SQS with dead letter queues',
      'Implemented push notifications on Firebase Cloud Messaging and Huawei Push Kit',
      'Set up mobile CI/CD with GitLab CI, Codemagic and Fastlane',
      'Automated critical user journeys with Maestro end-to-end tests',
      'Clarified requirements directly with client stakeholders',
    ],
    demonstrates: [
      'Owning features across mobile, web admin and backend',
      'Asynchronous processing that holds up under bulk workloads',
      'Release and test automation for three app stores',
      'Technical leadership during a team transition',
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
      context:
        'Personal Collection works through a network of dealers. Dealers and employees needed one app for their credit, invoices, transactions, events, surveys and promotions on iOS, Android and Huawei devices, and the business needed an admin portal to run it all.',
      problem:
        'Admins had to update thousands of records at once, run surveys that change often, verify who actually attended incentive-linked events, and reach every device, including Huawei phones without Google services. Doing any of that by hand, or synchronously inside the app, would not hold up.',
      solution:
        'A Flutter app and an Angular admin portal on shared backend services and AWS. Admins define surveys and events once, import data in bulk and send notifications. Heavy work runs on queues, off the request path, and automated pipelines and tests keep releases to three stores predictable.',
      results: [
        { value: '15,000+', label: 'Users and devices reached by push notifications', basis: 'production' },
        { value: '600+', label: 'Attendees checked in at incentive events', basis: 'production' },
        { value: '20,000+', label: 'Records processed in a bulk-import load test', basis: 'load-test' },
        { value: '5–6h → ~2h', label: 'Manual regression testing per release cycle', basis: 'internal' },
      ],
      decisions: [
        {
          title: 'Schema-driven surveys',
          why: 'Surveys change often. Defining each survey once as a schema lets the admin portal, backend and Flutter app render it the same way, so a new survey doesn’t need new app code.',
        },
        {
          title: 'Queues with dead letter queues',
          why: 'Bulk imports and notification processing run asynchronously on AWS SQS. Failed messages go to a dead letter queue to inspect and retry instead of disappearing, and cache-based locking stops two imports from colliding.',
        },
        {
          title: 'Geofenced QR check-in',
          why: 'A QR code on its own can be shared. Validating the attendee’s location at scan time means attendance, and the incentives tied to it, reflects who was actually at the venue.',
        },
        {
          title: 'Two push providers',
          why: 'Huawei devices without Google services can’t receive Firebase Cloud Messaging, so Huawei Push Kit runs alongside it and every dealer gets the message.',
        },
        {
          title: 'Automated releases and tests',
          why: 'GitLab CI, Codemagic and Fastlane handle builds, code signing and store releases. Maestro covers the critical user journeys, so each release needs less manual checking.',
        },
      ],
      impact: [
        {
          title: 'Bulk operations without blocking',
          body: 'Asynchronous workflows handled 20,000+ records in load testing, so admins can run large imports without holding up the app or the portal. That figure is from a load test, not production traffic.',
        },
        {
          title: 'One message reaches every dealer',
          body: 'Push notifications on two providers support 15,000+ production users and devices across Android, iOS and Huawei.',
        },
        {
          title: 'Attendance the business can trust',
          body: 'Geofenced QR check-in verified 600+ attendees at incentive-linked events, so incentives follow real attendance.',
        },
        {
          title: 'Shorter release cycles',
          body: 'Maestro tests on critical journeys cut manual regression testing from 5–6 hours to about 2 hours per cycle, leaving QA time for the checks automation can’t do.',
        },
      ],
      architecture: [
        { title: 'Clients', items: ['Flutter dealer app (iOS, Android, Huawei)', 'Angular admin portal'] },
        { title: 'API', items: ['NestJS backend', 'REST APIs'] },
        { title: 'Async', items: ['AWS SQS workers', 'Dead letter queues', 'AWS S3 storage'] },
        { title: 'Delivery', items: ['FCM + Huawei Push Kit', 'CI/CD to three app stores'] },
      ],
      architectureNote: 'High-level view only. The client’s internal architecture stays private.',
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
    status: 'published',
    problem:
      'Stories are a familiar engagement feature, but a viewer, an editor, interactive stickers, media playback and export add up to a lot of work for every team that wants them.',
    demonstrates: [
      'API design for other developers',
      'Package architecture: a headless engine under swappable UI',
      'Complex gesture, media and editing UI in Flutter',
      'Publishing, versioning and documentation on pub.dev',
    ],
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
      context:
        'Stories show up in social, retail and community apps alike. A Flutter team that wants them usually starts from a blank screen.',
      solution:
        'One open-source package with a viewer, an editor, interactive stickers, media and export, all on a single document model. Teams can use the ready-made UI or drive the headless engine with their own.',
      decisions: [
        {
          title: 'One document model',
          why: 'The viewer, editor and exporters all read the same StoryDocument, so a story built in the editor plays back exactly as it was made.',
        },
        {
          title: 'Headless controller',
          why: 'StoryController handles playback and timing without any UI, so a team with its own design system can build a completely custom viewer.',
        },
        {
          title: 'Versioned JSON with migrations',
          why: 'Stories are saved data. A versioned format with migrations means stories saved today still open after the package changes.',
        },
        {
          title: 'Bring your own player',
          why: 'Video and audio go through any player, so apps keep the media stack they already use.',
        },
      ],
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
    status: 'published',
    problem:
      'When a step fails halfway through an automation, re-running it can resend emails or duplicate rows, and someone has to dig through logs to work out what went wrong.',
    demonstrates: [
      'Durable, replay-safe workflow execution',
      'Multi-tenant security: row-level security, encrypted credentials, 2FA',
      'AI assistance with a human approval step',
      'Designing and shipping a complete product end to end',
    ],
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
        { value: '9', label: 'Step types in the visual builder', basis: 'public' },
        { value: '9', label: 'Connectors, plus any HTTPS API', basis: 'public' },
        { value: '~35', label: 'Validation rules checked before publish', basis: 'public' },
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
    problem: 'Artists and collectors wanted social networking and art trading in one place, with conversations and bids happening live.',
    demonstrates: [
      'Real-time features: chat and live bidding',
      'Commerce flows: in-app purchases and subscriptions',
      'Contributing features within a larger team',
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
    problem:
      'Requirements arrive as meeting notes and chat threads. Turning them into a spec a team can estimate is slow, and the gaps tend to surface late, during development.',
    demonstrates: [
      'LLM integration with a person reviewing every step',
      'Structured output from unstructured input',
      'Product thinking about how teams plan work',
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
    summary: 'An experimental souls-like 3D action RPG on Flutter Scene, the 3D engine on Flutter GPU. A learning project, not production software.',
    problem: 'A learning experiment, not a product: how far can Flutter, a UI toolkit, be pushed as a real-time 3D game engine?',
    demonstrates: [
      'Real-time rendering and performance tuning',
      'Game loops, animation and physics',
      'Evaluating emerging technology (Flutter GPU) hands-on',
    ],
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
    status: 'experimental',
    motif: 'blade',
    palette: { sunrise: ['#e9825a', '#2b9ea6', '#18233b'], dusk: ['#a78bfa', '#6b9ceb', '#060a17'] },
  },
];

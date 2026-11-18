import type { Project } from '@/types';

/**
 * Featured projects. To use real artwork, drop an image into
 * src/assets/projects/ named <id>.webp (or <id>-sunrise.webp / <id>-dusk.webp).
 * Add `github` / `demo` URLs to show the link buttons, and `year` to show a year.
 *
 * Order: flagships first (Personal Collection, Story Framework), then own work, company work.
 * `featured` projects get a showcase card; the in-development and experimental ones are
 * listed in the experiments collection (src/data/inventory.ts) and keep their own pages.
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
    featured: true,
    summary:
      'A retail and dealer platform on the App Store, Google Play and Huawei AppGallery. I led its Flutter app and owned features end to end across the admin portal, backend and AWS.',
    problem:
      'Admins needed to run bulk data updates, surveys, event attendance and notifications for the dealer network from one portal, without manual workarounds and without slowing the app down.',
    description:
      'A cross-platform retail and dealer platform supported by mobile apps, an administrative portal, backend services and cloud infrastructure. Dealers and employees use the app for their credit, invoices, transactions, events, surveys and promotions; admins run it all from the web portal. The product is built by a team at White Cloak Technologies. I led mobile development, owned several features end to end across the Angular portal, NestJS backend and AWS, and served as interim technical lead for six months when the team’s tech lead left. The work described here is mine; the product as a whole is the team’s.',
    platforms: 'iOS · Android · Huawei · Web admin',
    stack: [
      'Flutter',
      'Dart',
      'Angular',
      'NestJS',
      'TypeScript',
      'AWS SQS',
      'Firebase Cloud Messaging',
      'Huawei Push Kit',
      'GitLab CI',
      'Codemagic',
      'Fastlane',
      'Maestro',
      'Claude Code Review',
    ],
    features: [
      'Led mobile development of the Flutter app for iOS, Android and Huawei',
      'Interim technical lead for six months after the team’s tech lead left',
      'Owned features end to end, from technical design to release, across the app, admin portal and backend',
      'Built the mobile release pipelines, automated regression tests and automated code review',
      'Clarified requirements directly with client stakeholders',
    ],
    demonstrates: [
      'Feature ownership across mobile, web admin and backend',
      'Asynchronous processing with failure handling',
      'Release, test and code review automation',
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
        'Personal Collection works through a network of dealers. Dealers and employees need one app for their account activity, events, surveys and promotions on iOS, Android and Huawei phones, and the business needs an admin portal to configure content, run events and reach the people using the app.',
      problem:
        'Admins update large batches of records at once, publish surveys that change often, need to know who actually attended incentive-linked events, and must reach every device, including Huawei phones without Google services. Doing that by hand, or inside a single synchronous request, isn’t practical at that volume.',
      solution:
        'A Flutter app and an Angular admin portal on shared backend services. Admins configure surveys and events once and every client follows. Heavy work runs on queues off the request path, and release pipelines, end-to-end tests and automated code review cover delivery to three stores.',
      results: [
        { value: '15,000+', label: 'Users and devices reached by push notifications', basis: 'production' },
        { value: '600+', label: 'Attendees checked in at incentive events', basis: 'production' },
        { value: '20,000+', label: 'Records processed in a bulk-import load test', basis: 'load-test' },
        { value: '5–6h → ~2h', label: 'Manual regression testing per release cycle', basis: 'internal' },
      ],
      contributions: [
        {
          title: 'Survey Management',
          area: 'Full-stack features',
          layers: ['Admin portal', 'Backend', 'Mobile app'],
          challenge:
            'Surveys change often and span three codebases. A new question set shouldn’t need new app code, and the portal, backend and app have to agree on what a survey is.',
          body: 'Led the feature end to end with a schema-driven design: admins define a survey once in the Angular portal, the backend services serve that definition, and the Flutter app renders the survey from it.',
          value: 'Full-stack ownership of one feature across every layer. New surveys reach users without new app code, and the three layers change together instead of drifting apart.',
        },
        {
          title: 'Event Management',
          area: 'Full-stack features',
          layers: ['Admin portal', 'Backend'],
          challenge: 'Admins needed one place to set up and run events, and that event data had to feed attendance check-in in the app.',
          body: 'Built Event Management across the Angular admin portal and the backend services.',
          value: 'Admins manage events inside the product itself, and the same event data powers QR check-in on attendees’ phones.',
        },
        {
          title: 'Asynchronous processing',
          area: 'Backend workflows',
          layers: ['Backend', 'Cloud'],
          challenge: 'Bulk imports of thousands of records and mass notifications are too heavy to run inside a single request.',
          body: 'Implemented backend workflows on AWS SQS for bulk imports and notification processing, with dead letter queues for messages that fail.',
          value: 'Heavy work runs in the background without holding up the app or the portal, and failed messages are kept for inspection and retry instead of being lost. Load-tested with 20,000+ records.',
        },
        {
          title: 'QR attendance',
          area: 'Mobile engineering',
          layers: ['Mobile app'],
          challenge: 'A QR code on its own can be shared, so a scan alone doesn’t prove someone was at the venue, and attendance is tied to incentives.',
          body: 'Built QR-based check-in with geofencing validation, so the attendee’s location is checked at the moment they scan.',
          value: 'Attendance reflects who was actually there, so incentives follow real attendance. Used at events with 600+ attendees.',
        },
        {
          title: 'Push notifications',
          area: 'Mobile engineering',
          layers: ['Mobile app', 'Backend'],
          challenge: 'Huawei phones without Google services can’t receive Firebase Cloud Messaging, but every app user still needs the message.',
          body: 'Implemented Firebase Cloud Messaging and Huawei Push Kit side by side, covering Android, iOS and Huawei devices.',
          value: 'One announcement reaches the whole user base, whatever phone they carry. Supports 15,000+ production users and devices.',
        },
        {
          title: 'Mobile CI/CD',
          area: 'CI/CD',
          layers: ['Delivery'],
          challenge: 'Building, signing and submitting to three app stores by hand is slow and easy to get wrong.',
          body: 'Set up the mobile delivery pipelines on GitLab CI, Codemagic and Fastlane, automating builds, code signing and store releases.',
          value: 'Every release is built the same way, so releases are repeatable and engineering time goes to features rather than release chores.',
        },
        {
          title: 'Automated regression testing',
          area: 'Testing & automation',
          layers: ['Quality'],
          challenge: 'Manual regression testing took 5–6 hours per release cycle.',
          body: 'Introduced Maestro end-to-end tests for the app’s critical user journeys.',
          value: 'Manual regression dropped to about 2 hours per cycle, roughly 60% less, leaving QA time for the checks automation can’t do.',
        },
        {
          title: 'Automated code review',
          area: 'Testing & automation',
          layers: ['Quality', 'Workflow'],
          challenge: 'Every merge request needs checking for best practices, consistency with the project’s architecture and security. Doing all of that by hand depends entirely on reviewer time and attention.',
          body: 'Set up Claude Code Review on the team’s merge requests. Every new merge request, and every new push to one, is reviewed automatically against best practices, the project’s architecture and security.',
          value: 'Best-practice, architecture and security issues are flagged on the merge request while the code is still fresh, feedback stays consistent across contributors, and human reviewers can focus on design and intent.',
        },
      ],
      diagram: {
        clients: [
          { label: 'Mobile application', detail: 'Flutter · iOS, Android, Huawei' },
          { label: 'Administrative portal', detail: 'Angular · web' },
        ],
        core: { label: 'Backend services', detail: 'NestJS' },
        services: [
          { label: 'Data storage', detail: 'Application data' },
          { label: 'Background processing', detail: 'Message queues + dead letter queues' },
          { label: 'Notification services', detail: 'FCM + Huawei Push Kit, delivered to the app' },
        ],
        caption: 'A simplified view of how the layers relate, with generic labels. It does not show the client’s actual infrastructure.',
      },
      approach: [
        { layer: 'Mobile app', tools: ['Flutter', 'Dart'], why: 'One codebase ships to iOS, Android and Huawei, so a feature lands on every platform together.' },
        { layer: 'Admin portal', tools: ['Angular'], why: 'A structured TypeScript framework for the portal where admins configure surveys and events, import data and send notifications.' },
        { layer: 'Backend', tools: ['NestJS'], why: 'Modular services that both the app and the portal rely on, so one feature’s logic lives in one place.' },
        { layer: 'Background processing', tools: ['AWS SQS', 'Dead letter queues'], why: 'Moves heavy work off the request path and keeps failed messages for retry.' },
        { layer: 'Notifications', tools: ['Firebase Cloud Messaging', 'Huawei Push Kit'], why: 'Two providers, because Huawei devices without Google services can’t use FCM.' },
        { layer: 'Delivery', tools: ['GitLab CI', 'Codemagic', 'Fastlane'], why: 'Repeatable builds, code signing and releases to three stores.' },
        { layer: 'Quality', tools: ['Maestro', 'Claude Code Review'], why: 'Two different problems: Maestro tests that the app still behaves correctly; Claude Code Review checks each merge request for best practices, architecture and security before it’s merged.' },
      ],
      workflows: [
        {
          title: 'Automated regression testing',
          area: 'Testing & automation',
          tool: 'Maestro',
          steps: [
            'A build is ready for the release cycle',
            'Maestro runs the critical user journeys',
            'Failures are flagged and fixed',
            'QA spends manual time on what automation can’t cover',
          ],
          note: 'Tests behavior: does the app still work for the people using it?',
          comparison: {
            before: { label: 'Before', value: '5–6 h', hours: 5.5 },
            after: { label: 'After', value: '~2 h', hours: 2 },
            basis: 'internal',
          },
        },
        {
          title: 'Automated code review',
          area: 'Testing & automation',
          tool: 'Claude Code Review',
          steps: [
            'A developer opens a merge request',
            'Claude Code Review runs automatically',
            'It checks best practices, project architecture and security',
            'Feedback appears on the merge request',
            'New pushes to the merge request trigger a fresh review',
            'Reviewers approve and merge',
          ],
          note: 'Reviews code: does the change follow best practices, fit the architecture and stay secure before it’s merged? It works alongside human review, not instead of it.',
        },
      ],
      impact: [
        {
          title: 'Every device reachable',
          body: 'One announcement reaches Android, iOS and Huawei users, including Huawei phones without Google services.',
        },
        {
          title: 'Imports that don’t block the app',
          body: 'Large imports run in the background, so admins and app users aren’t left waiting, and failed messages are kept for retry. Verified in a load test, not production traffic.',
        },
        {
          title: 'Attendance that matches who was there',
          body: 'Incentives tied to events follow verified, on-site check-ins rather than shared QR codes.',
        },
        {
          title: 'Less manual regression',
          body: 'QA spends about 2 hours on manual regression per release cycle instead of 5–6, leaving time for the checks automation can’t do.',
        },
        {
          title: 'Automated merge request review',
          body: 'Every merge request, and every push to one, is checked for best practices, architecture and security before merge. A qualitative change; it hasn’t been measured.',
        },
      ],
      disclaimer:
        'Certain implementation details, visuals, and internal architecture have been omitted or generalized to respect client confidentiality.',
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
    featured: true,
    problem:
      'Stories are a familiar engagement feature, but a viewer, an editor, interactive stickers, media playback and export add up to a lot of work for every team that wants them.',
    demonstrates: [
      'API design for other developers',
      'Package architecture: a headless engine under swappable UI',
      'Gesture, media and editing UI in Flutter',
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
    featured: true,
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
      'Brightrail is a workflow automation platform in the same category as n8n and Zapier, aimed at small technical teams. Workflows are drawn on a visual canvas and run on a durable engine that survives restarts, retries failures safely with idempotency keys and records every step. When a run fails, an AI assistant explains why and suggests a fix, and a person approves it before anything happens.',
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
    featured: true,
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

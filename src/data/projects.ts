import type { Project } from '@/types';

/**
 * Featured projects. To use real artwork, drop an image into
 * src/assets/projects/ named <id>.webp (or <id>-sunrise.webp / <id>-dusk.webp).
 * Add `github` / `demo` URLs to show the link buttons, and `year` to show a year.
 *
 * Splurge Art and Personal Collection: company projects at White Cloak, where I am one
 * contributor on the team (resume + the public Personal Collection app page, Nov 2026).
 * Story Framework, Brightrail: from their GitHub READMEs and live sites (Nov 2026).
 * AI Requirements Analyst, Souls-like demo (a Flutter Scene experiment): in development;
 * planned features from the original brief. TODO: update as they take shape.
 */
export const projects: Project[] = [
  {
    id: 'splurge-art',
    index: '01',
    title: 'Splurge Art',
    codename: 'The Auction House',
    category: 'AI Art Social Marketplace',
    summary: 'A social marketplace for AI-generated art. I contributed mobile and web features as part of the White Cloak team. Now discontinued.',
    description:
      'Splurge Art was a social marketplace that combined networking, AI-generated artwork and marketplace trading. It was built by a team at White Cloak Technologies, where I was one of the engineers contributing mobile and web features, mainly the real-time and commerce flows. The product has since been discontinued.',
    stack: ['Flutter', 'NestJS', 'Next.js', 'Cloud Firestore', 'Firebase', 'GraphQL'],
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
    id: 'personal-collection',
    index: '02',
    title: 'Personal Collection',
    codename: 'The Network',
    category: 'Retail & Dealer Platform',
    summary: 'The dealer app for Personal Collection, live on the App Store, Google Play and Huawei AppGallery. I lead its mobile development at White Cloak.',
    description:
      'Personal Collection\u2019s app for its network of dealers: credit tracking, invoices, transactions and promotions in one place. It is built by a team at White Cloak Technologies, where I am the mobile lead for the Flutter app. I also contribute to the Angular administration and the NestJS backend, and work directly with the client\u2019s stakeholders to clarify requirements.',
    stack: ['Flutter', 'Angular', 'NestJS', 'TypeScript', 'AWS'],
    features: [
      'Lead mobile development of the Flutter app for iOS, Android and Huawei',
      'Product management and catalog features',
      'Customer engagement and announcements',
      'Event management',
      'Survey management',
      'Requirements clarified directly with client stakeholders',
    ],
    role: 'Mobile lead; Angular & backend contributor',
    employer: 'White Cloak Technologies',
    links: [
      { label: 'App Store', href: 'https://apps.apple.com/ph/app/personal-collection/id6751012612' },
      { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=app.pcdsi.superapp' },
      { label: 'AppGallery', href: 'https://appgallery.huawei.com/app/C114971443' },
      { label: 'Website', href: 'https://pcapp.pcdsi.ph/' },
    ],
    motif: 'retail',
    palette: { sunrise: ['#2b9ea6', '#f4a774', '#f6edbb'], dusk: ['#e58db9', '#a78bfa', '#121a36'] },
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
    motif: 'spec',
    palette: { sunrise: ['#e9825a', '#f6edbb', '#18233b'], dusk: ['#ff9f78', '#a78bfa', '#0b1230'] },
  },
  {
    id: 'story-framework',
    index: '04',
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
      'Export as JSON, per-item PNGs or a slideshow video; versioned JSON with migrations',
      'Headless StoryController for fully custom viewers',
    ],
    role: 'Author & maintainer',
    github: 'https://github.com/ChristianLloydSalon/story_framework',
    packageUrl: 'https://pub.dev/packages/story_framework',
    motif: 'graph',
    palette: { sunrise: ['#2b9ea6', '#f6edbb', '#2d4a7a'], dusk: ['#a78bfa', '#6b9ceb', '#0b1230'] },
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

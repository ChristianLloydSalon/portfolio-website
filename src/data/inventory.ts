import type { InventoryItem } from '@/types';

/**
 * Open source, tools and experiments. Add `href` to link an item.
 * TODO: add repository links, and any published packages or contributions.
 */
export const inventory: InventoryItem[] = [
  {
    id: 'story-framework-pkg',
    name: 'story_framework',
    kind: 'Package',
    status: 'Published',
    description: 'Instagram-style stories for Flutter: viewer, editor, interactive stickers, video and export. On pub.dev.',
    stack: ['Flutter', 'Dart'],
    href: 'https://pub.dev/packages/story_framework',
  },
  {
    id: 'features-brick',
    name: 'features',
    kind: 'Tool',
    status: 'Published',
    description: 'A Mason brick that scaffolds a complete Flutter feature module (data, DI, domain and presentation layers) in one command, so every feature starts consistent and review-ready.',
    stack: ['Dart', 'Mason', 'Clean Architecture'],
    href: 'https://github.com/ChristianLloydSalon/features',
  },
  {
    id: 'changelog-script',
    name: 'changelog',
    kind: 'Tool',
    status: 'Published',
    description: 'Release notes without the end-of-sprint scramble: a shell script that collects entries by category as you work, previews them and releases them under a version.',
    stack: ['Shell', 'CLI'],
    href: 'https://github.com/ChristianLloydSalon/changelog',
  },
  {
    id: 'brightrail',
    name: 'Brightrail',
    kind: 'Side Project',
    status: 'Live',
    description: 'Workflow automation with durable execution, AI failure analysis and human-approved recovery.',
    stack: ['Next.js', 'Supabase', 'Inngest'],
    href: 'https://brightrail.vercel.app',
  },
  {
    id: 'souls-like',
    name: 'Souls-like Game Demo',
    kind: 'Experiment',
    status: 'In Development',
    description: 'A souls-like 3D action RPG experiment built on Flutter Scene, the 3D engine on Flutter GPU.',
    stack: ['Flutter', 'Flutter Scene'],
  },
  {
    id: 'ai-requirements',
    name: 'AI Requirements Analyst',
    kind: 'Tool',
    status: 'In Development',
    description: 'Turns loose notes and briefs into structured, buildable specifications.',
    stack: ['TypeScript', 'LLM APIs'],
  },
  {
    id: 'portfolio-site',
    name: 'This Portfolio',
    kind: 'Side Project',
    status: 'Active',
    description: 'A cinematic portfolio built with React and GSAP, with two themes and a hand-tuned scroll story.',
    stack: ['React', 'TypeScript', 'GSAP'],
    href: 'https://github.com/ChristianLloydSalon/portfolio-website',
  },
];

/** Total slots shown in the grid; remaining slots render as locked. */
export const INVENTORY_SLOTS = 8;

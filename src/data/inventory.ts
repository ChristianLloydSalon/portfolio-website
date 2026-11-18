import type { InventoryItem } from '@/types';

/**
 * Additional projects and experiments, shown below the featured projects in the Projects
 * section. Featured projects (Story Framework, Brightrail…) are not repeated here.
 * `href` links out; `projectId` opens that project's case study instead.
 */
export const inventory: InventoryItem[] = [
  {
    id: 'ai-requirements',
    name: 'AI Requirements Analyst',
    kind: 'Tool',
    status: 'In Development',
    description: 'Turns meeting notes and loose briefs into structured specifications: user stories, acceptance criteria and open questions, with a person reviewing every step.',
    stack: ['TypeScript', 'NestJS', 'LLM APIs'],
    projectId: 'ai-requirements-analyst',
  },
  {
    id: 'souls-like',
    name: 'Souls-like Game Demo',
    kind: 'Experiment',
    status: 'In Development',
    description: 'A learning experiment: a 3D action RPG on Flutter Scene, the 3D engine on Flutter GPU, to test how far Flutter goes as a real-time game engine.',
    stack: ['Flutter', 'Flutter Scene'],
    projectId: 'souls-like-demo',
  },
  {
    id: 'features-brick',
    name: 'features',
    kind: 'Tool',
    status: 'Published',
    description: 'A Mason brick that scaffolds a complete Flutter feature module (data, DI, domain and presentation layers) in one command, so every feature starts with the same structure.',
    stack: ['Dart', 'Mason', 'Clean Architecture'],
    href: 'https://github.com/ChristianLloydSalon/features',
  },
  {
    id: 'changelog-script',
    name: 'changelog',
    kind: 'Tool',
    status: 'Published',
    description: 'A shell script that collects release-note entries by category as you work, previews them and releases them under a version.',
    stack: ['Shell', 'CLI'],
    href: 'https://github.com/ChristianLloydSalon/changelog',
  },
  {
    id: 'portfolio-site',
    name: 'This Portfolio',
    kind: 'Side Project',
    status: 'Live',
    description: 'This site: React and GSAP, two themes, a scroll-driven story, and pages prerendered at build time for search engines.',
    stack: ['React', 'TypeScript', 'GSAP'],
    href: 'https://github.com/ChristianLloydSalon/portfolio-website',
  },
];

/** Total slots shown in the grid; remaining slots render as locked. */
export const INVENTORY_SLOTS = 6;

import type { NavItem } from '@/types';

export const navigation: NavItem[] = [
  { id: 'home', label: 'Home', caption: 'Opening sequence' },
  { id: 'about', label: 'About', caption: 'The engineer' },
  { id: 'impact', label: 'Impact', caption: 'Measured results' },
  { id: 'projects', label: 'Projects', caption: 'Case studies & experiments' },
  { id: 'experience', label: 'Experience', caption: 'Mission log' },
  { id: 'arsenal', label: 'Arsenal', caption: 'Technical arsenal' },
  { id: 'contact', label: 'Contact', caption: "Let's talk" },
];

/**
 * Retired sections, kept so old links still land somewhere: "What I can build" was folded
 * into About, and the Inventory became the experiments collection inside Projects.
 */
export const LEGACY_SECTIONS: Record<string, { section: string; anchor?: string }> = {
  build: { section: 'about' },
  inventory: { section: 'projects', anchor: 'more-projects' },
};

/** "Chapter 03" style label for a section, so numbering follows the navigation order. */
export const chapter = (id: string) => `Chapter ${String(navigation.findIndex((n) => n.id === id)).padStart(2, '0')}`;

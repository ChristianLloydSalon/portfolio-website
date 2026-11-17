import type { NavItem } from '@/types';

export const navigation: NavItem[] = [
  { id: 'home', label: 'Home', caption: 'Opening sequence' },
  { id: 'about', label: 'About', caption: 'The engineer' },
  { id: 'impact', label: 'Impact', caption: 'Business outcomes' },
  { id: 'projects', label: 'Projects', caption: 'Case studies' },
  { id: 'build', label: 'Build', caption: 'What I can build' },
  { id: 'experience', label: 'Experience', caption: 'Mission log' },
  { id: 'arsenal', label: 'Arsenal', caption: 'Technical loadout' },
  { id: 'inventory', label: 'Inventory', caption: 'Open source' },
  { id: 'contact', label: 'Contact', caption: "Let's talk" },
];

/** "Chapter 03" style label for a section, so numbering follows the navigation order. */
export const chapter = (id: string) => `Chapter ${String(navigation.findIndex((n) => n.id === id)).padStart(2, '0')}`;

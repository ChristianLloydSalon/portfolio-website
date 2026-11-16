export type ThemeName = 'sunrise' | 'dusk';

export interface Link {
  label: string;
  href: string;
}

export interface SocialLink extends Link {
  kind: 'github' | 'linkedin' | 'email' | 'resume' | 'website' | 'x';
  handle: string;
}

export interface Profile {
  name: string;
  firstName: string;
  lastName: string;
  role: string;
  /** One-line value proposition under the role in the hero. */
  pitch: string;
  tagline: string[];
  location: string;
  email: string;
  resumeUrl: string;
  socials: SocialLink[];
}

export type ProjectMotif = 'graph' | 'spec' | 'retail' | 'blade' | 'market';

export interface Project {
  id: string;
  index: string;
  title: string;
  codename: string;
  category: string;
  /** Optional: shown next to the category when known. */
  year?: string;
  summary: string;
  description: string;
  stack: string[];
  features: string[];
  role: string;
  github?: string;
  demo?: string;
  /** Package registry page, e.g. pub.dev. */
  packageUrl?: string;
  /** Omit for shipped, live work. */
  status?: 'in-development' | 'discontinued';
  /**
   * Set for company work: the product belongs to the employer/client, and I contributed
   * as one engineer on the team. Drives the "Company project" badge and contributor wording.
   */
  employer?: string;
  /** Extra public links, e.g. app store pages. */
  links?: { label: string; href: string }[];
  /** Deeper write-up shown in the project presentation; every part is optional. */
  caseStudy?: CaseStudy;
  /** Procedural artwork used when no image exists in src/assets/projects/<id>.* */
  motif: ProjectMotif;
  palette: Record<ThemeName, [string, string, string]>;
}

export interface CaseStudy {
  /** Headline numbers. `source` is shown small, e.g. "Public Play Store listing". */
  results?: { value: string; label: string; source?: string }[];
  /** Demo clips/images: `asset` is an asset key, e.g. "projects/story-framework/demo-viewer". */
  media?: { asset: string; alt: string; caption: string }[];
  /** High-level architecture as left-to-right tiers. Keep company work generic. */
  architecture?: { title: string; items: string[] }[];
  architectureNote?: string;
  challenges?: { title: string; problem: string; solution: string }[];
  code?: { label: string; code: string }[];
}

export interface Mission {
  id: string;
  company: string;
  position: string;
  period: string;
  location?: string;
  status: 'active' | 'complete';
  /** Official titles held at this company, earliest first. */
  progression?: string[];
  summary: string;
  /** Grouped work; when present it replaces the Responsibilities/Contributions columns. */
  groups?: { title: string; items: string[] }[];
  responsibilities: string[];
  contributions: string[];
  achievements: string[];
  stack: string[];
}

export type SkillIcon = 'smartphone' | 'layout' | 'server' | 'cloud' | 'boxes' | 'database' | 'workflow' | 'flask';

/** production: shipped real products with it. working: real use, less depth. familiar: learned or tried. */
export type SkillTier = 'production' | 'working' | 'familiar';

export interface Skill {
  name: string;
  mono: string;
  note: string;
  tier: SkillTier;
}

export interface SkillCategory {
  id: string;
  name: string;
  short: string;
  icon: SkillIcon;
  description: string;
  skills: Skill[];
}

export type InventoryKind = 'Package' | 'Contribution' | 'Tool' | 'Experiment' | 'Side Project';

export interface InventoryItem {
  id: string;
  name: string;
  kind: InventoryKind;
  description: string;
  stack: string[];
  href?: string;
  status: 'Published' | 'Live' | 'Active' | 'In Development' | 'Prototype' | 'Archived';
}

export interface NavItem {
  id: string;
  label: string;
  caption: string;
}

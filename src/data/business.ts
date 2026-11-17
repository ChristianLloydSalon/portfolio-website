/**
 * Business-facing content: the outcomes my work supports (Impact section) and the kinds of
 * software I can build (Build section). Each outcome links to evidence elsewhere on the site.
 * Keep it realistic: I'm an individual engineer, not an agency. No guarantees, no financial claims.
 */

export interface BusinessOutcome {
  id: string;
  title: string;
  body: string;
  /** Concrete evidence from my work, with where it was measured. */
  proof: string;
  /** Project id whose case study backs this up. */
  projectId: string;
}

export const outcomes: BusinessOutcome[] = [
  {
    id: 'launch',
    title: 'Launch products faster',
    body: 'Cross-platform apps and complete products, from the first screen to the backend behind it, so one codebase reaches iOS, Android and Huawei.',
    proof: 'Personal Collection ships from one Flutter codebase to three app stores.',
    projectId: 'personal-collection',
  },
  {
    id: 'overhead',
    title: 'Reduce operational overhead',
    body: 'Replace repetitive manual work with automated workflows, integrations and reliable data processing.',
    proof: 'Maestro tests cut manual regression testing from 5–6 hours to about 2 per release cycle.',
    projectId: 'personal-collection',
  },
  {
    id: 'scale',
    title: 'Scale without breaking',
    body: 'Maintainable backends and infrastructure that keep up as users, transactions and workloads grow.',
    proof: 'Queue-based bulk imports handled 20,000+ records in load testing without blocking the app.',
    projectId: 'personal-collection',
  },
  {
    id: 'decide',
    title: 'Make better business decisions',
    body: 'Turn requirements into usable features and structured data, so the business can see what is actually happening.',
    proof: 'Geofenced QR check-in verified 600+ attendees, so incentives follow real attendance.',
    projectId: 'personal-collection',
  },
];

export interface Capability {
  id: string;
  title: string;
  body: string;
  items: string[];
  /** Where I've done this kind of work, by project id. */
  evidence: { label: string; projectId?: string; section?: string }[];
}

export const capabilities: Capability[] = [
  {
    id: 'products',
    title: 'Digital products',
    body: 'Apps your customers or your team use every day.',
    items: ['Cross-platform mobile apps', 'MVP development', 'Customer-facing applications', 'Internal business applications'],
    evidence: [
      { label: 'Personal Collection', projectId: 'personal-collection' },
      { label: 'Splurge Art', projectId: 'splurge-art' },
    ],
  },
  {
    id: 'automation',
    title: 'Business process automation',
    body: 'Less copy-paste, fewer spreadsheets passed around.',
    items: ['Workflow automation', 'Administrative systems', 'Third-party integrations', 'Data processing'],
    evidence: [
      { label: 'Brightrail', projectId: 'brightrail' },
      { label: 'Bulk imports at Personal Collection', projectId: 'personal-collection' },
    ],
  },
  {
    id: 'modernization',
    title: 'Software modernization',
    body: 'Make the software you already have faster and easier to change.',
    items: ['Improving existing applications', 'Performance optimization', 'Legacy modernization', 'Architecture improvements'],
    evidence: [{ label: 'Experience at White Cloak', section: 'experience' }],
  },
  {
    id: 'backend',
    title: 'Backend & cloud systems',
    body: 'The services, queues and infrastructure behind the screen.',
    items: ['REST APIs', 'Backend services', 'Cloud infrastructure', 'Asynchronous processing', 'System integrations'],
    evidence: [
      { label: 'AWS SQS workflows', projectId: 'personal-collection' },
      { label: 'Cloud skills', section: 'arsenal' },
    ],
  },
];

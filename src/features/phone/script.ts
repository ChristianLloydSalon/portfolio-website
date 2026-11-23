import { profile } from '@/data/profile';
import { missions } from '@/data/experience';
import { projects } from '@/data/projects';
import { inventory } from '@/data/inventory';
import { skillCategories } from '@/data/skills';
import type { PhoneApp } from './phoneStore';

/**
 * The Messages conversation: pre-written, no AI. Each node is what "Christian" texts,
 * plus the replies the visitor can tap. Facts come from src/data, so this stays true
 * when the portfolio data changes. Free-typed messages are matched by keyword (see
 * `matchKeywords`); anything unknown lands on `fallback`, which points to email.
 */

export type Action =
  | { label: string; href: string }
  | { label: string; section: string }
  | { label: string; project: string }
  | { label: string; app: PhoneApp };

export interface Node {
  says: string[];
  actions?: Action[];
  replies: { label: string; next: NodeId }[];
}

export type NodeId =
  | 'start'
  | 'menu'
  | 'hello'
  | 'work'
  | 'history'
  | 'projects'
  | 'flagship'
  | 'story'
  | 'side'
  | 'stack'
  | 'contact'
  | 'help'
  | 'cloud'
  | 'different'
  | 'availability'
  | 'phone'
  | 'thanks'
  | 'cheat'
  | 'fallback';

const job = missions[0];
const company = job.company.replace(/,? Inc\.?$/, '');
const teaching = missions.find((m) => m.id === 'bisu-instructor');
const degree = missions.find((m) => m.id === 'bisu-degree');
const byId = (id: string) => projects.find((p) => p.id === id);
const pc = byId('personal-collection');
const story = byId('story-framework');
const brightrail = byId('brightrail');
const tools = inventory.filter((i) => i.kind === 'Tool' && i.status === 'Published');
const building = projects.filter((p) => p.status === 'in-development').map((p) => p.title);
const social = (kind: string) => profile.socials.find((s) => s.kind === kind);
const linkedin = social('linkedin');
const github = social('github');

/** A few production skills from each discipline, e.g. "Mobile: Flutter & Dart, Kotlin & Swift". */
const stackLines = skillCategories
  .slice(0, 4)
  .map((c) => `${c.short}: ${c.skills.filter((s) => s.tier === 'production').slice(0, 3).map((s) => s.name).join(', ')}`);

const mainReplies: Node['replies'] = [
  { label: 'What do you do?', next: 'work' },
  { label: 'How can you help us?', next: 'help' },
  { label: 'Show me your best work', next: 'projects' },
  { label: 'How do I reach you?', next: 'contact' },
];
const more = { label: 'Something else', next: 'menu' as const };

const emailAction: Action = { label: 'Email me', href: `mailto:${profile.email}` };

export const script: Record<NodeId, Node> = {
  start: {
    says: ['Yo! 👋 You found my phone.', `I'm ${profile.firstName.split(' ')[0]}, a ${profile.role} from ${profile.location}.`, 'What do you wanna know?'],
    replies: mainReplies,
  },
  menu: {
    says: ['Sure, what else?'],
    replies: [
      ...mainReplies,
      { label: 'Your tech stack?', next: 'stack' },
      { label: 'What makes you different?', next: 'different' },
      { label: "What's with the phone?", next: 'phone' },
    ],
  },
  hello: {
    says: ['Hey hey 👋', 'Pick something below, or just type.'],
    replies: mainReplies,
  },
  work: {
    says: [
      `I'm a ${profile.role}. I spent five years at ${company} (${job.period}), most recently as a ${job.position}.`,
      'Production Flutter apps for iOS, Android and Huawei, plus the Angular admin tools, NestJS services and AWS behind them.',
      ...(pc ? [`On ${pc.title} I was the mobile lead, and its interim tech lead for six months.`] : []),
    ],
    replies: [
      { label: 'Tell me about that app', next: 'flagship' },
      { label: 'Are you available?', next: 'availability' },
      { label: 'Before that?', next: 'history' },
      more,
    ],
  },
  history: {
    says: [
      ...(degree ? [`I studied ${degree.position.replace('BS ', '')} at ${degree.company.split(' – ')[0]} (${degree.period.toLowerCase()}), as a DOST scholar.`] : []),
      ...(teaching ? [`Then I taught software development there part-time (${teaching.period}), while shipping production code.`] : []),
    ],
    actions: [{ label: 'See the full mission log', section: 'experience' }],
    replies: [{ label: 'Show me your best work', next: 'projects' }, more],
  },
  projects: {
    says: ["Two I'm proudest of:", ...(pc ? [`📱 ${pc.title}: ${pc.summary.split('. ')[0]}.`] : []), ...(story ? [`🎞️ ${story.title}: ${story.summary}`] : [])],
    replies: [
      ...(pc ? [{ label: pc.title, next: 'flagship' as const }] : []),
      ...(story ? [{ label: story.title, next: 'story' as const }] : []),
      { label: 'Any side projects?', next: 'side' },
      more,
    ],
  },
  flagship: {
    says: pc
      ? [
          `${pc.title} is the dealer app for Personal Collection, a team project at White Cloak. I led the Flutter app and built features end to end: surveys, events, bulk imports and push.`,
          ...(pc.caseStudy?.results?.length
            ? [pc.caseStudy.results.map((r) => `${r.value} ${r.label[0].toLowerCase()}${r.label.slice(1)}${r.basis === 'production' ? ' (production)' : ''}`).join(' · ')]
            : []),
          'Fun bits: schema-driven surveys, SQS with dead letter queues, and QR check-in with geofencing so nobody checks in from home 😄',
        ]
      : ['That one lives in the Projects section.'],
    actions: pc ? [{ label: 'Read the case study', project: pc.id }] : [{ label: 'Open Projects', section: 'projects' }],
    replies: [{ label: 'Big data, how?', next: 'cloud' }, ...(story ? [{ label: story.title + '?', next: 'story' as const }] : []), more],
  },
  story: {
    says: story
      ? [
          `${story.title} is my open-source Flutter package on pub.dev: Instagram-style stories, viewer and editor.`,
          'Polls, quizzes, stickers, video, undo/redo, and export to JSON, PNG or video. All on one document model.',
        ]
      : ['That one lives in the Projects section.'],
    actions: [
      ...(story?.packageUrl ? [{ label: 'Open on pub.dev', href: story.packageUrl }] : []),
      { label: 'Open Projects', section: 'projects' },
    ],
    replies: [{ label: 'Any side projects?', next: 'side' }, more],
  },
  side: {
    says: [
      ...(brightrail ? [`${brightrail.title}: ${brightrail.summary}`] : []),
      ...(tools.length ? [`I also publish small dev tools: ${tools.map((t) => t.name).join(' and ')}.`] : []),
      ...(building.length ? [`Cooking right now: ${building.join(' and ')} 🔧`] : []),
    ],
    actions: [{ label: 'See the experiments', section: 'more-projects' }],
    replies: [{ label: 'Your tech stack?', next: 'stack' }, { label: 'How do I reach you?', next: 'contact' }, more],
  },
  stack: {
    says: ['Day to day:', ...stackLines, 'Plus CI/CD, monitoring and testing. The full loadout is in the Arsenal.'],
    actions: [{ label: 'Open the Arsenal', section: 'arsenal' }],
    replies: [{ label: 'Show me your best work', next: 'projects' }, { label: 'How do I reach you?', next: 'contact' }, more],
  },
  contact: {
    says: ['Email is the fastest way to reach me 📬', profile.email, 'Or find me here 👇'],
    actions: [
      emailAction,
      ...(linkedin ? [{ label: linkedin.label, href: linkedin.href }] : []),
      ...(github ? [{ label: github.label, href: github.href }] : []),
    ],
    replies: [{ label: 'Thanks!', next: 'thanks' }, more],
  },
  help: {
    says: [
      "Depends what you need. Here's what I've delivered before:",
      '📱 Mobile apps and complete products: Flutter on the screen, NestJS and AWS behind it.',
      '⚙️ Automating manual work: bulk imports, workflows and integrations.',
      '🧱 Backend work: APIs, queues and AWS infrastructure.',
      '🔧 Improving existing apps: architecture, release pipelines and automated tests.',
      "I'm one engineer, not an agency, so I'm at my best owning a product area or joining your team.",
    ],
    actions: [{ label: 'See the projects', section: 'projects' }],
    replies: [
      { label: 'Any proof?', next: 'flagship' },
      { label: 'What makes you different?', next: 'different' },
      { label: 'How do I reach you?', next: 'contact' },
    ],
  },
  cloud: {
    says: [
      'Mostly serverless and queues on AWS: Lambda, EventBridge, SQS, SNS and S3, plus Terraform.',
      ...(pc ? [`On ${pc.title} I built bulk imports on SQS with dead letter queues. They handled 20,000+ records in a load test without blocking the app.`] : []),
      "That's a load test, not production traffic. Failed messages land in the dead letter queue to retry instead of vanishing.",
    ],
    actions: [{ label: 'Open the Arsenal', section: 'arsenal' }],
    replies: [{ label: 'How can you help us?', next: 'help' }, { label: 'How do I reach you?', next: 'contact' }, more],
  },
  different: {
    says: [
      "Honest answer? I don't stop at the Flutter layer.",
      "I've carried features from the Angular admin through NestJS and AWS into the app, and set up the CI/CD and tests that ship them.",
      ...(story ? [`I also publish tools other devs use, like ${story.title} on pub.dev.`] : []),
      "And I've stepped in as interim tech lead, so I know delivery isn't only code.",
    ],
    replies: [{ label: 'Show me your best work', next: 'projects' }, { label: 'Are you available?', next: 'availability' }, more],
  },
  availability: {
    says: [
      "Happy to talk about a role or a project. Email is the fastest way to reach me.",
      "Send a bit of context and I'll get back to you.",
    ],
    actions: [emailAction],
    replies: [{ label: 'How can you help us?', next: 'help' }, more],
  },
  phone: {
    says: [
      'Every good open world needs a phone 😎',
      "Try the Radio app: all the music is synthesized live in your browser. No audio files, no licences.",
      'And these texts? Pre-written by me. No AI, so I always say exactly what I mean.',
    ],
    actions: [{ label: 'Open Radio', app: 'radio' }],
    replies: [more],
  },
  thanks: {
    says: ['Anytime 🙌 Talk soon!'],
    replies: [more],
  },
  cheat: {
    says: ['Cheat activated: infinite coffee ☕♾️', "Doesn't make me code faster, but I feel faster."],
    replies: [more],
  },
  fallback: {
    says: ["Haha, I'm just the phone 📱 That one needs the real me.", 'Text me and I\'ll get back to you.'],
    actions: [emailAction],
    replies: mainReplies,
  },
};

/** Free-typed message → node. First rule with a matching word wins. */
const RULES: { words: string[]; next: NodeId }[] = [
  { words: ['cheat', 'konami', 'godmode', 'god mode'], next: 'cheat' },
  { words: ['thank', 'thanks', 'ty', 'cool', 'nice', 'awesome'], next: 'thanks' },
  { words: ['hire', 'hiring', 'available', 'availability', 'open to', 'freelance', 'looking for work'], next: 'availability' },
  { words: ['email', 'contact', 'reach', 'call', 'linkedin', 'resume', 'cv', 'work with'], next: 'contact' },
  { words: ['different', 'why you', 'why him', 'why hire', 'stand out', 'unique', 'better than'], next: 'different' },
  { words: ['personal collection', 'dealer', 'white cloak'], next: 'flagship' },
  { words: ['help', 'business', 'company', 'services', 'applications', 'can you build', 'can he build', 'build for'], next: 'help' },
  { words: ['aws', 'cloud', 'data', 'large scale', 'scale', 'sqs', 'queue', 'lambda', 'infrastructure'], next: 'cloud' },
  { words: ['stack', 'skill', 'skills', 'tech', 'language', 'languages', 'flutter', 'dart', 'react', 'angular', 'nestjs', 'typescript', 'backend', 'frontend'], next: 'stack' },
  { words: ['story', 'stories', 'package', 'pub.dev', 'open source'], next: 'story' },
  { words: ['side', 'brightrail', 'tool', 'tools', 'game', 'souls', 'experiment'], next: 'side' },
  { words: ['project', 'projects', 'portfolio', 'built', 'build', 'app', 'apps', 'best', 'github'], next: 'projects' },
  { words: ['school', 'study', 'studied', 'degree', 'university', 'teach', 'teaching', 'before', 'history', 'experience', 'career'], next: 'history' },
  { words: ['what do you do', 'who are you', 'about', 'role', 'current'], next: 'work' },
  { words: ['phone', 'radio', 'music', 'gta', 'ai', 'bot'], next: 'phone' },
  { words: ['hi', 'hello', 'hey', 'yo', 'sup', 'kumusta'], next: 'hello' },
];

export function matchKeywords(text: string): NodeId {
  const t = ` ${text.toLowerCase().replace(/[^a-z0-9.\s]/g, ' ').replace(/\s+/g, ' ')} `;
  for (const rule of RULES) {
    // Whole words / phrases only, so "ai" doesn't match "available".
    if (rule.words.some((w) => t.includes(` ${w} `) || t.includes(` ${w}s `))) return rule.next;
  }
  return 'fallback';
}

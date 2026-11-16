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
  | 'phone'
  | 'thanks'
  | 'cheat'
  | 'fallback';

const job = missions[0];
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
  { label: 'Show me your best work', next: 'projects' },
  { label: 'Your tech stack?', next: 'stack' },
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
    replies: [...mainReplies, { label: "What's with the phone?", next: 'phone' }],
  },
  hello: {
    says: ['Hey hey 👋', 'Pick something below, or just type.'],
    replies: mainReplies,
  },
  work: {
    says: [
      `Right now I'm a ${job.position} at ${job.company.replace(/,? Inc\.?$/, '')} (${job.period}).`,
      'Mostly production Flutter apps for iOS, Android and Huawei, plus the Angular admin tools, NestJS services and AWS behind them.',
      ...(pc ? [`I'm also the mobile lead on ${pc.title}, and I was its interim tech lead for six months.`] : []),
    ],
    replies: [
      { label: 'Tell me about that app', next: 'flagship' },
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
          `${pc.title} is the dealer app for Personal Collection. It's a team project at White Cloak, and I lead the Flutter side.`,
          ...(pc.caseStudy?.results?.length ? [pc.caseStudy.results.map((r) => `${r.value} ${r.label[0].toLowerCase()}${r.label.slice(1)}`).join(' · ')] : []),
          "Fun bits: CSV bulk imports on SQS + S3, schema-driven surveys, and QR check-in with geofencing so nobody checks in from home 😄",
        ]
      : ['That one lives in the Projects section.'],
    actions: [{ label: 'Open Projects', section: 'projects' }],
    replies: [...(story ? [{ label: story.title + '?', next: 'story' as const }] : []), { label: 'Any side projects?', next: 'side' }, more],
  },
  story: {
    says: story
      ? [
          `${story.title} is my open-source Flutter package on pub.dev: Instagram-style stories, viewer and editor.`,
          'Polls, quizzes, stickers, video, undo/redo, and export to JSON, PNG or video. All on one document model.',
        ]
      : ['That one lives in the Projects section.'],
    actions: [
      ...(story?.packageUrl ? [{ label: 'Open on pub.dev', href: story.packageUrl }] : inventory[0]?.href ? [{ label: 'Open on pub.dev', href: inventory[0].href }] : []),
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
    actions: [{ label: 'Open the Inventory', section: 'inventory' }],
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
      { label: 'Resume (PDF)', href: profile.resumeUrl },
    ],
    replies: [{ label: 'Thanks!', next: 'thanks' }, more],
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
  { words: ['hire', 'hiring', 'job', 'available', 'availability', 'email', 'contact', 'reach', 'call', 'linkedin', 'resume', 'cv', 'work with', 'freelance'], next: 'contact' },
  { words: ['stack', 'skill', 'skills', 'tech', 'language', 'languages', 'flutter', 'dart', 'react', 'angular', 'nestjs', 'aws', 'typescript', 'backend', 'frontend'], next: 'stack' },
  { words: ['personal collection', 'dealer', 'white cloak'], next: 'flagship' },
  { words: ['story', 'stories', 'package', 'pub.dev', 'open source'], next: 'story' },
  { words: ['side', 'brightrail', 'tool', 'tools', 'game', 'souls', 'experiment'], next: 'side' },
  { words: ['project', 'projects', 'portfolio', 'built', 'build', 'app', 'apps', 'best', 'github'], next: 'projects' },
  { words: ['school', 'study', 'studied', 'degree', 'university', 'teach', 'teaching', 'before', 'history', 'experience', 'career'], next: 'history' },
  { words: ['what do you do', 'who are you', 'about', 'role', 'company', 'current'], next: 'work' },
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

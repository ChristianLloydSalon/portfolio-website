import { useRef } from 'react';
import { BookOpen, Layers, Rocket } from 'lucide-react';
import { SectionHeading } from '@/components/typography/SectionHeading';
import { PortraitCard } from './PortraitCard';
import { profile } from '@/data/profile';
import { chapter } from '@/data/navigation';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/animations/gsap';
import { revealOnScroll } from '@/animations/transitions';
import { splitWords } from '@/animations/effects';
import './About.css';

const STATEMENT =
  'I build software end to end: Flutter apps on the screen, NestJS services and AWS behind them, and the pipelines that release them to three app stores.';

const principles = [
  {
    icon: Rocket,
    title: 'Own it after launch',
    body: 'Release pipelines, automated tests and production monitoring are part of the feature, not an afterthought.',
  },
  {
    icon: Layers,
    title: 'Keep it changeable',
    body: 'Clear layers, predictable state and modular features, so a codebase stays easy to change as it grows.',
  },
  {
    icon: BookOpen,
    title: 'Leave a trail',
    body: 'I document architecture, APIs and workflows so the team never depends on one person. Two years of teaching made this a habit.',
  },
];

const fileRows: [string, string][] = [
  ['Name', profile.name],
  ['Class', profile.role],
  ['Base', profile.location],
  ['Guild', 'White Cloak Technologies · since 2021'],
  ['Main', 'Flutter · Dart · Angular · NestJS · AWS'],
  ['Training', 'BS Computer Engineering · DOST Scholar'],
];

export function About() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGsap(
    () => {
      const root = ref.current!;
      if (reduced) return;
      revealOnScroll(root);
      // Word-by-word light-up, scrubbed with scroll.
      const words = root.querySelectorAll('.reveal-word');
      gsap.to(words, {
        opacity: 1,
        stagger: 0.08,
        ease: 'none',
        scrollTrigger: { trigger: '[data-statement]', start: 'top 80%', end: 'bottom 45%', scrub: 0.5 },
      });
    },
    ref,
    [reduced],
  );

  return (
    <section ref={ref} id="about" className="about section-pad container-x" aria-labelledby="about-title">
      <SectionHeading
        id="about-title"
        chapter={chapter('about')}
        kicker="The Engineer"
        title={
          <>
            Meet the <span className="text-accent-ink">engineer</span>
          </>
        }
      />

      <p className="about__statement display" data-statement>
        {splitWords(STATEMENT).map((w, i) =>
          /\s+/.test(w) ? w : (
            <span key={i} className="reveal-word">
              {w}
            </span>
          ),
        )}
      </p>

      <div className="about__file">
        <PortraitCard />

        <div className="about__details">
          <div className="card-glass about__dossier" data-reveal>
            <div className="about__dossier-head">
              <p className="eyebrow">Character file</p>
              <p className="eyebrow text-accent-ink">Player 01</p>
            </div>
            <dl className="about__rows">
              {fileRows.map(([k, v]) => (
                <div key={k} className="about__row">
                  <dt className="eyebrow">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="about__bio" data-reveal>
            I&rsquo;m {profile.firstName}, based in {profile.location}. I joined White Cloak Technologies as a junior
            engineer in 2021 and now lead the mobile side of client projects, taking features from technical design to
            store release. I work best owning a product area end to end, or joining a team that needs one engineer
            across mobile, web and backend.
          </p>

        </div>
      </div>

      <div className="about__principles">
        <h3 className="eyebrow text-ink-2" data-reveal>
          Engineering philosophy
        </h3>
        <ol className="about__principle-list">
          {principles.map((p, i) => (
            <li key={p.title} className="about__principle" data-reveal>
              <span className="about__principle-num display">{String(i + 1).padStart(2, '0')}</span>
              <p.icon className="about__principle-icon" size={28} aria-hidden="true" />
              <h4 className="display about__principle-title">{p.title}</h4>
              <p className="text-ink-2">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

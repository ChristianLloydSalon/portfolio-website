import { useRef } from 'react';
import { BookOpen, Layers, Rocket } from 'lucide-react';
import { SectionHeading } from '@/components/typography/SectionHeading';
import { PortraitCard } from './PortraitCard';
import { profile } from '@/data/profile';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/animations/gsap';
import { revealOnScroll } from '@/animations/transitions';
import { splitWords } from '@/animations/effects';
import './About.css';

const STATEMENT =
  'I build mobile apps end to end. Flutter on the screen, NestJS and AWS behind it, shipped to every major app store, and the occasional game, just to prove it can be done.';

const principles = [
  {
    icon: Rocket,
    title: 'Ship for production',
    body: 'Prototypes are easy. I care about what happens after launch: CI/CD that ships safely, monitoring with Sentry and Dynatrace, and code the next engineer can change.',
  },
  {
    icon: Layers,
    title: 'Design the system',
    body: 'Clean Architecture, predictable state with BLoC and Riverpod, and modular features. Architecture is how a codebase stays fast to work in for years.',
  },
  {
    icon: BookOpen,
    title: 'Leave a trail',
    body: 'Two years of teaching taught me that knowledge only counts once it is shared. I document architecture, APIs and workflows so teams can move without me.',
  },
];

const pad = (n: number) => String(n).padStart(2, '0');

const fileRows: [string, string][] = [
  ['Name', profile.name],
  ['Class', profile.role],
  ['Base', profile.location],
  ['Guild', 'White Cloak Technologies'],
  ['Specialization', 'Flutter & cross-platform mobile'],
  ['Main', 'Flutter · Dart · NestJS · AWS'],
  ['Training', 'BS Computer Engineering · DOST Scholar'],
];

export function About() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  // Source: resume (Nov 2026).
  const stats = [
    { value: 5, suffix: '+', label: 'Years in production' },
    { value: 3, suffix: '', label: 'App stores shipped to' },
  ];

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
      root.querySelectorAll<HTMLElement>('[data-stat]').forEach((el) => {
        const target = Number(el.dataset.stat);
        const counter = { v: 0 };
        el.textContent = pad(0);
        gsap.to(counter, {
          v: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = pad(Math.round(counter.v));
          },
          scrollTrigger: { trigger: '[data-stats]', start: 'top 85%', once: true },
        });
      });
    },
    ref,
    [reduced],
  );

  return (
    <section ref={ref} id="about" className="about section-pad container-x" aria-labelledby="about-title">
      <SectionHeading
        id="about-title"
        chapter="Chapter 01"
        kicker="The Developer"
        title={
          <>
            Meet the <span className="text-accent-ink">developer</span>
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
            I&rsquo;m {profile.firstName}, a software engineer based in {profile.location}. For more than five years
            I&rsquo;ve built and supported production iOS and Android apps in Flutter, along with the Angular
            dashboards, NestJS services and AWS pipelines behind them. Before that I taught software development at
            Bohol Island State University, where I earned my Computer Engineering degree as a DOST scholar.
          </p>

          <ul className="about__stats" data-stats data-reveal>
            {stats.map((s) => (
              <li key={s.label}>
                <span className="display about__stat-value">
                  <span data-stat={s.value}>{pad(s.value)}</span>
                  {s.suffix}
                </span>
                <span className="eyebrow">{s.label}</span>
              </li>
            ))}
          </ul>
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

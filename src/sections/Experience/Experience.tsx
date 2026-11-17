import { useRef } from 'react';
import { CheckCircle2, CircleDot, Trophy } from 'lucide-react';
import { missions } from '@/data/experience';
import { SectionHeading } from '@/components/typography/SectionHeading';
import { chapter } from '@/data/navigation';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, ScrollTrigger } from '@/animations/gsap';
import { revealOnScroll } from '@/animations/transitions';
import './Experience.css';

const total = String(missions.length).padStart(2, '0');

export function Experience() {
  const ref = useRef<HTMLElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  useGsap(
    () => {
      const root = ref.current!;
      if (reduced) {
        root.querySelectorAll('[data-mission]').forEach((m) => m.classList.add('is-reached'));
        return;
      }
      revealOnScroll(root);
      gsap.fromTo(
        '[data-timeline-fill]',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '[data-timeline]', start: 'top 60%', end: 'bottom 60%', scrub: 0.4 } },
      );
      root.querySelectorAll<HTMLElement>('[data-mission]').forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 60%',
          end: 'bottom 60%',
          onToggle: (self) => {
            if (self.isActive) {
              el.classList.add('is-reached');
              if (counterRef.current) counterRef.current.textContent = String(missions.length - i).padStart(2, '0');
              if (titleRef.current) titleRef.current.textContent = missions[i].position;
            }
          },
        });
      });
    },
    ref,
    [reduced],
  );

  return (
    <section ref={ref} id="experience" className="experience section-pad container-x" aria-labelledby="experience-title">
      <SectionHeading
        id="experience-title"
        chapter={chapter('experience')}
        kicker="Career timeline"
        title={
          <>
            Mission <span className="text-accent-ink">log</span>
          </>
        }
        intro="Five years of production software, newest first: how the role grew, what I owned, and the decisions that came with it. Project results are in the case studies above."
      />

      <div className="experience__layout">
        <aside className="experience__hud" aria-hidden="true">
          <div className="experience__hud-inner card-glass">
            <p className="eyebrow text-ink-2">Mission</p>
            <p className="display experience__counter">
              <span ref={counterRef}>{total}</span>
              <span className="experience__counter-total">/{total}</span>
            </p>
            <p className="experience__hud-title" ref={titleRef}>
              {missions[0].position}
            </p>
          </div>
        </aside>

        <div className="experience__track" data-timeline>
          <span className="experience__line" aria-hidden="true">
            <span data-timeline-fill />
          </span>
          <ol className="experience__timeline">
          {missions.map((m, i) => (
            <li key={m.id} className="mission" data-mission>
              <span className="mission__node" aria-hidden="true" />
              <article className="mission__card" aria-labelledby={`${m.id}-title`}>
                <header className="mission__head" data-reveal>
                  <p className="mission__tag eyebrow">
                    <span>Mission {String(missions.length - i).padStart(2, '0')}</span>
                    <span className={`mission__status is-${m.status}`}>
                      {m.status === 'active' ? <CircleDot size={13} aria-hidden="true" /> : <CheckCircle2 size={13} aria-hidden="true" />}
                      {m.status === 'active' ? 'Current' : 'Complete'}
                    </span>
                  </p>
                  <p className="eyebrow text-ink-2 mission__period">{m.period}</p>
                </header>
                <h3 id={`${m.id}-title`} className="display mission__title" data-reveal>
                  {m.position}
                </h3>
                {m.progression && m.progression.length > 1 && (
                  <ol className="mission__progression" data-reveal aria-label="Career progression">
                    {m.progression.map((t, k) => (
                      <li key={t} className={k === m.progression!.length - 1 ? 'is-current' : undefined}>
                        {t}
                      </li>
                    ))}
                  </ol>
                )}
                <p className="mission__company" data-reveal>
                  {m.company}
                  {m.location && <span className="mission__location"> · {m.location}</span>}
                </p>
                <p className="mission__summary" data-reveal>
                  {m.summary}
                </p>

                {m.groups?.length ? (
                  <div className="mission__groups" data-reveal>
                    {m.groups.map((g) => (
                      <div key={g.title} className="mission__group">
                        <h4 className="eyebrow mission__sub">{g.title}</h4>
                        <ul className="mission__list">
                          {g.items.map((r) => (
                            <li key={r}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                <div className="mission__grid" data-reveal>
                  <div>
                    <h4 className="eyebrow mission__sub">Responsibilities</h4>
                    <ul className="mission__list">
                      {m.responsibilities.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="eyebrow mission__sub">Contributions</h4>
                    <ul className="mission__list">
                      {m.contributions.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                )}

                {m.achievements.length > 0 && (
                  <ul className="mission__trophies" data-reveal aria-label="Achievements">
                    {m.achievements.map((a) => (
                      <li key={a}>
                        <Trophy size={16} aria-hidden="true" />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}

                <ul className="mission__stack" data-reveal aria-label="Technologies">
                  {m.stack.map((s) => (
                    <li key={s} className="chip">
                      {s}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

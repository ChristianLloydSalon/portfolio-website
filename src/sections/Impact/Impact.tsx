import { useRef } from 'react';
import { ArrowRight, Gauge, Rocket, Scale, Workflow, type LucideIcon } from 'lucide-react';
import { SectionHeading } from '@/components/typography/SectionHeading';
import { outcomes } from '@/data/business';
import { chapter } from '@/data/navigation';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { revealOnScroll } from '@/animations/transitions';
import { openProject } from '@/sections/Projects/openProject';
import './Impact.css';

const ICONS: Record<string, LucideIcon> = { launch: Rocket, overhead: Workflow, scale: Gauge, decide: Scale };

/** Business outcomes, each backed by a piece of evidence from a case study. */
export function Impact() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGsap(
    () => {
      if (reduced) return;
      revealOnScroll(ref.current!);
    },
    ref,
    [reduced],
  );

  return (
    <section ref={ref} id="impact" className="impact section-pad container-x" aria-labelledby="impact-title">
      <SectionHeading
        id="impact-title"
        chapter={chapter('impact')}
        kicker="Business outcomes"
        title={
          <>
            I build software that <span className="text-accent-ink">moves businesses forward.</span>
          </>
        }
        intro="Technology is only valuable when it solves a real problem. I help businesses turn ideas, inefficient processes and operational challenges into reliable software products."
        titleClassName="impact__title"
      />

      <ol className="impact__grid">
        {outcomes.map((o, i) => {
          const Icon = ICONS[o.id] ?? Rocket;
          return (
            <li key={o.id} className="impact__card" data-reveal>
              <div className="impact__head">
                <span className="impact__num eyebrow" aria-hidden="true">
                  Objective {String(i + 1).padStart(2, '0')}
                </span>
                <Icon className="impact__icon" size={26} aria-hidden="true" />
              </div>
              <h3 className="display impact__card-title">{o.title}</h3>
              <p className="impact__body">{o.body}</p>
              <p className="impact__proof">
                <span className="impact__proof-label eyebrow">Proof</span>
                {o.proof}
              </p>
            </li>
          );
        })}
      </ol>

      <div className="impact__footer" data-reveal>
        <p className="text-ink-2">Every proof point above comes from one production app, with the numbers and how they were measured.</p>
        <button type="button" className="btn btn-primary" onClick={(e) => openProject('personal-collection', e.currentTarget)}>
          View the case study <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

import { useRef } from 'react';
import { ArrowRight, BellRing, Layers, MapPin, Timer, type LucideIcon } from 'lucide-react';
import { SectionHeading } from '@/components/typography/SectionHeading';
import { outcomes } from '@/data/business';
import { chapter } from '@/data/navigation';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { revealOnScroll } from '@/animations/transitions';
import { openProject } from '@/sections/Projects/openProject';
import { BASIS_LABEL } from '@/sections/Projects/projectStatus';
import './Impact.css';

const ICONS: Record<string, LucideIcon> = { push: BellRing, attendance: MapPin, bulk: Layers, regression: Timer };

/** Measured results from my work, each labelled with where it was measured. */
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
        kicker="Measured results"
        title={
          <>
            What the work <span className="text-accent-ink">changed</span>
          </>
        }
        intro="Results from features I built on Personal Collection, a White Cloak client app. Each number is labelled with where it was measured."
        titleClassName="impact__title"
      />

      <ol className="impact__grid">
        {outcomes.map((o, i) => {
          const Icon = ICONS[o.id] ?? Layers;
          return (
            <li key={o.id} className="impact__card" data-reveal>
              <div className="impact__head">
                <span className="impact__num eyebrow" aria-hidden="true">
                  Objective {String(i + 1).padStart(2, '0')}
                </span>
                <Icon className="impact__icon" size={26} aria-hidden="true" />
              </div>
              <p className="impact__result">
                <span className="display impact__value">{o.result.value}</span>
                <span className="impact__value-label">{o.result.label}</span>
                <span className={`cs-basis is-${o.result.basis}`}>{BASIS_LABEL[o.result.basis]}</span>
              </p>
              <h3 className="display impact__card-title">{o.title}</h3>
              <p className="impact__body">{o.body}</p>
            </li>
          );
        })}
      </ol>

      <div className="impact__footer" data-reveal>
        <p className="text-ink-2">The case study covers how each feature was built and what was mine versus the team&rsquo;s.</p>
        <button type="button" className="btn btn-primary" onClick={(e) => openProject('personal-collection', e.currentTarget)}>
          View the case study <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

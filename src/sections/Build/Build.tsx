import { useRef } from 'react';
import { ArrowRight, Check, Cog, Layers, RefreshCcw, Server, Smartphone, type LucideIcon } from 'lucide-react';
import { SectionHeading } from '@/components/typography/SectionHeading';
import { capabilities } from '@/data/business';
import { chapter } from '@/data/navigation';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { revealOnScroll } from '@/animations/transitions';
import { scrollToSection } from '@/animations/scroll';
import { openProject } from '@/sections/Projects/openProject';
import './Build.css';
import { sectionPath } from '@/app/routes';

const ICONS: Record<string, LucideIcon> = { products: Smartphone, automation: Cog, modernization: RefreshCcw, backend: Server };

/** What I can build, in plain terms for non-technical visitors, each with where I've done it. */
export function Build() {
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
    <section ref={ref} id="build" className="build section-pad container-x" aria-labelledby="build-title">
      <SectionHeading
        id="build-title"
        chapter={chapter('build')}
        kicker="For your business"
        title={
          <>
            What I can <span className="text-accent-ink">build</span> for you
          </>
        }
        intro="I'm one engineer, not an agency. These are the kinds of work I've delivered before and can take ownership of, on my own or as part of your team."
        titleClassName="build__title"
      />

      <ul className="build__grid">
        {capabilities.map((c) => {
          const Icon = ICONS[c.id] ?? Layers;
          return (
            <li key={c.id} className="build__card card-glass" data-reveal>
              <Icon className="build__icon" size={28} aria-hidden="true" />
              <h3 className="display build__card-title">{c.title}</h3>
              <p className="build__body">{c.body}</p>
              <ul className="build__items">
                {c.items.map((it) => (
                  <li key={it}>
                    <Check size={15} aria-hidden="true" />
                    {it}
                  </li>
                ))}
              </ul>
              <p className="build__evidence">
                <span className="eyebrow">Done before</span>
                <span className="build__evidence-links">
                  {c.evidence.map((e) => (
                    <button
                      key={e.label}
                      type="button"
                      className="build__evidence-link"
                      onClick={(ev) => (e.projectId ? openProject(e.projectId, ev.currentTarget) : e.section && scrollToSection(e.section))}
                    >
                      {e.label} <ArrowRight size={13} aria-hidden="true" />
                    </button>
                  ))}
                </span>
              </p>
            </li>
          );
        })}
      </ul>

      <div className="build__cta" data-reveal>
        <p className="display build__cta-title">Have something in mind?</p>
        <a
          href={sectionPath('contact')}
          className="btn btn-primary"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('contact');
          }}
        >
          Let&rsquo;s talk <ArrowRight size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

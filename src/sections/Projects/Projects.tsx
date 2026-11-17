import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import { useLocation, useRoute } from 'wouter';
import { projects } from '@/data/projects';
import { SectionHeading } from '@/components/typography/SectionHeading';
import { ProjectArt } from './ProjectArt';
import { STATUS_LABEL } from './projectStatus';
import { ProjectOverlay } from './ProjectOverlay';
import { onOpenProject } from './openProject';
import { chapter } from '@/data/navigation';
import { useTheme } from '@/features/theme/useTheme';
import { useGsap } from '@/hooks/useGsap';
import { DESKTOP_QUERY, useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/animations/gsap';
import { revealOnScroll } from '@/animations/transitions';
import { scrollToSection } from '@/animations/scroll';
import { PROJECT_ROUTE, isProjectPath, projectPath, resolvePath, sectionPath } from '@/app/routes';
import './Projects.css';

interface Props {
  /** False until deep links are handled; a /projects/:id URL opens the overlay only then. */
  ready: boolean;
}

export function Projects({ ready }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { theme } = useTheme();
  const reduced = useReducedMotion();
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const horizontal = desktop && !reduced;
  const [origin, setOrigin] = useState<DOMRect | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const hudIndexRef = useRef<HTMLSpanElement>(null);
  const hudNameRef = useRef<HTMLSpanElement>(null);

  // The open project lives in the URL: /projects/:id.
  const [, navigate] = useLocation();
  const [match, params] = useRoute<{ id: string }>(PROJECT_ROUTE);
  const routeIndex = match ? projects.findIndex((p) => p.id === params.id) : -1;
  const openIndex = ready && routeIndex >= 0 ? routeIndex : null;
  // True when the overlay was opened in-app, so closing can step Back instead of
  // stacking another history entry. A deep link has nothing of ours to go back to.
  const pushedRef = useRef(false);

  const show = useCallback(
    (i: number, trigger: HTMLElement | null, rect: DOMRect | null) => {
      triggerRef.current = trigger;
      setOrigin(rect);
      const already = isProjectPath(window.location.pathname);
      if (!already) pushedRef.current = true;
      navigate(projectPath(projects[i].id), { replace: already });
    },
    [navigate],
  );

  const open = useCallback((i: number, el: HTMLElement) => show(i, el, el.getBoundingClientRect()), [show]);

  const close = useCallback(() => {
    setOrigin(null);
    if (pushedRef.current) {
      pushedRef.current = false;
      history.back();
    } else {
      navigate(sectionPath('projects'), { replace: true });
    }
  }, [navigate]);

  // Reads the live URL, not the last render, so rapid presses each count.
  const step = useCallback(
    (d: number) => {
      const target = resolvePath(window.location.pathname);
      const i = target.kind === 'project' ? projects.findIndex((p) => p.id === target.id) : -1;
      if (i < 0) return;
      navigate(projectPath(projects[(i + d + projects.length) % projects.length].id), { replace: true });
    },
    [navigate],
  );

  // Left via the browser's Back button: nothing of ours is on the stack any more.
  useEffect(() => {
    if (!match) pushedRef.current = false;
  }, [match]);

  // Unknown project id: fall back to the projects section.
  useEffect(() => {
    if (ready && match && routeIndex < 0) navigate(sectionPath('projects'), { replace: true });
  }, [ready, match, routeIndex, navigate]);

  // "View case study" links elsewhere on the page open the presentation directly.
  useEffect(
    () =>
      onOpenProject((id, trigger) => {
        const i = projects.findIndex((p) => p.id === id);
        if (i >= 0) show(i, trigger, null);
      }),
    [show],
  );

  useGsap(
    () => {
      const root = ref.current!;
      if (reduced) return;
      revealOnScroll(root, '[data-reveal]');

      if (!horizontal) {
        root.querySelectorAll<HTMLElement>('[data-card-art]').forEach((art) => {
          gsap.fromTo(art, { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: art, start: 'top bottom', end: 'bottom 30%', scrub: true } });
        });
        return;
      }

      const track = root.querySelector<HTMLElement>('[data-track]')!;
      const distance = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-pin]',
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Direct DOM writes: no React re-render per scroll frame.
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
            const i = Math.min(projects.length - 1, Math.floor(self.progress * projects.length));
            if (hudIndexRef.current) hudIndexRef.current.textContent = projects[i].index;
            if (hudNameRef.current) hudNameRef.current.textContent = projects[i].codename;
          },
        },
      });

      // Art drifts against the track direction for depth; cards tilt in.
      root.querySelectorAll<HTMLElement>('[data-card]').forEach((card) => {
        const art = card.querySelector('[data-card-art]');
        gsap.fromTo(art, { xPercent: -8, scale: 1.18 }, {
          xPercent: 8,
          scale: 1.05,
          ease: 'none',
          scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
        });
        gsap.from(card.querySelectorAll('[data-card-in]'), {
          y: 40,
          opacity: 0,
          stagger: 0.06,
          ease: 'expo.out',
          duration: 1,
          scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 75%', toggleActions: 'play none none reverse' },
        });
      });
    },
    ref,
    [horizontal, reduced],
  );

  return (
    <section ref={ref} id="projects" className="projects" aria-labelledby="projects-title">
      <div className="container-x section-pad pb-0!">
        <SectionHeading
          id="projects-title"
          chapter={chapter('projects')}
          kicker="Case studies"
          title={
            <>
              Featured <br className="hidden md:block" />
              projects
            </>
          }
          intro="Each one starts with the problem it solves. Company products show what I personally owned within the team; every project is labelled with where it stands, from production to experiment."
        />
      </div>

      <div className={`projects__pin ${horizontal ? 'is-horizontal' : ''}`} data-pin>
        <ol className="projects__track" data-track>
          {projects.map((p, i) => (
            <li key={p.id} className="project-card" data-card>
              <a
                href={projectPath(p.id)}
                className="project-card__hit"
                onClick={(e) => {
                  // Modified clicks (new tab/window) go to the page's own URL.
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                  e.preventDefault();
                  open(i, e.currentTarget);
                }}
                aria-haspopup="dialog"
              >
                <div className="project-card__media">
                  <div className="project-card__art" data-card-art>
                    <ProjectArt project={p} theme={theme} />
                  </div>
                  <span className="project-card__index display" aria-hidden="true">
                    {p.index}
                  </span>
                  <span className="project-card__open" aria-hidden="true">
                    <Plus size={22} />
                  </span>
                </div>
                <div className="project-card__body">
                  <p className="eyebrow project-card__meta" data-card-in>
                    <span className={`status-badge is-${p.status}`}>{STATUS_LABEL[p.status]}</span>
                    {p.employer && <span className="company-badge">Company project</span>}
                    <span>{p.category}</span>
                    {p.year && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{p.year}</span>
                      </>
                    )}
                  </p>
                  <h3 className="display project-card__title" data-card-in>
                    {p.title}
                  </h3>
                  <p className="project-card__summary" data-card-in>
                    {p.summary}
                  </p>
                  <ul className="project-card__stack" data-card-in aria-label="Tech stack">
                    {p.stack.slice(0, 4).map((s) => (
                      <li key={s} className="chip">
                        {s}
                      </li>
                    ))}
                  </ul>
                  <span className="project-card__cta eyebrow" data-card-in aria-hidden="true">
                    {p.caseStudy?.context ? 'View case study' : 'View project'} <ArrowRight size={14} />
                  </span>
                </div>
              </a>
            </li>
          ))}
          <li className="project-card project-card--end" aria-label="More work">
            <div className="project-card__end">
              <p className="eyebrow text-ink-2">More in the vault</p>
              <p className="display project-card__end-title">Side quests &amp; open source</p>
              <a
                href={sectionPath('inventory')}
                className="btn btn-primary self-start"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('inventory');
                }}
              >
                Open inventory <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </li>
        </ol>

        {horizontal && (
          <div className="projects__hud container-x" aria-hidden="true">
            <span className="eyebrow">
              <span ref={hudIndexRef}>{projects[0].index}</span> / {String(projects.length).padStart(2, '0')}
            </span>
            <span className="projects__bar">
              <span ref={barRef} style={{ transform: 'scaleX(0)' }} />
            </span>
            <span className="eyebrow" ref={hudNameRef}>
              {projects[0].codename}
            </span>
          </div>
        )}
      </div>

      <ProjectOverlay
        index={openIndex}
        origin={origin}
        onClose={close}
        onStep={step}
        returnFocusRef={triggerRef}
      />
    </section>
  );
}

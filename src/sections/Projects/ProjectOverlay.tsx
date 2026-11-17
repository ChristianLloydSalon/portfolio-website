import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, ExternalLink, Github, Mail, Package, X } from 'lucide-react';
import { projects } from '@/data/projects';
import { copyEmail, mailtoUrl } from '@/lib/email';
import { ProjectArt } from './ProjectArt';
import { STATUS_LABEL } from './projectStatus';
import {
  CaseStudyBrief,
  CaseStudyDecisions,
  CaseStudyDisclaimer,
  CaseStudyEngineering,
  CaseStudySections,
  CaseStudyResults,
} from './CaseStudy';
import { useTheme } from '@/features/theme/useTheme';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { prefersReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/animations/gsap';
import { lockScroll } from '@/animations/scroll';
import { site } from '@/seo/site';

interface Props {
  index: number | null;
  origin: DOMRect | null;
  onClose: () => void;
  /** Move by a relative step (-1 / +1). Relative, so rapid presses each count. */
  onStep: (delta: number) => void;
  returnFocusRef: React.RefObject<HTMLElement>;
}

/** Full-screen project presentation. Expands from the clicked card. */
export function ProjectOverlay({ index, origin, onClose, onStep, returnFocusRef }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const open = index !== null;
  const closingRef = useRef(false);
  // "Ask about this project" also copies the address, for visitors without a mail app.
  const [askCopied, setAskCopied] = useState(false);
  useEffect(() => setAskCopied(false), [index]);

  const close = () => {
    const el = ref.current;
    if (!el || closingRef.current) return;
    if (prefersReducedMotion()) {
      onClose();
      return;
    }
    closingRef.current = true;
    gsap.to(el, {
      opacity: 0,
      y: 40,
      duration: 0.45,
      ease: 'power3.in',
      onComplete: () => {
        closingRef.current = false;
        onClose();
      },
    });
  };

  useFocusTrap(ref, open, close, returnFocusRef);

  useEffect(() => {
    lockScroll('project', open);
    return () => {
      if (open) lockScroll('project', false);
    };
  }, [open]);

  // Each project route gets its own tab title.
  useEffect(() => {
    if (index === null) return;
    document.title = `${projects[index].title} | ${site.name}`;
    // Not the previous title: a deep-linked page loads with the project's title already.
    return () => {
      document.title = site.title;
    };
  }, [index]);

  // Expand from the card's rectangle.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !open) return;
    gsap.set(el, { opacity: 1, y: 0 });
    if (prefersReducedMotion() || !origin) return;
    const { top, left, right, bottom } = origin;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    gsap.fromTo(
      el,
      { clipPath: `inset(${top}px ${vw - right}px ${vh - bottom}px ${left}px round 28px)` },
      { clipPath: 'inset(0px 0px 0px 0px round 0px)', duration: 0.9, ease: 'expo.inOut' },
    );
    gsap.from(el.querySelectorAll('[data-ov-in]'), { y: 50, opacity: 0, duration: 1, stagger: 0.06, delay: 0.45, ease: 'expo.out' });
    // origin only changes together with a fresh open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Content swap when navigating between projects.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !open) return;
    el.querySelector('[data-ov-scroll]')?.scrollTo({ top: 0 });
    if (prefersReducedMotion()) return;
    gsap.fromTo(el.querySelectorAll('[data-ov-swap]'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: 'expo.out' });
  }, [index, open]);

  if (!open) return null;
  const p = projects[index];
  const prev = (index - 1 + projects.length) % projects.length;
  const next = (index + 1) % projects.length;

  const overlay = (
    <div
      ref={ref}
      className="project-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-overlay-title"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') onStep(1);
        if (e.key === 'ArrowLeft') onStep(-1);
      }}
    >
      <button type="button" className="project-overlay__close" onClick={close} aria-label="Close project">
        <X size={22} aria-hidden="true" />
      </button>
      <div className="project-overlay__scroll" data-ov-scroll data-lenis-prevent>
        <div className="project-overlay__hero">
          <div className="project-overlay__art" data-ov-swap>
            <ProjectArt project={p} theme={theme} priority />
          </div>
          <div className="project-overlay__hero-shade" aria-hidden="true" />
          <div className="project-overlay__hero-copy container-x">
            <p className="eyebrow" data-ov-in data-ov-swap>
              Mission {p.index} · {p.codename}
            </p>
            <h2 id="project-overlay-title" className="display project-overlay__title" data-ov-in data-ov-swap>
              {p.title}
            </h2>
          </div>
        </div>

        <div className="project-overlay__body container-x">
          <dl className="project-overlay__meta" data-ov-in data-ov-swap>
            <div>
              <dt className="eyebrow">Category</dt>
              <dd>{p.category}</dd>
            </div>
            <div>
              <dt className="eyebrow">Status</dt>
              <dd>
                <span className={`status-badge is-${p.status}`}>{STATUS_LABEL[p.status]}</span>
              </dd>
            </div>
            {p.employer && (
              <div>
                <dt className="eyebrow">Built at</dt>
                <dd>{p.employer}</dd>
              </div>
            )}
            {p.platforms && (
              <div>
                <dt className="eyebrow">Platforms</dt>
                <dd>{p.platforms}</dd>
              </div>
            )}
            {p.year && (
              <div>
                <dt className="eyebrow">Year</dt>
                <dd>{p.year}</dd>
              </div>
            )}
            <div>
              <dt className="eyebrow">Role</dt>
              <dd>{p.role}</dd>
            </div>
          </dl>

          {p.caseStudy?.results && <CaseStudyResults results={p.caseStudy.results} />}

          <CaseStudyBrief context={p.caseStudy?.context} problem={p.caseStudy?.problem ?? p.problem} solution={p.caseStudy?.solution} />

          <div className="project-overlay__grid">
            <div data-ov-in data-ov-swap>
              <h3 className="eyebrow text-ink-2">Briefing</h3>
              <p className="project-overlay__desc">{p.description}</p>

              <div className="project-overlay__links">
                {p.github && (
                  <a className="btn btn-primary" href={p.github} target="_blank" rel="noreferrer">
                    <Github size={16} aria-hidden="true" /> Repository
                  </a>
                )}
                {p.packageUrl && (
                  <a className="btn btn-ghost" href={p.packageUrl} target="_blank" rel="noreferrer">
                    <Package size={16} aria-hidden="true" /> pub.dev
                  </a>
                )}
                {p.demo && (
                  <a className="btn btn-ghost" href={p.demo} target="_blank" rel="noreferrer">
                    Live demo <ExternalLink size={16} aria-hidden="true" />
                  </a>
                )}
                {p.links?.map((l) => (
                  <a key={l.href} className="btn btn-ghost" href={l.href} target="_blank" rel="noreferrer">
                    {l.label} <ExternalLink size={16} aria-hidden="true" />
                  </a>
                ))}
                <a
                  className="btn btn-ghost"
                  href={mailtoUrl(`About ${p.title}`)}
                  onClick={async () => setAskCopied(await copyEmail())}
                >
                  <Mail size={16} aria-hidden="true" /> {askCopied ? 'Email address copied' : 'Ask about this project'}
                </a>
                <span className="sr-only" aria-live="polite">
                  {askCopied ? 'Email address copied. If no email app opened, paste it into your email.' : ''}
                </span>
                {p.employer ? (
                  <p className="project-overlay__note">
                    Company project, built by a team at {p.employer}. What&rsquo;s listed under my role is my own
                    work; the product and its codebase belong to the company and stay private.
                  </p>
                ) : (
                  !p.github && !p.demo && !p.packageUrl && !p.links?.length && (
                    <p className="chip">
                      {p.status === 'in-development'
                        ? 'In development: links coming at launch'
                        : p.status === 'experimental'
                          ? 'Experiment: no public build yet'
                          : 'Repository and demo available on request'}
                    </p>
                  )
                )}
              </div>
            </div>

            <div data-ov-in data-ov-swap>
              <h3 className="eyebrow text-ink-2">
                {p.employer ? 'My role & responsibilities' : p.status === 'in-development' || p.status === 'experimental' ? 'Objectives' : 'Key features'}
              </h3>
              <ol className="project-overlay__features">
                {p.features.map((f, i) => (
                  <li key={f}>
                    <span className="project-overlay__feature-num">{String(i + 1).padStart(2, '0')}</span>
                    {f}
                  </li>
                ))}
              </ol>
              <h3 className="eyebrow text-ink-2 mt-10">What it demonstrates</h3>
              <ul className="project-overlay__demonstrates">
                {p.demonstrates.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <h3 className="eyebrow text-ink-2 mt-10">Technologies used</h3>
              <ul className="project-overlay__stack">
                {p.stack.map((s) => (
                  <li key={s} className="chip">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {p.caseStudy && <CaseStudyEngineering study={p.caseStudy} />}
          {p.caseStudy && <CaseStudyDecisions study={p.caseStudy} />}
          {p.caseStudy && <CaseStudySections study={p.caseStudy} />}
          {p.caseStudy?.disclaimer && <CaseStudyDisclaimer text={p.caseStudy.disclaimer} />}

          <nav className="project-overlay__pager" aria-label="Other projects">
            <button type="button" className="project-overlay__pager-btn" onClick={() => onStep(-1)}>
              <ArrowLeft size={18} aria-hidden="true" />
              <span>
                <span className="eyebrow block opacity-70">Previous</span>
                <span className="display text-2xl">{projects[prev].title}</span>
              </span>
            </button>
            <button type="button" className="project-overlay__pager-btn is-next" onClick={() => onStep(1)}>
              <span>
                <span className="eyebrow block opacity-70">Next</span>
                <span className="display text-2xl">{projects[next].title}</span>
              </span>
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>

    </div>
  );
  // The build-time prerender has no document: render in place so the page's HTML carries the case study.
  return import.meta.env.SSR ? overlay : createPortal(overlay, document.body);
}

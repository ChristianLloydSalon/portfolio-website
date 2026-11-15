import { useRef } from 'react';
import { ArrowDown, FileText, MapPin } from 'lucide-react';
import { Scene } from '@/components/scene/Scene';
import { LogoMark, SHINE_TRAVEL } from '@/components/brand/Logo';
import { MagneticButton } from '@/components/buttons/MagneticButton';
import { profile } from '@/data/profile';
import { useTheme } from '@/features/theme/useTheme';
import { useGsap } from '@/hooks/useGsap';
import { DESKTOP_QUERY, FINE_POINTER_QUERY, useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/animations/gsap';
import { scrollToSection } from '@/animations/scroll';
import { asset } from '@/lib/assets';
import type { ThemeName } from '@/types';
import './Hero.css';

/** Parallax depth per scene layer: higher moves more. */
const DEPTH: Record<string, number> = { sky: 0.15, far: 0.3, city: 0.45, water: 0.35, palms: 1.2, figure: 0.8 };

/** Palm silhouettes (shape masks); resolved once, stable identity keeps <Scene> memoized. */
const PALM_LEFT = asset('palms/palms-left-mask');
const PALM_RIGHT = asset('palms/palms-right-mask');
const PALM_MASKS = PALM_LEFT || PALM_RIGHT ? { left: PALM_LEFT, right: PALM_RIGHT } : undefined;

interface HeroProps {
  ready: boolean;
  /** The loading-screen logo is flying into the mark, so don't animate the mark in here. */
  logoHandoff?: boolean;
}

export function Hero({ ready, logoHandoff = false }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { theme } = useTheme();
  const reduced = useReducedMotion();
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const finePointer = useMediaQuery(FINE_POINTER_QUERY);
  const compact = useMediaQuery('(max-width: 767px)');

  // Both theme versions are mounted at once and crossfaded by CSS, so a theme
  // switch never waits on an image download. A missing variant borrows the other.
  const backdropFor = (t: ThemeName) => (compact ? asset('hero/hero-mobile', t) : undefined) ?? asset('hero/hero', t);
  const sunriseBackdrop = backdropFor('sunrise') ?? backdropFor('dusk');
  const duskBackdrop = backdropFor('dusk') ?? backdropFor('sunrise');
  const backdrop = sunriseBackdrop && duskBackdrop ? { sunrise: sunriseBackdrop, dusk: duskBackdrop } : undefined;
  const hasBackdrop = !!backdrop;
  const character = asset('portraits/hero-character', theme);

  // Entrance, after the intro card lifts.
  useGsap(
    () => {
      if (!ready || reduced) return;
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      // Explicit end value: GSAP reads the default `none` as brightness(0), which would
      // fade the scene to black and then snap back. Clear the filter once settled.
      tl.fromTo(
        '[data-hero-stage]',
        { scale: 1.22, filter: 'brightness(0.6)' },
        { scale: 1, filter: 'brightness(1)', duration: 2.4, ease: 'power3.out', clearProps: 'filter' },
      );
      // With a hand-off the loading-screen logo lands on the mark itself; otherwise fade it in.
      if (!logoHandoff) tl.from('[data-hero-mark]', { y: 30, scale: 0.9, opacity: 0, duration: 1.4 }, 0.6);
      tl
        .from('[data-hero-in]', { y: 40, opacity: 0, duration: 1.1, stagger: 0.09 }, 0.75)
        .fromTo('[data-hero-mark] [data-logo-shine]', { x: 0 }, { x: SHINE_TRAVEL, duration: 1.3, ease: 'power2.inOut' }, 1.5);
    },
    ref,
    [ready, reduced, logoHandoff],
  );

  // Scroll: pinned camera push on desktop, light parallax elsewhere.
  useGsap(
    () => {
      if (reduced) return;
      const layer = (name: string) => `[data-layer="${name}"]`;
      if (desktop) {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=110%', scrub: 0.8, pin: true, anticipatePin: 1 },
        });
        // Only animate layers that exist (a painted backdrop replaces the drawn ones).
        const at = (name: string, vars: gsap.TweenVars) => {
          if (ref.current!.querySelector(layer(name))) tl.to(layer(name), vars, 0);
        };
        // A painting has no separate depth layers, so it gets a stronger push of its own.
        at('sky', hasBackdrop ? { scale: 1.2, y: -50 } : { scale: 1.08, y: -30 });
        at('far', { scale: 1.14, y: -40 });
        at('city', { scale: 1.22, y: -60 });
        at('water', { scale: 1.12 });
        // A real cut-out stays opaque (a fade would ghost the scene through it);
        // the camera slides past it instead. The silhouette just dissolves.
        at('figure', character ? { scale: 1.3, x: () => window.innerWidth * 0.24, y: 60 } : { scale: 1.6, y: 120, opacity: 0 });
        at('palms', { scale: 2.1, y: 160 });
        tl.to('[data-hero-content]', { y: -140, opacity: 0, duration: 0.6 }, 0).to('[data-hero-fade]', { opacity: 1, duration: 0.35 }, 0.65);
      } else {
        const st = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true };
        const drift = (name: string, vars: gsap.TweenVars) => {
          if (ref.current!.querySelector(layer(name))) gsap.to(layer(name), { ...vars, ease: 'none', scrollTrigger: st });
        };
        drift('palms', { y: 120, scale: 1.15 });
        drift('figure', { y: 70 });
        drift('city', { y: 30 });
        drift('sky', hasBackdrop ? { scale: 1.1 } : { y: 0 });
        gsap.to('[data-hero-content]', { y: -60, opacity: 0.2, ease: 'none', scrollTrigger: st });
      }
    },
    ref,
    [desktop, reduced, compact, hasBackdrop, character],
  );

  // Pointer parallax (fine pointers only).
  useGsap(
    () => {
      if (reduced || !finePointer) return;
      const movers = Object.entries(DEPTH).map(([name, depth]) => {
        const el = ref.current!.querySelector<HTMLElement>(`[data-layer="${name}"]`);
        if (!el) return null;
        return {
          depth,
          x: gsap.quickTo(el, 'xPercent', { duration: 1.4, ease: 'power3.out' }),
          y: gsap.quickTo(el, 'yPercent', { duration: 1.4, ease: 'power3.out' }),
        };
      });
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        for (const m of movers) {
          if (!m) continue;
          m.x(-nx * m.depth * 1.6);
          m.y(-ny * m.depth * 0.9);
        }
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      return () => window.removeEventListener('pointermove', onMove);
    },
    ref,
    [reduced, finePointer, compact, hasBackdrop, character],
  );

  return (
    <section ref={ref} id="home" className={`hero ${character ? 'hero--character' : ''}`} aria-labelledby="hero-title">
      <div className="hero__stage" data-hero-stage>
        <Scene variant="hero" compact={compact} backdrop={backdrop}
          palmMasks={PALM_MASKS} characterUrl={character} idPrefix="hero" />
      </div>
      <div className="hero__vignette" aria-hidden="true" />

      <div className="hero__content container-x" data-hero-content>
        <div className="hero__lockup">
          <div className="hero__mark" data-hero-mark>
            <LogoMark />
          </div>
        </div>

        <div className="hero__copy">
          <h1 id="hero-title" className="hero__name display" data-hero-in>
            <span>{profile.firstName}</span> <span>{profile.lastName}</span>
          </h1>
          <p className="hero__role" data-hero-in>
            {profile.role}
          </p>
          <ul className="hero__tagline" data-hero-in aria-label="Tagline">
            {profile.tagline.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <div className="hero__actions" data-hero-in>
            <MagneticButton
              variant="primary"
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('projects');
              }}
            >
              Explore Portfolio <ArrowDown size={16} aria-hidden="true" />
            </MagneticButton>
            <MagneticButton variant="ghost" href={profile.resumeUrl} target="_blank" rel="noreferrer">
              View Resume <FileText size={16} aria-hidden="true" />
            </MagneticButton>
          </div>
        </div>
      </div>

      <div className="hero__footer container-x" data-hero-in>
        <p className="hero__location eyebrow">
          <MapPin size={14} aria-hidden="true" /> {profile.location}
          <span className="hero__coords" aria-hidden="true">
            9.85°N 124.14°E
          </span>
        </p>
        <a
          href="#about"
          className="hero__scroll eyebrow"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('about');
          }}
        >
          <span>Scroll</span>
          <span className="hero__scroll-line" aria-hidden="true" />
        </a>
      </div>

      <div className="hero__fade" data-hero-fade aria-hidden="true" />
    </section>
  );
}

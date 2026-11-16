import { useId, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '@/animations/gsap';
import { LogoMark, SHINE_TRAVEL } from '@/components/brand/Logo';
import { prefersReducedMotion } from '@/hooks/useReducedMotion';
import { lockScroll } from '@/animations/scroll';
import './Intro.css';

/** Plays on every visit, except for visitors who ask their system to reduce motion. */
function shouldPlay() {
  return !prefersReducedMotion();
}

/**
 * Loading screen, on every visit: five stars fill one by one, drop beneath the centre
 * while the CS mark comes into focus above them,
 * a shine sweeps across it, then the mark flies to the hero's CS mark while the
 * background dissolves into the hero (a shared-element hand-off).
 * Any key, click or tap skips to the exit.
 *
 * onDone(handoff): the hero may start building (handoff = the logo flies into its mark).
 * onSettled(): the logo has landed and page scrolling is unlocked; safe to scroll.
 */
export function Intro({ onDone, onSettled }: { onDone: (handoff: boolean) => void; onSettled: () => void }) {
  const [play] = useState(shouldPlay);
  const [gone, setGone] = useState(!play);
  const ref = useRef<HTMLDivElement>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const settledRef = useRef(onSettled);
  settledRef.current = onSettled;

  // Layout effect: initial states are set before first paint, and ctx.revert()
  // fully resets them under StrictMode.
  useLayoutEffect(() => {
    if (!play) {
      doneRef.current(false);
      settledRef.current();
      return;
    }
    const el = ref.current!;

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      doneRef.current(true);
    };

    const mark = el.querySelector<HTMLElement>('[data-intro-mark]')!;
    const target = () => document.querySelector<HTMLElement>('[data-hero-mark]');

    /**
     * Delta from the loading-screen mark to the hero mark (centre to centre, height to
     * height; both share the logo's aspect ratio). Measured when the flight starts, so it
     * lands correctly at any screen size. Falls back to a gentle push if the target is missing.
     */
    const flight = () => {
      const to = target()?.getBoundingClientRect();
      const from = mark.getBoundingClientRect();
      if (!to || !to.height) return { x: 0, y: 0, scale: 1.18 };
      return {
        x: to.left + to.width / 2 - (from.left + from.width / 2),
        y: to.top + to.height / 2 - (from.top + from.height / 2),
        scale: to.height / from.height,
      };
    };
    let path = { x: 0, y: 0, scale: 1 };

    // The page must not move under the loading screen: the logo flies to a fixed target.
    // Released when the logo lands.
    // Locked synchronously here, before anything paints; smooth scrolling honours it when it starts.
    window.scrollTo(0, 0);
    lockScroll('intro', true);
    let settled = false;
    const unlock = () => {
      lockScroll('intro', false);
      if (!settled) {
        settled = true;
        settledRef.current();
      }
    };

    // Where the star row settles: just under the mark (measured, so it holds at any size).
    const starsDrop = () => mark.offsetHeight / 2 + Math.max(28, mark.offsetHeight * 0.18);

    let tl: gsap.core.Timeline;
    const ctx = gsap.context(() => {
      // Paused until the first frame is on screen (see below), so a heavy first render
      // can't swallow the opening beat of a sequence this short.
      tl = gsap.timeline({ paused: true, onComplete: () => setGone(true) });
      const stars = gsap.utils.toArray<SVGElement>('[data-intro-star]');
      const fills = gsap.utils.toArray<SVGElement>('[data-intro-star-fill]');

      // Whole sequence lands on the hero at ~2s. Beats overlap so it stays punchy.
      // Beat 1 (0–0.7s): five empty stars snap in and fill one after another, left to right.
      tl.fromTo(stars, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(2.5)', stagger: 0.03 }, 0);
      fills.forEach((fill, i) => {
        const at = 0.18 + i * 0.1;
        tl.fromTo(fill, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.16, ease: 'back.out(3)' }, at)
          .fromTo(stars[i], { scale: 1.4 }, { scale: 1, duration: 0.26, ease: 'power3.out', immediateRender: false }, at);
      });
      const full = 0.72;
      // All five lit: a quick flash across the row as it drops under the incoming mark.
      tl.to(stars, { scale: 1.15, duration: 0.08, ease: 'power2.out', yoyo: true, repeat: 1, stagger: 0.015 }, full)
        .to('[data-intro-stars]', { y: starsDrop, scale: 0.62, duration: 0.4, ease: 'power3.out' }, full);

      // Beat 2 (0.72–1.35s): the mark punches into focus above the stars; one shine.
      tl.fromTo(
        '[data-intro-mark]',
        { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.5, ease: 'expo.out' },
        full,
      )
        .fromTo('[data-intro-glow]', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, full + 0.05)
        .fromTo('[data-logo-shine]', { x: 0 }, { x: SHINE_TRAVEL, duration: 0.5, ease: 'power2.inOut' }, full + 0.15)

        // Beat 3 (1.35–2s): hand-off to the hero.
        .addLabel('exit', 1.35)
        .to('[data-intro-stars]', { opacity: 0, y: () => starsDrop() + 16, duration: 0.2, ease: 'power2.in' }, 'exit')
        .add(() => {
          // Start the hero now so it builds up behind the dissolving background,
          // and hide its real mark until the flying logo lands on it.
          finish();
          path = flight();
          const t = target();
          if (t) gsap.set(t, { opacity: 0 });
        }, 'exit')
        .to('[data-intro-hint]', { opacity: 0, duration: 0.2 }, 'exit')
        .to('[data-intro-glow]', { opacity: 0, duration: 0.3 }, 'exit')
        .to('[data-intro-bg]', { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 'exit+=0.05')
        // Function values are read when this tween starts, i.e. after `path` is measured.
        .to(mark, { x: () => path.x, y: () => path.y, scale: () => path.scale, duration: 0.62, ease: 'power3.inOut' }, 'exit+=0.03')
        .add(() => {
          // Landed: swap to the hero's own mark (same size, same place).
          const t = target();
          if (t) gsap.set(t, { opacity: 1 });
          gsap.set(mark, { opacity: 0 });
          unlock();
        });
    }, el);

    // Two rAFs: the first fires before the first paint, the second after it.
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => tl.play());
    });

    const SCROLL_KEYS = new Set([' ', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End']);
    const skip = (e?: Event) => {
      // Skipping with Space/arrows must not also scroll the page.
      if (e instanceof KeyboardEvent && SCROLL_KEYS.has(e.key)) e.preventDefault();
      // Land just before the exit so the playhead crosses it and fires the hand-off
      // callback (seek() suppresses callbacks at the position it jumps to).
      if (tl.time() < tl.labels.exit) tl.seek(tl.labels.exit - 0.01);
      tl.play(); // in case the skip lands before the first frame started it

    };
    window.addEventListener('keydown', skip, { once: true });
    el.addEventListener('pointerdown', skip, { once: true });
    return () => {
      window.removeEventListener('keydown', skip);
      el.removeEventListener('pointerdown', skip);
      cancelAnimationFrame(raf);
      ctx.revert();
      unlock();
    };
  }, [play]);

  if (gone) return null;

  return (
    <div ref={ref} className="intro" aria-hidden="true">
      <div className="intro__bg" data-intro-bg />
      <div className="intro__glow" data-intro-glow />
      <div className="intro__mark" data-intro-mark>
        <LogoMark />
      </div>
      <IntroStars />

      {/* Visual only: the whole screen is the skip target (any key, click or tap). */}
      <p className="intro__hint" data-intro-hint>
        <span className="intro__hint--keys">
          Press <b>any key</b> to skip
        </span>
        <span className="intro__hint--touch">
          <b>Tap</b> anywhere to skip
        </span>
      </p>
    </div>
  );
}

/** Rounded five-point star, 24×24 box. */
const STAR = 'M12 2.6l2.85 5.78 6.38.93-4.62 4.5 1.09 6.35L12 17.16l-5.7 3 1.09-6.35-4.62-4.5 6.38-.93z';

/** Five stars that fill with the logo gradient, one after another. */
function IntroStars() {
  const id = useId().replace(/:/g, '');
  return (
    <div className="intro__stars" data-intro-stars>
      <svg width="0" height="0" className="intro__defs" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-star`} x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--logo-1)' }} />
            <stop offset="0.35" style={{ stopColor: 'var(--logo-2)' }} />
            <stop offset="0.7" style={{ stopColor: 'var(--logo-3)' }} />
            <stop offset="1" style={{ stopColor: 'var(--logo-4)' }} />
          </linearGradient>
        </defs>
      </svg>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} className="intro__star" viewBox="0 0 24 24" data-intro-star>
          <path className="intro__star-empty" d={STAR} />
          <path className="intro__star-fill" d={STAR} fill={`url(#${id}-star)`} data-intro-star-fill />
        </svg>
      ))}
    </div>
  );
}

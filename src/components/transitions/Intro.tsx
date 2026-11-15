import { useLayoutEffect, useRef, useState } from 'react';
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
 * Loading screen, on every visit: a plain background, the CS mark comes into focus,
 * a shine sweeps across it, then the mark flies to the hero's CS mark while the
 * background dissolves into the hero (a shared-element hand-off).
 * Any key, click or tap skips to the exit.
 *
 * onDone(handoff): handoff is true when the logo flies into the hero mark.
 */
export function Intro({ onDone }: { onDone: (handoff: boolean) => void }) {
  const [play] = useState(shouldPlay);
  const [gone, setGone] = useState(!play);
  const ref = useRef<HTMLDivElement>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  // Layout effect: initial states are set before first paint, and ctx.revert()
  // fully resets them under StrictMode.
  useLayoutEffect(() => {
    if (!play) {
      doneRef.current(false);
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
    const unlock = () => lockScroll('intro', false);

    let tl: gsap.core.Timeline;
    const ctx = gsap.context(() => {
      tl = gsap.timeline({ onComplete: () => setGone(true) });
      tl.fromTo(
        '[data-intro-mark]',
        { opacity: 0, scale: 0.86, filter: 'blur(12px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.0, ease: 'expo.out' },
        0.2,
      )
        .fromTo('[data-intro-glow]', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out' }, 0.5)
        // The shine: one clean sweep across the letters.
        .fromTo('[data-logo-shine]', { x: 0 }, { x: SHINE_TRAVEL, duration: 1.1, ease: 'power2.inOut' }, 0.95)
        .to('[data-intro-mark]', { scale: 1.03, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 1.2)

        .addLabel('exit', 2.6)
        .add(() => {
          // Start the hero now so it builds up behind the dissolving background,
          // and hide its real mark until the flying logo lands on it.
          finish();
          path = flight();
          const t = target();
          if (t) gsap.set(t, { opacity: 0 });
        }, 'exit')
        .to('[data-intro-hint]', { opacity: 0, duration: 0.3 }, 'exit')
        .to('[data-intro-glow]', { opacity: 0, duration: 0.5 }, 'exit')
        .to('[data-intro-bg]', { opacity: 0, duration: 1.0, ease: 'power2.inOut' }, 'exit+=0.15')
        // Function values are read when this tween starts, i.e. after `path` is measured.
        .to(mark, { x: () => path.x, y: () => path.y, scale: () => path.scale, duration: 1.15, ease: 'power3.inOut' }, 'exit+=0.05')
        .add(() => {
          // Landed: swap to the hero's own mark (same size, same place).
          const t = target();
          if (t) gsap.set(t, { opacity: 1 });
          gsap.set(mark, { opacity: 0 });
          unlock();
        });
    }, el);

    const SCROLL_KEYS = new Set([' ', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End']);
    const skip = (e?: Event) => {
      // Skipping with Space/arrows must not also scroll the page.
      if (e instanceof KeyboardEvent && SCROLL_KEYS.has(e.key)) e.preventDefault();
      // Land just before the exit so the playhead crosses it and fires the hand-off
      // callback (seek() suppresses callbacks at the position it jumps to).
      if (tl.time() < tl.labels.exit) tl.seek(tl.labels.exit - 0.01);
    };
    window.addEventListener('keydown', skip, { once: true });
    el.addEventListener('pointerdown', skip, { once: true });
    return () => {
      window.removeEventListener('keydown', skip);
      el.removeEventListener('pointerdown', skip);
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
      <p className="intro__hint" data-intro-hint>
        Press any key to skip
      </p>
    </div>
  );
}

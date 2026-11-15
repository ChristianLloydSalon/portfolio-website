import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';
import { prefersReducedMotion } from '@/hooks/useReducedMotion';

let lenis: Lenis | null = null;
let tick: ((time: number) => void) | null = null;

/**
 * Scroll lock holders. The page stays locked while ANY holder is present, so one
 * component releasing its lock (e.g. a closed menu mounting) can't unlock another's.
 */
export type ScrollLockOwner = 'intro' | 'menu' | 'project';
const lockOwners = new Set<ScrollLockOwner>();

function applyLock() {
  const locked = lockOwners.size > 0;
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}

/** Starts Lenis smooth scrolling synced with GSAP's ticker. No-op under reduced motion. */
export function startSmoothScroll() {
  if (lenis || prefersReducedMotion()) return;
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    // Native touch scrolling feels better on phones.
    syncTouch: false,
  });
  lenis.on('scroll', ScrollTrigger.update);
  // Respect locks taken before smooth scrolling started (e.g. the loading screen).
  if (lockOwners.size) lenis.stop();
  tick = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
}

export function stopSmoothScroll() {
  if (tick) gsap.ticker.remove(tick);
  lenis?.destroy();
  lenis = null;
  tick = null;
}

/** Takes (locked = true) or releases this owner's hold on page scrolling. */
export function lockScroll(owner: ScrollLockOwner, locked: boolean) {
  if (locked) lockOwners.add(owner);
  else lockOwners.delete(owner);
  applyLock();
}

/** Smoothly scrolls to a section id and moves focus there for keyboard and screen-reader users. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const focus = () => {
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  };
  // Pinned sections sit inside a ScrollTrigger pin-spacer; after the pin ends the
  // element itself is offset to the end of the pinned range, so measure the spacer.
  const anchor = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el;
  const top = id === 'home' ? 0 : Math.max(0, anchor.getBoundingClientRect().top + window.scrollY);
  if (lenis) {
    lenis.scrollTo(top, { duration: id === 'home' ? 1.8 : 1.4, onComplete: focus });
  } else {
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    focus();
  }
  history.replaceState(null, '', id === 'home' ? location.pathname : `#${id}`);
}

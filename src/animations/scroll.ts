import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';
import { prefersReducedMotion } from '@/hooks/useReducedMotion';

let lenis: Lenis | null = null;
let tick: ((time: number) => void) | null = null;

/**
 * Scroll lock holders. The page stays locked while ANY holder is present, so one
 * component releasing its lock (e.g. a closed menu mounting) can't unlock another's.
 */
export type ScrollLockOwner = 'intro' | 'menu' | 'project' | 'radio';
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

/** URL for a section: the hero is the bare path, others are #id. Query string is kept. */
function sectionUrl(id: string) {
  return id === 'home' ? location.pathname + location.search : `${location.pathname}${location.search}#${id}`;
}

/**
 * Mirrors the visible section in the address bar. Uses replaceState: no new history
 * entry per section (Back still leaves the site) and no jump (unlike setting location.hash).
 */
export function syncUrlToSection(id: string) {
  const url = sectionUrl(id);
  if (url !== location.pathname + location.search + location.hash) history.replaceState(history.state, '', url);
}

// True while a link-triggered scroll is gliding to its target. Sections passed on the
// way must not rewrite the URL, which already points at the destination.
let programmatic = false;
let programmaticTimer = 0;
export function isProgrammaticScroll() {
  return programmatic;
}
function setProgrammatic(on: boolean, maxMs = 0) {
  window.clearTimeout(programmaticTimer);
  programmatic = on;
  // Safety net in case a scroll is interrupted and never reports completion.
  if (on && maxMs) programmaticTimer = window.setTimeout(() => (programmatic = false), maxMs);
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
  syncUrlToSection(id);
  if (lenis) {
    const duration = id === 'home' ? 1.8 : 1.4;
    setProgrammatic(true, duration * 1000 + 600);
    lenis.scrollTo(top, {
      duration,
      onComplete: () => {
        setProgrammatic(false);
        focus();
      },
    });
  } else {
    const instant = prefersReducedMotion();
    setProgrammatic(true, instant ? 150 : 1200);
    window.scrollTo({ top, behavior: instant ? 'auto' : 'smooth' });
    focus();
  }
}

import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';
import { prefersReducedMotion } from '@/hooks/useReducedMotion';
import { isProjectPath, sectionPath } from '@/app/routes';

let lenis: Lenis | null = null;
let tick: ((time: number) => void) | null = null;

/**
 * Scroll lock holders. The page stays locked while ANY holder is present, so one
 * component releasing its lock (e.g. a closed menu mounting) can't unlock another's.
 */
export type ScrollLockOwner = 'intro' | 'menu' | 'project' | 'radio' | 'phone';
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

/** URL for a section: the hero is the bare path, others are /id. Query string is kept. */
function sectionUrl(id: string) {
  return sectionPath(id) + location.search;
}

/**
 * Mirrors the visible section in the address bar. Uses replaceState: no new history
 * entry per section (Back still leaves the site). A project route stays put: the
 * overlay owns the URL while it is open.
 */
export function syncUrlToSection(id: string) {
  if (isProjectPath(location.pathname)) return;
  const url = sectionUrl(id);
  if (url !== location.pathname + location.search + location.hash) history.replaceState(history.state, '', url);
}

/** Document offset of a section. Pinned sections are measured by their pin-spacer. */
function sectionTop(el: HTMLElement, id: string) {
  // After the pin ends the element itself is offset to the end of the pinned range.
  const anchor = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el;
  return id === 'home' ? 0 : Math.max(0, anchor.getBoundingClientRect().top + window.scrollY);
}

/** Jumps to a section without animating (e.g. under a deep-linked project overlay). */
export function jumpToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = sectionTop(el, id);
  if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
  else window.scrollTo({ top, behavior: 'auto' });
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
  const top = sectionTop(el, id);
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

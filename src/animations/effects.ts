import { gsap } from './gsap';

/**
 * Magnetic hover: the element drifts toward the pointer. Only for fine pointers
 * and when motion is allowed. Returns a cleanup function.
 */
export function magnetic(el: HTMLElement, strength = 0.28) {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduced) return () => {};

  const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });

  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    xTo((e.clientX - (r.left + r.width / 2)) * strength);
    yTo((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    xTo(0);
    yTo(0);
  };
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerleave', leave);
  return () => {
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerleave', leave);
    gsap.set(el, { x: 0, y: 0 });
  };
}

/** Splits text content into word spans for scroll-driven reveals. */
export function splitWords(text: string) {
  return text.split(/(\s+)/).filter(Boolean);
}

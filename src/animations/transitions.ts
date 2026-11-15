import { gsap, ScrollTrigger } from './gsap';

/**
 * Fades up every [data-reveal] element inside `scope` as it enters the viewport.
 * Call inside a gsap.context (useGsap) so it is reverted on unmount.
 */
export function revealOnScroll(scope: HTMLElement, selector = '[data-reveal]') {
  const items = scope.querySelectorAll<HTMLElement>(selector);
  if (!items.length) return;
  gsap.set(items, { y: 48, opacity: 0 });
  ScrollTrigger.batch(items, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { y: 0, opacity: 1, duration: 1.1, stagger: 0.08, ease: 'expo.out', overwrite: true }),
  });
}

/** Clip-path wipe reveal for imagery. */
export function wipeOnScroll(scope: HTMLElement, selector = '[data-wipe]') {
  scope.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: 'inset(18% 12% 18% 12% round 2rem)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 1.75rem)',
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 35%', scrub: 0.6 },
      },
    );
  });
}

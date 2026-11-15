import { useRef } from 'react';
import type { ThemeName } from '@/types';
import { FIGURE_HEAD_R, FIGURE_HEAD_Y, FIGURE_PATH } from '@/components/scene/geometry';
import { useTheme } from '@/features/theme/useTheme';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/animations/gsap';
import { asset } from '@/lib/assets';
import { profile } from '@/data/profile';

/**
 * Character portrait. Uses src/assets/portraits/portrait.(webp|png|jpg) when present
 * (theme variants supported), otherwise a stylized silhouette card.
 */
export function PortraitCard() {
  const ref = useRef<HTMLElement>(null);
  const { theme } = useTheme();
  const reduced = useReducedMotion();
  // Both theme versions are mounted and crossfaded by CSS (like the hero), so a theme
  // switch never waits on a download. A missing variant borrows the other.
  const photoFor = (t: ThemeName) => asset('portraits/portrait', t);
  const photos = { sunrise: photoFor('sunrise') ?? photoFor('dusk'), dusk: photoFor('dusk') ?? photoFor('sunrise') };
  const photo = photos[theme];
  const paired = !!photos.sunrise && !!photos.dusk && photos.sunrise !== photos.dusk;
  const alt = `Illustrated portrait of ${profile.name} at a laptop in ${profile.location}, with the Chocolate Hills, a tarsier and a river cruise behind him`;

  useGsap(
    () => {
      if (reduced) return;
      gsap.fromTo(
        ref.current,
        { clipPath: 'inset(12% 10% 12% 10% round 2rem)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 1.75rem)',
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top 92%', end: 'top 40%', scrub: 0.6 },
        },
      );
      gsap.fromTo(
        '[data-portrait-art]',
        { scale: photo ? 1.08 : 1.2, yPercent: photo ? -3 : -6 },
        { scale: 1, yPercent: photo ? 3 : 6, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    },
    ref,
    [reduced, photo],
  );

  return (
    <figure ref={ref} className={`portrait ${photo ? 'portrait--photo' : ''}`}>
      <div className="portrait__art" data-portrait-art>
        {paired ? (
          (['sunrise', 'dusk'] as const).map((t) => (
            <img
              key={t}
              className={`portrait__img portrait__img--${t}`}
              src={photos[t]}
              // Only the visible version is announced to screen readers.
              alt={t === theme ? alt : ''}
              aria-hidden={t === theme ? undefined : true}
              loading="lazy"
              decoding="async"
            />
          ))
        ) : photo ? (
          <img src={photo} alt={alt} loading="lazy" decoding="async" />
        ) : (
          <svg viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Stylized silhouette of the developer at golden hour">
            <defs>
              <linearGradient id="portrait-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" style={{ stopColor: 'var(--sky-1)' }} />
                <stop offset="0.55" style={{ stopColor: 'var(--sky-2)' }} />
                <stop offset="1" style={{ stopColor: 'var(--sky-3)' }} />
              </linearGradient>
              <linearGradient id="portrait-sun" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" style={{ stopColor: 'var(--sun-1)' }} />
                <stop offset="1" style={{ stopColor: 'var(--sun-2)' }} />
              </linearGradient>
            </defs>
            <rect width="400" height="520" fill="url(#portrait-sky)" />
            <circle cx="200" cy="235" r="150" fill="url(#portrait-sun)" opacity="0.95" />
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x="0" y={280 + i * 22} width="400" height={3 + i * 2} style={{ fill: 'var(--sky-2)' }} />
            ))}
            <rect y="410" width="400" height="110" style={{ fill: 'var(--water-2)' }} />
            <g transform="translate(200 500) scale(1.18)">
              <ellipse cx="0" cy="2" rx="60" ry="6" style={{ fill: 'var(--fg)', opacity: 0.5 }} />
              <circle cx="0" cy={FIGURE_HEAD_Y} r={FIGURE_HEAD_R} style={{ fill: 'var(--fg)' }} />
              <path d={FIGURE_PATH} style={{ fill: 'var(--fg)' }} />
            </g>
          </svg>
        )}
      </div>
      <figcaption className="portrait__caption">
        <span className="display portrait__name">{profile.firstName}</span>
        <span className="eyebrow">{profile.role}</span>
      </figcaption>
      <span className="portrait__badge eyebrow" aria-hidden="true">
        Lv. ∞
      </span>
    </figure>
  );
}

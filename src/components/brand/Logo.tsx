import { useId } from 'react';
import { profile } from '@/data/profile';
import { LOGO_H, LOGO_INK, LOGO_SILHOUETTE, LOGO_W } from './logoPaths';
import './Logo.css';

interface MarkProps {
  className?: string;
  /** Accessible name. Omit when the mark is decorative (e.g. next to visible text). */
  title?: string;
}

/**
 * CS monogram. Gradient body + dark outline, both theme-aware.
 * Contains a shine band ([data-logo-shine]) clipped to the letters; animate its `x`
 * from 0 to SHINE_TRAVEL (user units) to sweep a highlight across the mark.
 */
export function LogoMark({ className = '', title }: MarkProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      className={`logo-mark ${className}`}
      viewBox={`0 0 ${LOGO_W} ${LOGO_H}`}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0.18" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--logo-1)' }} />
          <stop offset="0.3" style={{ stopColor: 'var(--logo-2)' }} />
          <stop offset="0.55" style={{ stopColor: 'var(--logo-3)' }} />
          <stop offset="0.8" style={{ stopColor: 'var(--logo-4)' }} />
          <stop offset="1" style={{ stopColor: 'var(--logo-5)' }} />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path d={LOGO_SILHOUETTE} clipRule="evenodd" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <rect width={LOGO_W} height={LOGO_H} fill={`url(#${id}-fill)`} />
        {/* Shine band: starts fully off the left edge. */}
        <g data-logo-shine>
          <rect
            x={-LOGO_W * 0.55}
            y={-LOGO_H * 0.25}
            width={LOGO_W * 0.4}
            height={LOGO_H * 1.5}
            fill={`url(#${id}-shine)`}
            transform={`skewX(-20)`}
          />
        </g>
      </g>
      {/* The stroke on the outline hides the anti-aliasing seam between the two layers. */}
      <path className="logo-mark__ink" d={LOGO_INK} fillRule="evenodd" />
    </svg>
  );
}

/** Distance (viewBox units) the shine band travels to cross the whole mark. */
export const SHINE_TRAVEL = LOGO_W * 1.9;

/** Navigation / footer lockup: mark + name. */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`logo ${className}`}>
      <LogoMark className="logo__mark" />
      <span className="logo__name">{profile.name}</span>
    </span>
  );
}

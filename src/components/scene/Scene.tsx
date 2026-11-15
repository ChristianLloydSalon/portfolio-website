import { memo, useMemo } from 'react';
import { FIGURE_HEAD_R, FIGURE_HEAD_Y, FIGURE_PATH, HORIZON, VB_H, VB_W, makePalm, makeSkyline, makeStars, ridgePath } from './geometry';
import type { ThemeName } from '@/types';
import './Scene.css';

interface Props {
  /** `hero`: full composition. `horizon`: sky, sun and sea only (closing section). */
  variant?: 'hero' | 'horizon';
  /** Narrow screens get a recomposed foreground so the palms and figure stay in frame. */
  compact?: boolean;
  /** Replace the procedural backdrop with supplied artwork (one image per theme; may be the same URL). */
  backdrop?: Record<ThemeName, string>;
  /** Replace the procedural figure with a supplied character cut-out (transparent PNG/WebP). */
  characterUrl?: string;
  /** Supplied palm silhouettes, used as shape masks and filled with the theme colour. */
  palmMasks?: { left?: string; right?: string };
  idPrefix?: string;
}

const viewBox = `0 0 ${VB_W} ${VB_H}`;

function SceneImpl({ variant = 'hero', compact = false, backdrop, characterUrl, palmMasks, idPrefix = 'scene' }: Props) {
  const stars = useMemo(() => makeStars(), []);
  const skyline = useMemo(() => makeSkyline(), []);
  const ridge = useMemo(() => ridgePath(), []);
  const palms = useMemo(() => {
    const spec: [number, number, number, number, number, number][] = compact
      ? [
          [585, 1010, 470, 60, 11, 0.85],
          [1035, 1010, 520, -70, 12, 0.9],
          [1065, 1010, 360, -20, 13, 0.7],
        ]
      : [
          [150, 1010, 600, 120, 11, 1.1],
          [300, 1010, 430, 70, 14, 0.85],
          [1420, 1010, 640, -150, 12, 1.15],
          [1540, 1010, 470, -60, 13, 0.9],
          [1290, 1010, 300, -40, 15, 0.65],
        ];
    return spec.map(([x, y, h, lean, seed, s]) => makePalm(x, y, h, lean, seed, s));
  }, [compact]);

  const id = (s: string) => `${idPrefix}-${s}`;
  const figureX = compact ? 985 : 1130;
  const figureScale = compact ? 0.62 : 1.05;

  return (
    <div className={`scene scene--${variant}`} aria-hidden="true">
      {backdrop ? (
        <div className="scene__layer" data-layer="sky">
          {backdrop.sunrise === backdrop.dusk ? (
            <img className="scene__img" src={backdrop.sunrise} alt="" decoding="async" {...{ fetchpriority: 'high' }} />
          ) : (
            (['sunrise', 'dusk'] as const).map((t) => (
              <img
                key={t}
                className={`scene__img scene__img--${t}`}
                src={backdrop[t]}
                alt=""
                decoding="async"
                {...{ fetchpriority: 'high' }}
              />
            ))
          )}
        </div>
      ) : (
        <>
          {/* Sky, sun, moon, stars */}
          <div className="scene__layer" data-layer="sky">
            <svg viewBox={viewBox} preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id={id('sky')} x1="0" y1="0" x2="0" y2={HORIZON} gradientUnits="userSpaceOnUse">
                  <stop offset="0" style={{ stopColor: 'var(--sky-1)' }} />
                  <stop offset="0.48" style={{ stopColor: 'var(--sky-2)' }} />
                  <stop offset="0.82" style={{ stopColor: 'var(--sky-3)' }} />
                  <stop offset="1" style={{ stopColor: 'var(--horizon)' }} />
                </linearGradient>
                <linearGradient id={id('sun')} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" style={{ stopColor: 'var(--sun-1)' }} />
                  <stop offset="0.55" style={{ stopColor: 'var(--accent-2)' }} />
                  <stop offset="1" style={{ stopColor: 'var(--sun-2)' }} />
                </linearGradient>
                <radialGradient id={id('glow')}>
                  <stop offset="0" style={{ stopColor: 'var(--horizon)', stopOpacity: 0.85 }} />
                  <stop offset="1" style={{ stopColor: 'var(--horizon)', stopOpacity: 0 }} />
                </radialGradient>
                <radialGradient id={id('moonglow')}>
                  <stop offset="0" style={{ stopColor: 'var(--sun-2)', stopOpacity: 0.55 }} />
                  <stop offset="1" style={{ stopColor: 'var(--sun-2)', stopOpacity: 0 }} />
                </radialGradient>
                {/* Retro sun: horizontal cuts that thicken toward the horizon */}
                <mask id={id('sunmask')}>
                  <rect x="0" y="0" width={VB_W} height={VB_H} fill="#fff" />
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <rect key={i} x="0" y={498 + i * 20 + i * i * 1.2} width={VB_W} height={2 + i * 2.2} fill="#000" />
                  ))}
                </mask>
              </defs>
              <rect width={VB_W} height={HORIZON + 4} fill={`url(#${id('sky')})`} />
              <g className="scene__stars">
                {stars.map((s, i) => (
                  <circle
                    key={i}
                    cx={s.x}
                    cy={s.y}
                    r={s.r}
                    className={s.twinkle ? 'twinkle' : undefined}
                    style={s.twinkle ? { animationDelay: `${s.delay}s` } : undefined}
                  />
                ))}
              </g>
              <g className="scene__sun">
                <circle cx="800" cy="560" r="420" fill={`url(#${id('glow')})`} />
                <circle cx="800" cy="545" r="215" fill={`url(#${id('sun')})`} mask={`url(#${id('sunmask')})`} />
              </g>
              <g className="scene__moon">
                <circle cx="1150" cy="210" r="190" fill={`url(#${id('moonglow')})`} />
                <circle cx="1150" cy="210" r="62" style={{ fill: 'var(--sun-1)' }} />
                <circle cx="1128" cy="198" r="10" style={{ fill: 'var(--sun-2)', opacity: 0.35 }} />
                <circle cx="1166" cy="230" r="7" style={{ fill: 'var(--sun-2)', opacity: 0.3 }} />
              </g>
              <g className="scene__clouds">
                <rect x="140" y="300" width="520" height="10" rx="5" />
                <rect x="260" y="322" width="300" height="7" rx="3.5" />
                <rect x="980" y="380" width="470" height="9" rx="4.5" />
                <rect x="1060" y="400" width="250" height="6" rx="3" />
                <rect x="60" y="455" width="380" height="6" rx="3" />
                <rect x="1180" y="470" width="360" height="5" rx="2.5" />
              </g>
            </svg>
          </div>

          {/* Distant hills */}
          <div className="scene__layer" data-layer="far">
            <svg viewBox={viewBox} preserveAspectRatio="xMidYMid slice">
              <path d={ridge} style={{ fill: 'var(--far)' }} />
            </svg>
          </div>

          {/* Skyline */}
          {variant === 'hero' && (
            <div className="scene__layer" data-layer="city">
              <svg viewBox={viewBox} preserveAspectRatio="xMidYMid slice">
                <g style={{ fill: 'var(--mid)' }}>
                  {skyline.map((b, i) => (
                    <g key={i}>
                      <rect x={b.x} y={HORIZON - b.h} width={b.w} height={b.h + 4} />
                      {b.antenna && <rect x={b.x + b.w / 2 - 1.5} y={HORIZON - b.h - 34} width="3" height="34" />}
                    </g>
                  ))}
                </g>
                <g className="scene__lights">
                  {skyline.flatMap((b, i) =>
                    b.windows.map((w, j) => <rect key={`${i}-${j}`} x={w.x} y={w.y} width="4" height="5" />),
                  )}
                </g>
              </svg>
            </div>
          )}

          {/* Ocean with sun / moon reflections */}
          <div className="scene__layer" data-layer="water">
            <svg viewBox={viewBox} preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id={id('water')} x1="0" y1={HORIZON} x2="0" y2={VB_H} gradientUnits="userSpaceOnUse">
                  <stop offset="0" style={{ stopColor: 'var(--water-1)' }} />
                  <stop offset="1" style={{ stopColor: 'var(--water-2)' }} />
                </linearGradient>
              </defs>
              <rect y={HORIZON} width={VB_W} height={VB_H - HORIZON} fill={`url(#${id('water')})`} />
              <g className="scene__reflect scene__reflect--sun">
                {Array.from({ length: 11 }, (_, i) => {
                  const w = 380 - i * 30 + (i % 2) * 40;
                  return <rect key={i} x={800 - w / 2} y={HORIZON + 8 + i * 22} width={w} height={3 + i * 0.6} rx="2" />;
                })}
              </g>
              <g className="scene__reflect scene__reflect--moon">
                {Array.from({ length: 9 }, (_, i) => {
                  const w = 110 - i * 9 + (i % 2) * 24;
                  return <rect key={i} x={1150 - w / 2} y={HORIZON + 10 + i * 24} width={w} height={2 + i * 0.4} rx="1" />;
                })}
              </g>
              {variant === 'hero' && (
              <g className="scene__reflect scene__reflect--city">
                {[880, 960, 1040, 1110, 1200, 1290].map((x, i) => (
                  <rect key={x} x={x} y={HORIZON + 6 + (i % 3) * 7} width="5" height={60 + (i % 3) * 30} rx="2" />
                ))}
              </g>
              )}
            </svg>
          </div>
        </>
      )}

      {variant === 'hero' && (
        <>
          {/* Supplied palm silhouettes: shape from the image, colour from the theme
              (so a theme switch recolours them with no crossfade ghosting). */}
          {(palmMasks?.left || palmMasks?.right) && (
            <div className="scene__layer" data-layer="palms">
              {(['left', 'right'] as const).map((side) =>
                palmMasks[side] ? (
                  <span
                    key={side}
                    className={`scene__palm scene__palm--${side}`}
                    style={{ WebkitMaskImage: `url(${palmMasks[side]})`, maskImage: `url(${palmMasks[side]})` }}
                  />
                ) : null,
              )}
            </div>
          )}

          {/* Drawn palms and shoreline: only for the fully procedural scene */}
          {!backdrop && !palmMasks?.left && !palmMasks?.right && (
          <div className="scene__layer" data-layer="palms">
            <svg viewBox={viewBox} preserveAspectRatio="xMidYMid slice">
              <g style={{ fill: 'var(--fg)', stroke: 'var(--fg)' }}>
                <path
                  d="M0 1000 L0 905 C220 880 420 920 640 948 C880 978 1140 930 1360 905 C1460 895 1540 900 1600 890 L1600 1000 Z"
                  stroke="none"
                />
                {palms.map((p, i) => (
                  <g key={i}>
                    <path d={p.trunk} stroke="none" />
                    {p.fronds.map((f, j) => (
                      <path key={j} d={f} fill="none" strokeWidth="5" strokeLinecap="round" />
                    ))}
                    <path d={p.leaflets} fill="none" strokeWidth="3.2" strokeLinecap="round" />
                    {p.coconuts.map((c, k) => (
                      <circle key={k} cx={c.x} cy={c.y} r="7" stroke="none" />
                    ))}
                  </g>
                ))}
              </g>
            </svg>
          </div>
          )}

          {/* Character */}
          <div className="scene__layer" data-layer="figure">
            {characterUrl ? (
              <img className="scene__character" src={characterUrl} alt="" decoding="async" />
            ) : (
              <svg viewBox={viewBox} preserveAspectRatio="xMidYMid slice">
                <g transform={`translate(${figureX} 952) scale(${figureScale})`}>
                  <ellipse cx="0" cy="2" rx="48" ry="5" style={{ fill: 'var(--fg)', opacity: 0.6 }} />
                  <circle cx="0" cy={FIGURE_HEAD_Y} r={FIGURE_HEAD_R} style={{ fill: 'var(--fg)' }} />
                  <path d={FIGURE_PATH} style={{ fill: 'var(--fg)' }} />
                  {/* Rim light from the sky */}
                  <path d={FIGURE_PATH} className="scene__rim" />
                  <circle cx="0" cy={FIGURE_HEAD_Y} r={FIGURE_HEAD_R} className="scene__rim" />
                </g>
              </svg>
            )}
          </div>
        </>
      )}

      <div className="scene__tint" />
    </div>
  );
}

export const Scene = memo(SceneImpl);

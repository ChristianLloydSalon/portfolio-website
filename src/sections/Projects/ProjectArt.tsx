import { memo } from 'react';
import type { Project, ThemeName } from '@/types';
import { asset } from '@/lib/assets';

interface Props {
  project: Project;
  theme: ThemeName;
  /** Eager-load when the art is above the fold (e.g. inside the open presentation). */
  priority?: boolean;
  className?: string;
}

/**
 * Project key art. A supplied image in src/assets/projects/<id>.* wins;
 * otherwise a procedural poster is drawn from the project's motif and palette.
 */
function ProjectArtImpl({ project, theme, priority = false, className = '' }: Props) {
  const src = asset(`projects/${project.id}`, theme);
  if (src) {
    return (
      <img
        className={`project-art ${className}`}
        src={src}
        alt={`${project.title} key art`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    );
  }
  const [a, b, c] = project.palette[theme];
  const gid = `${project.id}-${theme}`;
  return (
    <svg
      className={`project-art ${className}`}
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${project.title} key art`}
    >
      <defs>
        <linearGradient id={`${gid}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c} />
          <stop offset="0.6" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
        <radialGradient id={`${gid}-glow`} cx="0.7" cy="0.3" r="0.6">
          <stop offset="0" stopColor={b} stopOpacity="0.9" />
          <stop offset="1" stopColor={b} stopOpacity="0" />
        </radialGradient>
        <pattern id={`${gid}-grid`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#fff" strokeOpacity="0.07" />
        </pattern>
      </defs>
      <rect width="800" height="500" fill={`url(#${gid}-bg)`} />
      <rect width="800" height="500" fill={`url(#${gid}-glow)`} />
      <rect width="800" height="500" fill={`url(#${gid}-grid)`} />
      <Motif motif={project.motif} a={a} b={b} c={c} />
    </svg>
  );
}

function Motif({ motif, a, b, c }: { motif: Project['motif']; a: string; b: string; c: string }) {
  switch (motif) {
    case 'graph': {
      // Branching story graph
      const nodes: [number, number, number][] = [
        [120, 250, 22], [280, 160, 16], [280, 340, 16], [440, 110, 12], [440, 220, 12],
        [440, 330, 12], [440, 420, 12], [600, 160, 18], [600, 360, 18], [720, 260, 26],
      ];
      const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6], [3, 7], [4, 7], [5, 8], [6, 8], [7, 9], [8, 9]];
      return (
        <g>
          {edges.map(([f, t], i) => {
            const [x1, y1] = nodes[f];
            const [x2, y2] = nodes[t];
            const mx = (x1 + x2) / 2;
            return (
              <path key={i} d={`M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`} fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="2.5" strokeDasharray={i % 3 === 0 ? '6 6' : undefined} />
            );
          })}
          {nodes.map(([x, y, r], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={r * 2.2} fill={b} opacity="0.25" />
              <circle cx={x} cy={y} r={r} fill={i === 0 || i === 9 ? '#fff' : c} stroke="#fff" strokeWidth="3" />
            </g>
          ))}
          <text x="96" y="300" fill="#fff" fontFamily="JetBrains Mono, monospace" fontSize="13" letterSpacing="2">START</text>
          <text x="688" y="314" fill="#fff" fontFamily="JetBrains Mono, monospace" fontSize="13" letterSpacing="2">ENDING</text>
          <text x="250" y="130" fill="#fff" fillOpacity="0.8" fontFamily="JetBrains Mono, monospace" fontSize="12">choice: A</text>
          <text x="250" y="380" fill="#fff" fillOpacity="0.8" fontFamily="JetBrains Mono, monospace" fontSize="12">choice: B</text>
        </g>
      );
    }
    case 'spec': {
      // Noise in, structured spec out
      return (
        <g>
          <g transform="translate(70 90) rotate(-6)">
            <rect width="250" height="320" rx="14" fill="#fff" fillOpacity="0.16" stroke="#fff" strokeOpacity="0.4" />
            {Array.from({ length: 9 }, (_, i) => (
              <path key={i} d={`M24 ${40 + i * 30} q 40 ${i % 2 ? -10 : 10} 80 0 t 80 0 t ${40 + (i % 3) * 10} 0`} fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" />
            ))}
          </g>
          <path d="M350 250 H440" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          <path d="M425 232 L446 250 L425 268" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="395" cy="250" r="34" fill="none" stroke={b} strokeWidth="2" strokeDasharray="4 6" />
          <g transform="translate(480 70)">
            <rect width="260" height="360" rx="16" fill={c} fillOpacity="0.55" stroke="#fff" strokeOpacity="0.6" />
            <rect x="24" y="26" width="140" height="14" rx="7" fill="#fff" />
            {Array.from({ length: 6 }, (_, i) => (
              <g key={i} transform={`translate(24 ${70 + i * 46})`}>
                <rect width="20" height="20" rx="5" fill={i < 4 ? a : 'none'} stroke="#fff" strokeWidth="2" />
                {i < 4 && <path d="M5 10 l4 4 l7 -8" fill="none" stroke="#fff" strokeWidth="2.5" />}
                <rect x="34" y="3" width={150 - (i % 3) * 30} height="6" rx="3" fill="#fff" fillOpacity="0.85" />
                <rect x="34" y="14" width={100 - (i % 2) * 20} height="4" rx="2" fill="#fff" fillOpacity="0.45" />
              </g>
            ))}
          </g>
        </g>
      );
    }
    case 'retail': {
      return (
        <g>
          <g transform="translate(300 40)">
            <rect width="200" height="420" rx="30" fill={c} stroke="#fff" strokeWidth="4" />
            <rect x="70" y="14" width="60" height="8" rx="4" fill="#fff" fillOpacity="0.5" />
            <rect x="18" y="40" width="164" height="90" rx="14" fill={a} />
            <text x="32" y="74" fill="#fff" fontFamily="Anton, Impact, sans-serif" fontSize="26">SUMMER</text>
            <text x="32" y="108" fill="#fff" fontFamily="Anton, Impact, sans-serif" fontSize="26">EVENT</text>
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(18 ${146 + i * 62})`}>
                <rect width="164" height="50" rx="10" fill="#fff" fillOpacity="0.14" />
                <rect x="10" y="10" width="30" height="30" rx="8" fill={b} />
                <rect x="50" y="14" width={90 - i * 12} height="7" rx="3.5" fill="#fff" fillOpacity="0.85" />
                <rect x="50" y="28" width="60" height="5" rx="2.5" fill="#fff" fillOpacity="0.45" />
              </g>
            ))}
            <rect x="18" y="346" width="164" height="44" rx="22" fill="#fff" />
            <text x="100" y="374" textAnchor="middle" fill={c} fontFamily="JetBrains Mono, monospace" fontSize="13" fontWeight="600">CHECKOUT</text>
          </g>
          <g transform="translate(70 110) rotate(-8)">
            <rect width="190" height="140" rx="18" fill="#fff" fillOpacity="0.16" stroke="#fff" strokeOpacity="0.5" />
            {[60, 90, 40, 75].map((h, i) => (
              <rect key={i} x={24 + i * 38} y={110 - h} width="24" height={h} rx="5" fill={i === 1 ? '#fff' : b} />
            ))}
            <text x="24" y="132" fill="#fff" fontFamily="JetBrains Mono, monospace" fontSize="11">SURVEY</text>
          </g>
          <g transform="translate(560 250) rotate(7)">
            <rect width="180" height="120" rx="18" fill="#fff" fillOpacity="0.16" stroke="#fff" strokeOpacity="0.5" />
            <text x="22" y="50" fill="#fff" fontFamily="Anton, Impact, sans-serif" fontSize="34">₱ 12,480</text>
            <text x="22" y="82" fill="#fff" fillOpacity="0.8" fontFamily="JetBrains Mono, monospace" fontSize="11">ORDER CONFIRMED</text>
          </g>
        </g>
      );
    }
    case 'market': {
      // Social art marketplace: framed artworks, a live bid ticker and chat.
      const frames: [number, number, number, number, number][] = [
        [70, 90, 190, 240, -5],
        [300, 60, 210, 280, 0],
        [550, 100, 180, 230, 5],
      ];
      return (
        <g>
          {frames.map(([x, y, w, h, rot], i) => (
            <g key={i} transform={`rotate(${rot} ${x + w / 2} ${y + h / 2})`}>
              <rect x={x} y={y} width={w} height={h} rx="10" fill="#fff" fillOpacity="0.92" />
              <rect x={x + 12} y={y + 12} width={w - 24} height={h - 24} rx="6" fill={i === 1 ? a : c} />
              {/* abstract "AI art": sun, hills, swirl */}
              <circle cx={x + w * 0.62} cy={y + h * 0.36} r={w * 0.16} fill={b} />
              <path
                d={`M${x + 12} ${y + h - 12} Q${x + w * 0.3} ${y + h * 0.5} ${x + w * 0.55} ${y + h * 0.72} T${x + w - 12} ${y + h * 0.6} V${y + h - 12} Z`}
                fill={i === 1 ? c : a}
                opacity="0.9"
              />
            </g>
          ))}
          {/* live bid ticker */}
          <g transform="translate(330 360)">
            <rect width="230" height="62" rx="31" fill={c} stroke="#fff" strokeOpacity="0.7" strokeWidth="2" />
            <circle cx="30" cy="31" r="8" fill={b} />
            <circle cx="30" cy="31" r="14" fill="none" stroke={b} strokeOpacity="0.6" strokeWidth="2" />
            <text x="54" y="26" fill="#fff" fillOpacity="0.8" fontFamily="JetBrains Mono, monospace" fontSize="11" letterSpacing="2">LIVE BID</text>
            <text x="54" y="48" fill="#fff" fontFamily="Anton, Impact, sans-serif" fontSize="22">₱ 48,200</text>
          </g>
          {/* chat bubble */}
          <g transform="translate(600 360)">
            <path d="M0 14 Q0 0 14 0 H136 Q150 0 150 14 V46 Q150 60 136 60 H40 L22 76 L24 60 H14 Q0 60 0 46 Z" fill="#fff" fillOpacity="0.92" />
            <rect x="16" y="16" width="90" height="7" rx="3.5" fill={c} fillOpacity="0.8" />
            <rect x="16" y="32" width="112" height="6" rx="3" fill={c} fillOpacity="0.45" />
          </g>
        </g>
      );
    }
    case 'blade':
    default: {
      return (
        <g>
          <circle cx="560" cy="170" r="120" fill="#fff" fillOpacity="0.85" />
          <circle cx="560" cy="170" r="200" fill="#fff" fillOpacity="0.08" />
          {/* Boss silhouette */}
          <path
            d="M430 420 L450 260 C440 230 450 200 480 190 L470 140 L505 180 C520 172 540 170 555 176 L585 130 L585 185 C615 200 625 230 615 262 L640 420 Z"
            fill={c}
          />
          <circle cx="520" cy="215" r="5" fill={b} />
          <circle cx="552" cy="215" r="5" fill={b} />
          {/* Ground */}
          <path d="M0 420 C200 400 600 440 800 410 V500 H0 Z" fill={c} />
          {/* Hero and sword */}
          <g transform="translate(220 420)">
            <path d="M-12 0 L-8 -60 L-18 -100 C-18 -118 18 -118 18 -100 L8 -60 L12 0 Z" fill={c} />
            <circle cx="0" cy="-126" r="13" fill={c} />
            <path d="M14 -96 L120 -190" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
            <path d="M14 -96 L120 -190" stroke={b} strokeWidth="14" strokeLinecap="round" strokeOpacity="0.35" />
          </g>
          {Array.from({ length: 18 }, (_, i) => (
            <circle key={i} cx={(i * 97) % 800} cy={120 + ((i * 53) % 280)} r={1.5 + (i % 3)} fill={b} opacity="0.7" />
          ))}
        </g>
      );
    }
  }
}

export const ProjectArt = memo(ProjectArtImpl);

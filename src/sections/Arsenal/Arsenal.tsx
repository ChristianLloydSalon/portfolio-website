import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Boxes, Cloud, Database, FlaskConical, LayoutTemplate, Server, Smartphone, Workflow, Wrench, type LucideIcon } from 'lucide-react';
import { skillCategories } from '@/data/skills';
import type { SkillIcon, SkillTier } from '@/types';
import { SectionHeading } from '@/components/typography/SectionHeading';
import { chapter } from '@/data/navigation';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/animations/gsap';
import { revealOnScroll } from '@/animations/transitions';
import './Arsenal.css';

const ICONS: Record<SkillIcon, LucideIcon> = {
  smartphone: Smartphone,
  layout: LayoutTemplate,
  server: Server,
  cloud: Cloud,
  boxes: Boxes,
  database: Database,
  workflow: Workflow,
  flask: FlaskConical,
  wrench: Wrench,
};

/** label: shown in the legend. short: fits the badge on each skill. */
const TIER: Record<SkillTier, { label: string; short: string; rank: number; hint: string }> = {
  production: { label: 'Production experience', short: 'Production', rank: 3, hint: 'Shipped and supported real products with it' },
  working: { label: 'Working knowledge', short: 'Working', rank: 2, hint: 'Used on real projects, with less depth' },
  familiar: { label: 'Familiar', short: 'Familiar', rank: 1, hint: 'Learned and tried it' },
};

/** Legend lists only tiers that some skill actually uses. */
const TIERS_IN_USE = (['production', 'working', 'familiar'] as const).filter((t) =>
  skillCategories.some((c) => c.skills.some((s) => s.tier === t)),
);

const SIZE = 440;
const C = SIZE / 2;
const R = 206;
const r = 118;
const GAP = 2.2; // degrees between segments

function polar(radius: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [C + radius * Math.cos(a), C + radius * Math.sin(a)] as const;
}

function segmentPath(a0: number, a1: number) {
  const [x0, y0] = polar(R, a0);
  const [x1, y1] = polar(R, a1);
  const [x2, y2] = polar(r, a1);
  const [x3, y3] = polar(r, a0);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M${x0} ${y0} A${R} ${R} 0 ${large} 1 ${x1} ${y1} L${x2} ${y2} A${r} ${r} 0 ${large} 0 ${x3} ${y3} Z`;
}

/** Icons sit at the middle of the ring band (r..R). */
const ICON_RADIUS = (R + r) / 2;
const ICON_SIZE = 32;

export function Arsenal() {
  const ref = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(SVGGElement | null)[]>([]);
  const hoverTimer = useRef<number>();
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const n = skillCategories.length;
  const step = 360 / n;
  const cat = skillCategories[active];
  const ActiveIcon = ICONS[cat.icon];

  useGsap(
    () => {
      if (reduced) return;
      revealOnScroll(ref.current!);
      gsap.from('[data-wheel]', {
        rotate: -50,
        scale: 0.85,
        opacity: 0,
        duration: 1.6,
        ease: 'expo.out',
        scrollTrigger: { trigger: '[data-wheel]', start: 'top 80%', once: true },
      });
    },
    ref,
    [reduced],
  );

  // Loadout swap animation.
  useLayoutEffect(() => {
    if (reduced || !panelRef.current) return;
    const items = panelRef.current.querySelectorAll('.loadout.is-active [data-slot]');
    const tw = gsap.fromTo(items, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'expo.out' });
    return () => {
      tw.kill();
    };
  }, [active, reduced]);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  // Desktop: hovering a slice selects it. A short delay ignores slices the cursor
  // merely crosses. Touch never selects on hover; a tap goes through onClick.
  // Uses pointermove, not pointerenter: the selected slice pops out and the others
  // settle back, so a slice can slide under a *still* cursor. pointerenter would fire
  // then and steal the selection (or flicker between two slices on a boundary);
  // pointermove only fires when the user actually moves.
  const pendingRef = useRef<number | null>(null);
  const onSliceMove = (i: number) => (e: PointerEvent<SVGGElement>) => {
    if (e.pointerType === 'touch' || i === active || pendingRef.current === i) return;
    window.clearTimeout(hoverTimer.current);
    pendingRef.current = i;
    hoverTimer.current = window.setTimeout(() => {
      pendingRef.current = null;
      setActive(i);
    }, 60);
  };
  const onSliceLeave = () => {
    window.clearTimeout(hoverTimer.current);
    pendingRef.current = null;
  };

  const onKey = (e: KeyboardEvent<SVGGElement>) => {
    let next = active;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (active + 1) % n;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (active - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section ref={ref} id="arsenal" className="arsenal section-pad container-x" aria-labelledby="arsenal-title">
      <SectionHeading
        id="arsenal-title"
        chapter={chapter('arsenal')}
        kicker="Technical loadout"
        title={
          <>
            Technical <span className="text-accent-ink">arsenal</span>
          </>
        }
        intro="The tools behind the work above, grouped by discipline. Pick one from the wheel. Levels are honest: production experience means shipped and supported, not just tried."
      />

      <div className="arsenal__layout">
        <div className="wheel" data-wheel>
          <svg
            className="wheel__svg"
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            role="tablist"
            aria-label="Skill categories"
            aria-orientation="horizontal"
          >
            <circle cx={C} cy={C} r={R + 14} className="wheel__halo" aria-hidden="true" />
            {skillCategories.map((c, i) => {
              const Icon = ICONS[c.icon];
              const isActive = i === active;
              const [x, y] = polar(ICON_RADIUS, i * step);
              // Unit vector along the slice's bisector: the selected slice pops outward along it.
              const [ux, uy] = polar(1, i * step).map((v) => v - C);
              return (
                <g
                  key={c.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`tab-${c.id}`}
                  aria-selected={isActive}
                  aria-controls="arsenal-panel"
                  aria-label={c.name}
                  tabIndex={isActive ? 0 : -1}
                  className={`wheel__slice ${isActive ? 'is-active' : ''}`}
                  style={{ '--ux': ux, '--uy': uy } as React.CSSProperties}
                  onPointerMove={onSliceMove(i)}
                  onPointerLeave={onSliceLeave}
                  onClick={() => setActive(i)}
                  onKeyDown={onKey}
                >
                  <path className="wheel__seg" d={segmentPath(i * step + GAP / 2 - step / 2, (i + 1) * step - GAP / 2 - step / 2)} />
                  <g className="wheel__slice-content" aria-hidden="true">
                    <Icon x={x - ICON_SIZE / 2} y={y - ICON_SIZE / 2} width={ICON_SIZE} height={ICON_SIZE} strokeWidth={1.6} />
                  </g>
                </g>
              );
            })}
            <circle cx={C} cy={C} r={r - 12} className="wheel__core" aria-hidden="true" />
          </svg>

          <div className="wheel__center" aria-hidden="true">
            <ActiveIcon size={30} />
            <span className="display wheel__center-name">{cat.short}</span>
            <span className="eyebrow wheel__center-count">{String(cat.skills.length).padStart(2, '0')} items</span>
          </div>
        </div>

        {/* Every category is rendered in the same grid cell and only the selected one is
            shown, so the panel is always as tall as the tallest category. Switching never
            changes its height, so the wheel and the page below don't jump. */}
        <div
          ref={panelRef}
          id="arsenal-panel"
          role="tabpanel"
          aria-labelledby={`tab-${cat.id}`}
          className="loadout-stack"
        >
          {skillCategories.map((c, i) => {
            const isActive = i === active;
            // Hidden pages hold their space but can't be focused or read.
            const hidden = isActive ? {} : ({ 'aria-hidden': true, inert: '' } as Record<string, unknown>);
            return (
              <div key={c.id} className={`loadout ${isActive ? 'is-active' : ''}`} {...hidden}>
                <p className="eyebrow text-ink-2" data-slot>
                  Class {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
                </p>
                <h3 className="display loadout__title" data-slot>
                  {c.name}
                </h3>
                <p className="loadout__desc" data-slot>
                  {c.description}
                </p>
                <ul className="loadout__tiers" data-slot aria-label="Experience levels">
                  {TIERS_IN_USE.map((t) => (
                    <li key={t}>
                      <TierPips tier={t} />
                      <span>
                        <strong>{TIER[t].label}</strong>: {TIER[t].hint.toLowerCase()}
                      </span>
                    </li>
                  ))}
                </ul>
                <ul className="loadout__slots">
                  {[...c.skills].sort((x, y) => TIER[y.tier].rank - TIER[x.tier].rank).map((s) => (
                    <li key={s.name} className="slot" data-slot>
                      <span className="slot__mono display" aria-hidden="true">
                        {s.mono}
                      </span>
                      <span className="slot__text">
                        <span className="slot__name">{s.name}</span>
                        <span className="slot__note">{s.note}</span>
                      </span>
                      <span className={`slot__tier is-${s.tier}`}>
                        <TierPips tier={s.tier} />
                        <span className="slot__tier-label" aria-hidden="true">{TIER[s.tier].short}</span>
                        <span className="sr-only">{TIER[s.tier].label}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Rank pips: filled count = tier rank (3 production, 2 working, 1 familiar). Decorative; the label carries the meaning. */
function TierPips({ tier }: { tier: SkillTier }) {
  return (
    <span className="tier-pips" aria-hidden="true">
      {[1, 2, 3].map((n) => (
        <span key={n} className={n <= TIER[tier].rank ? 'is-on' : undefined} />
      ))}
    </span>
  );
}

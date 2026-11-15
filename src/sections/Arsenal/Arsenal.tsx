import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Boxes, Cloud, LayoutTemplate, Server, Smartphone, type LucideIcon } from 'lucide-react';
import { skillCategories } from '@/data/skills';
import type { SkillIcon } from '@/types';
import { SectionHeading } from '@/components/typography/SectionHeading';
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
};

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
    const items = panelRef.current.querySelectorAll('[data-slot]');
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
        chapter="Chapter 04"
        kicker="Technical loadout"
        title={
          <>
            Technical <span className="text-accent-ink">arsenal</span>
          </>
        }
        intro="Pick a discipline from the wheel to see the loadout. Every tool here has been used to ship real work."
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

        <div
          ref={panelRef}
          id="arsenal-panel"
          role="tabpanel"
          aria-labelledby={`tab-${cat.id}`}
          className="loadout"
        >
          <p className="eyebrow text-ink-2" data-slot>
            Class {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
          </p>
          <h3 className="display loadout__title" data-slot>
            {cat.name}
          </h3>
          <p className="loadout__desc" data-slot>
            {cat.description}
          </p>
          <ul className="loadout__slots">
            {cat.skills.map((s, i) => (
              <li key={s.name} className="slot" data-slot>
                <span className="slot__mono display" aria-hidden="true">
                  {s.mono}
                </span>
                <span className="slot__text">
                  <span className="slot__name">{s.name}</span>
                  <span className="slot__note">{s.note}</span>
                </span>
                <span className="slot__key eyebrow" aria-hidden="true">
                  {i + 1}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

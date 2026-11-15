import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, FlaskConical, GitPullRequest, Lock, Package, Sparkles, Wrench, type LucideIcon } from 'lucide-react';
import { INVENTORY_SLOTS, inventory } from '@/data/inventory';
import type { InventoryKind } from '@/types';
import { SectionHeading } from '@/components/typography/SectionHeading';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/animations/gsap';
import { revealOnScroll } from '@/animations/transitions';
import './OpenSource.css';

const KIND_ICON: Record<InventoryKind, LucideIcon> = {
  Package,
  Contribution: GitPullRequest,
  Tool: Wrench,
  Experiment: FlaskConical,
  'Side Project': Sparkles,
};

const KIND_TONE: Record<InventoryKind, string> = {
  Package: 'tone-a',
  Contribution: 'tone-b',
  Tool: 'tone-c',
  Experiment: 'tone-d',
  'Side Project': 'tone-e',
};

type Filter = 'All' | InventoryKind;

export function OpenSource() {
  const ref = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<Filter>('All');

  const kinds = useMemo(() => Array.from(new Set(inventory.map((i) => i.kind))), []);
  const filters: Filter[] = ['All', ...kinds];
  const items = filter === 'All' ? inventory : inventory.filter((i) => i.kind === filter);
  const locked = filter === 'All' ? Math.max(0, INVENTORY_SLOTS - inventory.length) : 0;

  useGsap(
    () => {
      if (reduced) return;
      revealOnScroll(ref.current!);
    },
    ref,
    [reduced],
  );

  const first = useRef(true);
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduced || !gridRef.current) return;
    const tiles = gridRef.current.querySelectorAll('[data-tile]');
    const tw = gsap.fromTo(tiles, { y: 30, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.04, ease: 'expo.out' });
    return () => {
      tw.kill();
    };
  }, [filter, reduced]);

  return (
    <section ref={ref} id="inventory" className="inventory section-pad container-x" aria-labelledby="inventory-title">
      <SectionHeading
        id="inventory-title"
        chapter="Chapter 05"
        kicker="Open source & side quests"
        title={
          <>
            The <span className="text-accent-ink">inventory</span>
          </>
        }
        intro="Packages, tools, contributions and experiments collected along the way. Some are polished, some are prototypes, all of them taught me something."
      />

      <div className="inventory__bar" data-reveal>
        <div className="inventory__filters" role="group" aria-label="Filter items by type">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              className={`inventory__filter ${filter === f ? 'is-active' : ''}`}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <p className="eyebrow text-ink-2" aria-live="polite">
          Items {String(items.length).padStart(2, '0')} / {String(INVENTORY_SLOTS).padStart(2, '0')}
        </p>
      </div>

      <ul ref={gridRef} className="inventory__grid" data-reveal>
        {items.map((item) => {
          const Icon = KIND_ICON[item.kind];
          const body = (
            <>
              <span className="tile__corners" aria-hidden="true" />
              <div className="tile__top">
                <span className={`tile__kind ${KIND_TONE[item.kind]}`}>
                  <Icon size={14} aria-hidden="true" /> {item.kind}
                </span>
                <span className="tile__status eyebrow">{item.status}</span>
              </div>
              <div className="tile__icon" aria-hidden="true">
                <Icon size={34} strokeWidth={1.5} />
              </div>
              <h3 className="tile__name">{item.name}</h3>
              <p className="tile__desc">{item.description}</p>
              <ul className="tile__stack" aria-label="Built with">
                {item.stack.map((s) => (
                  <li key={s} className="chip">
                    {s}
                  </li>
                ))}
              </ul>
              {item.href && <ArrowUpRight className="tile__link" size={20} aria-hidden="true" />}
            </>
          );
          return (
            <li key={item.id} className="tile" data-tile>
              {item.href ? (
                <a className="tile__inner" href={item.href} target="_blank" rel="noreferrer">
                  {body}
                </a>
              ) : (
                <div className="tile__inner">{body}</div>
              )}
            </li>
          );
        })}
        {Array.from({ length: locked }, (_, i) => (
          <li key={`locked-${i}`} className="tile tile--locked" data-tile>
            <div className="tile__inner">
              <Lock size={22} aria-hidden="true" />
              <p className="eyebrow">Locked slot</p>
              <p className="tile__desc">More loot incoming</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

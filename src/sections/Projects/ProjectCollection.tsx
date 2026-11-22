import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  FlaskConical,
  GitPullRequest,
  Hammer,
  Lock,
  LockOpen,
  Gamepad2,
  Package,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { INVENTORY_SLOTS, inventory } from '@/data/inventory';
import type { InventoryItem, InventoryKind } from '@/types';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/animations/gsap';
import { projectPath } from '@/app/routes';
import { openProject } from './openProject';
import './ProjectCollection.css';

const KIND_ICON: Record<InventoryKind, LucideIcon> = {
  Package,
  Contribution: GitPullRequest,
  Tool: Wrench,
  Experiment: FlaskConical,
  'Side Project': Gamepad2,
};

const KIND_TONE: Record<InventoryKind, string> = {
  Package: 'tone-a',
  Contribution: 'tone-b',
  Tool: 'tone-c',
  Experiment: 'tone-d',
  'Side Project': 'tone-e',
};

/** How far along an item is, shown as a game-style item state. */
type Tier = 'unlocked' | 'progress' | 'prototype' | 'completed';

const STATUS_TIER: Record<InventoryItem['status'], Tier> = {
  Published: 'unlocked',
  Live: 'unlocked',
  Active: 'progress',
  'In Development': 'progress',
  Prototype: 'prototype',
  Archived: 'completed',
};

const TIER_META: Record<Tier, { label: string; icon: LucideIcon }> = {
  unlocked: { label: 'Unlocked', icon: LockOpen },
  progress: { label: 'In progress', icon: Hammer },
  prototype: { label: 'Prototype', icon: FlaskConical },
  completed: { label: 'Completed', icon: CheckCircle2 },
};

type Filter = 'All' | InventoryKind;

/** Plain left clicks open the case study in-app; modified clicks follow the link. */
const isPlainClick = (e: React.MouseEvent) => !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0);

/**
 * Secondary collection inside the Projects section: smaller tools, packages and
 * experiments. Items with a case study open it; the rest link out.
 */
export function ProjectCollection() {
  const gridRef = useRef<HTMLUListElement>(null);
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<Filter>('All');

  const kinds = useMemo(() => Array.from(new Set(inventory.map((i) => i.kind))), []);
  const filters: Filter[] = ['All', ...kinds];
  const items = filter === 'All' ? inventory : inventory.filter((i) => i.kind === filter);
  const locked = filter === 'All' ? Math.max(0, INVENTORY_SLOTS - inventory.length) : 0;

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
    <section id="more-projects" className="inventory container-x" aria-labelledby="more-projects-title">
      <header className="inventory__head" data-reveal>
        <p className="eyebrow text-ink-2">Side quests</p>
        <h3 id="more-projects-title" className="display inventory__title">
          Additional projects <span className="text-accent-ink">&amp; experiments</span>
        </h3>
        <p className="inventory__intro text-ink-2">
          Smaller tools, packages and experiments. Some are published; some are still being built.
        </p>
      </header>

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
          const tier = STATUS_TIER[item.status];
          const { label: tierLabel, icon: TierIcon } = TIER_META[tier];
          const linked = !!(item.href || item.projectId);
          const body = (
            <>
              <span className="tile__corners" aria-hidden="true" />
              <div className="tile__top">
                <span className={`tile__kind ${KIND_TONE[item.kind]}`}>{item.kind}</span>
              </div>
              <div className="tile__meta">
                <div className="tile__icon" aria-hidden="true">
                  <Icon size={34} strokeWidth={1.5} />
                </div>
                <span className="tile__tier" title={tierLabel}>
                  <TierIcon size={14} aria-hidden="true" /> {item.status}
                </span>
              </div>
              <h4 className="tile__name">
                {item.name}
                {linked && <ArrowUpRight className="tile__link" size={18} aria-hidden="true" />}
              </h4>
              <p className="tile__desc">{item.description}</p>
              {item.projectId && <p className="tile__cta eyebrow">View project page</p>}
              <ul className="tile__stack" aria-label="Built with">
                {item.stack.map((s) => (
                  <li key={s} className="chip">
                    {s}
                  </li>
                ))}
              </ul>
            </>
          );
          return (
            <li key={item.id} className={`tile tile--${tier}`} data-tile>
              {item.projectId ? (
                <a
                  className="tile__inner"
                  href={projectPath(item.projectId)}
                  aria-haspopup="dialog"
                  onClick={(e) => {
                    if (!isPlainClick(e)) return;
                    e.preventDefault();
                    openProject(item.projectId!, e.currentTarget);
                  }}
                >
                  {body}
                </a>
              ) : item.href ? (
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
          <li key={`locked-${i}`} className="tile tile--locked" data-tile aria-hidden="true">
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

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Layers, PowerOff, Rocket, Sunset, type LucideIcon } from 'lucide-react';
import { gsap } from '@/animations/gsap';
import { lockScroll } from '@/animations/scroll';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { prefersReducedMotion } from '@/hooks/useReducedMotion';
import { radioStore, useRadio } from './radioStore';
import { stationById, type StationId } from './stations';
import { tune, turnOff } from './controller';
import './Radio.css';

/**
 * Lazy chunk (loaded on first use of the navbar radio): the station wheel,
 * and the Now Playing toast (shown on each station and track change).
 */

type SlotId = StationId | 'off';
interface Slot {
  id: SlotId;
  icon: LucideIcon;
  /** Direction on the wheel, degrees clockwise from 12 o'clock. */
  angle: number;
}
// Clockwise from the top. Off sits at the bottom, where a thumb or cursor rests.
const SLOTS: Slot[] = [
  { id: 'dusk', icon: Sunset, angle: 0 },
  { id: 'arch', icon: Layers, angle: 90 },
  { id: 'off', icon: PowerOff, angle: 180 },
  { id: 'deploy', icon: Rocket, angle: 270 },
];
const KEY_TO_SLOT: Record<string, number> = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 };

const label = (id: SlotId) => (id === 'off' ? { freq: 'OFF', name: 'Radio off', vibe: 'Silence is golden' } : stationById(id));

/** Donut wedge path for slot k of 4, centred on its angle. Units: viewBox 0..200. */
function wedge(angle: number) {
  const c = 100;
  const [r1, r2] = [44, 98];
  const span = 45 - 2; // half of 90°, minus a gap
  const pt = (r: number, a: number) => {
    const rad = ((a - 90) * Math.PI) / 180;
    return `${c + r * Math.cos(rad)} ${c + r * Math.sin(rad)}`;
  };
  const a0 = angle - span;
  const a1 = angle + span;
  return `M ${pt(r2, a0)} A ${r2} ${r2} 0 0 1 ${pt(r2, a1)} L ${pt(r1, a1)} A ${r1} ${r1} 0 0 0 ${pt(r1, a0)} Z`;
}

function StationBadge({ id, icon: Icon }: { id: SlotId; icon: LucideIcon }) {
  const l = label(id);
  return (
    <span className={`radio-badge radio-badge--${id}`} aria-hidden="true">
      <Icon size={18} strokeWidth={2.2} />
      <span className="radio-badge__freq">{l.freq}</span>
    </span>
  );
}

export default function RadioPanel() {
  const { station, track, trackN, wheelOpen } = useRadio();
  const [mounted, setMounted] = useState(false);
  const [focus, setFocus] = useState(0);
  const [toast, setToast] = useState<{ id: StationId; title: string; n: number } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const returnTo = useRef<HTMLElement | null>(null);

  const close = useCallback(() => radioStore.set({ wheelOpen: false }), []);

  const choose = useCallback((id: SlotId) => {
    const already = radioStore.get().station === (id === 'off' ? null : id);
    radioStore.set({ wheelOpen: false });
    if (already) return; // re-picking the current station just closes the wheel
    if (id === 'off') turnOff();
    else tune(id);
  }, []);

  // Now Playing toast on every track start, wherever it came from (wheel, phone, next track).
  // Skipped while the phone is open: its player already shows it.
  useEffect(() => {
    // Read from the store, not a dependency: closing the phone must not re-announce the track.
    const { station: id, track: title, quiet } = radioStore.get();
    if (!trackN || !id || !title || quiet) return;
    setToast({ id, title, n: trackN });
  }, [trackN]);

  // Open: mount, start on the station that's playing (or the first one).
  useEffect(() => {
    if (wheelOpen) {
      returnTo.current = document.querySelector<HTMLElement>('[data-radio-btn]');
      const playing = SLOTS.findIndex((s) => s.id === (radioStore.get().station ?? 'off'));
      setFocus(playing >= 0 ? playing : 0);
      setMounted(true);
    }
  }, [wheelOpen]);

  // Focuses the current slot (marked data-autofocus below), so the wheel opens on it directly.
  useFocusTrap(overlayRef, mounted && wheelOpen, close, returnTo);

  useEffect(() => {
    if (!mounted) return;
    lockScroll('radio', wheelOpen);
    return () => lockScroll('radio', false);
  }, [mounted, wheelOpen]);

  // Wheel in / out.
  useLayoutEffect(() => {
    if (!mounted) return;
    const reduced = prefersReducedMotion();
    const overlay = overlayRef.current!;
    const wheel = wheelRef.current!;
    if (wheelOpen) {
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
      if (!reduced) {
        gsap.fromTo(wheel, { scale: 0.85, rotate: -25 }, { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(1.6)' });
        gsap.fromTo(wheel.querySelectorAll('.radio-slot'), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)', stagger: 0.04, delay: 0.08 });
      }
    } else {
      gsap.to(overlay, { opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: () => setMounted(false) });
      if (!reduced) gsap.to(wheel, { scale: 0.9, duration: 0.2, ease: 'power2.in' });
    }
  }, [wheelOpen, mounted]);

  // Now Playing toast: slides in, holds ~2s, slides out.
  useLayoutEffect(() => {
    const el = toastRef.current;
    if (!toast || !el) return;
    const reduced = prefersReducedMotion();
    const tl = gsap.timeline();
    tl.fromTo(el, { opacity: 0, y: reduced ? 0 : -24 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' })
      .to(el, { opacity: 0, y: reduced ? 0 : -16, duration: 0.35, ease: 'power2.in' }, '+=2.1')
      .add(() => setToast(null));
    return () => {
      tl.kill();
    };
  }, [toast]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const k = KEY_TO_SLOT[e.key];
    if (k === undefined) return;
    e.preventDefault();
    setFocus(k);
    btnRefs.current[k]?.focus();
  };

  // Point anywhere on the wheel to aim at a station, like a real selector dial.
  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    const r = wheelRef.current!.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    if (Math.hypot(dx, dy) < r.width * 0.16) return;
    const deg = ((Math.atan2(dy, dx) * 180) / Math.PI + 90 + 360) % 360;
    setFocus(Math.round(deg / 90) % 4);
  };

  const focused = SLOTS[focus];
  const fl = label(focused.id);
  const toastStation = toast ? stationById(toast.id) : null;

  return (
    <>
      {mounted && (
        <div
          ref={overlayRef}
          className="radio-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Radio stations"
          onKeyDown={onKeyDown}
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div ref={wheelRef} className="radio-wheel" onPointerMove={onPointerMove}>
            <svg className="radio-wheel__ring" viewBox="0 0 200 200" aria-hidden="true">
              <defs>
                <linearGradient id="radio-wedge" x1="0" y1="0" x2="0.2" y2="1">
                  <stop offset="0" style={{ stopColor: 'var(--logo-2)' }} />
                  <stop offset="1" style={{ stopColor: 'var(--logo-3)' }} />
                </linearGradient>
              </defs>
              {SLOTS.map((s, k) => (
                <path
                  key={s.id}
                  d={wedge(s.angle)}
                  className={`radio-wedge ${k === focus ? 'is-focus' : ''} ${s.id === (station ?? 'off') ? 'is-playing' : ''}`}
                  onClick={() => choose(s.id)}
                />
              ))}
            </svg>

            {SLOTS.map((s, k) => {
              const l = label(s.id);
              const rad = ((s.angle - 90) * Math.PI) / 180;
              return (
                <button
                  key={s.id}
                  ref={(el) => (btnRefs.current[k] = el)}
                  type="button"
                  className={`radio-slot ${k === focus ? 'is-focus' : ''}`}
                  style={{ left: `${50 + 35.5 * Math.cos(rad)}%`, top: `${50 + 35.5 * Math.sin(rad)}%` }}
                  aria-label={s.id === 'off' ? 'Turn radio off' : `${l.freq} ${l.name}, ${l.vibe}`}
                  aria-pressed={s.id === (station ?? 'off')}
                  data-autofocus={s.id === (station ?? 'off') ? true : undefined}
                  onFocus={() => setFocus(k)}
                  onPointerEnter={() => setFocus(k)}
                  onClick={() => choose(s.id)}
                >
                  <StationBadge id={s.id} icon={s.icon} />
                </button>
              );
            })}

            <div className="radio-hub" aria-live="polite">
              <span className="radio-hub__eyebrow">{station && focused.id === station ? '● On air' : focused.id === 'off' ? 'Tune out' : 'FM'}</span>
              <span className="radio-hub__freq">{fl.freq}</span>
              <span className="radio-hub__name">{fl.name}</span>
              <span className="radio-hub__vibe">{station && focused.id === station && track ? `♪ ${track}` : fl.vibe}</span>
            </div>
          </div>

          <p className="radio-overlay__hint" aria-hidden="true">
            <span className="radio-overlay__hint--keys">
              <b>Arrows</b> to aim · <b>Enter</b> to tune · <b>Esc</b> to close
            </span>
            <span className="radio-overlay__hint--touch">
              <b>Tap</b> a station · tap outside to close
            </span>
          </p>
        </div>
      )}

      {toastStation && (
        <div ref={toastRef} className="radio-toast" role="status" key={toast!.n}>
          <StationBadge id={toastStation.id} icon={SLOTS.find((s) => s.id === toastStation.id)!.icon} />
          <span className="radio-toast__text">
            <span className="radio-toast__eyebrow">Now playing</span>
            <span className="radio-toast__name">
              {toastStation.freq} · {toastStation.name}
            </span>
            <span className="radio-toast__track">♪ {toast!.title}</span>
          </span>
        </div>
      )}

    </>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Layers, Pause, Play, Rocket, SkipBack, SkipForward, Sunset, type LucideIcon } from 'lucide-react';
import { prefersReducedMotion } from '@/hooks/useReducedMotion';
import { useRadio } from '@/features/radio/radioStore';
import { stationById, stations, type StationId } from '@/features/radio/stations';
import { jumpTo, levels, progress, skip, trackTitles, tune, turnOff } from '@/features/radio/controller';

/**
 * Music-player view of the radio: station picker, cover art with a live level meter,
 * track progress, transport controls and the station's track list. Same engine and
 * store as the navbar wheel, so both always show the same thing.
 */

const ICONS: Record<StationId, LucideIcon> = { dusk: Sunset, arch: Layers, deploy: Rocket };
const BARS = 18;

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export function RadioApp() {
  const { station, track, last } = useRadio();
  const [view, setView] = useState<StationId>(station ?? last ?? 'dusk');
  const [index, setIndex] = useState(-1);
  const fillRef = useRef<HTMLSpanElement>(null);
  const elapsedRef = useRef<HTMLSpanElement>(null);
  const durationRef = useRef<HTMLSpanElement>(null);
  const barsRef = useRef<HTMLSpanElement>(null);

  // The player follows whatever's on air (also when tuned from the wheel).
  useEffect(() => {
    if (station) setView(station);
    else setIndex(-1);
  }, [station]);

  // Progress, track index and level meter, straight to the DOM each frame (no re-renders).
  useEffect(() => {
    const bins = new Uint8Array(32);
    const reduced = prefersReducedMotion();
    let raf = 0;
    let shown = -2;
    const loop = () => {
      const p = progress();
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${p ? Math.min(1, p.elapsed / p.duration) : 0})`;
      if (elapsedRef.current) elapsedRef.current.textContent = p ? fmt(p.elapsed) : '0:00';
      if (durationRef.current) durationRef.current.textContent = p ? fmt(p.duration) : '-:--';
      const i = p ? p.index : -1;
      if (i !== shown) setIndex((shown = i));
      const bars = barsRef.current?.children;
      if (bars) {
        const live = !reduced && levels(bins);
        for (let k = 0; k < bars.length; k++) {
          const v = live ? 0.1 + (bins[k + 1] / 255) * 0.9 : p ? 0.35 : 0.1;
          (bars[k] as HTMLElement).style.transform = `scaleY(${v})`;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  const on = station === view;
  const s = stationById(view);
  const Icon = ICONS[view];
  const titles = trackTitles(view);

  const pick = (id: StationId) => {
    if (station && station !== id) tune(id);
    setView(id);
  };

  return (
    <div className="player">
      <div className="player__stations" role="group" aria-label="Stations">
        {stations.map((st) => (
          <button key={st.id} type="button" className={`player__station ${st.id === view ? 'is-active' : ''}`} aria-pressed={st.id === view} onClick={() => pick(st.id)}>
            <span className="player__station-freq">{st.freq}</span>
            <span className="player__station-name">{st.name.replace(/ (FM|Radio)$/, '')}</span>
          </button>
        ))}
      </div>

      <div className={`player__art phone-art--${view} ${on ? 'is-on' : ''}`} aria-hidden="true">
        <span className="player__art-sun" />
        <span className="player__art-grid" />
        <span className="player__art-badge">
          <Icon size={30} strokeWidth={2} />
          <span>{s.freq}</span>
        </span>
        <span ref={barsRef} className="player__meter">
          {Array.from({ length: BARS }, (_, k) => (
            <span key={k} />
          ))}
        </span>
      </div>

      <div className="player__meta" aria-live="polite">
        <span className="player__eyebrow">{on ? '● On air' : 'Off air'}</span>
        <span className="player__title">{on && track ? track : s.name}</span>
        <span className="player__sub">
          {s.freq} {s.name} · {s.vibe}
        </span>
      </div>

      <div className="player__progress" aria-hidden="true">
        <span className="player__track">
          <span ref={fillRef} className="player__fill" />
        </span>
        <span className="player__times">
          <span ref={elapsedRef}>0:00</span>
          <span ref={durationRef}>-:--</span>
        </span>
      </div>

      <div className="player__controls">
        <button type="button" className="player__ctl" aria-label="Previous track" disabled={!on} onClick={() => skip(-1)}>
          <SkipBack size={22} fill="currentColor" />
        </button>
        <button
          type="button"
          className="player__play"
          aria-label={on ? `Turn off ${s.name}` : `Play ${s.name}`}
          onClick={() => (on ? turnOff() : tune(view))}
        >
          {on ? <Pause size={26} fill="currentColor" /> : <Play size={26} fill="currentColor" />}
        </button>
        <button type="button" className="player__ctl" aria-label="Next track" disabled={!on} onClick={() => skip(1)}>
          <SkipForward size={22} fill="currentColor" />
        </button>
      </div>

      <div className="player__list">
        <span className="player__list-head">Tracks on {s.freq}</span>
        <ol>
          {titles.map((t, i) => {
            const current = on && i === index;
            return (
              <li key={t}>
                <button
                  type="button"
                  className={`player__item ${current ? 'is-current' : ''}`}
                  aria-current={current ? 'true' : undefined}
                  onClick={() => (on ? jumpTo(i) : tune(view, i))}
                >
                  <span className="player__item-n" aria-hidden="true">
                    {current ? (
                      <span className="phone-eq">
                        <span />
                        <span />
                        <span />
                      </span>
                    ) : (
                      String(i + 1).padStart(2, '0')
                    )}
                  </span>
                  <span className="player__item-title">{t}</span>
                </button>
              </li>
            );
          })}
        </ol>
        <p className="player__note">Synthesized live in your browser. No audio files.</p>
      </div>
    </div>
  );
}

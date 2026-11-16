import { Radio } from 'lucide-react';
import { loadRadioPanel, radioStore, useRadio } from './radioStore';
import { stationById } from './stations';
import './RadioButton.css';

/**
 * Navbar radio: silent until clicked. Opens the station wheel; shows the
 * frequency and a little equalizer while something is playing.
 */
export function RadioButton({ className = '' }: { className?: string }) {
  const { station, track, wheelOpen } = useRadio();
  const playing = station ? stationById(station) : null;
  const nowPlaying = playing ? `${playing.freq} ${playing.name}${track ? `, playing ${track}` : ''}` : '';

  return (
    <button
      type="button"
      data-radio-btn
      className={`radio-btn ${playing ? 'is-playing' : ''} ${className}`}
      aria-haspopup="dialog"
      aria-expanded={wheelOpen}
      aria-label={playing ? `Radio: ${nowPlaying}. Change station` : 'Radio: off. Choose a station'}
      title={playing ? nowPlaying : 'Radio'}
      // Fetch the wheel + audio chunk on intent, so the click opens instantly.
      onPointerEnter={() => void loadRadioPanel()}
      onFocus={() => void loadRadioPanel()}
      onClick={() => radioStore.set({ loaded: true, wheelOpen: !wheelOpen })}
    >
      <span className="radio-btn__icon" aria-hidden="true">
        {playing ? (
          <span className="radio-btn__eq">
            <span />
            <span />
            <span />
          </span>
        ) : (
          <span className="radio-btn__off">
            <Radio size={16} strokeWidth={2.2} />
          </span>
        )}
      </span>
      <span className="radio-btn__label" aria-hidden="true">
        {playing ? `${playing.freq} FM` : 'Radio'}
      </span>
    </button>
  );
}

/** Radio stations. Pure data, so the navbar button can show them without loading the audio engine. */
export type StationId = 'dusk' | 'arch' | 'deploy';

export interface Station {
  id: StationId;
  freq: string;
  name: string;
  /** Short genre line shown in the wheel and the Now Playing toast. */
  vibe: string;
}

// Every station is lo-fi synthwave; each has its own flavour and its own tracks (see engine.ts).
export const stations: Station[] = [
  { id: 'dusk', freq: '98.5', name: 'Bohol Dusk FM', vibe: 'Tropical lo-fi synthwave' },
  { id: 'arch', freq: '104.2', name: 'Clean Arch Radio', vibe: 'Slow lo-fi synthwave · focus' },
  { id: 'deploy', freq: '88.8', name: 'Midnight Deploy FM', vibe: 'Night-drive lo-fi synthwave' },
];

export const stationById = (id: StationId) => stations.find((s) => s.id === id)!;

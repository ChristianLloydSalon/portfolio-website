import { lazy, Suspense } from 'react';
import { loadRadioPanel, useRadio } from './radioStore';

const RadioPanel = lazy(loadRadioPanel);

/** Mounts the radio wheel/toast chunk only after the visitor first opens the radio. */
export function RadioHost() {
  const { loaded } = useRadio();
  if (!loaded) return null;
  return (
    <Suspense fallback={null}>
      <RadioPanel />
    </Suspense>
  );
}

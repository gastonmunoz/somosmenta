'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { WizardData } from '@/lib/wizard-types';

interface Props {
  data: Partial<WizardData>;
  onNext: (data: Partial<WizardData>) => void;
  onBack: () => void;
}

export default function WizardStep2Attendees({ data, onNext, onBack }: Props) {
  const [value, setValue] = useState<number>(data.attendees ?? 50);

  function clamp(n: number) {
    return Math.min(500, Math.max(1, n));
  }

  return (
    <div>
      <h3
        id="attendees-heading"
        className="text-xl font-normal text-[var(--charcoal)] mb-6"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        ¿Cuántos asistentes esperás?
      </h3>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            aria-label="Disminuir asistentes"
            onClick={() => setValue(v => clamp(v - 10))}
            className="w-10 h-10 border border-[var(--gray-mid)] rounded-lg text-[var(--charcoal)] hover:border-[var(--brand)] transition-colors text-lg shrink-0"
          >
            −
          </button>
          <input
            type="number"
            aria-label="Cantidad de asistentes"
            aria-describedby="attendees-heading"
            min={1}
            max={500}
            value={value}
            onChange={e => setValue(clamp(Number(e.target.value)))}
            className="flex-1 border border-[var(--gray-mid)] rounded-lg px-4 py-3 text-center text-[var(--charcoal)] text-lg focus:outline-none focus:border-[var(--brand-mid)]"
          />
          <button
            type="button"
            aria-label="Aumentar asistentes"
            onClick={() => setValue(v => clamp(v + 10))}
            className="w-10 h-10 border border-[var(--gray-mid)] rounded-lg text-[var(--charcoal)] hover:border-[var(--brand)] transition-colors text-lg shrink-0"
          >
            +
          </button>
        </div>
        <input
          type="range"
          aria-label="Cantidad de asistentes"
          min={1}
          max={500}
          value={value}
          onChange={e => setValue(Number(e.target.value))}
          className="w-full accent-[var(--brand)]"
        />
        <div className="flex justify-between text-[11px] text-[var(--gray-text)] mt-1">
          <span>1</span>
          <span>500</span>
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Volver
        </Button>
        <Button onClick={() => onNext({ attendees: value })} className="flex-1">
          Siguiente
        </Button>
      </div>
    </div>
  );
}

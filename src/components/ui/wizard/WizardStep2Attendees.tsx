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
        className="text-xl font-normal text-[var(--black)] mb-6"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        ¿Cuántos asistentes esperás?
      </h3>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setValue(v => clamp(v - 10))}
            className="w-10 h-10 border border-[var(--gray-mid)] rounded-lg text-[var(--black)] hover:border-[var(--sage)] transition-colors text-lg shrink-0"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            max={500}
            value={value}
            onChange={e => setValue(clamp(Number(e.target.value)))}
            className="flex-1 border border-[var(--gray-mid)] rounded-lg px-4 py-3 text-center text-[var(--black)] text-lg focus:outline-none focus:border-[var(--sage)]"
          />
          <button
            onClick={() => setValue(v => clamp(v + 10))}
            className="w-10 h-10 border border-[var(--gray-mid)] rounded-lg text-[var(--black)] hover:border-[var(--sage)] transition-colors text-lg shrink-0"
          >
            +
          </button>
        </div>
        <input
          type="range"
          min={1}
          max={500}
          value={value}
          onChange={e => setValue(Number(e.target.value))}
          className="w-full accent-[var(--sage)]"
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

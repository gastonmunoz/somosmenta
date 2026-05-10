'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { WizardData } from '@/lib/wizard-types';

interface Props {
  data: Partial<WizardData>;
  onNext: (data: Partial<WizardData>) => void;
  onBack: () => void;
}

export default function WizardStep3Date({ data, onNext, onBack }: Props) {
  const [value, setValue] = useState<string>(data.date ?? '');
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <h3
        className="text-xl font-normal text-[var(--black)] mb-6"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        ¿Cuándo es el evento?
      </h3>
      <div className="mb-8">
        <input
          type="date"
          min={today}
          value={value}
          onChange={e => setValue(e.target.value)}
          className="w-full border border-[var(--gray-mid)] rounded-lg px-4 py-3 text-[var(--black)] focus:outline-none focus:border-[var(--sage)]"
        />
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Volver
        </Button>
        <Button onClick={() => onNext({ date: value })} disabled={!value} className="flex-1">
          Siguiente
        </Button>
      </div>
    </div>
  );
}

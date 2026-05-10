'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BUDGET_LABELS, type WizardData } from '@/lib/wizard-types';

interface Props {
  data: Partial<WizardData>;
  onNext: (data: Partial<WizardData>) => void;
  onBack: () => void;
}

const OPTIONS = Object.entries(BUDGET_LABELS) as [WizardData['budget'], string][];

export default function WizardStep4Budget({ data, onNext, onBack }: Props) {
  const [selected, setSelected] = useState<WizardData['budget'] | undefined>(data.budget);

  return (
    <div>
      <h3
        className="text-xl font-normal text-[var(--black)] mb-6"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        ¿Cuál es tu presupuesto estimado?
      </h3>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {OPTIONS.map(([value, label]) => (
          <button
            key={value}
            onClick={() => setSelected(value)}
            className={cn(
              'border rounded-lg p-4 text-sm text-left transition-colors text-[var(--black)]',
              selected === value
                ? 'border-[var(--sage)] bg-[var(--sage-light)]'
                : 'border-[var(--gray-mid)] hover:border-[var(--sage)]'
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Volver
        </Button>
        <Button
          onClick={() => selected && onNext({ budget: selected })}
          disabled={!selected}
          className="flex-1"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}

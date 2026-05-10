'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { EVENT_TYPE_LABELS, type WizardData } from '@/lib/wizard-types';

interface Props {
  data: Partial<WizardData>;
  onNext: (data: Partial<WizardData>) => void;
}

const OPTIONS = Object.entries(EVENT_TYPE_LABELS) as [WizardData['eventType'], string][];

export default function WizardStep1EventType({ data, onNext }: Props) {
  const [selected, setSelected] = useState<WizardData['eventType'] | undefined>(data.eventType);

  return (
    <div>
      <h3
        className="text-xl font-normal text-[var(--black)] mb-6"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        ¿Qué tipo de evento estás planeando?
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
      <Button
        onClick={() => selected && onNext({ eventType: selected })}
        disabled={!selected}
        className="w-full"
      >
        Siguiente
      </Button>
    </div>
  );
}

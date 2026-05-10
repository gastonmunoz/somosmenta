'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { WizardData } from '@/lib/wizard-types';

interface Props {
  data: Partial<WizardData>;
  onSubmit: (data: Partial<WizardData>) => void;
  onBack: () => void;
  submitting: boolean;
}

export default function WizardStep5Contact({ data, onSubmit, onBack, submitting }: Props) {
  const [company, setCompany] = useState(data.company ?? '');
  const [email, setEmail] = useState(data.email ?? '');
  const [notes, setNotes] = useState(data.notes ?? '');
  const [emailError, setEmailError] = useState('');

  function handleSubmit() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Ingresá un email válido');
      return;
    }
    setEmailError('');
    onSubmit({ company, email, notes });
  }

  const canSubmit = company.trim().length > 0 && email.trim().length > 0 && !submitting;

  return (
    <div>
      <h3
        className="text-xl font-normal text-[var(--black)] mb-6"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        ¿Quién nos escribe?
      </h3>
      <div className="flex flex-col gap-4 mb-8">
        <div>
          <label className="block text-[11px] tracking-[2px] uppercase text-[var(--gray-text)] mb-1.5">
            Empresa
          </label>
          <input
            type="text"
            value={company}
            onChange={e => setCompany(e.target.value)}
            placeholder="Nombre de tu empresa"
            className="w-full border border-[var(--gray-mid)] rounded-lg px-4 py-3 text-[var(--black)] text-sm focus:outline-none focus:border-[var(--sage)]"
          />
        </div>
        <div>
          <label className="block text-[11px] tracking-[2px] uppercase text-[var(--gray-text)] mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              setEmailError('');
            }}
            placeholder="tu@empresa.com"
            className="w-full border border-[var(--gray-mid)] rounded-lg px-4 py-3 text-[var(--black)] text-sm focus:outline-none focus:border-[var(--sage)]"
          />
          {emailError && <p className="text-red-500 text-[11px] mt-1">{emailError}</p>}
        </div>
        <div>
          <label className="block text-[11px] tracking-[2px] uppercase text-[var(--gray-text)] mb-1.5">
            Notas adicionales{' '}
            <span className="normal-case text-[var(--gray-text)]">(opcional)</span>
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Contanos más sobre tu evento..."
            rows={3}
            className="w-full border border-[var(--gray-mid)] rounded-lg px-4 py-3 text-[var(--black)] text-sm focus:outline-none focus:border-[var(--sage)] resize-none"
          />
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} disabled={submitting} className="flex-1">
          Volver
        </Button>
        <Button onClick={handleSubmit} disabled={!canSubmit} className="flex-1">
          {submitting ? 'Enviando...' : 'Generar Brief'}
        </Button>
      </div>
    </div>
  );
}

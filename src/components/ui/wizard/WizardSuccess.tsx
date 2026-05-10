'use client';

import { CheckCircle } from 'lucide-react';

interface Props {
  email: string;
}

export default function WizardSuccess({ email }: Props) {
  return (
    <div className="text-center py-8">
      <CheckCircle className="w-12 h-12 text-[var(--sage)] mx-auto mb-4" />
      <h3
        className="text-2xl font-normal text-[var(--black)] mb-3"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        ¡Tu brief fue generado!
      </h3>
      <p className="text-sm text-[var(--gray-text)] leading-relaxed">
        El PDF se descargó automáticamente. Nuestro equipo se contactará a{' '}
        <span className="text-[var(--black)] font-medium">{email}</span> a la brevedad.
      </p>
    </div>
  );
}

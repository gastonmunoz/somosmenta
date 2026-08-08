'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onRetry: () => void;
}

export default function WizardError({ onRetry }: Props) {
  return (
    <div className="text-center py-8" role="alert">
      <AlertCircle className="w-12 h-12 text-[var(--charcoal)] mx-auto mb-4" />
      <h3
        className="text-2xl font-normal text-[var(--charcoal)] mb-3"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        No pudimos enviar tu brief
      </h3>
      <p className="text-sm text-[var(--gray-text)] leading-relaxed mb-6">
        Hubo un problema de nuestro lado. Probá de nuevo o escribinos directamente a{' '}
        <a href="mailto:hola@calton.com.ar" className="text-[var(--brand-mid)] font-medium underline">
          hola@calton.com.ar
        </a>
        .
      </p>
      <Button onClick={onRetry} className="mx-auto">
        Reintentar
      </Button>
    </div>
  );
}

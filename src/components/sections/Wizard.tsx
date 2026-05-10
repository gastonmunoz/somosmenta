'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WizardStep1EventType from '@/components/ui/wizard/WizardStep1EventType';
import WizardStep2Attendees from '@/components/ui/wizard/WizardStep2Attendees';
import WizardStep3Date from '@/components/ui/wizard/WizardStep3Date';
import WizardStep4Budget from '@/components/ui/wizard/WizardStep4Budget';
import WizardStep5Contact from '@/components/ui/wizard/WizardStep5Contact';
import WizardSuccess from '@/components/ui/wizard/WizardSuccess';
import { generateBrief } from '@/lib/generateBrief';
import type { WizardData } from '@/lib/wizard-types';

const STEPS = 5;

export default function Wizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<WizardData>>({});
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleNext(partial: Partial<WizardData>) {
    setData(prev => ({ ...prev, ...partial }));
    setStep(s => s + 1);
  }

  function handleBack() {
    setStep(s => Math.max(0, s - 1));
  }

  async function handleSubmit(partial: Partial<WizardData>) {
    const final = { ...data, ...partial } as WizardData;
    setData(final);
    setSubmitting(true);

    generateBrief(final);

    await fetch('/api/send-brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(final),
    }).catch(() => {});

    setSubmitting(false);
    setDone(true);
  }

  const progress = ((step + 1) / STEPS) * 100;

  const stepComponents = [
    <WizardStep1EventType key="1" data={data} onNext={handleNext} />,
    <WizardStep2Attendees key="2" data={data} onNext={handleNext} onBack={handleBack} />,
    <WizardStep3Date key="3" data={data} onNext={handleNext} onBack={handleBack} />,
    <WizardStep4Budget key="4" data={data} onNext={handleNext} onBack={handleBack} />,
    <WizardStep5Contact
      key="5"
      data={data}
      onSubmit={handleSubmit}
      onBack={handleBack}
      submitting={submitting}
    />,
  ];

  return (
    <section id="brief" className="bg-[var(--sage-light)] py-20 md:py-24 px-8 md:px-12">
      <div className="max-w-xl mx-auto">
        <p className="text-[10px] tracking-[4px] uppercase text-[var(--sage)] mb-4 text-center">
          Armá tu propuesta
        </p>
        <h2
          className="text-4xl md:text-5xl font-normal text-[var(--black)] mb-10 text-center"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Event Brief
        </h2>

        <div className="bg-white rounded-2xl shadow-md p-8">
          {done ? (
            <WizardSuccess email={data.email ?? ''} />
          ) : (
            <>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] tracking-[2px] uppercase text-[var(--gray-text)]">
                  Paso {step + 1} de {STEPS}
                </span>
              </div>
              <div className="h-1.5 bg-[var(--gray-mid)] rounded-full mb-8">
                <div
                  className="h-full bg-[var(--sage)] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                >
                  {stepComponents[step]}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

import { z } from 'zod';
import { EVENT_TYPE_VALUES, BUDGET_VALUES } from './leads';
import type { WizardData } from './wizard-types';

const MAX_FIELD = 200;
const MAX_NOTES = 2000;
const MAX_MESSAGE_CHARS = 2000;
const MAX_MESSAGES = 30;

export const MAX_CONVERSATION_CHARS = 8000;

const emailField = z.string().trim().max(MAX_FIELD).pipe(z.email());

export const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(MAX_MESSAGE_CHARS),
      })
    )
    .min(1)
    .max(MAX_MESSAGES),
});

export const wizardDataSchema = z.object({
  eventType: z.enum(EVENT_TYPE_VALUES as [WizardData['eventType'], ...WizardData['eventType'][]]),
  attendees: z.number().int().positive().max(100000),
  date: z.string().min(1),
  budget: z.enum(BUDGET_VALUES as [WizardData['budget'], ...WizardData['budget'][]]),
  company: z.string().trim().min(1).max(MAX_FIELD),
  email: emailField,
  notes: z.string().max(MAX_NOTES).optional().default(''),
});

export const captureLeadSchema = z.object({
  name: z.string().trim().max(MAX_FIELD).optional().default(''),
  company: z.string().trim().min(1).max(MAX_FIELD),
  email: emailField,
  eventType: z.string().trim().max(MAX_FIELD).optional().default(''),
  attendees: z.number().int().positive().max(100000).optional(),
});

import { Resend } from 'resend';
import { getSupabase } from './supabase';
import { EVENT_TYPE_LABELS, BUDGET_LABELS, type WizardData } from './wizard-types';

const resend = new Resend(process.env.RESEND_API_KEY);

export function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const EVENT_TYPE_VALUES = Object.keys(EVENT_TYPE_LABELS) as WizardData['eventType'][];
export const BUDGET_VALUES = Object.keys(BUDGET_LABELS) as WizardData['budget'][];

export type LeadSource = 'wizard' | 'chatbot';

export type LeadInput = {
  source: LeadSource;
  name?: string;
  company: string;
  email: string;
  eventType?: string;
  attendees?: number;
  budget?: string;
  notes?: string;
};

export type RecordLeadResult =
  | { ok: true; notified: boolean }
  | { ok: false; error: string };

function buildEmailHtml(lead: LeadInput, heading: string) {
  const rows: [string, string][] = [
    ['Nombre', lead.name || '—'],
    ['Empresa', lead.company],
    ['Email', lead.email],
    ['Tipo de evento', lead.eventType || '—'],
    ['Asistentes', lead.attendees != null ? String(lead.attendees) : '—'],
    ...(lead.budget ? ([['Presupuesto', lead.budget]] as [string, string][]) : []),
    ...(lead.notes ? ([['Notas', lead.notes]] as [string, string][]) : []),
  ];

  const tableRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 14px;font-weight:600;color:#555;white-space:nowrap">${esc(k)}</td><td style="padding:6px 14px;color:#414042">${esc(v)}</td></tr>`
    )
    .join('');

  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
      <h2 style="color:#3F592A;margin-bottom:4px">${esc(heading)}</h2>
      <p style="color:#888;font-size:13px;margin-top:0">Recibido el ${new Date().toLocaleDateString('es-AR')}</p>
      <table style="border-collapse:collapse;width:100%;margin-top:16px;border:1px solid #E3E3DF;border-radius:8px;overflow:hidden">
        ${tableRows}
      </table>
    </div>
  `;
}

/**
 * Persists a lead durably before doing anything else, then attempts to
 * notify the team by email. A notification failure is logged and recorded
 * on the row, but never turns a successful persist into a failed result —
 * the lead is already safe once `ok: true` comes back.
 */
export async function recordLead(
  lead: LeadInput,
  emailSubject: string,
  emailHeading: string
): Promise<RecordLeadResult> {
  let supabase;
  try {
    supabase = getSupabase();
  } catch (err) {
    console.error('[leads] supabase not configured:', err);
    return { ok: false, error: 'not_configured' };
  }

  const { data: row, error: insertError } = await supabase
    .from('leads')
    .insert({
      source: lead.source,
      name: lead.name || null,
      company: lead.company,
      email: lead.email,
      event_type: lead.eventType || null,
      attendees: lead.attendees ?? null,
      budget: lead.budget || null,
      notes: lead.notes || null,
    })
    .select('id')
    .single();

  if (insertError || !row) {
    console.error('[leads] failed to persist lead:', insertError);
    return { ok: false, error: 'persist_failed' };
  }

  try {
    // The Resend SDK does not throw on API errors — it resolves with
    // { data: null, error }, so a failed send must be checked explicitly
    // rather than relying on the catch block below.
    const { error: sendError } = await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: process.env.RESEND_TO!,
      subject: emailSubject,
      html: buildEmailHtml(lead, emailHeading),
    });

    if (sendError) throw sendError;

    await supabase.from('leads').update({ notified_at: new Date().toISOString() }).eq('id', row.id);
    return { ok: true, notified: true };
  } catch (err) {
    console.error('[leads] lead persisted but notification failed:', row.id, err);
    const message =
      err instanceof Error ? err.message : typeof err === 'object' && err && 'message' in err
        ? String((err as { message: unknown }).message)
        : 'unknown error';
    await supabase.from('leads').update({ notify_error: message }).eq('id', row.id);
    return { ok: true, notified: false };
  }
}

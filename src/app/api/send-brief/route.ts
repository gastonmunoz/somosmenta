import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { EVENT_TYPE_LABELS, BUDGET_LABELS, type WizardData } from '@/lib/wizard-types';

const resend = new Resend(process.env.RESEND_API_KEY);

function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const data: WizardData = await request.json();

    if (
      !['team-building', 'lanzamiento', 'conferencia', 'outro'].includes(data.eventType) &&
      !['team-building', 'lanzamiento', 'conferencia', 'otro'].includes(data.eventType)
    ) {
      return NextResponse.json({ error: 'Invalid eventType' }, { status: 400 });
    }
    if (!isValidEmail(data.email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    if (!data.company?.trim()) {
      return NextResponse.json({ error: 'Missing company' }, { status: 400 });
    }

    const rows: [string, string][] = [
      ['Tipo de evento', EVENT_TYPE_LABELS[data.eventType] ?? data.eventType],
      ['Asistentes', String(data.attendees)],
      ['Fecha', new Date(data.date).toLocaleDateString('es-AR')],
      ['Presupuesto', BUDGET_LABELS[data.budget] ?? data.budget],
      ['Empresa', data.company],
      ['Email', data.email],
      ...(data.notes ? [['Notas', data.notes] as [string, string]] : []),
    ];

    const tableRows = rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 14px;font-weight:600;color:#555;white-space:nowrap">${esc(k)}</td><td style="padding:6px 14px;color:#1A1A1A">${esc(v)}</td></tr>`
      )
      .join('');

    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: process.env.RESEND_TO!,
      subject: `Nuevo brief — ${esc(data.company)} — ${esc(EVENT_TYPE_LABELS[data.eventType] ?? data.eventType)}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
          <h2 style="color:#5D8A6B;margin-bottom:4px">Nuevo Event Brief</h2>
          <p style="color:#888;font-size:13px;margin-top:0">Recibido el ${new Date().toLocaleDateString('es-AR')}</p>
          <table style="border-collapse:collapse;width:100%;margin-top:16px;border:1px solid #E5E5E5;border-radius:8px;overflow:hidden">
            ${tableRows}
          </table>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

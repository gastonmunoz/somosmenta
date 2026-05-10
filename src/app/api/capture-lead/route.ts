import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

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
    const { name, company, email, eventType, attendees } = await request.json();

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    if (!name?.trim() || !company?.trim() || !eventType?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const rows: [string, string][] = [
      ['Nombre', name],
      ['Empresa', company],
      ['Email', email],
      ['Tipo de evento', eventType],
      ['Asistentes', String(attendees ?? '—')],
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
      subject: `Nuevo lead via chatbot — ${esc(company)}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
          <h2 style="color:#5D8A6B;margin-bottom:4px">Nuevo Lead — Chatbot</h2>
          <p style="color:#888;font-size:13px;margin-top:0">Recibido el ${new Date().toLocaleDateString('es-AR')}</p>
          <table style="border-collapse:collapse;width:100%;margin-top:16px;border:1px solid #E5E5E5;border-radius:8px;overflow:hidden">
            ${tableRows}
          </table>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to capture lead' }, { status: 500 });
  }
}

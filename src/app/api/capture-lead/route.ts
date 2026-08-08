import { NextRequest, NextResponse } from 'next/server';
import { recordLead } from '@/lib/leads';
import { captureLeadSchema } from '@/lib/validation';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const allowed = await checkRateLimit(getClientIp(request), 'capture-lead');
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = captureLeadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const { name, company, email, eventType, attendees } = parsed.data;

    const result = await recordLead(
      { source: 'chatbot', name, company, email, eventType, attendees },
      `Nuevo lead via chatbot — ${company}`,
      'Nuevo Lead — Chatbot'
    );

    if (!result.ok) {
      return NextResponse.json({ error: 'Failed to capture lead' }, { status: 500 });
    }
    return NextResponse.json({ ok: true, notified: result.notified });
  } catch (err) {
    console.error('[capture-lead] unexpected error:', err);
    return NextResponse.json({ error: 'Failed to capture lead' }, { status: 500 });
  }
}

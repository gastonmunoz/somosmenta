import { NextRequest, NextResponse } from 'next/server';
import { EVENT_TYPE_LABELS, BUDGET_LABELS } from '@/lib/wizard-types';
import { recordLead } from '@/lib/leads';
import { wizardDataSchema } from '@/lib/validation';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const allowed = await checkRateLimit(getClientIp(request), 'send-brief');
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = wizardDataSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const data = parsed.data;
    const eventTypeLabel = EVENT_TYPE_LABELS[data.eventType];

    const result = await recordLead(
      {
        source: 'wizard',
        company: data.company,
        email: data.email,
        eventType: eventTypeLabel,
        attendees: data.attendees,
        budget: BUDGET_LABELS[data.budget],
        notes: data.notes,
      },
      `Nuevo brief — ${data.company} — ${eventTypeLabel}`,
      'Nuevo Event Brief'
    );

    if (!result.ok) {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
    return NextResponse.json({ ok: true, notified: result.notified });
  } catch (err) {
    console.error('[send-brief] unexpected error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

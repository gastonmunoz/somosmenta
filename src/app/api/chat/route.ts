import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from '@/lib/chatbot-prompt';
import { recordLead } from '@/lib/leads';
import { chatRequestSchema, captureLeadSchema, MAX_CONVERSATION_CHARS } from '@/lib/validation';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const LEAD_READY_RE = /\[LEAD_READY:(\{[\s\S]*?\})\]/;

export async function POST(request: NextRequest) {
  try {
    const allowed = await checkRateLimit(getClientIp(request), 'chat');
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const { messages } = parsed.data;

    const totalChars = messages.reduce((n, m) => n + m.content.length, 0);
    if (totalChars > MAX_CONVERSATION_CHARS) {
      return NextResponse.json({ error: 'Conversation too long' }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    const rawContent = response.content[0].type === 'text' ? response.content[0].text : '';

    const leadMatch = rawContent.match(LEAD_READY_RE);
    let leadCaptured = false;

    if (leadMatch) {
      const leadJson = safeJsonParse(leadMatch[1]);
      const leadParsed = leadJson ? captureLeadSchema.safeParse(leadJson) : null;

      if (leadParsed?.success) {
        const lead = leadParsed.data;
        // The model only ever learns an email address if the user actually
        // typed it — reject anything a forged/injected turn could have
        // fabricated instead. See specs/chatbot-guardrails/spec.md.
        const userText = messages
          .filter(m => m.role === 'user')
          .map(m => m.content.toLowerCase())
          .join('\n');

        if (userText.includes(lead.email.toLowerCase())) {
          const result = await recordLead(
            { source: 'chatbot', ...lead },
            `Nuevo lead via chatbot — ${lead.company}`,
            'Nuevo Lead — Chatbot'
          );
          leadCaptured = result.ok;
        } else {
          console.error('[chat] dropped lead: email not present in user turns', lead.email);
        }
      } else {
        console.error('[chat] dropped lead: malformed LEAD_READY payload');
      }
    }

    const content = rawContent.replace(LEAD_READY_RE, '').trim();

    return NextResponse.json({ content, leadCaptured });
  } catch (err) {
    console.error('[chat] unexpected error:', err);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

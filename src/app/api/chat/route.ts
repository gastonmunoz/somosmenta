import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from '@/lib/chatbot-prompt';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const LEAD_READY_RE = /\[LEAD_READY:(\{[\s\S]*?\})\]/;

type Message = { role: 'user' | 'assistant'; content: string };

export async function POST(request: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Missing messages' }, { status: 400 });
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
      try {
        const leadData = JSON.parse(leadMatch[1]);
        const origin = request.nextUrl.origin;
        await fetch(`${origin}/api/capture-lead`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData),
        });
        leadCaptured = true;
      } catch {
        // silently fail — don't break the conversation
      }
    }

    const content = rawContent.replace(LEAD_READY_RE, '').trim();

    return NextResponse.json({ content, leadCaptured });
  } catch {
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}

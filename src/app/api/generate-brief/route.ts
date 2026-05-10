import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import {
  EVENT_TYPE_LABELS,
  BUDGET_LABELS,
  type WizardData,
  type AiBriefContent,
} from '@/lib/wizard-types';

const client = new Anthropic();

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const data: WizardData = await request.json();

    if (!['team-building', 'lanzamiento', 'conferencia', 'otro'].includes(data.eventType)) {
      return NextResponse.json({ error: 'Invalid eventType' }, { status: 400 });
    }
    if (!isValidEmail(data.email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    if (!data.company?.trim()) {
      return NextResponse.json({ error: 'Missing company' }, { status: 400 });
    }

    const eventDate = new Date(data.date).toLocaleDateString('es-AR');
    const eventType = EVENT_TYPE_LABELS[data.eventType];
    const budget = BUDGET_LABELS[data.budget];

    const prompt = `Sos experto en producción de eventos corporativos en Argentina. Un cliente completó un formulario y necesitás generar contenido para su Event Brief personalizado.

Datos del evento:
- Tipo: ${eventType}
- Empresa: ${data.company}
- Asistentes: ${data.attendees}
- Fecha: ${eventDate}
- Presupuesto: ${budget}${data.notes ? `\n- Notas: ${data.notes}` : ''}

Respondé SOLO con un JSON válido, sin markdown ni texto adicional, con esta estructura exacta:

{
  "resumenEjecutivo": "2-3 oraciones personalizadas describiendo el evento. Mencioná la empresa, el tipo de evento, los asistentes y el presupuesto en contexto.",
  "serviciosRecomendados": [
    { "nombre": "Nombre del servicio", "descripcion": "Una oración explicando por qué es ideal para este evento." }
  ],
  "analisisPresupuesto": "2 oraciones analizando el presupuesto ${budget} en el contexto de un ${eventType} para ${data.attendees} personas. Indicá qué es factible y qué optimizar.",
  "timelineSugerido": [
    "Hito con tiempo antes del evento"
  ],
  "preguntasClave": [
    "Pregunta que ${data.company} debe resolver antes de confirmar la producción"
  ],
  "proximosPasos": [
    "Paso concreto y personalizado para ${data.company}"
  ]
}

Incluí 4-6 servicios, 5-6 hitos en el timeline, 4-5 preguntas clave y 3-4 próximos pasos.`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = message.content.find(b => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No content from AI' }, { status: 500 });
    }

    const aiContent: AiBriefContent = JSON.parse(textBlock.text);
    return NextResponse.json(aiContent);
  } catch {
    return NextResponse.json({ error: 'Failed to generate brief' }, { status: 500 });
  }
}

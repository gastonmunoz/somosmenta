import jsPDF from 'jspdf';
import {
  EVENT_TYPE_LABELS,
  BUDGET_LABELS,
  type WizardData,
  type AiBriefContent,
} from './wizard-types';

const MARGIN = 20;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const BOTTOM_LIMIT = PAGE_HEIGHT - 18;

function maybeNewPage(doc: jsPDF, y: number, needed = 8): number {
  if (y + needed > BOTTOM_LIMIT) {
    doc.addPage();
    return 28;
  }
  return y;
}

function wrappedText(doc: jsPDF, text: string, x: number, y: number, maxW: number): number {
  const lines = doc.splitTextToSize(text, maxW) as string[];
  for (const line of lines) {
    y = maybeNewPage(doc, y);
    doc.text(line, x, y);
    y += 6;
  }
  return y;
}

function sectionHeader(doc: jsPDF, title: string, y: number, pageWidth: number): number {
  y = maybeNewPage(doc, y, 16);
  y += 4;
  doc.setDrawColor(229, 229, 229);
  doc.line(MARGIN, y, pageWidth - MARGIN, y);
  y += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text(title, MARGIN, y);
  return y + 8;
}

export function generateBrief(data: WizardData, ai: AiBriefContent): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text('CALTON', MARGIN, 25);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Event Brief', pageWidth - MARGIN, 20, { align: 'right' });
  doc.text(new Date().toLocaleDateString('es-AR'), pageWidth - MARGIN, 27, { align: 'right' });

  doc.setDrawColor(93, 138, 107);
  doc.line(MARGIN, 33, pageWidth - MARGIN, 33);

  // Resumen ejecutivo
  let y = 45;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text('Resumen Ejecutivo', MARGIN, y);
  y += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  y = wrappedText(doc, ai.resumenEjecutivo, MARGIN, y, CONTENT_WIDTH);

  // Datos del evento
  y = sectionHeader(doc, 'Datos del Evento', y, pageWidth);
  const rows: [string, string][] = [
    ['Tipo de evento', EVENT_TYPE_LABELS[data.eventType]],
    ['Asistentes', String(data.attendees)],
    ['Fecha', new Date(data.date).toLocaleDateString('es-AR')],
    ['Presupuesto', BUDGET_LABELS[data.budget]],
    ['Empresa', data.company],
    ['Email', data.email],
    ...(data.notes ? [['Notas', data.notes] as [string, string]] : []),
  ];
  doc.setFontSize(10);
  for (const [label, value] of rows) {
    y = maybeNewPage(doc, y, 7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(85, 85, 85);
    doc.text(label + ':', MARGIN, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(26, 26, 26);
    const lines = doc.splitTextToSize(value, CONTENT_WIDTH - 55) as string[];
    doc.text(lines, 75, y);
    y += 7 * (lines.length > 1 ? lines.length : 1);
  }

  // Servicios recomendados
  y = sectionHeader(doc, 'Servicios Recomendados', y, pageWidth);
  for (const s of ai.serviciosRecomendados) {
    y = maybeNewPage(doc, y, 14);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(93, 138, 107);
    doc.text(`• ${s.nombre}`, MARGIN, y);
    y += 6;
    if (s.descripcion) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(85, 85, 85);
      doc.setFontSize(9);
      y = wrappedText(doc, s.descripcion, MARGIN + 4, y, CONTENT_WIDTH - 4);
      doc.setFontSize(10);
    }
    y += 1;
  }

  // Análisis de presupuesto
  y = sectionHeader(doc, 'Análisis de Presupuesto', y, pageWidth);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(26, 26, 26);
  y = wrappedText(doc, ai.analisisPresupuesto, MARGIN, y, CONTENT_WIDTH);

  // Timeline sugerido
  y = sectionHeader(doc, 'Timeline Sugerido', y, pageWidth);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(26, 26, 26);
  for (let i = 0; i < ai.timelineSugerido.length; i++) {
    y = maybeNewPage(doc, y, 6);
    y = wrappedText(doc, `${i + 1}. ${ai.timelineSugerido[i]}`, MARGIN, y, CONTENT_WIDTH);
  }

  // Preguntas clave
  if (ai.preguntasClave.length > 0) {
    y = sectionHeader(doc, 'Preguntas Clave', y, pageWidth);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(26, 26, 26);
    for (const q of ai.preguntasClave) {
      y = maybeNewPage(doc, y, 6);
      y = wrappedText(doc, `• ${q}`, MARGIN, y, CONTENT_WIDTH);
    }
  }

  // Próximos pasos
  y = sectionHeader(doc, 'Próximos Pasos', y, pageWidth);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(26, 26, 26);
  for (const paso of ai.proximosPasos) {
    y = maybeNewPage(doc, y, 6);
    y = wrappedText(doc, `• ${paso}`, MARGIN, y, CONTENT_WIDTH);
  }

  const filename = `brief-calton-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

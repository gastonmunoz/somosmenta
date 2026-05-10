import jsPDF from 'jspdf';
import {
  EVENT_TYPE_LABELS,
  BUDGET_LABELS,
  RECOMMENDED_SERVICES,
  type WizardData,
} from './wizard-types';

export function generateBrief(data: WizardData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('CALTON', 20, 25);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Event Brief', pageWidth - 20, 20, { align: 'right' });
  doc.text(new Date().toLocaleDateString('es-AR'), pageWidth - 20, 27, { align: 'right' });

  doc.setDrawColor(93, 138, 107);
  doc.line(20, 33, pageWidth - 20, 33);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text('Resumen del Evento', 20, 45);

  const rows: [string, string][] = [
    ['Tipo de evento', EVENT_TYPE_LABELS[data.eventType]],
    ['Asistentes', String(data.attendees)],
    ['Fecha', new Date(data.date).toLocaleDateString('es-AR')],
    ['Presupuesto', BUDGET_LABELS[data.budget]],
    ['Empresa', data.company],
    ['Email', data.email],
    ...(data.notes ? [['Notas', data.notes] as [string, string]] : []),
  ];

  let y = 55;
  doc.setFontSize(10);
  for (const [label, value] of rows) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(85, 85, 85);
    doc.text(label + ':', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(26, 26, 26);
    const lines = doc.splitTextToSize(value, pageWidth - 90);
    doc.text(lines, 75, y);
    y += 7 * (lines.length > 1 ? lines.length : 1);
  }

  y += 6;
  doc.setDrawColor(229, 229, 229);
  doc.line(20, y, pageWidth - 20, y);
  y += 10;

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text('Servicios Recomendados', 20, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  for (const service of RECOMMENDED_SERVICES[data.eventType]) {
    doc.text(`• ${service}`, 24, y);
    y += 7;
  }

  y += 6;
  doc.line(20, y, pageWidth - 20, y);
  y += 10;

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Próximos Pasos', 20, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('El equipo de Calton se contactará a la brevedad.', 20, y);
  y += 7;
  doc.text('Mientras tanto, podés escribirnos a hola@calton.com.ar', 20, y);

  const filename = `brief-calton-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

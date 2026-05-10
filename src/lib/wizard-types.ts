export type AiBriefContent = {
  resumenEjecutivo: string;
  serviciosRecomendados: { nombre: string; descripcion: string }[];
  analisisPresupuesto: string;
  timelineSugerido: string[];
  preguntasClave: string[];
  proximosPasos: string[];
};

export type WizardData = {
  eventType: 'team-building' | 'lanzamiento' | 'conferencia' | 'otro';
  attendees: number;
  date: string;
  budget: 'hasta-500k' | '500k-2m' | '2m-5m' | '5m+';
  company: string;
  email: string;
  notes: string;
};

export const EVENT_TYPE_LABELS: Record<WizardData['eventType'], string> = {
  'team-building': 'Team Building',
  'lanzamiento': 'Lanzamiento',
  'conferencia': 'Conferencia',
  'otro': 'Otro',
};

export const BUDGET_LABELS: Record<WizardData['budget'], string> = {
  'hasta-500k': 'Hasta $500.000',
  '500k-2m': '$500.000 – $2.000.000',
  '2m-5m': '$2.000.000 – $5.000.000',
  '5m+': '$5.000.000+',
};

export const RECOMMENDED_SERVICES: Record<WizardData['eventType'], string[]> = {
  'team-building': ['Dinámicas grupales', 'Catering', 'Espacios al aire libre'],
  'lanzamiento': ['Escenografía', 'A/V', 'Producción de contenido'],
  'conferencia': ['Sala equipada', 'Moderación', 'Transmisión en vivo'],
  'otro': ['Consultoría personalizada'],
};

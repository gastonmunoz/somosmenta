export type AiBriefContent = {
  resumenEjecutivo: string;
  serviciosRecomendados: { nombre: string; descripcion: string }[];
  analisisPresupuesto: string;
  timelineSugerido: string[];
  preguntasClave: string[];
  proximosPasos: string[];
};

export type WizardData = {
  eventType: 'lanzamiento' | 'congreso-cientifico' | 'capacitacion' | 'simposio' | 'stand' | 'otro';
  attendees: number;
  date: string;
  budget: 'hasta-500k' | '500k-2m' | '2m-5m' | '5m+';
  company: string;
  email: string;
  notes: string;
};

export const EVENT_TYPE_LABELS: Record<WizardData['eventType'], string> = {
  'lanzamiento': 'Lanzamiento',
  'congreso-cientifico': 'Congreso científico',
  'capacitacion': 'Capacitación',
  'simposio': 'Simposio',
  'stand': 'Stand',
  'otro': 'Otro',
};

export const BUDGET_LABELS: Record<WizardData['budget'], string> = {
  'hasta-500k': 'Hasta $500.000',
  '500k-2m': '$500.000 – $2.000.000',
  '2m-5m': '$2.000.000 – $5.000.000',
  '5m+': '$5.000.000+',
};

export const RECOMMENDED_SERVICES: Record<WizardData['eventType'], string[]> = {
  'lanzamiento': ['Escenografía', 'A/V', 'Producción de contenido'],
  'congreso-cientifico': ['Sala plenaria', 'Traducción simultánea', 'Transmisión en vivo'],
  'capacitacion': ['Aula equipada', 'Material didáctico', 'Catering'],
  'simposio': ['Paneles y mesas redondas', 'Moderación', 'Transmisión en vivo'],
  'stand': ['Diseño de stand', 'Personal de piso', 'Logística de feria'],
  'otro': ['Consultoría personalizada'],
};

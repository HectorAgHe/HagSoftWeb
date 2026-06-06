/**
 * Modelos del flujo de contacto (WhatsApp + mailto).
 */

export enum ContactChannel {
  WhatsApp = 'whatsapp',
  Email = 'email'
}

export enum FormStatus {
  Idle = 'idle',
  Sending = 'sending',
  Success = 'success',
  Error = 'error'
}

/** Datos completos del formulario de contacto del sitio. */
export interface ContactFormData {
  readonly nombre: string;
  readonly email: string;
  readonly telefono?: string;
  readonly empresa?: string;
  readonly servicio?: string;        // slug o título del servicio de interés
  readonly presupuesto?: string;     // rango aproximado
  readonly asunto: string;
  readonly mensaje: string;
}

/** Versión genérica usada por componentes simples (WhatsApp redirect). */
export interface ContactForm {
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
}

export interface QuoteForm extends ContactForm {
  empresa?: string;
  serviceId?: string;
  presupuesto?: string;
  plazo?: string;
}

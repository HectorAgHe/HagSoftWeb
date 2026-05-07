/**
 * Modelos del flujo de contacto (WhatsApp + EmailJS).
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

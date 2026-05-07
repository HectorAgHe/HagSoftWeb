import { Injectable, signal } from '@angular/core';
import { ContactForm, FormStatus, QuoteForm } from '../models/contact.model';

/**
 * ContactService
 * - sendQuote(): envío formal por EmailJS (a implementar en Fase 1).
 * - openWhatsApp(): redirige a wa.me con mensaje pre-llenado.
 *
 * TODO: integrar @emailjs/browser leyendo keys de environment.
 */
@Injectable({ providedIn: 'root' })
export class ContactService {
  readonly status = signal<FormStatus>(FormStatus.Idle);

  /** Envía una cotización por EmailJS. */
  async sendQuote(_form: QuoteForm): Promise<void> {
    this.status.set(FormStatus.Sending);
    // TODO: emailjs.send(serviceId, templateId, payload, publicKey)
    this.status.set(FormStatus.Success);
  }

  /** Genera la URL de WhatsApp con mensaje pre-llenado. */
  buildWhatsAppUrl(phone: string, message: string): string {
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encoded}`;
  }

  /** Construye un mensaje base a partir del formulario de contacto. */
  buildContactMessage(form: ContactForm): string {
    return [
      `Hola HagSoft, soy ${form.nombre}.`,
      form.email ? `Mi correo: ${form.email}` : null,
      form.telefono ? `Mi teléfono: ${form.telefono}` : null,
      '',
      form.mensaje
    ]
      .filter((line): line is string => line !== null)
      .join('\n');
  }
}

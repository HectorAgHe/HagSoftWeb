import { Injectable, signal } from '@angular/core';
import {
  ContactForm,
  ContactFormData,
  FormStatus,
  QuoteForm
} from '../models/contact.model';

/* ════════════════════════════════════════════════════════════════════════
 *
 *   📧  CAMBIA AQUÍ EL CORREO DE DESTINO DEL FORMULARIO
 *
 *   Este es el correo al que llegarán los mensajes que envíe la gente
 *   desde la página /contacto. Si lo cambias en el futuro (ej. ventas@,
 *   un alias, o cuando integres EmailJS / API), modifica esta constante
 *   y todo lo demás sigue funcionando.
 *
 * ═══════════════════════════════════════════════════════════════════════ */
export const HAGSOFT_CONTACT_EMAIL = 'contacto@hagsoft.mx';

/* ────────────────────────────────────────────────────────────────────────
 * Número de WhatsApp para el botón flotante y CTAs. Cambia aquí también.
 * ──────────────────────────────────────────────────────────────────────── */
export const HAGSOFT_WHATSAPP = '521000000000'; // formato: 52 + lada + número

/**
 * ContactService
 * - buildMailtoUrl(): arma un mailto: con subject y body pre-llenados
 *   para abrir el cliente de correo del usuario. No envía nada
 *   automáticamente — el usuario revisa y envía manualmente.
 * - buildWhatsAppUrl(): genera URL de wa.me con mensaje pre-llenado.
 */
@Injectable({ providedIn: 'root' })
export class ContactService {
  readonly status = signal<FormStatus>(FormStatus.Idle);

  /** Genera el URL mailto: que abre el cliente de correo del usuario. */
  buildMailtoUrl(form: ContactFormData): string {
    const subject = encodeURIComponent(`[HagSoft] ${form.asunto}`);
    const body = encodeURIComponent(this.formatEmailBody(form));
    return `mailto:${HAGSOFT_CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  /** Abre el cliente de correo del usuario con el mensaje pre-llenado. */
  openMailto(form: ContactFormData): void {
    if (typeof window === 'undefined') return;
    window.location.href = this.buildMailtoUrl(form);
    this.status.set(FormStatus.Success);
  }

  /**
   * Genera el URL de Gmail web compose con todo pre-llenado.
   * Se abre en pestaña nueva para no perder el form del usuario.
   * Funciona en cualquier OS sin depender del handler default de mailto.
   */
  buildGmailUrl(form: ContactFormData): string {
    const params = new URLSearchParams({
      view: 'cm',
      fs: '1',
      to: HAGSOFT_CONTACT_EMAIL,
      su: `[HagSoft] ${form.asunto}`,
      body: this.formatEmailBody(form)
    });
    return `https://mail.google.com/mail/?${params.toString()}`;
  }

  openGmail(form: ContactFormData): void {
    if (typeof window === 'undefined') return;
    window.open(this.buildGmailUrl(form), '_blank', 'noopener,noreferrer');
    this.status.set(FormStatus.Success);
  }

  /** Copia el mensaje completo al portapapeles (formato: asunto + body). */
  async copyToClipboard(form: ContactFormData): Promise<boolean> {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return false;
    const subject = `[HagSoft] ${form.asunto}`;
    const fullText = [
      `Para: ${HAGSOFT_CONTACT_EMAIL}`,
      `Asunto: ${subject}`,
      '',
      this.formatEmailBody(form)
    ].join('\n');
    try {
      await navigator.clipboard.writeText(fullText);
      this.status.set(FormStatus.Success);
      return true;
    } catch {
      this.status.set(FormStatus.Error);
      return false;
    }
  }

  /** Cuerpo formateado del correo — bonito para que Héctor lo lea fácil. */
  private formatEmailBody(form: ContactFormData): string {
    const lines = [
      'Hola Héctor,',
      '',
      'Te escribo desde el sitio de HagSoft. Estos son mis datos:',
      '',
      '──────── CONTACTO ────────',
      `Nombre:    ${form.nombre}`,
      `Email:     ${form.email}`,
      `Teléfono:  ${form.telefono || '—'}`,
      `Empresa:   ${form.empresa || '—'}`,
      '',
      '──────── INTERÉS ────────',
      `Servicio:    ${form.servicio || 'No especificado'}`,
      `Presupuesto: ${form.presupuesto || 'Por definir'}`,
      '',
      '──────── MENSAJE ────────',
      form.mensaje,
      '',
      '—',
      'Enviado desde hagsoft.mx'
    ];
    return lines.join('\n');
  }

  /* ----------------------------------------------------------------
   * Métodos viejos preservados para compatibilidad (whatsapp-btn, etc.)
   * ---------------------------------------------------------------- */
  async sendQuote(_form: QuoteForm): Promise<void> {
    this.status.set(FormStatus.Sending);
    // TODO: integrar EmailJS / API
    this.status.set(FormStatus.Success);
  }

  buildWhatsAppUrl(phone: string, message: string): string {
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encoded}`;
  }

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

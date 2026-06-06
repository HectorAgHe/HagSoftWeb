import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogService } from '../../../../core/services/catalog.service';
import { ContactService, HAGSOFT_CONTACT_EMAIL } from '../../../../core/services/contact.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ContactFormData } from '../../../../core/models/contact.model';

/**
 * Formulario de contacto con tres formas de enviar:
 *   1) mailto: → abre el cliente de correo default del sistema
 *   2) Gmail web → URL de Gmail compose (nueva pestaña)
 *   3) Clipboard → copia el mensaje formateado al portapapeles
 *
 * Cero backend, cero auto-envío. El usuario siempre tiene control final.
 */
@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css'
})
export class ContactForm {
  private readonly fb = inject(FormBuilder);
  private readonly contactSvc = inject(ContactService);
  private readonly toast = inject(ToastService);
  private readonly catalog = inject(CatalogService);

  readonly destinationEmail = HAGSOFT_CONTACT_EMAIL;
  readonly servicesList = this.catalog.services;
  readonly hasOpenedMailto = signal(false);
  readonly menuOpen = signal(false);

  readonly presupuestos: ReadonlyArray<string> = [
    'Menos de $10,000 MXN',
    '$10,000 – $30,000 MXN',
    '$30,000 – $60,000 MXN',
    'Más de $60,000 MXN',
    'Por definir'
  ];

  readonly form = this.fb.nonNullable.group({
    nombre:      ['', [Validators.required, Validators.minLength(2)]],
    email:       ['', [Validators.required, Validators.email]],
    telefono:    [''],
    empresa:     [''],
    servicio:    [''],
    presupuesto: [''],
    asunto:      ['', [Validators.required, Validators.minLength(3)]],
    mensaje:     ['', [Validators.required, Validators.minLength(10)]]
  });

  showError(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  setAsunto(value: string): void {
    this.form.patchValue({ asunto: value });
    this.form.get('asunto')?.markAsDirty();
  }

  toggleMenu(): void {
    this.menuOpen.update(open => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  /** Acción default del botón principal "Enviar" → mailto del sistema. */
  onSubmit(): void {
    if (!this.validateBeforeSend()) return;
    const data = this.form.getRawValue() as ContactFormData;
    this.contactSvc.openMailto(data);
    this.hasOpenedMailto.set(true);
    this.toast.success(
      'Se abrió tu cliente de correo. Revisa el borrador y dale enviar.',
      5000
    );
  }

  /** Opción del menú: abrir directamente Gmail web. */
  sendViaGmail(): void {
    if (!this.validateBeforeSend()) return;
    const data = this.form.getRawValue() as ContactFormData;
    this.contactSvc.openGmail(data);
    this.hasOpenedMailto.set(true);
    this.closeMenu();
    this.toast.success('Se abrió Gmail en una pestaña nueva.', 5000);
  }

  /** Opción del menú: copiar el mensaje al portapapeles. */
  async sendViaClipboard(): Promise<void> {
    if (!this.validateBeforeSend()) return;
    const data = this.form.getRawValue() as ContactFormData;
    const ok = await this.contactSvc.copyToClipboard(data);
    this.closeMenu();
    if (ok) {
      this.toast.success(
        'Mensaje copiado. Pégalo en tu cliente de correo favorito.',
        5000
      );
      this.hasOpenedMailto.set(true);
    } else {
      this.toast.error('No se pudo copiar. Intenta otra opción.');
    }
  }

  resetForm(): void {
    this.form.reset();
    this.hasOpenedMailto.set(false);
    this.closeMenu();
  }

  /** Valida el form y muestra warning si está incompleto. Centralizado. */
  private validateBeforeSend(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.warning('Revisa los campos marcados antes de enviar.');
      this.closeMenu();
      return false;
    }
    return true;
  }
}

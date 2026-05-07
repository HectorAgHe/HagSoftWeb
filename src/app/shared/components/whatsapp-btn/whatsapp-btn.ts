import { Component } from '@angular/core';

/**
 * Botón flotante de WhatsApp — siempre visible en todas las rutas.
 * Número y mensaje se leerán de environment cuando se configuren.
 */
@Component({
  selector: 'app-whatsapp-btn',
  standalone: true,
  imports: [],
  templateUrl: './whatsapp-btn.html',
  styleUrl: './whatsapp-btn.css'
})
export class WhatsappBtn {
  // TODO: leer environment.whatsappNumber
  readonly whatsappUrl = 'https://wa.me/521000000000?text=Hola%20HagSoft';
}

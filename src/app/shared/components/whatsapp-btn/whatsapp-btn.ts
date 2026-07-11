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
  readonly whatsappUrl = 'https://wa.me/525639752147?text=Hola%20HagSoft';
}

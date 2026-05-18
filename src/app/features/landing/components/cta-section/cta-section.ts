import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Commitment {
  readonly icon: 'code' | 'shield' | 'headset' | 'check';
  readonly title: string;
  readonly description: string;
}

@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cta-section.html',
  styleUrl: './cta-section.css'
})
export class CtaSection {
  // TODO: leer environment.whatsappNumber
  readonly whatsappUrl =
    'https://wa.me/521000000000?text=' +
    encodeURIComponent('Hola HagSoft, quiero saber más sobre sus servicios.');

  readonly commitments: readonly Commitment[] = [
    {
      icon: 'code',
      title: 'El código es tuyo',
      description: 'Propiedad total desde el día uno. Sin candados, sin amarres.'
    },
    {
      icon: 'shield',
      title: 'Sin sorpresas',
      description: 'El precio que acordamos no cambia. Cero costos ocultos.'
    },
    {
      icon: 'headset',
      title: 'Soporte real',
      description: 'Contacto directo con Héctor por WhatsApp. Sin call centers.'
    },
    {
      icon: 'check',
      title: 'Garantía 30 días',
      description: 'Errores corregidos sin costo extra después de la entrega.'
    }
  ];
}

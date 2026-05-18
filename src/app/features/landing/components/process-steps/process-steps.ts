import { Component } from '@angular/core';

interface ProcessStep {
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly highlight: string;
}

interface PaymentMilestone {
  readonly percent: string;
  readonly title: string;
  readonly description: string;
}

@Component({
  selector: 'app-process-steps',
  standalone: true,
  imports: [],
  templateUrl: './process-steps.html',
  styleUrl: './process-steps.css'
})
export class ProcessSteps {
  readonly steps: readonly ProcessStep[] = [
    {
      number: '01',
      title: 'Hablamos',
      description:
        'Diagnóstico sin costo. Platicamos sobre tu negocio, identificamos dolores reales y vemos si encajamos.',
      highlight: '30–45 minutos'
    },
    {
      number: '02',
      title: 'Propuesta clara',
      description:
        'Te entregamos plan, alcance y precio fijo. Si te late, firmamos. Si no, nos despedimos como amigos.',
      highlight: 'Precio cerrado'
    },
    {
      number: '03',
      title: 'Demo funcional',
      description:
        'A mitad del proyecto ves el sistema funcionando con tus datos reales. Ajustamos antes de entregar.',
      highlight: 'Sin sorpresas'
    },
    {
      number: '04',
      title: 'Entrega y soporte',
      description:
        'Capacitamos a tu equipo, te dejamos el código tuyo y damos 30 días de soporte incluidos.',
      highlight: 'Código tuyo'
    }
  ];

  readonly payments: readonly PaymentMilestone[] = [
    {
      percent: '50%',
      title: 'Al firmar',
      description: 'Para iniciar desarrollo'
    },
    {
      percent: '25%',
      title: 'Demo aprobada',
      description: 'A mitad del proyecto'
    },
    {
      percent: '25%',
      title: 'Entrega final',
      description: 'Sistema listo para usar'
    }
  ];
}

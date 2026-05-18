import { Component } from '@angular/core';

interface PainPoint {
  readonly text: string;
}

interface Benefit {
  readonly text: string;
}

@Component({
  selector: 'app-problem-solution',
  standalone: true,
  imports: [],
  templateUrl: './problem-solution.html',
  styleUrl: './problem-solution.css'
})
export class ProblemSolution {
  readonly pains: readonly PainPoint[] = [
    { text: 'Inventario en Excel que se descontrola' },
    { text: 'Vendes productos agotados sin saberlo' },
    { text: 'Sin visibilidad de ganancias en tiempo real' },
    { text: 'Sistemas que no se comunican entre sí' },
    { text: 'Presencia digital limitada o inexistente' }
  ];

  readonly benefits: readonly Benefit[] = [
    { text: 'Inventario en tiempo real desde tu celular' },
    { text: 'Alertas automáticas de stock bajo' },
    { text: 'Reporte de ventas y ganancias del día' },
    { text: 'Un solo sistema que centraliza todo' },
    { text: 'Presencia web profesional y funcional' }
  ];
}

import { Component } from '@angular/core';
import { Hero } from './components/hero/hero';
import { ProblemSolution } from './components/problem-solution/problem-solution';
import { ServicesSection } from './components/services-section/services-section';
import { ProcessSteps } from './components/process-steps/process-steps';
import { CtaSection } from './components/cta-section/cta-section';

/**
 * LandingComponent — orquesta las secciones de la página principal (/).
 */
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [Hero, ProblemSolution, ServicesSection, ProcessSteps, CtaSection],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {}

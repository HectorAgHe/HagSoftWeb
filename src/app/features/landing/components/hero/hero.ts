import {
  Component,
  signal,
  computed,
  afterNextRender,
  inject,
  DestroyRef
} from '@angular/core';
import { TechSpheres } from './tech-spheres/tech-spheres';

type HeroStage = 0 | 1 | 2;

/**
 * Hero multi-stage con sticky scroll.
 *
 * - El contenedor mide 300vh para que el usuario pueda hacer scroll
 *   a través de 3 "escenas" antes de pasar al resto del landing.
 * - Adentro hay un panel sticky de 100vh que se queda fijo en pantalla
 *   mientras las escenas se intercambian con opacidad.
 * - Stage 0: animated mesh gradient + título.
 * - Stage 1: ilustración dashboard + texto a la derecha.
 * - Stage 2: ilustración mobile + texto a la izquierda.
 *
 * Performance:
 * - Scroll listener throttleado con requestAnimationFrame.
 * - Animaciones solo en transform/opacity (GPU-accelerated).
 * - SSR-safe vía afterNextRender. Cleanup en DestroyRef.
 */
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [TechSpheres],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero {
  private readonly destroyRef = inject(DestroyRef);

  readonly stage = signal<HeroStage>(0);
  readonly progress = signal(0);

  readonly isInitial = computed(() => this.stage() === 0);

  constructor() {
    afterNextRender(() => {
      let raf = 0;

      const compute = (): void => {
        const el = document.getElementById('hs-hero');
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        const raw = total <= 0 ? 0 : -rect.top / total;
        const progress = Math.max(0, Math.min(1, raw));

        this.progress.set(progress);

        if (progress < 0.34) this.stage.set(0);
        else if (progress < 0.67) this.stage.set(1);
        else this.stage.set(2);
      };

      const onScroll = (): void => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          compute();
          raf = 0;
        });
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      compute();

      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        if (raf) cancelAnimationFrame(raf);
      });
    });
  }
}

import { Component, signal, afterNextRender, inject, DestroyRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/**
 * Navbar global — sticky-top con efecto hide-on-scroll.
 * - Se ve estático al inicio (scrollY <= 10).
 * - Se oculta con transform translateY(-100%) cuando scrollY > 10.
 * - Reaparece al regresar al tope (scrollY <= 10).
 * - Si el menú mobile está abierto, no se oculta.
 *
 * Mobile collapse manejado con signal — sin JS de Bootstrap.
 * SSR-safe gracias a afterNextRender (solo se ejecuta en navegador).
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private readonly destroyRef = inject(DestroyRef);

  readonly isMenuOpen = signal(false);
  readonly isScrolled = signal(false);

  constructor() {
    afterNextRender(() => {
      const onScroll = (): void => {
        this.isScrolled.set(window.scrollY > 10);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
      });
    });
  }

  toggleMenu(): void {
    this.isMenuOpen.update(open => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}

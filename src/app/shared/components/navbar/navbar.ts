import { Component, signal, afterNextRender, inject, DestroyRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';

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
  private readonly toast = inject(ToastService);

  readonly isMenuOpen = signal(false);
  readonly isScrolled = signal(false);

  constructor() {
    afterNextRender(() => {
      const root = document.documentElement;
      const onScroll = (): void => {
        const scrolled = window.scrollY > 10;
        this.isScrolled.set(scrolled);
        // Doble enlace para que componentes externos (ej. tabs sticky de
        // /servicios) reaccionen sin tener referencia al navbar:
        //   1) Clase booleana (selectores CSS clásicos)
        //   2) CSS variable con la altura efectiva del navbar (0 si oculto)
        root.classList.toggle('hs-navbar-is-hidden', scrolled);
        root.style.setProperty('--hs-navbar-h', scrolled ? '0px' : '70px');
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        root.classList.remove('hs-navbar-is-hidden');
        root.style.removeProperty('--hs-navbar-h');
      });
    });
  }

  toggleMenu(): void {
    this.isMenuOpen.update(open => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  /** Click sobre "Blog" — muestra toast y cierra el menú móvil. */
  showBlogComingSoon(event: Event): void {
    event.preventDefault();
    this.toast.info('El blog estará disponible próximamente.');
    this.closeMenu();
  }
}

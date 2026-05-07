import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/**
 * Navbar global — sticky-top, responsive con Bootstrap.
 * El collapse mobile lo manejamos con un signal local
 * para evitar depender del JS de Bootstrap.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  readonly isMenuOpen = signal(false);

  toggleMenu(): void {
    this.isMenuOpen.update(open => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}

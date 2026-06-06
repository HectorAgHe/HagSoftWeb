import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  private readonly toast = inject(ToastService);

  readonly currentYear = new Date().getFullYear();

  /** Click sobre "Blog" en el footer — muestra toast "Próximamente". */
  showBlogComingSoon(event: Event): void {
    event.preventDefault();
    this.toast.info('El blog estará disponible próximamente.');
  }
}

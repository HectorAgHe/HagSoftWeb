import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class Toast {
  private readonly svc = inject(ToastService);
  readonly toasts = this.svc.toasts;

  dismiss(id: number): void {
    this.svc.dismiss(id);
  }
}

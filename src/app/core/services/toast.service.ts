import { Injectable, signal } from '@angular/core';

export type ToastType = 'info' | 'success' | 'error' | 'warning';

export interface ToastItem {
  readonly id: number;
  readonly message: string;
  readonly type: ToastType;
  readonly duration: number;
}

export interface ToastOptions {
  readonly type?: ToastType;
  /** ms antes de auto-cerrarse. Default 3500. 0 = no auto-cerrar. */
  readonly duration?: number;
}

/**
 * ToastService — notificaciones flotantes ligeras.
 * Signal-based, sin dependencias externas. Render hecho por <app-toast />
 * que se monta una sola vez a nivel de app.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<readonly ToastItem[]>([]);
  readonly toasts = this._toasts.asReadonly();
  private nextId = 1;

  show(message: string, options: ToastOptions = {}): void {
    const toast: ToastItem = {
      id: this.nextId++,
      message,
      type: options.type ?? 'info',
      duration: options.duration ?? 3500
    };
    this._toasts.update(list => [...list, toast]);
    if (toast.duration > 0) {
      setTimeout(() => this.dismiss(toast.id), toast.duration);
    }
  }

  /** Atajos por tipo */
  info(message: string, duration?: number): void {
    this.show(message, { type: 'info', duration });
  }
  success(message: string, duration?: number): void {
    this.show(message, { type: 'success', duration });
  }
  error(message: string, duration?: number): void {
    this.show(message, { type: 'error', duration });
  }
  warning(message: string, duration?: number): void {
    this.show(message, { type: 'warning', duration });
  }

  dismiss(id: number): void {
    this._toasts.update(list => list.filter(t => t.id !== id));
  }

  clear(): void {
    this._toasts.set([]);
  }
}

import { Injectable, computed, signal } from '@angular/core';
import { Service, ServiceCategory } from '../models/service.model';

/**
 * CatalogService
 * Provee el catálogo de servicios. Por ahora hardcoded;
 * en Fase 2 vendrá de la API .NET 10.
 */
@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly _services = signal<readonly Service[]>([]);

  readonly services = this._services.asReadonly();
  readonly featured = computed(() =>
    this._services().filter(s => s.featured)
  );

  /** Carga el catálogo (placeholder — reemplazar con HTTP en Fase 2). */
  loadCatalog(): void {
    this._services.set([]);
  }

  /** Devuelve un servicio por slug. */
  getBySlug(slug: string): Service | undefined {
    return this._services().find(s => s.slug === slug);
  }

  /** Filtra por categoría. */
  getByCategory(category: ServiceCategory): readonly Service[] {
    return this._services().filter(s => s.category === category);
  }
}

import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../../../core/services/catalog.service';
import { CATEGORY_LABELS, Service } from '../../../../core/models/service.model';
import { CurrencyMxPipe } from '../../../../shared/pipes/currency-mx.pipe';
import { CtaSection } from '../../../landing/components/cta-section/cta-section';

/**
 * Página de detalle de un servicio individual.
 * Ruta: /servicios/:slug
 *
 * El input `slug` se recibe automáticamente desde el param de ruta
 * gracias a withComponentInputBinding() configurado en app.config.ts.
 */
@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [RouterLink, CurrencyMxPipe, CtaSection],
  templateUrl: './service-detail.html',
  styleUrl: './service-detail.css'
})
export class ServiceDetail {
  private readonly catalog = inject(CatalogService);

  /** Slug recibido desde la URL via withComponentInputBinding(). */
  readonly slug = input<string>('');

  /** Servicio resuelto desde el slug. undefined si no existe. */
  readonly service = computed(() => this.catalog.getBySlug(this.slug()));

  /** Etiqueta legible de la categoría. */
  readonly categoryLabel = computed(() => {
    const svc = this.service();
    return svc ? CATEGORY_LABELS[svc.category] : '';
  });

  /** Servicios sugeridos: otros 3 de la misma categoría o featured. */
  readonly relatedServices = computed<readonly Service[]>(() => {
    const current = this.service();
    if (!current) return [];
    const all = this.catalog.services();
    const sameCategory = all.filter(s => s.category === current.category && s.id !== current.id);
    const featured = all.filter(s => s.featured && s.id !== current.id);

    // Combinar sin duplicados, máximo 3. Result es mutable (Service[])
    // porque vamos a hacer push; al retornarlo, el caller lo recibe como
    // readonly Service[] gracias al type param del computed.
    const seen = new Set<string>();
    const result: Service[] = [];
    for (const s of [...sameCategory, ...featured]) {
      if (!seen.has(s.id) && result.length < 3) {
        seen.add(s.id);
        result.push(s);
      }
    }
    return result;
  });
}

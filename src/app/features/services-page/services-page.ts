import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../core/services/catalog.service';
import { CATEGORY_LABELS, ServiceCategory } from '../../core/models/service.model';
import { CurrencyMxPipe } from '../../shared/pipes/currency-mx.pipe';
import { CtaSection } from '../landing/components/cta-section/cta-section';

/** Valor especial del tab "todos" — no es una categoría real. */
type TabId = ServiceCategory | 'all';

interface Tab {
  readonly id: TabId;
  readonly label: string;
  readonly count: number;
}

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [RouterLink, CurrencyMxPipe, CtaSection],
  templateUrl: './services-page.html',
  styleUrl: './services-page.css'
})
export class ServicesPage {
  private readonly catalog = inject(CatalogService);

  /** Tab activa — controla el filtrado. Default: todos. */
  readonly activeTab = signal<TabId>('all');

  /**
   * Lista de tabs derivada del catálogo. Solo se muestran categorías
   * que tienen al menos un servicio (incluyendo coming-soon).
   * Se reordena para que la categoría con más servicios aparezca primero.
   */
  readonly tabs = computed<readonly Tab[]>(() => {
    const services = this.catalog.services();
    const counts = new Map<ServiceCategory, number>();
    for (const s of services) {
      counts.set(s.category, (counts.get(s.category) ?? 0) + 1);
    }
    const categoryTabs: Tab[] = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([cat, count]) => ({
        id: cat,
        label: CATEGORY_LABELS[cat],
        count
      }));

    return [
      { id: 'all' as const, label: 'Todos', count: services.length },
      ...categoryTabs
    ];
  });

  /** Servicios visibles según el tab activo. */
  readonly filteredServices = computed(() => {
    const tab = this.activeTab();
    const all = this.catalog.services();
    return tab === 'all' ? all : all.filter(s => s.category === tab);
  });

  selectTab(id: TabId): void {
    this.activeTab.set(id);
  }

  isActive(id: TabId): boolean {
    return this.activeTab() === id;
  }
}

/**
 * Modelos del catálogo de servicios HagSoft.
 *
 * El campo `category` es la pieza clave para el filtrado por tabs y para
 * la integración con la futura API: el backend devolverá la misma estructura
 * y el frontend solo mapea cada enum a un label legible.
 */

export enum ServiceCategory {
  POS       = 'pos',
  WebApp    = 'web-app',
  Website   = 'website',
  Mobile    = 'mobile',
  ERP       = 'erp',
  IoT       = 'iot',
  Consulting = 'consulting'
}

/** Etiquetas visibles para cada categoría (i18n-ready). */
export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  [ServiceCategory.POS]:       'POS',
  [ServiceCategory.WebApp]:    'Apps web',
  [ServiceCategory.Website]:   'Páginas web',
  [ServiceCategory.Mobile]:    'Apps móviles',
  [ServiceCategory.ERP]:       'ERP / Odoo',
  [ServiceCategory.IoT]:       'IoT',
  [ServiceCategory.Consulting]:'Consultoría'
};

export interface Price {
  readonly amount: number;
  readonly currency: 'MXN' | 'USD';
  readonly suffix?: string;
}

export interface GalleryImage {
  readonly src: string;
  readonly alt: string;
  readonly caption?: string;
}

export interface GalleryVideo {
  readonly src: string;
  readonly poster?: string;
  readonly title?: string;
}

/** Galería de proyectos asociada a un servicio (mock por ahora, API después). */
export interface ServiceGallery {
  readonly images?: readonly GalleryImage[];
  readonly videos?: readonly GalleryVideo[];
}

export interface Service {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly category: ServiceCategory;
  readonly summary: string;
  readonly description: string;
  readonly features: readonly string[];
  readonly price: Price;
  readonly icon?: string;
  /** Si está destacado: el landing lo incluye en el grid de 4 cards. */
  readonly featured?: boolean;
  /** Producto bandera de HagSoft — debe ser único en todo el catálogo. */
  readonly isAnchor?: boolean;
  /** Etiqueta opcional para servicios en roadmap (no contratables aún). */
  readonly status?: 'available' | 'coming-soon';
  /** Imágenes y videos de proyectos reales. Mock ahora, API después. */
  readonly gallery?: ServiceGallery;
}

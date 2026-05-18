import { Injectable, computed, signal } from '@angular/core';
import { Service, ServiceCategory } from '../models/service.model';

/**
 * CatalogService
 * Provee el catálogo de servicios HagSoft.
 * Datos del Documento de Empresa v1.0 — precios MXN + IVA.
 *
 * En Fase 2 estos datos vendrán de la API .NET 10.
 */
@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly _services = signal<readonly Service[]>(SERVICES_SEED);

  readonly services = this._services.asReadonly();
  readonly featured = computed(() => this._services().filter(s => s.featured));

  /** Devuelve un servicio por slug. */
  getBySlug(slug: string): Service | undefined {
    return this._services().find(s => s.slug === slug);
  }

  /** Filtra por categoría. */
  getByCategory(category: ServiceCategory): readonly Service[] {
    return this._services().filter(s => s.category === category);
  }
}

/* ----------------------------------------------------------------
 * Catálogo seed — servicios reales de HagSoft
 * ---------------------------------------------------------------- */
const SERVICES_SEED: readonly Service[] = [
  {
    id: 'sistema-tienda',
    slug: 'sistema-control-tienda',
    title: 'Sistema de control para tu tienda',
    category: ServiceCategory.POS,
    summary: 'El núcleo digital de tu negocio. Inventario, ventas y reportes en un solo lugar.',
    description:
      'Reemplaza el Excel con un sistema hecho a tu medida. Controla tu inventario en tiempo real, registra ventas con punto de venta básico, recibe alertas de stock bajo y genera reportes claros desde cualquier dispositivo.',
    features: [
      'Inventario en tiempo real con alertas de stock',
      'Registro de ventas y punto de venta básico',
      'Panel de reportes: día, semana, mes',
      'Catálogo de clientes y control de créditos',
      'Acceso desde computadora y celular',
      'Capacitación hasta 3 usuarios · 30 días de soporte'
    ],
    price: { amount: 18000, currency: 'MXN', suffix: '+ IVA · desde' },
    icon: 'box',
    featured: true
  },
  {
    id: 'sitio-web',
    slug: 'sitio-web-profesional',
    title: 'Sitio web profesional',
    category: ServiceCategory.Web,
    summary: 'Presencia digital seria, mobile-first y optimizada para Google.',
    description:
      'Un sitio web a la medida que se ve bien en cualquier dispositivo, carga rápido y es encontrable. Pensado para tiendas y comercios que quieren proyectar profesionalismo desde el primer clic.',
    features: [
      'Diseño a medida — sin plantillas genéricas',
      'SEO básico configurado desde el día uno',
      'Mobile-first y carga rápida',
      'Catálogo de productos / servicios',
      'Formulario de contacto con WhatsApp',
      'Entrega en 2–3 semanas'
    ],
    price: { amount: 8000, currency: 'MXN', suffix: '+ IVA · desde' },
    icon: 'globe',
    featured: true
  },
  {
    id: 'ecommerce',
    slug: 'tienda-en-linea',
    title: 'Tienda en línea (e-commerce)',
    category: ServiceCategory.Web,
    summary: 'Vende 24/7 con carrito, pagos en línea y conexión a tu inventario.',
    description:
      'Una tienda online que cobra por MercadoPago o Stripe, gestiona pedidos y opcionalmente se conecta a tu sistema de inventario para no vender lo que ya no tienes.',
    features: [
      'Carrito de compras con MercadoPago / Stripe',
      'Gestión de pedidos y pagos',
      'Integración opcional con tu inventario',
      'Notificaciones por correo y WhatsApp',
      'Diseño responsive optimizado para conversión',
      'Entrega en 3–5 semanas'
    ],
    price: { amount: 12000, currency: 'MXN', suffix: '+ IVA · desde' },
    icon: 'shopping-cart',
    featured: true
  },
  {
    id: 'odoo-erp',
    slug: 'implementacion-odoo',
    title: 'Implementación Odoo (ERP)',
    category: ServiceCategory.ERP,
    summary: 'ERP serio y accesible. Inventario, contabilidad y CFDI en una plataforma.',
    description:
      'Implementación de Odoo Community con módulos de inventario, compras, ventas, contabilidad y facturación CFDI/SAT. Capacitamos a tu equipo y dejamos el sistema listo para operar.',
    features: [
      'Odoo Community — instalación y configuración',
      'Módulos de inventario, compras, ventas y contabilidad',
      'Facturación CFDI / SAT integrada',
      'Capacitación al equipo',
      'Personalización de reportes',
      'Entrega en 3–6 semanas'
    ],
    price: { amount: 20000, currency: 'MXN', suffix: '+ IVA · desde' },
    icon: 'layers',
    featured: true
  }
] as const;

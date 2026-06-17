import { Injectable, computed, signal } from '@angular/core';
import { Service, ServiceCategory } from '../models/service.model';

/**
 * CatalogService — único punto de origen del catálogo de servicios.
 *
 * Actualmente devuelve datos hardcoded (SERVICES_SEED). Cuando exista la
 * API, basta con reemplazar el `signal(SERVICES_SEED)` por una llamada
 * HTTP que actualice el signal — los componentes que consumen `services`
 * o `featured` no requieren cambios.
 */
@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly _services = signal<readonly Service[]>(SERVICES_SEED);

  readonly services = this._services.asReadonly();
  readonly featured = computed(() => this._services().filter(s => s.featured));

  /**
   * Categorías que tienen al menos un servicio publicado (excluye coming-soon).
   * Esto es lo que usan los tabs para no mostrar pestañas vacías.
   */
  readonly availableCategories = computed(() => {
    const set = new Set<ServiceCategory>();
    for (const s of this._services()) {
      set.add(s.category);
    }
    return Array.from(set);
  });

  /** Devuelve un servicio por slug. */
  getBySlug(slug: string): Service | undefined {
    return this._services().find(s => s.slug === slug);
  }

  /** Filtra por categoría. */
  getByCategory(category: ServiceCategory): readonly Service[] {
    return this._services().filter(s => s.category === category);
  }

  /**
   * Hook futuro para refrescar desde la API.
   * Cuando exista, se llamará en main.ts o en un APP_INITIALIZER.
   */
  // async refresh(): Promise<void> {
  //   const list = await firstValueFrom(this.http.get<Service[]>('/api/services'));
  //   this._services.set(list);
  // }
}

/* ----------------------------------------------------------------
 * Catálogo seed — servicios actuales + servicios en pipeline.
 * Datos del Documento de Empresa HagSoft v1.0.
 * ---------------------------------------------------------------- */
/* ════════════════════════════════════════════════════════════════════════
 *
 *   🎨  MOSTRAR GALERÍA DE PROYECTOS (imágenes + videos)
 *
 *   Cuando tengas proyectos reales para mostrar:
 *      1) Reemplaza los src de cada `gallery` de abajo con tus imágenes
 *         y videos reales (sube a tu CDN o coloca en src/assets/).
 *      2) Cambia este flag a `true`.
 *      3) Las galerías aparecen automáticamente en /servicios y
 *         /servicios/:slug — no tienes que tocar templates.
 *
 *   Mientras esto sea false, las galerías quedan ocultas pero los
 *   datos siguen ahí intactos en cada service.gallery.
 *
 * ═══════════════════════════════════════════════════════════════════════ */
export const SHOW_PROJECT_GALLERY = false;

/* ----------------------------------------------------------------
 * Sample video público (Big Buck Bunny) — reemplazar con videos reales
 * cuando se tengan. Picsum.photos genera imágenes consistentes por seed.
 * ---------------------------------------------------------------- */
const SAMPLE_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

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
    featured: true,
    isAnchor: true,            // <- producto bandera, único en el catálogo
    status: 'available',
    gallery: {
      images: [
        { src: 'https://picsum.photos/seed/hagsoft-pos-1/900/560', alt: 'Dashboard de ventas', caption: 'Reportes del día en una sola pantalla' },
        { src: 'https://picsum.photos/seed/hagsoft-pos-2/900/560', alt: 'Catálogo de productos', caption: 'Inventario con alertas de stock' },
        { src: 'https://picsum.photos/seed/hagsoft-pos-3/900/560', alt: 'Punto de venta', caption: 'POS rápido para mostrador' },
        { src: 'https://picsum.photos/seed/hagsoft-pos-4/900/560', alt: 'App móvil', caption: 'Acceso desde el celular' }
      ],
      videos: [
        { src: SAMPLE_VIDEO, poster: 'https://picsum.photos/seed/hagsoft-pos-vid/900/560', title: 'Demo del flujo completo' }
      ]
    }
  },
  {
    id: 'sitio-web',
    slug: 'sitio-web-profesional',
    title: 'Sitio web profesional',
    category: ServiceCategory.Website,
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
    featured: true,
    status: 'available',
    gallery: {
      images: [
        { src: 'https://picsum.photos/seed/hagsoft-web-1/900/560', alt: 'Sitio responsive', caption: 'Diseño mobile-first' },
        { src: 'https://picsum.photos/seed/hagsoft-web-2/900/560', alt: 'Sitio corporativo', caption: 'Identidad limpia y profesional' },
        { src: 'https://picsum.photos/seed/hagsoft-web-3/900/560', alt: 'Página de servicios', caption: 'Catálogo claro y navegable' }
      ],
      videos: [
        { src: SAMPLE_VIDEO, poster: 'https://picsum.photos/seed/hagsoft-web-vid/900/560', title: 'Recorrido por el sitio' }
      ]
    }
  },
  {
    id: 'ecommerce',
    slug: 'tienda-en-linea',
    title: 'Tienda en línea (e-commerce)',
    category: ServiceCategory.WebApp,
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
    featured: true,
    status: 'available',
    gallery: {
      images: [
        { src: 'https://picsum.photos/seed/hagsoft-shop-1/900/560', alt: 'Catálogo de productos', caption: 'Grid optimizado para conversión' },
        { src: 'https://picsum.photos/seed/hagsoft-shop-2/900/560', alt: 'Carrito y checkout', caption: 'Proceso de pago en 3 pasos' },
        { src: 'https://picsum.photos/seed/hagsoft-shop-3/900/560', alt: 'Detalle de producto', caption: 'Fichas con galería de imágenes' },
        { src: 'https://picsum.photos/seed/hagsoft-shop-4/900/560', alt: 'Panel de pedidos', caption: 'Gestión desde un solo lugar' }
      ],
      videos: [
        { src: SAMPLE_VIDEO, poster: 'https://picsum.photos/seed/hagsoft-shop-vid/900/560', title: 'Demo: del catálogo al pago' }
      ]
    }
  },
  {
    id: 'odoo-erp',
    slug: 'implementacion-odoo',
    title: 'Implementación (ERP)',
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
    featured: true,
    status: 'coming-soon',
    gallery: {
      images: [
        { src: 'https://picsum.photos/seed/hagsoft-odoo-1/900/560', alt: 'Módulo de inventario', caption: 'Stock multi-almacén' },
        { src: 'https://picsum.photos/seed/hagsoft-odoo-2/900/560', alt: 'Facturación CFDI', caption: 'Timbrado SAT integrado' },
        { src: 'https://picsum.photos/seed/hagsoft-odoo-3/900/560', alt: 'Reportes contables', caption: 'Estados financieros automáticos' }
      ]
    }
  },
  {
    id: 'mobile-app',
    slug: 'app-movil-negocio',
    title: 'App móvil para tu negocio',
    category: ServiceCategory.Mobile,
    summary: 'Tu marca en el bolsillo de tus clientes. Pedidos, fidelización y notificaciones.',
    description:
      'Aplicación móvil nativa Android e iOS que conecta a tus clientes con tu negocio. Pedidos en línea, programa de lealtad con puntos, notificaciones push de promociones y catálogo siempre actualizado.',
    features: [
      'App nativa para Android e iOS',
      'Pedidos en línea con seguimiento',
      'Programa de fidelización por puntos',
      'Notificaciones push segmentadas',
      'Sincronización con tu sistema de inventario',
      'Publicación en App Store y Google Play incluida'
    ],
    price: { amount: 35000, currency: 'MXN', suffix: '+ IVA · desde' },
    icon: 'mobile',
    status: 'coming-soon',
    gallery: {
      images: [
        { src: 'https://picsum.photos/seed/hagsoft-mobile-1/900/560', alt: 'Pantalla de inicio', caption: 'Onboarding rápido' },
        { src: 'https://picsum.photos/seed/hagsoft-mobile-2/900/560', alt: 'Pedidos en línea', caption: 'Checkout en 2 pasos' },
        { src: 'https://picsum.photos/seed/hagsoft-mobile-3/900/560', alt: 'Programa de lealtad', caption: 'Puntos y recompensas' }
      ],
      videos: [
        { src: SAMPLE_VIDEO, poster: 'https://picsum.photos/seed/hagsoft-mobile-vid/900/560', title: 'Demo: pedido completo en la app' }
      ]
    }
  },
  {
    id: 'iot-monitoreo',
    slug: 'monitoreo-iot',
    title: 'Monitoreo IoT para tu local',
    category: ServiceCategory.IoT,
    summary: 'Sensores conectados a tu sistema. Temperatura, accesos, energía, todo en un panel.',
    description:
      'Instalación y configuración de sensores IoT para tu negocio: monitoreo de temperatura en refrigeradores, control de accesos, consumo eléctrico y alertas en tiempo real al celular cuando algo se sale de rango.',
    features: [
      'Sensores de temperatura, humedad y energía',
      'Cámaras IP integradas al panel',
      'Alertas en tiempo real por WhatsApp',
      'Dashboard centralizado en la nube',
      'Historial de mediciones por 12 meses',
      'Instalación y configuración incluida'
    ],
    price: { amount: 15000, currency: 'MXN', suffix: '+ IVA · desde' },
    icon: 'sensor',
    status: 'coming-soon'
  },
  {
    id: 'consultoria',
    slug: 'consultoria-tecnologica',
    title: 'Consultoría y diagnóstico',
    category: ServiceCategory.Consulting,
    summary: 'Antes de comprar nada, sabemos qué necesitas. Diagnóstico claro y plan de acción.',
    description:
      'Sesión de diagnóstico tecnológico para tu negocio. Revisamos tu operación actual, identificamos cuellos de botella y te entregamos un plan de modernización por etapas con prioridades, presupuestos y plazos realistas.',
    features: [
      'Auditoría de procesos y sistemas actuales',
      'Identificación de oportunidades de automatización',
      'Plan de modernización por fases con presupuesto',
      'Recomendaciones de stack tecnológico',
      'Documentación entregable propiedad del cliente',
      'Sesión de seguimiento 30 días después'
    ],
    price: { amount: 5000, currency: 'MXN', suffix: '+ IVA · sesión' },
    icon: 'compass',
    status: 'available',
    gallery: {
      images: [
        { src: 'https://picsum.photos/seed/hagsoft-consulting-1/900/560', alt: 'Sesión de diagnóstico', caption: 'Análisis de procesos actuales' },
        { src: 'https://picsum.photos/seed/hagsoft-consulting-2/900/560', alt: 'Plan de modernización', caption: 'Roadmap por fases con presupuesto' }
      ]
    }
  }
] as const;

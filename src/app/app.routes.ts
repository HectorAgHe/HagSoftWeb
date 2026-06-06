import { Routes } from '@angular/router';

/**
 * Rutas HagSoft — todas lazy-loaded para code splitting.
 * Cada feature carga su chunk solo cuando el usuario navega.
 */
export const routes: Routes = [
  {
    path: '',
    title: 'HagSoft — Software a la medida para comercios mexicanos',
    loadComponent: () =>
      import('./features/landing/landing').then(m => m.Landing)
  },
  {
    path: 'servicios',
    title: 'Servicios | HagSoft',
    loadComponent: () =>
      import('./features/services-page/services-page').then(m => m.ServicesPage)
  },
  {
    path: 'servicios/:slug',
    title: 'Detalle de servicio | HagSoft',
    loadComponent: () =>
      import('./features/services-page/components/service-detail/service-detail').then(m => m.ServiceDetail)
  },
  {
    path: 'contacto',
    title: 'Contacto | HagSoft',
    loadComponent: () =>
      import('./features/contact/contact').then(m => m.Contact)
  },
  /* ────────────────────────────────────────────────────────
   * Blog deshabilitado por ahora. El navbar/footer disparan
   * un toast "Próximamente" cuando se hace click.
   * Si alguien escribe /blog directo en URL, el wildcard de
   * abajo lo redirige al inicio.
   *
   * Para reactivarlo: descomentar estas rutas + volver a
   * poner routerLink en navbar/footer.
   *
   * { path: 'blog',       loadComponent: () => import('./features/blog/blog').then(m => m.Blog) },
   * { path: 'blog/:slug', loadComponent: () => import('./features/blog/components/post-detail/post-detail').then(m => m.PostDetail) },
   * ──────────────────────────────────────────────────────── */
  {
    path: '**',
    redirectTo: ''
  }
];

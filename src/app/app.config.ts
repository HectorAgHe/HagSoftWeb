import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // withComponentInputBinding() = los params de ruta (ej. :slug) se mapean
    // automáticamente a los inputs del componente con el mismo nombre.
    // Ej: /servicios/sistema-control-tienda → input slug = 'sistema-control-tienda'.
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay())
  ]
};

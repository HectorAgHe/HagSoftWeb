import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling
} from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideRouter(
      routes,
      // Los params de ruta (:slug) se mapean a inputs del componente.
      withComponentInputBinding(),
      // Control del scroll al cambiar de ruta:
      //   - 'enabled': navegación nueva → arriba; back/forward → restaura posición
      //   - anchorScrolling: si la URL trae #fragment, scrollea a ese elemento
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      })
    ),

    provideClientHydration(withEventReplay())
  ]
};

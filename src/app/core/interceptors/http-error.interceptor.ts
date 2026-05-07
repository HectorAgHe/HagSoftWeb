import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor global para manejo de errores HTTP.
 * Loggea el error y lo re-lanza para que el componente decida.
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: unknown) => {
      // TODO: integrar logging real (Sentry, LogRocket, etc.)
      console.error('[HTTP Error]', error);
      return throwError(() => error);
    })
  );
};

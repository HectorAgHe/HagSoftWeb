import { CanActivateFn } from '@angular/router';

/**
 * Guard de autenticación — Fase 2
 * Protegerá rutas del portal de clientes.
 * Por ahora siempre devuelve true (pendiente de implementar).
 */
export const authGuard: CanActivateFn = (_route, _state) => {
  return true;
};

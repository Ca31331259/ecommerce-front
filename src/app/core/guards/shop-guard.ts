import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

/**
 * Flag global `environment.shopHabilitado` (pedido real 2026-11-25, ver Javadoc de
 * environment.ts) -- bloquea la navegación directa por URL a las páginas de tienda cuando el
 * módulo está apagado en esta imagen (el nav/header ya las oculta, esto es la segunda barrera).
 */
export const shopGuard: CanActivateFn = () => {

  const router =
    inject(Router);

  if (
    !environment.shopHabilitado
  ) {

    return router.createUrlTree([
      '/'
    ]);

  }

  return true;

};

/** Mismo criterio que shopGuard, pero para las páginas de shop del panel admin (productos/
 * categorías/pedidos/clientes) -- si está apagado, vuelve al dashboard en vez de a la home pública. */
export const adminShopGuard: CanActivateFn = () => {

  const router =
    inject(Router);

  if (
    !environment.shopHabilitado
  ) {

    return router.createUrlTree([
      '/admin/dashboard'
    ]);

  }

  return true;

};

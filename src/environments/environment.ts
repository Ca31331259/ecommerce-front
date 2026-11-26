/**
 * Entorno de desarrollo (ng serve). En producción se reemplaza por environment.prod.ts vía
 * fileReplacements (ver angular.json, configuración "production") -- mismo criterio que
 * numecos-angular (api-config.ts/environment.ts).
 *
 * shopHabilitado (pedido real 2026-11-25): flag GLOBAL -- no por tenant -- para apagar TODA la
 * tienda pública (carrito/checkout/productos) y el panel admin del shop en esta imagen, antes de
 * buildear para un cliente que todavía no vende por acá. Prendido en dev para no frenar el
 * desarrollo local; en producción arranca apagado por defecto (ver environment.prod.ts) y hay que
 * tocar ese archivo a mano antes de buildear la imagen de un cliente que sí lo tenga habilitado.
 * IMPORTANTE: coordinar con `shop.habilitado` del backend (repo ecommerce) -- si el backend tiene
 * el shop apagado, esta flag también debe estar apagada o las páginas de tienda quedan vacías
 * (los endpoints que consultan ya no existen del lado del backend).
 */
export const environment = {
  production: false,
  shopHabilitado: true
};

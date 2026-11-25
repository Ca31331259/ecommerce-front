import { AdminStatusBadgeVariant } from '@shared/design-system-admin';

/** Los estados de pedido viajan como string crudo, sin enum centralizado del lado del backend (ver
 * Javadoc de ShopOrderRepository.Orden) -- acá se centraliza la traducción a algo legible, una sola
 * vez, para que la lista y el detalle no dupliquen el mapeo. */
const ETIQUETAS: Record<string, string> = {
  PENDIENTE_PAGO: 'Pendiente de pago',
  PAGO_RECHAZADO: 'Pago rechazado',
  PAGADO: 'Pagado',
  EN_PREPARACION: 'En preparación',
  VENCIDO: 'Vencido',
  CANCELADO: 'Cancelado',
  DESPACHADO: 'Despachado',
  LISTO_PARA_RETIRAR: 'Listo para retirar',
  ENTREGADO: 'Entregado'
};

const VARIANTES: Record<string, AdminStatusBadgeVariant> = {
  PENDIENTE_PAGO: 'warning',
  PAGO_RECHAZADO: 'danger',
  PAGADO: 'info',
  EN_PREPARACION: 'primary',
  VENCIDO: 'neutral',
  CANCELADO: 'danger',
  DESPACHADO: 'primary',
  LISTO_PARA_RETIRAR: 'primary',
  ENTREGADO: 'success'
};

export function etiquetaEstadoPedido(estado: string): string {

  return ETIQUETAS[estado] ?? estado;

}

export function variantEstadoPedido(estado: string): AdminStatusBadgeVariant {

  return VARIANTES[estado] ?? 'neutral';

}

export const ESTADOS_PEDIDO: readonly string[] = Object.keys(ETIQUETAS);

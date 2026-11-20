// Espejo de ShopOrderService.OrdenResponse (Platform) -- Fase 2, ver docs/ecommerce/plan-fase-2.md.

export const ESTADOS_PEDIDO = ['PENDIENTE_PAGO', 'PAGADO', 'PAGO_RECHAZADO', 'VENCIDO', 'CANCELADO'] as const;
export type EstadoPedido = (typeof ESTADOS_PEDIDO)[number];

export interface ShopOrderItem {
  titulo: string;
  variante: string | null;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

export interface ShopOrder {
  numero: string;
  tokenPublico: string;
  estado: EstadoPedido;
  requiereAtencion: boolean;
  motivoAtencion: string | null;
  subtotal: number;
  total: number;
  moneda: string;
  items: ShopOrderItem[];
  urlPago: string | null;
  venceEn: string;
}

export interface ShopBranch {
  id: number;
  nombre: string;
  direccion: string | null;
}

export interface CheckoutRequest {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  tipoDocumento: string;
  numeroDocumento: string;
  condicionIva: string;
  sucursalRetiroId: number;
  idempotencyKey: string;
}

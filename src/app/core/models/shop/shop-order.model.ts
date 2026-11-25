// Espejo de ShopOrderService.OrdenResponse (Platform) -- Fase 2, ver docs/ecommerce/plan-fase-2.md.

export const ESTADOS_PEDIDO = [
  'PENDIENTE_PAGO',
  'PAGADO',
  'PAGO_RECHAZADO',
  'VENCIDO',
  'CANCELADO',
  'EN_PREPARACION',
  'LISTO_PARA_RETIRAR',
  'DESPACHADO',
  'ENTREGADO',
  'REEMBOLSADO'
] as const;
export type EstadoPedido = (typeof ESTADOS_PEDIDO)[number];

/** Fase 7 (ver docs/ecommerce/plan-fase-7.md en numecos-java §3.1) -- "retiro" sigue siendo el
 * comportamiento de siempre, "envío a domicilio" es la alternativa nueva. Nombres FIJADOS con el
 * contrato real de `ShopOrderService.CheckoutRequest`/`OrdenResponse` del lado Platform. */
export const METODOS_ENTREGA = ['RETIRO_SUCURSAL', 'ENVIO_DOMICILIO'] as const;
export type MetodoEntrega = (typeof METODOS_ENTREGA)[number];

export interface ShopOrderItem {
  titulo: string;
  variante: string | null;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

export interface ShopOrderSucursal {
  nombre: string;
  direccion: string | null;
  telefono: string | null;
}

export interface ShopOrderHistorialItem {
  estadoAnterior: EstadoPedido | null;
  estadoNuevo: EstadoPedido;
  motivo: string | null;
  origen: string;
  creadoEn: string;
}

/** Fase 7 (ver docs/ecommerce/plan-fase-7.md en numecos-java §3.9) -- `costo` ya es el final
 * cobrado (envío gratis incluido, viene en 0 en ese caso); `seguimientoEmpresa`/`Numero`/`Link`
 * vienen `null` hasta que la óptica despacha el pedido (§3.8). Snapshot de texto (nunca ids de
 * localidad/provincia/zona, C3). */
export interface ShopOrderEnvio {
  destinatarioNombre: string;
  telefonoContacto: string;
  calle: string;
  numero: string;
  pisoDepto: string | null;
  entreCalles: string | null;
  localidadNombre: string | null;
  provinciaNombre: string | null;
  codigoPostal: string | null;
  costo: number;
  zonaNombre: string | null;
  plazoEstimado: string | null;
  seguimientoEmpresa: string | null;
  seguimientoNumero: string | null;
  seguimientoLink: string | null;
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
  codigoRetiro: string | null;
  sucursal: ShopOrderSucursal | null;
  montoReembolsado: number | null;
  fechaReembolso: string | null;
  historial: ShopOrderHistorialItem[];
  /** Fase 7 -- `envio` viene `null` para pedidos `RETIRO_SUCURSAL`. */
  metodoEntrega: MetodoEntrega;
  envio: ShopOrderEnvio | null;
}

export interface ShopBranch {
  id: number;
  nombre: string;
  direccion: string | null;
}

/** Fase 7 -- `sucursalRetiroId` sólo aplica (y se valida en el backend) si
 * `metodoEntrega=RETIRO_SUCURSAL`; los campos `envio*` sólo si `metodoEntrega=ENVIO_DOMICILIO`.
 * Nombres de campo FIJADOS con el contrato real de `ShopOrderService.CheckoutRequest`. */
export interface CheckoutRequest {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  tipoDocumento: string;
  numeroDocumento: string;
  condicionIva: string;
  sucursalRetiroId: number | null;
  idempotencyKey: string;
  metodoEntrega: MetodoEntrega;
  envioDestinatarioNombre: string | null;
  envioTelefonoContacto: string | null;
  envioCalle: string | null;
  envioNumero: string | null;
  envioPisoDepto: string | null;
  envioEntreCalles: string | null;
  envioLocalidadId: number | null;
  envioProvinciaId: number | null;
  envioCodigoPostal: string | null;
}

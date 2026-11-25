/** Catálogo publicado ya sincronizado desde el ERP (ver ShopAdminController del lado Platform) --
 * acá nunca se crea/edita un producto o categoría, sólo se muestra lo sincronizado y se puede
 * habilitar/deshabilitar la publicación, que viaja de vuelta al ERP. */

export interface AdminShopProduct {
  id: number;
  tipoProducto: string;
  titulo: string;
  categoriaId: number | null;
  precio: number | null;
  estadoStock: string | null;
  activo: boolean;
  imagenUrl: string | null;
  cantidadStock: number | null;
}

export interface AdminShopProductPage {
  contenido: AdminShopProduct[];
  total: number;
  pagina: number;
  tamanio: number;
}

export interface AdminShopCategory {
  id: number;
  nombre: string;
  slug: string;
  categoriaPadreId: number | null;
  orden: number;
  activo: boolean;
}

/** Pedidos -- a diferencia del catálogo, acá Platform ES la fuente de verdad (el pedido se crea en
 * el checkout y recién después se le avisa al ERP), por eso el panel admin sólo necesita leer, sin
 * ningún viaje de ida y vuelta. */

export interface AdminOrderSummary {
  id: number;
  numero: string;
  estado: string;
  requiereAtencion: boolean;
  compradorNombre: string | null;
  compradorApellido: string | null;
  compradorEmail: string | null;
  total: number;
  moneda: string;
  metodoEntrega: string;
  creadoEn: string;
}

export interface AdminOrderSummaryPage {
  contenido: AdminOrderSummary[];
  total: number;
  pagina: number;
  tamanio: number;
}

export interface AdminOrderItem {
  id: number;
  orderId: number;
  shopProductId: number;
  erpProductoId: number;
  tipoProducto: string;
  sku: string | null;
  tituloSnapshot: string;
  descripcionVarianteSnapshot: string | null;
  precioUnitarioSnapshot: number;
  cantidad: number;
  subtotal: number;
  precioLista: number | null;
  descuentoPromo: number | null;
  descuentoCupon: number | null;
}

export interface AdminOrderHistoryEntry {
  estadoAnterior: string | null;
  estadoNuevo: string;
  motivo: string | null;
  origen: string;
  creadoEn: string;
}

export interface AdminOrderDetail {
  id: number;
  numero: string;
  estado: string;
  requiereAtencion: boolean;
  motivoAtencion: string | null;
  moneda: string;
  compradorNombre: string;
  compradorApellido: string;
  compradorEmail: string;
  compradorTelefono: string | null;
  compradorTipoDocumento: string | null;
  compradorNumeroDocumento: string | null;
  compradorCondicionIva: string | null;
  metodoEntrega: string;
  subtotal: number;
  total: number;
  creadoEn: string;
  actualizadoEn: string;
  venceEn: string;
  codigoRetiro: string | null;
  montoReembolsado: number | null;
  fechaReembolso: string | null;
  cuponCodigo: string | null;
  cuponMontoDescontado: number | null;
  envioDestinatarioNombre: string | null;
  envioTelefonoContacto: string | null;
  envioCalle: string | null;
  envioNumero: string | null;
  envioPisoDepto: string | null;
  envioEntreCalles: string | null;
  envioCodigoPostal: string | null;
  envioCosto: number | null;
  envioZonaNombre: string | null;
  envioPlazoEstimado: string | null;
  envioSeguimientoEmpresa: string | null;
  envioSeguimientoNumero: string | null;
  envioSeguimientoLink: string | null;
}

export interface AdminOrderDetailResponse {
  orden: AdminOrderDetail;
  items: AdminOrderItem[];
  historial: AdminOrderHistoryEntry[];
}

/** Sólo pedidos que se concretaron como venta (ver ShopOrderRepository.resumenVentas del lado
 * backend) -- "pedidosRequierenAtencion" es la única excepción, cuenta todos los estados. */
export interface AdminSalesSummary {
  totalPedidos: number;
  montoTotal: number;
  ticketPromedio: number;
  pedidosHoy: number;
  pedidosRequierenAtencion: number;
}

/** No hay cuenta de cliente propia (checkout invitado) -- "cliente" es agrupar pedidos por email
 * de comprador (ver ShopOrderRepository.listarClientes del lado backend). */
export interface AdminCustomerSummary {
  email: string;
  nombre: string | null;
  apellido: string | null;
  telefono: string | null;
  cantidadPedidos: number;
  montoTotalComprado: number;
  primerPedido: string;
  ultimoPedido: string;
}

export interface AdminCustomerSummaryPage {
  contenido: AdminCustomerSummary[];
  total: number;
  pagina: number;
  tamanio: number;
}

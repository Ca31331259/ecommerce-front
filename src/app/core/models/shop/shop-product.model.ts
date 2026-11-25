// Espejo de ShopPublicController.ProductoResponse (Platform) -- ver
// docs/ecommerce/plan-fase-0-1.md en numecos-java §2.5.

export interface ShopProduct {
  id: number;
  tipoProducto: string;
  titulo: string;
  slug: string;
  descripcion: string | null;
  categoriaId: number | null;
  destacado: boolean;
  precio: number | null;
  precioComparativo: number | null;
  estadoStock: string | null;
  grupoVarianteId: string | null;
  atributosFiltro: Record<string, string>;
  imagenes: string[];
  /** Fase 5 (ver docs/ecommerce/plan-fase-5.md en numecos-java §3.1) -- sólo no-nulos cuando el
   * producto tiene una promoción vigente: `precio` ya viene descontado, `precioOriginal` es el
   * precio de lista (para el tachado) y `descuentoPorcentaje` siempre viaja como porcentaje (sea
   * la promo PORCENTAJE o MONTO_FIJO). La promoción pisa `precioComparativo`, que viaja en null
   * cuando hay promoción activa -- nunca hay que resolver precedencia entre los dos del lado del
   * front. */
  precioOriginal: number | null;
  descuentoPorcentaje: number | null;
}

export interface ShopProductDetail {
  producto: ShopProduct;
  variantes: ShopProduct[];
}

export interface ShopPage<T> {
  contenido: T[];
  total: number;
  pagina: number;
  tamanio: number;
}

export type ShopFacets = Record<string, Record<string, number>>;

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

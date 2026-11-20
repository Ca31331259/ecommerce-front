// Espejo de ShopPublicController.CategoriaResponse (Platform).

export interface ShopCategory {
  id: number;
  nombre: string;
  slug: string;
  categoriaPadreId: number | null;
  orden: number;
  cantidadProductos: number;
}

// Espejo de ShopCartController.Carrito (Platform) -- Fase 2, ver docs/ecommerce/plan-fase-2.md.

export interface ShopCartItem {
  shopProductId: number;
  titulo: string;
  slug: string;
  precioUnitario: number | null;
  cantidad: number;
  subtotal: number;
  activo: boolean;
}

export interface ShopCart {
  token: string;
  items: ShopCartItem[];
  total: number;
}

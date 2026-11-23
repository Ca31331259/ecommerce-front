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
  /** Fase 5 (ver docs/ecommerce/plan-fase-5.md en numecos-java §3.4, espejo de
   * ShopCartService.Carrito) -- `null`/0 cuando no hay cupón aplicado o dejó de ser válido
   * (vencimiento, baja, etc.): se re-valida en cada lectura, sin aviso explícito de "este cupón
   * ya no aplica" (mismo criterio que la promoción, §1.4). */
  cuponCodigo: string | null;
  descuentoCupon: number;
  totalFinal: number;
}

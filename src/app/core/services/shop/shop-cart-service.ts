import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ApiConfig } from '@core/config/api.config';
import { ShopCart } from '@core/models/shop/shop-cart.model';
import { ShopBranch } from '@core/models/shop/shop-order.model';
import { ShopService } from './shop-service';
import { shopSessionId } from './shop-session';

const CART_TOKEN_KEY = 'shop_cart_token';

/** Mismo criterio que `session_id` de eventos: localStorage + header propio, NUNCA cookie --
 * el storefront y Platform viven en dominios distintos (Fase 2, corrección C7). */
function leerOCrearToken(): string {
  let token = localStorage.getItem(CART_TOKEN_KEY);
  if (!token) {
    token = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    localStorage.setItem(CART_TOKEN_KEY, token);
  }
  return token;
}

/**
 * Carrito anónimo del storefront (Fase 2, ver docs/ecommerce/plan-fase-2.md) -- singleton
 * (`providedIn: 'root'`) para que el contador del header y la página de carrito compartan el mismo
 * estado sin volver a pedirlo innecesariamente.
 */
@Injectable({ providedIn: 'root' })
export class ShopCartService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ApiConfig);
  private readonly shop = inject(ShopService);

  readonly carrito = signal<ShopCart | null>(null);
  readonly cantidadItems = computed(() => this.carrito()?.items.reduce((acc, i) => acc + i.cantidad, 0) ?? 0);
  readonly drawerAbierto = signal(false);

  abrirDrawer(): void {
    this.drawerAbierto.set(true);
  }

  cerrarDrawer(): void {
    this.drawerAbierto.set(false);
  }

  private get domain(): string {
    return window.location.hostname;
  }

  constructor() {
    this.refrescar();
  }

  token(): string {
    return leerOCrearToken();
  }

  private headers(): HttpHeaders {
    return new HttpHeaders({ 'X-Cart-Token': this.token() });
  }

  private params(): HttpParams {
    return new HttpParams().set('domain', this.domain);
  }

  refrescar() {
    this.http
      .get<ShopCart>(`${this.config.baseUrl}/public/shop/cart`, { headers: this.headers(), params: this.params() })
      .subscribe({
        next: (carrito) => this.carrito.set(carrito),
        error: () => this.carrito.set(null)
      });
  }

  agregar(productoId: number, cantidad = 1) {
    return this.http
      .post<ShopCart>(
        `${this.config.baseUrl}/public/shop/cart/items`,
        { productoId, cantidad },
        { headers: this.headers(), params: this.params() }
      )
      .pipe(tap((carrito) => this.carrito.set(carrito)));
  }

  cambiarCantidad(productoId: number, cantidad: number) {
    return this.http
      .put<ShopCart>(
        `${this.config.baseUrl}/public/shop/cart/items/${productoId}`,
        { cantidad },
        { headers: this.headers(), params: this.params() }
      )
      .pipe(tap((carrito) => this.carrito.set(carrito)));
  }

  /** Único punto donde se saca un ítem del carrito (lo llaman tanto la página de carrito como el
   * mini-cart drawer) -- por eso el evento `remove_from_cart` (Fase 6, ver
   * docs/ecommerce/plan-fase-6.md §3.1) se dispara acá y no en cada componente, para no
   * duplicarlo ni olvidarlo en alguno de los dos puntos de entrada. `productoId` es el mismo id
   * de la publicación (`shop_product.id`) que ya usan `product_view`/`add_to_cart`. */
  quitar(productoId: number) {
    return this.http
      .delete<ShopCart>(`${this.config.baseUrl}/public/shop/cart/items/${productoId}`, {
        headers: this.headers(),
        params: this.params()
      })
      .pipe(
        tap((carrito) => {
          this.carrito.set(carrito);
          this.shop.registrarEvento('remove_from_cart', { productId: productoId }).subscribe();
        })
      );
  }

  /** Fase 5 (ver docs/ecommerce/plan-fase-5.md en numecos-java §3.4) -- valida y aplica el cupón
   * al carrito, sin reservarlo todavía (la reserva atómica pasa recién al confirmar el checkout).
   * El token sigue viajando por `X-Cart-Token` como el resto de este servicio (nunca path/cookie,
   * el endpoint real es `POST /cart/cupon`, no `/cart/{token}/cupon`). `X-Session-Id` es opcional
   * para el backend, pero se manda igual (mismo criterio que `ShopOrderService.checkout`) para que
   * los eventos `coupon_applied`/`coupon_rejected` que el backend emite solo quedar asociados a la
   * sesión anónima. Ante rechazo (400), el backend devuelve siempre el mismo mensaje
   * ("Código no válido") tanto si el código no existe como si no aplica -- nunca distinguir la
   * causa en la UI. */
  aplicarCupon(codigo: string) {
    return this.http
      .post<ShopCart>(
        `${this.config.baseUrl}/public/shop/cart/cupon`,
        { codigo },
        { headers: this.headers().set('X-Session-Id', shopSessionId()), params: this.params() }
      )
      .pipe(tap((carrito) => this.carrito.set(carrito)));
  }

  sucursalesDisponibles() {
    return this.http.get<ShopBranch[]>(`${this.config.baseUrl}/public/shop/cart/sucursales-disponibles`, {
      headers: this.headers(),
      params: this.params()
    });
  }
}

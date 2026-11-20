import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ApiConfig } from '@core/config/api.config';
import { ShopCart } from '@core/models/shop/shop-cart.model';
import { ShopBranch } from '@core/models/shop/shop-order.model';

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

  quitar(productoId: number) {
    return this.http
      .delete<ShopCart>(`${this.config.baseUrl}/public/shop/cart/items/${productoId}`, {
        headers: this.headers(),
        params: this.params()
      })
      .pipe(tap((carrito) => this.carrito.set(carrito)));
  }

  sucursalesDisponibles() {
    return this.http.get<ShopBranch[]>(`${this.config.baseUrl}/public/shop/cart/sucursales-disponibles`, {
      headers: this.headers(),
      params: this.params()
    });
  }
}

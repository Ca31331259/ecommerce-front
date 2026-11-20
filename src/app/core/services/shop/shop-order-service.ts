import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ApiConfig } from '@core/config/api.config';
import { CheckoutRequest, ShopBranch, ShopOrder } from '@core/models/shop/shop-order.model';
import { ShopCartService } from './shop-cart-service';

/** Checkout y estado del pedido (Fase 2, ver docs/ecommerce/plan-fase-2.md §4.1). */
@Injectable({ providedIn: 'root' })
export class ShopOrderService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ApiConfig);
  private readonly cartService = inject(ShopCartService);

  private get domain(): string {
    return window.location.hostname;
  }

  private params(): HttpParams {
    return new HttpParams().set('domain', this.domain);
  }

  private headers(): HttpHeaders {
    return new HttpHeaders({ 'X-Cart-Token': this.cartService.token() });
  }

  sucursalesHabilitadas() {
    return this.http.get<ShopBranch[]>(`${this.config.baseUrl}/public/shop/branches`, { params: this.params() });
  }

  /** Fase 3 (ver docs/ecommerce/plan-fase-3.md bloque 3) -- el checkout lo consulta antes de
   * mostrar el formulario, para avisar si los pagos no están disponibles (ej. la óptica tiene
   * Mercado Pago desconectado/vencido) sin que el comprador llegue a cargar sus datos. */
  pagosDisponibles() {
    return this.http.get<{ disponible: boolean }>(`${this.config.baseUrl}/public/shop/payments/disponible`, {
      params: this.params()
    });
  }

  checkout(request: CheckoutRequest) {
    return this.http.post<ShopOrder>(`${this.config.baseUrl}/public/shop/checkout`, request, {
      headers: this.headers(),
      params: this.params()
    });
  }

  obtenerPedido(token: string) {
    return this.http.get<ShopOrder>(`${this.config.baseUrl}/public/shop/orders/${token}`, { params: this.params() });
  }

  reintentarPago(token: string) {
    return this.http.post<ShopOrder>(`${this.config.baseUrl}/public/shop/orders/${token}/reintentar-pago`, {}, {
      params: this.params()
    });
  }

  cancelar(token: string) {
    return this.http.post<ShopOrder>(`${this.config.baseUrl}/public/shop/orders/${token}/cancelar`, {}, { params: this.params() });
  }

  simularPago(externalReference: string, resultado: 'APROBADO' | 'RECHAZADO') {
    return this.http.post<{ tokenPublico: string }>(
      `${this.config.baseUrl}/public/shop/payments/fake/${externalReference}/simular`,
      { resultado },
      { params: this.params() }
    );
  }
}

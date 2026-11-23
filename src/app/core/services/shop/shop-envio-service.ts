import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ApiConfig } from '@core/config/api.config';
import { CotizarEnvioRequest, CotizarEnvioResponse, ProvinciaGeografia } from '@core/models/shop/shop-envio.model';
import { ShopCartService } from './shop-cart-service';

/** Envío a domicilio del checkout (Fase 7, ver docs/ecommerce/plan-fase-7.md en numecos-java
 * §3.1/§3.2) -- mismo criterio de resolución de tenant (`?domain=`) y de carrito (header
 * `X-Cart-Token`, nunca cookie, C7 de Fase 2) que `ShopOrderService`/`ShopCartService`. */
@Injectable({ providedIn: 'root' })
export class ShopEnvioService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ApiConfig);
  private readonly cartService = inject(ShopCartService);

  private get domain(): string {
    return window.location.hostname;
  }

  private params(): HttpParams {
    return new HttpParams().set('domain', this.domain);
  }

  /** `X-Cart-Token` va SIEMPRE (igual que en los endpoints de carrito/checkout) para que el
   * backend pueda evaluar el umbral de envío gratis sobre el subtotal real del carrito -- sin
   * esto, sólo un cupón `ENVIO_GRATIS` puede poner el costo en 0 (ver Javadoc de
   * `ShopEnvioService.cotizar` del lado Platform). */
  private headers(): HttpHeaders {
    return new HttpHeaders({ 'X-Cart-Token': this.cartService.token() });
  }

  /** Nunca se llama de forma anticipada para "adivinar" si el envío está habilitado -- el
   * backend no expone ningún flag público separado para eso (confirmado leyendo
   * `ShopEnvioService`/`ShopEnvioController` reales: `activo` es un dato interno que sólo se usa
   * dentro de la propia cotización). `disponible=false` es, a propósito, la única señal que ve el
   * comprador tanto si no hay cobertura para su dirección como si la óptica no ofrece envío. */
  cotizar(request: CotizarEnvioRequest) {
    return this.http.post<CotizarEnvioResponse>(`${this.config.baseUrl}/public/shop/envio/cotizar`, request, {
      headers: this.headers(),
      params: this.params()
    });
  }

  /** Catálogo Provincia→Localidad completo (§3.12 del plan) -- chico, se trae entero una vez y se
   * filtra/ordena en el cliente. */
  geografia() {
    return this.http.get<ProvinciaGeografia[]>(`${this.config.baseUrl}/public/shop/envio/geografia`, {
      params: this.params()
    });
  }
}

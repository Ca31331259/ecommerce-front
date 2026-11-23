import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfig } from '@core/config/api.config';
import { ShopCategory } from '@core/models/shop/shop-category.model';
import { ShopFacets, ShopPage, ShopProduct, ShopProductDetail } from '@core/models/shop/shop-product.model';
import { shopSessionId } from './shop-session';

export interface ShopProductFilter {
  categoria?: number;
  tipoProducto?: string;
  /** Varios atributos simultáneos (ej. { forma: 'aviador', color: 'negro' }), Fase 1.5 -- cada
   * clave se manda como su propio query param (ver ShopPublicController.atributosDe, que trata
   * cualquier param no reservado como filtro de atributo). */
  atributos?: Record<string, string>;
  precioMin?: number;
  precioMax?: number;
  texto?: string;
  orden?: string;
  /** Fase 5 -- filtro "En promoción" (`?enPromocion=true`, ver ShopPublicController.productos). */
  enPromocion?: boolean;
  page?: number;
  size?: number;
}

export type ShopFacetFilter = Omit<ShopProductFilter, 'page' | 'size'>;

/**
 * Consume /public/shop/** de Platform (Fase 1, ver docs/ecommerce/plan-fase-0-1.md en
 * numecos-java §2.5) -- mismo criterio de resolución de tenant que TenantService.loadTenant
 * (?domain= = window.location.hostname, sin auth).
 */
@Injectable({ providedIn: 'root' })
export class ShopService {

  private http = inject(HttpClient);

  private readonly config =
    inject(ApiConfig);

  private get domain(): string {
    return window.location.hostname;
  }

  productos(filtro: ShopProductFilter = {}) {
    let params = this.paramsDeFiltro(filtro);
    params = params.set('page', filtro.page ?? 0);
    params = params.set('size', filtro.size ?? 24);
    return this.http.get<ShopPage<ShopProduct>>(
      `${this.config.baseUrl}/public/shop/products`,
      { params }
    );
  }

  facetas(filtro: ShopFacetFilter = {}) {
    const params = this.paramsDeFiltro(filtro);
    return this.http.get<ShopFacets>(
      `${this.config.baseUrl}/public/shop/products/facets`,
      { params }
    );
  }

  private paramsDeFiltro(filtro: ShopFacetFilter): HttpParams {
    let params = new HttpParams().set('domain', this.domain);
    if (filtro.categoria != null) params = params.set('categoria', filtro.categoria);
    if (filtro.tipoProducto) params = params.set('tipoProducto', filtro.tipoProducto);
    if (filtro.precioMin != null) params = params.set('precioMin', filtro.precioMin);
    if (filtro.precioMax != null) params = params.set('precioMax', filtro.precioMax);
    if (filtro.texto) params = params.set('texto', filtro.texto);
    if (filtro.orden) params = params.set('orden', filtro.orden);
    if (filtro.enPromocion) params = params.set('enPromocion', 'true');
    for (const [clave, valor] of Object.entries(filtro.atributos ?? {})) {
      if (valor) params = params.set(clave, valor);
    }
    return params;
  }

  destacados(limite = 12) {
    const params = new HttpParams().set('domain', this.domain).set('limite', limite);
    return this.http.get<ShopProduct[]>(
      `${this.config.baseUrl}/public/shop/products/destacados`,
      { params }
    );
  }

  // ---- Fase 5: secciones de descubrimiento nuevas -- mismo molde que destacados() (ver
  // docs/ecommerce/plan-fase-5.md en numecos-java §1.8/§3.2/§3.3) ----

  novedades(limite = 12) {
    const params = new HttpParams().set('domain', this.domain).set('limite', limite);
    return this.http.get<ShopProduct[]>(
      `${this.config.baseUrl}/public/shop/products/novedades`,
      { params }
    );
  }

  masVendidos(limite = 12) {
    const params = new HttpParams().set('domain', this.domain).set('limite', limite);
    return this.http.get<ShopProduct[]>(
      `${this.config.baseUrl}/public/shop/products/mas-vendidos`,
      { params }
    );
  }

  enPromocion(limite = 12) {
    const params = new HttpParams().set('domain', this.domain).set('limite', limite);
    return this.http.get<ShopProduct[]>(
      `${this.config.baseUrl}/public/shop/products/en-promocion`,
      { params }
    );
  }

  producto(slug: string) {
    const params = new HttpParams().set('domain', this.domain);
    return this.http.get<ShopProductDetail>(
      `${this.config.baseUrl}/public/shop/products/${slug}`,
      { params }
    );
  }

  categorias() {
    const params = new HttpParams().set('domain', this.domain);
    return this.http.get<ShopCategory[]>(
      `${this.config.baseUrl}/public/shop/categories`,
      { params }
    );
  }

  registrarEvento(tipo: string, payload?: Record<string, unknown>) {
    const params = new HttpParams().set('domain', this.domain);
    return this.http.post<void>(
      `${this.config.baseUrl}/public/shop/events`,
      { tipo, sessionId: shopSessionId(), payload },
      { params }
    );
  }
}

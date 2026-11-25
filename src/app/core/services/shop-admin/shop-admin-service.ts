import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  AdminCustomerSummaryPage,
  AdminOrderDetailResponse,
  AdminOrderSummaryPage,
  AdminSalesSummary,
  AdminShopCategory,
  AdminShopProductPage
} from '../../models/shop-admin';

import { ApiConfig } from '@core/config/api.config';


@Injectable({
  providedIn: 'root'
})
export class ShopAdminService {

  private readonly http =
    inject(HttpClient);

  private readonly config =
    inject(ApiConfig);

  private readonly api =
    this.config.baseUrl + '/admin/shop';


  listarProductos(
    activo: boolean | null,
    pagina: number,
    tamanio: number
  ): Observable<AdminShopProductPage> {

    let params: Record<string, string> = {
      pagina: String(pagina),
      tamanio: String(tamanio)
    };

    if (activo !== null) {

      params = {
        ...params,
        activo: String(activo)
      };

    }

    return this.http.get<AdminShopProductPage>(
      `${this.api}/products`,
      { params }
    );

  }


  cambiarActivo(
    id: number,
    activo: boolean
  ): Observable<void> {

    return this.http.patch<void>(
      `${this.api}/products/${id}/activo`,
      { activo }
    );

  }


  listarCategorias(): Observable<AdminShopCategory[]> {

    return this.http.get<AdminShopCategory[]>(
      `${this.api}/categories`
    );

  }


  listarPedidos(
    estado: string | null,
    email: string | null,
    pagina: number,
    tamanio: number
  ): Observable<AdminOrderSummaryPage> {

    let params: Record<string, string> = {
      pagina: String(pagina),
      tamanio: String(tamanio)
    };

    if (estado) {

      params = {
        ...params,
        estado
      };

    }

    if (email) {

      params = {
        ...params,
        email
      };

    }

    return this.http.get<AdminOrderSummaryPage>(
      `${this.api}/orders`,
      { params }
    );

  }


  obtenerPedido(
    id: number
  ): Observable<AdminOrderDetailResponse> {

    return this.http.get<AdminOrderDetailResponse>(
      `${this.api}/orders/${id}`
    );

  }


  resumenVentas(): Observable<AdminSalesSummary> {

    return this.http.get<AdminSalesSummary>(
      `${this.api}/orders/resumen`
    );

  }


  listarClientes(
    pagina: number,
    tamanio: number
  ): Observable<AdminCustomerSummaryPage> {

    return this.http.get<AdminCustomerSummaryPage>(
      `${this.api}/customers`,
      {
        params: {
          pagina: String(pagina),
          tamanio: String(tamanio)
        }
      }
    );

  }

}

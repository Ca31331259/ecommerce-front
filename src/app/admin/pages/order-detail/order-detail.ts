import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  AdminBreadcrumb,
  AdminBreadcrumbItem,
  AdminButton,
  AdminCard,
  AdminInfoItem,
  AdminInfoList,
  AdminLoader,
  AdminPage,
  AdminSection,
  AdminStatusBadge,
  AdminTable,
  AdminTableContentDirective,
  AdminToolbar,
  AdminToolbarMetaDirective
} from '@shared/design-system-admin';

import {
  ShopAdminService
} from '../../../core/services/shop-admin/shop-admin-service';

import {
  AdminOrderDetailResponse
} from '../../../core/models/shop-admin';

import {
  etiquetaEstadoPedido,
  variantEstadoPedido
} from '../orders/order-estado';


@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    AdminPage,
    AdminBreadcrumb,
    AdminBreadcrumbItem,
    AdminToolbar,
    AdminToolbarMetaDirective,
    AdminSection,
    AdminCard,
    AdminLoader,
    AdminStatusBadge,
    AdminButton,
    AdminInfoList,
    AdminInfoItem,
    AdminTable,
    AdminTableContentDirective
  ],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.scss'
})
export class OrderDetail implements OnInit {

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly shopAdminService: ShopAdminService
  ) {}

  readonly detalle =
    signal<AdminOrderDetailResponse | null>(null);

  readonly loading =
    signal(true);

  readonly notFound =
    signal(false);


  ngOnInit(): void {

    const id =
      Number(this.route.snapshot.paramMap.get('id'));

    this.shopAdminService
      .obtenerPedido(id)
      .subscribe({
        next: respuesta => {

          this.detalle.set(respuesta);
          this.loading.set(false);

        },
        error: () => {

          this.notFound.set(true);
          this.loading.set(false);

        }
      });

  }


  volver(): void {

    void this.router.navigate([
      '/admin/orders'
    ]);

  }


  etiqueta(
    estado: string
  ) {

    return etiquetaEstadoPedido(estado);

  }


  variante(
    estado: string
  ) {

    return variantEstadoPedido(estado);

  }


  get tieneEnvio(): boolean {

    return this.detalle()?.orden?.metodoEntrega === 'ENVIO_DOMICILIO';

  }

}

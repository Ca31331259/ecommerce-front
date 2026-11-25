import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router
} from '@angular/router';

import {
  AdminBreadcrumb,
  AdminBreadcrumbItem,
  AdminButton,
  AdminEmptyState,
  AdminPage,
  AdminSection,
  AdminStatusBadge,
  AdminTable,
  AdminTableContentDirective,
  AdminTableEmptyDirective,
  AdminTableFooterDirective,
  AdminToolbar
} from '@shared/design-system-admin';

import {
  ShopAdminService
} from '../../../core/services/shop-admin/shop-admin-service';

import {
  AdminOrderSummary
} from '../../../core/models/shop-admin';

import {
  ESTADOS_PEDIDO,
  etiquetaEstadoPedido,
  variantEstadoPedido
} from './order-estado';


const TAMANIO_PAGINA = 20;


@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    AdminPage,
    AdminBreadcrumb,
    AdminBreadcrumbItem,
    AdminToolbar,
    AdminSection,
    AdminStatusBadge,
    AdminButton,
    AdminTable,
    AdminTableContentDirective,
    AdminTableEmptyDirective,
    AdminTableFooterDirective,
    AdminEmptyState
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.scss'
})
export class Orders implements OnInit {

  constructor(
    private readonly shopAdminService: ShopAdminService,
    private readonly router: Router
  ) {}

  readonly estadosFiltro = ESTADOS_PEDIDO;

  readonly pedidos =
    signal<AdminOrderSummary[]>([]);

  readonly loading =
    signal(true);

  readonly total =
    signal(0);

  readonly pagina =
    signal(0);

  readonly filtroEstado =
    signal<string | null>(null);

  readonly tamanio = TAMANIO_PAGINA;


  ngOnInit(): void {

    this.cargar();

  }


  cambiarFiltro(
    estado: string | null
  ): void {

    this.filtroEstado.set(estado);
    this.pagina.set(0);
    this.cargar();

  }


  irAPagina(
    pagina: number
  ): void {

    this.pagina.set(pagina);
    this.cargar();

  }


  verDetalle(
    pedido: AdminOrderSummary
  ): void {

    void this.router.navigate([
      '/admin/orders',
      pedido.id
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


  private cargar(): void {

    this.loading.set(true);

    this.shopAdminService
      .listarPedidos(this.filtroEstado(), this.pagina(), this.tamanio)
      .subscribe({
        next: respuesta => {

          this.pedidos.set(respuesta.contenido);
          this.total.set(respuesta.total);
          this.loading.set(false);

        },
        error: () => {

          this.loading.set(false);

        }
      });

  }


  get totalPaginas(): number {

    return Math.max(1, Math.ceil(this.total() / this.tamanio));

  }

}

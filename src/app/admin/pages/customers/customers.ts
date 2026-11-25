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
  AdminCustomerSummary
} from '../../../core/models/shop-admin';


const TAMANIO_PAGINA = 20;


@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    AdminPage,
    AdminBreadcrumb,
    AdminBreadcrumbItem,
    AdminToolbar,
    AdminSection,
    AdminButton,
    AdminTable,
    AdminTableContentDirective,
    AdminTableEmptyDirective,
    AdminTableFooterDirective,
    AdminEmptyState
  ],
  templateUrl: './customers.html',
  styleUrl: './customers.scss'
})
export class Customers implements OnInit {

  constructor(
    private readonly shopAdminService: ShopAdminService,
    private readonly router: Router
  ) {}

  readonly clientes =
    signal<AdminCustomerSummary[]>([]);

  readonly loading =
    signal(true);

  readonly total =
    signal(0);

  readonly pagina =
    signal(0);

  readonly tamanio = TAMANIO_PAGINA;


  ngOnInit(): void {

    this.cargar();

  }


  irAPagina(
    pagina: number
  ): void {

    this.pagina.set(pagina);
    this.cargar();

  }


  verPedidos(
    cliente: AdminCustomerSummary
  ): void {

    void this.router.navigate(
      ['/admin/orders'],
      { queryParams: { email: cliente.email } }
    );

  }


  private cargar(): void {

    this.loading.set(true);

    this.shopAdminService
      .listarClientes(this.pagina(), this.tamanio)
      .subscribe({
        next: respuesta => {

          this.clientes.set(respuesta.contenido);
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

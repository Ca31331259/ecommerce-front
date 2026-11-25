import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

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
  AdminSwitch
} from '@shared/design-system-admin/forms/admin-switch/admin-switch';

import { FormsModule } from '@angular/forms';

import {
  ShopAdminService
} from '../../../core/services/shop-admin/shop-admin-service';

import {
  AdminShopProduct
} from '../../../core/models/shop-admin';


type FiltroActivo = 'todos' | 'activos' | 'inactivos';

const TAMANIO_PAGINA = 20;


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminPage,
    AdminBreadcrumb,
    AdminBreadcrumbItem,
    AdminToolbar,
    AdminSection,
    AdminStatusBadge,
    AdminButton,
    AdminSwitch,
    AdminTable,
    AdminTableContentDirective,
    AdminTableEmptyDirective,
    AdminTableFooterDirective,
    AdminEmptyState
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products implements OnInit {

  constructor(
    private readonly shopAdminService: ShopAdminService
  ) {}

  readonly productos =
    signal<AdminShopProduct[]>([]);

  readonly loading =
    signal(true);

  readonly total =
    signal(0);

  readonly pagina =
    signal(0);

  readonly filtro =
    signal<FiltroActivo>('todos');

  readonly tamanio = TAMANIO_PAGINA;

  private readonly idsCambiando =
    new Set<number>();


  ngOnInit(): void {

    this.cargar();

  }


  cambiarFiltro(
    filtro: FiltroActivo
  ): void {

    this.filtro.set(filtro);
    this.pagina.set(0);
    this.cargar();

  }


  irAPagina(
    pagina: number
  ): void {

    this.pagina.set(pagina);
    this.cargar();

  }


  cargar(): void {

    this.loading.set(true);

    const activo =
      this.filtro() === 'activos'
        ? true
        : this.filtro() === 'inactivos'
          ? false
          : null;

    this.shopAdminService
      .listarProductos(activo, this.pagina(), this.tamanio)
      .subscribe({
        next: respuesta => {

          this.productos.set(respuesta.contenido);
          this.total.set(respuesta.total);
          this.loading.set(false);

        },
        error: () => {

          this.loading.set(false);

        }
      });

  }


  estaCambiando(
    id: number
  ): boolean {

    return this.idsCambiando.has(id);

  }


  toggleActivo(
    producto: AdminShopProduct,
    nuevoValor: boolean
  ): void {

    if (nuevoValor === producto.activo) {

      return;

    }

    this.idsCambiando.add(producto.id);

    this.shopAdminService
      .cambiarActivo(producto.id, nuevoValor)
      .subscribe({
        next: () => {

          this.productos.update(lista =>
            lista.map(p =>
              p.id === producto.id
                ? { ...p, activo: nuevoValor }
                : p
            )
          );

          this.idsCambiando.delete(producto.id);

        },
        error: () => {

          this.idsCambiando.delete(producto.id);

        }
      });

  }


  get totalPaginas(): number {

    return Math.max(1, Math.ceil(this.total() / this.tamanio));

  }

}

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
  AdminEmptyState,
  AdminPage,
  AdminSection,
  AdminTable,
  AdminTableContentDirective,
  AdminTableEmptyDirective,
  AdminToolbar
} from '@shared/design-system-admin';

import {
  ShopAdminService
} from '../../../core/services/shop-admin/shop-admin-service';

import {
  AdminShopCategory
} from '../../../core/models/shop-admin';


@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    AdminPage,
    AdminBreadcrumb,
    AdminBreadcrumbItem,
    AdminToolbar,
    AdminSection,
    AdminTable,
    AdminTableContentDirective,
    AdminTableEmptyDirective,
    AdminEmptyState
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.scss'
})
export class Categories implements OnInit {

  constructor(
    private readonly shopAdminService: ShopAdminService
  ) {}

  readonly categorias =
    signal<AdminShopCategory[]>([]);

  readonly loading =
    signal(true);


  ngOnInit(): void {

    this.shopAdminService
      .listarCategorias()
      .subscribe({
        next: categorias => {

          this.categorias.set(categorias);
          this.loading.set(false);

        },
        error: () => {

          this.loading.set(false);

        }
      });

  }


  nombrePadre(
    categoria: AdminShopCategory
  ): string {

    if (categoria.categoriaPadreId == null) {

      return '-';

    }

    const padre =
      this.categorias().find(c => c.id === categoria.categoriaPadreId);

    return padre?.nombre ?? '-';

  }

}

import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ShopService } from '@core/services/shop/shop-service';
import { ShopCategory } from '@core/models/shop/shop-category.model';
import { ShopFacets, ShopProduct } from '@core/models/shop/shop-product.model';
import { DsSection } from '../../../../shared/design-system/layout/ds-section';
import { DsContainer } from '../../../../shared/design-system/layout/ds-container';
import { DsCard } from '../../../../shared/design-system/atoms/ds-card';
import { DsBadge } from '../../../../shared/design-system/atoms/ds-badge';
import { DsButton } from '../../../../shared/design-system/atoms/ds-button';
import { DsLoader } from '../../../../shared/design-system/atoms/ds-loader';
import { DsImagePlaceholder } from '../../../../shared/design-system/atoms/ds-image-placeholder';
import {
  DsEmptyDescriptionDirective,
  DsEmptyIconDirective,
  DsEmptyState,
  DsEmptyTitleDirective
} from '../../../../shared/design-system/molecules/ds-empty-state';

const TAMANIO_PAGINA = 24;

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    DsSection,
    DsContainer,
    DsCard,
    DsBadge,
    DsButton,
    DsLoader,
    DsImagePlaceholder,
    DsEmptyState,
    DsEmptyIconDirective,
    DsEmptyTitleDirective,
    DsEmptyDescriptionDirective
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList {

  private readonly shop = inject(ShopService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly cargando = signal(true);
  readonly productos = signal<ShopProduct[]>([]);
  readonly total = signal(0);
  readonly pagina = signal(0);
  readonly categorias = signal<ShopCategory[]>([]);
  readonly facetas = signal<ShopFacets>({});

  readonly categoriaSeleccionada = signal<number | null>(null);

  get hayMasPaginas(): boolean {
    return (this.pagina() + 1) * TAMANIO_PAGINA < this.total();
  }

  constructor() {
    this.shop.categorias().subscribe({
      next: (categorias) => this.categorias.set(categorias),
      error: () => this.categorias.set([])
    });

    this.route.queryParamMap.subscribe((params) => {
      const categoria = params.get('categoria');
      this.categoriaSeleccionada.set(categoria ? Number(categoria) : null);
      this.cargar(0);
    });
  }

  nombreCategoria(categoriaId: number): string {
    return this.categorias().find((c) => c.id === categoriaId)?.nombre ?? '';
  }

  seleccionarCategoria(categoriaId: number | null): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { categoria: categoriaId },
      queryParamsHandling: 'merge'
    });
  }

  imagenPrincipal(producto: ShopProduct): string | null {
    return producto.imagenes.length > 0 ? producto.imagenes[0] : null;
  }

  etiquetaStock(producto: ShopProduct): { texto: string; variant: 'success' | 'warning' | 'neutral' } | null {
    switch (producto.estadoStock) {
      case 'DISPONIBLE':
        return null;
      case 'ULTIMAS_UNIDADES':
        return { texto: 'Últimas unidades', variant: 'warning' };
      case 'CONSULTAR':
        return { texto: 'Consultar disponibilidad', variant: 'neutral' };
      case 'SIN_STOCK':
        return { texto: 'Sin stock', variant: 'neutral' };
      default:
        return null;
    }
  }

  siguientePagina(): void {
    if (this.hayMasPaginas) {
      this.cargar(this.pagina() + 1);
    }
  }

  paginaAnterior(): void {
    if (this.pagina() > 0) {
      this.cargar(this.pagina() - 1);
    }
  }

  private cargar(page: number): void {
    this.cargando.set(true);
    const categoria = this.categoriaSeleccionada() ?? undefined;
    this.shop.productos({ categoria, page, size: TAMANIO_PAGINA }).subscribe({
      next: (resultado) => {
        this.productos.set(resultado.contenido);
        this.total.set(resultado.total);
        this.pagina.set(resultado.pagina);
        this.cargando.set(false);
      },
      // Tienda pausada (404) u otro error del backend: no queda nada que mostrar, pero el
      // loader tiene que soltar igual -- si no, el spinner queda girando para siempre.
      error: () => {
        this.productos.set([]);
        this.total.set(0);
        this.cargando.set(false);
      }
    });
    this.shop.facetas(categoria).subscribe({
      next: (facetas) => this.facetas.set(facetas),
      error: () => this.facetas.set({})
    });
  }
}

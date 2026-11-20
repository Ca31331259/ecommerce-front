import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe, KeyValuePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ShopService } from '@core/services/shop/shop-service';
import { ShopProduct, ShopProductDetail } from '@core/models/shop/shop-product.model';
import { DsSection } from '../../../../shared/design-system/layout/ds-section';
import { DsContainer } from '../../../../shared/design-system/layout/ds-container';
import { DsBadge } from '../../../../shared/design-system/atoms/ds-badge';
import { DsButton } from '../../../../shared/design-system/atoms/ds-button';
import { DsLoader } from '../../../../shared/design-system/atoms/ds-loader';
import { DsImagePlaceholder } from '../../../../shared/design-system/atoms/ds-image-placeholder';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, KeyValuePipe, DsSection, DsContainer, DsBadge, DsButton, DsLoader, DsImagePlaceholder],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetail {

  private readonly shop = inject(ShopService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly cargando = signal(true);
  readonly detalle = signal<ShopProductDetail | null>(null);
  readonly imagenActiva = signal(0);
  readonly noEncontrado = signal(false);

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        this.cargar(slug);
      }
    });
  }

  imagenesProducto(): string[] {
    return this.detalle()?.producto.imagenes ?? [];
  }

  etiquetaStock(): { texto: string; variant: 'success' | 'warning' | 'neutral' } | null {
    const producto = this.detalle()?.producto;
    switch (producto?.estadoStock) {
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

  irAVariante(variante: ShopProduct): void {
    this.router.navigate(['/tienda', 'productos', variante.slug]);
  }

  private cargar(slug: string): void {
    this.cargando.set(true);
    this.noEncontrado.set(false);
    this.imagenActiva.set(0);
    this.shop.producto(slug).subscribe({
      next: (detalle) => {
        this.detalle.set(detalle);
        this.cargando.set(false);
        this.shop.registrarEvento('product_view', { productId: detalle.producto.id }).subscribe();
      },
      error: () => {
        this.cargando.set(false);
        this.noEncontrado.set(true);
      }
    });
  }
}

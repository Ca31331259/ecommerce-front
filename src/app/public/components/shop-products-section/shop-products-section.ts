import {
  Component,
  Input,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ShopService } from '@core/services/shop/shop-service';
import { ShopProduct } from '@core/models/shop/shop-product.model';
import { DsSection } from '../../../shared/design-system/layout/ds-section';
import { DsContainer } from '../../../shared/design-system/layout/ds-container';
import { DsSectionHeader } from '../../../shared/design-system/layout/ds-section-header';
import { DsHeaderBadgeDirective } from '../../../shared/design-system/layout/ds-section-header/directives/ds-header-badge.directive';
import { DsBadge } from '../../../shared/design-system/atoms/ds-badge';
import { DsCard } from '../../../shared/design-system/atoms/ds-card';
import { DsImagePlaceholder } from '../../../shared/design-system/atoms/ds-image-placeholder';

/**
 * Bloque de la home que lista productos de una de las 4 secciones de descubrimiento del catálogo
 * (Fase 5, ver docs/ecommerce/plan-fase-5.md en numecos-java §1.8/§3.2/§3.3): "destacados" (section
 * `PRODUCTS`, única que ya existía como valor del armador de secciones pero sin bloque propio
 * todavía -- el `@case('PRODUCTS')` de `home.html` era un comentario vacío) y las 3 nuevas
 * (`EN_PROMOCION`/`MAS_VENDIDOS`/`NOVEDADES`). Mismo patrón de componente standalone
 * auto-contenido que ya usan `ProductList`/`ProductDetail` (se resuelve su propio
 * `ShopService`, no depende de `TenantStore`): clonarla 4 veces para cada endpoint hermano habría
 * sido 4 copias idénticas salvo el método de `ShopService` a llamar y los textos, así que el
 * `kind` sólo cambia esos dos puntos.
 */
export type ShopHomeSectionKind = 'destacados' | 'en-promocion' | 'mas-vendidos' | 'novedades';

const TITULOS: Record<ShopHomeSectionKind, string> = {
  destacados: 'Productos destacados',
  'en-promocion': 'En promoción',
  'mas-vendidos': 'Más vendidos',
  novedades: 'Novedades'
};

const SUBTITULOS: Record<ShopHomeSectionKind, string> = {
  destacados: 'Una selección pensada para vos.',
  'en-promocion': 'Aprovechá los descuentos por tiempo limitado.',
  'mas-vendidos': 'Los productos que más elige nuestra clientela.',
  novedades: 'Lo último que suma la tienda.'
};

const ICONOS: Record<ShopHomeSectionKind, string> = {
  destacados: 'fa-solid fa-star',
  'en-promocion': 'fa-solid fa-tags',
  'mas-vendidos': 'fa-solid fa-fire',
  novedades: 'fa-solid fa-sparkles'
};

const ETIQUETAS_BADGE: Record<ShopHomeSectionKind, string> = {
  destacados: 'Destacados',
  'en-promocion': 'Ofertas',
  'mas-vendidos': 'Más vendidos',
  novedades: 'Novedades'
};

@Component({
  selector: 'app-shop-products-section',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    DsSection,
    DsContainer,
    DsSectionHeader,
    DsHeaderBadgeDirective,
    DsBadge,
    DsCard,
    DsImagePlaceholder
  ],
  templateUrl: './shop-products-section.html',
  styleUrl: './shop-products-section.scss'
})
export class ShopProductsSection implements OnInit {

  @Input({ required: true })
  kind!: ShopHomeSectionKind;

  @Input()
  limite = 8;

  private readonly shop = inject(ShopService);

  readonly cargando = signal(true);
  readonly productos = signal<ShopProduct[]>([]);

  get titulo(): string {
    return TITULOS[this.kind];
  }

  get subtitulo(): string {
    return SUBTITULOS[this.kind];
  }

  get icono(): string {
    return ICONOS[this.kind];
  }

  get etiquetaBadge(): string {
    return ETIQUETAS_BADGE[this.kind];
  }

  ngOnInit(): void {
    this.obtenerPeticion().subscribe({
      next: (productos) => {
        this.productos.set(productos);
        this.cargando.set(false);
        // Evento de métricas `promo_view` (Fase 5, §1.12 del doc) -- se emite al verse la sección
        // "En promoción" con productos reales, mismo endpoint genérico que el resto de eventos.
        if (this.kind === 'en-promocion' && productos.length) {
          this.shop.registrarEvento('promo_view', { origen: 'home_en_promocion' }).subscribe();
        }
      },
      // Tienda pausada u otro error del backend: la sección simplemente no se muestra (mismo
      // criterio que el resto de bloques de la home ante datos vacíos).
      error: () => {
        this.productos.set([]);
        this.cargando.set(false);
      }
    });
  }

  imagenPrincipal(producto: ShopProduct): string | null {
    return producto.imagenes.length > 0 ? producto.imagenes[0] : null;
  }

  private obtenerPeticion() {
    switch (this.kind) {
      case 'en-promocion':
        return this.shop.enPromocion(this.limite);
      case 'mas-vendidos':
        return this.shop.masVendidos(this.limite);
      case 'novedades':
        return this.shop.novedades(this.limite);
      default:
        return this.shop.destacados(this.limite);
    }
  }
}

import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe, KeyValuePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

// Etiquetas legibles para las claves de atributo que puede devolver /products/facets -- sin
// entrada acá, se usa la clave tal cual (ver etiquetaFaceta). No todas las claves existen para
// todos los tipos de producto (ver construirAtributosFiltro en el ERP), la UI sólo muestra las
// que realmente vienen en la respuesta.
const ETIQUETAS_FACETA: Record<string, string> = {
  tipo: 'Tipo',
  marca: 'Marca',
  material: 'Material',
  estilo: 'Forma',
  color: 'Color'
};

const OPCIONES_ORDEN: { valor: string; etiqueta: string }[] = [
  { valor: 'destacados', etiqueta: 'Destacados' },
  { valor: 'precio_asc', etiqueta: 'Precio: menor a mayor' },
  { valor: 'precio_desc', etiqueta: 'Precio: mayor a menor' },
  { valor: 'novedades', etiqueta: 'Novedades' },
  // Fase 5 (ver docs/ecommerce/plan-fase-5.md en numecos-java §3.2) -- puntaje calculado por el
  // ERP de noche, Platform sólo ordena por `puntaje_ventas DESC`.
  { valor: 'mas_vendidos', etiqueta: 'Más vendidos' }
];

// Nunca son filtros de atributo -- todo lo demás en la URL se interpreta como uno (mismo criterio
// que ShopPublicController.atributosDe del lado de Platform).
const PARAMS_RESERVADOS = new Set(['categoria', 'orden', 'precioMin', 'precioMax', 'q', 'enPromocion']);

function soloAtributos(params: Record<string, string>): Record<string, string> {
  const atributos: Record<string, string> = {};
  for (const [clave, valor] of Object.entries(params)) {
    if (!PARAMS_RESERVADOS.has(clave) && valor) {
      atributos[clave] = valor;
    }
  }
  return atributos;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    CurrencyPipe,
    KeyValuePipe,
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
  readonly ordenSeleccionado = signal<string | null>(null);
  readonly atributosSeleccionados = signal<Record<string, string>>({});
  readonly precioMin = signal<number | null>(null);
  readonly precioMax = signal<number | null>(null);
  readonly textoBusqueda = signal('');
  readonly drawerAbierto = signal(false);
  // Fase 5 (ver docs/ecommerce/plan-fase-5.md en numecos-java §3.1) -- filtro "En promoción".
  readonly enPromocionSeleccionado = signal(false);

  readonly opcionesOrden = OPCIONES_ORDEN;
  protected buscadorTexto = '';

  get hayMasPaginas(): boolean {
    return (this.pagina() + 1) * TAMANIO_PAGINA < this.total();
  }

  get hayFiltrosActivos(): boolean {
    return this.categoriaSeleccionada() !== null || Object.keys(this.atributosSeleccionados()).length > 0
      || this.precioMin() !== null || this.precioMax() !== null || this.textoBusqueda() !== ''
      || this.enPromocionSeleccionado();
  }

  constructor() {
    this.shop.categorias().subscribe({
      next: (categorias) => this.categorias.set(categorias),
      error: () => this.categorias.set([])
    });

    this.route.queryParamMap.subscribe((params) => {
      const todos: Record<string, string> = {};
      params.keys.forEach((clave) => (todos[clave] = params.get(clave) ?? ''));

      const categoriaNueva = params.get('categoria') ? Number(params.get('categoria')) : null;
      const categoriaCambio = categoriaNueva !== this.categoriaSeleccionada();
      const textoNuevo = params.get('q') ?? '';
      const textoCambio = textoNuevo !== this.textoBusqueda();

      this.categoriaSeleccionada.set(categoriaNueva);
      this.ordenSeleccionado.set(params.get('orden'));
      this.precioMin.set(params.get('precioMin') ? Number(params.get('precioMin')) : null);
      this.precioMax.set(params.get('precioMax') ? Number(params.get('precioMax')) : null);
      this.enPromocionSeleccionado.set(params.get('enPromocion') === 'true');
      this.textoBusqueda.set(textoNuevo);
      this.buscadorTexto = textoNuevo;
      this.atributosSeleccionados.set(soloAtributos(todos));

      // Fase 6 (ver docs/ecommerce/plan-fase-6.md §1.7/§3.1) -- el evento `search` se dispara
      // recién en el callback de la respuesta de `cargar` (ver más abajo), no acá al cambiar el
      // texto, para poder incluir `cantidadResultados` real. Sólo se pide cuando el texto
      // realmente cambió, nunca al repaginar/filtrar sin tocar la búsqueda.
      this.cargar(0, textoCambio && textoNuevo ? textoNuevo : undefined);

      if (categoriaCambio && categoriaNueva != null) {
        this.shop.registrarEvento('category_view', { categoriaId: categoriaNueva }).subscribe();
      }
    });
  }

  nombreCategoria(categoriaId: number): string {
    return this.categorias().find((c) => c.id === categoriaId)?.nombre ?? '';
  }

  etiquetaFaceta(clave: string): string {
    return ETIQUETAS_FACETA[clave] ?? clave;
  }

  valorSeleccionado(clave: string): string | null {
    return this.atributosSeleccionados()[clave] ?? null;
  }

  seleccionarCategoria(categoriaId: number | null): void {
    this.navegarConFiltros({ categoria: categoriaId });
  }

  seleccionarOrden(orden: string | null): void {
    this.navegarConFiltros({ orden });
  }

  alternarAtributo(clave: string, valor: string): void {
    const actuales = { ...this.atributosSeleccionados() };
    if (actuales[clave] === valor) {
      delete actuales[clave];
    } else {
      actuales[clave] = valor;
    }
    this.navegarConFiltros({ atributos: actuales });
    this.shop.registrarEvento('filter_used', { clave, valor: actuales[clave] ?? null }).subscribe();
  }

  aplicarRangoPrecio(min: number | null, max: number | null): void {
    this.navegarConFiltros({ precioMin: min, precioMax: max });
    this.shop.registrarEvento('filter_used', { clave: 'precio', min, max }).subscribe();
  }

  alternarEnPromocion(): void {
    const nuevoValor = !this.enPromocionSeleccionado();
    this.navegarConFiltros({ enPromocion: nuevoValor });
    this.shop.registrarEvento('filter_used', { clave: 'enPromocion', valor: nuevoValor }).subscribe();
  }

  buscar(): void {
    this.navegarConFiltros({ q: this.buscadorTexto || null });
  }

  limpiarFiltros(): void {
    this.buscadorTexto = '';
    this.router.navigate([], { relativeTo: this.route, queryParams: {} });
  }

  abrirDrawer(): void {
    this.drawerAbierto.set(true);
  }

  cerrarDrawer(): void {
    this.drawerAbierto.set(false);
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

  /** Arma la URL completa a partir del estado actual + los cambios pedidos -- a propósito nunca usa
   * `queryParamsHandling: 'merge'`: un atributo que se saca tiene que desaparecer de la URL, no
   * quedar pisado por el valor viejo. */
  private navegarConFiltros(cambios: {
    categoria?: number | null;
    orden?: string | null;
    atributos?: Record<string, string>;
    precioMin?: number | null;
    precioMax?: number | null;
    q?: string | null;
    enPromocion?: boolean | null;
  }): void {
    const categoria = cambios.categoria !== undefined ? cambios.categoria : this.categoriaSeleccionada();
    const orden = cambios.orden !== undefined ? cambios.orden : this.ordenSeleccionado();
    const atributos = cambios.atributos ?? this.atributosSeleccionados();
    const precioMin = cambios.precioMin !== undefined ? cambios.precioMin : this.precioMin();
    const precioMax = cambios.precioMax !== undefined ? cambios.precioMax : this.precioMax();
    const q = cambios.q !== undefined ? cambios.q : (this.textoBusqueda() || null);
    const enPromocion = cambios.enPromocion !== undefined ? cambios.enPromocion : this.enPromocionSeleccionado();

    const queryParams: Record<string, string | number | null> = {
      categoria,
      orden,
      precioMin,
      precioMax,
      q,
      // Nunca se manda 'false' -- ausencia del param = sin filtro, mismo criterio que el resto de
      // filtros opcionales de esta URL.
      enPromocion: enPromocion ? 'true' : null,
      ...atributos
    };
    this.router.navigate([], { relativeTo: this.route, queryParams });
  }

  /** `textoBusqueda` sólo se pasa cuando el texto de búsqueda realmente cambió en esta carga (ver
   * el llamado desde el subscribe de `queryParamMap`) -- dispara `search` en el callback de la
   * respuesta, ya con la cantidad real de resultados (Fase 6, §1.7/§3.1 del plan). */
  private cargar(page: number, textoBusqueda?: string): void {
    this.cargando.set(true);
    const filtro = {
      categoria: this.categoriaSeleccionada() ?? undefined,
      atributos: this.atributosSeleccionados(),
      precioMin: this.precioMin() ?? undefined,
      precioMax: this.precioMax() ?? undefined,
      texto: this.textoBusqueda() || undefined,
      orden: this.ordenSeleccionado() ?? undefined,
      enPromocion: this.enPromocionSeleccionado() || undefined,
      page,
      size: TAMANIO_PAGINA
    };
    this.shop.productos(filtro).subscribe({
      next: (resultado) => {
        this.productos.set(resultado.contenido);
        this.total.set(resultado.total);
        this.pagina.set(resultado.pagina);
        this.cargando.set(false);
        if (textoBusqueda) {
          this.shop
            .registrarEvento('search', { texto: textoBusqueda, cantidadResultados: resultado.total })
            .subscribe();
        }
      },
      // Tienda pausada (404) u otro error del backend: no queda nada que mostrar, pero el
      // loader tiene que soltar igual -- si no, el spinner queda girando para siempre.
      error: () => {
        this.productos.set([]);
        this.total.set(0);
        this.cargando.set(false);
      }
    });
    this.shop.facetas(filtro).subscribe({
      next: (facetas) => this.facetas.set(facetas),
      error: () => this.facetas.set({})
    });
  }
}

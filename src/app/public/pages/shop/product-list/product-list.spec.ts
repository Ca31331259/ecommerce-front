import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { ProductList } from './product-list';
import { ShopService } from '@core/services/shop/shop-service';
import { ShopPage, ShopProduct } from '@core/models/shop/shop-product.model';

function producto(id: number): ShopProduct {
  return {
    id,
    tipoProducto: 'ARMAZON',
    titulo: `Anteojo ${id}`,
    slug: `anteojo-${id}`,
    descripcion: null,
    categoriaId: null,
    destacado: false,
    precio: 1000,
    precioComparativo: null,
    estadoStock: 'DISPONIBLE',
    grupoVarianteId: null,
    atributosFiltro: {},
    imagenes: []
  };
}

function paginaVacia(): ShopPage<ShopProduct> {
  return { contenido: [], total: 0, pagina: 0, tamanio: 24 };
}

describe('ProductList', () => {
  let fixture: ComponentFixture<ProductList>;
  let component: ProductList;
  let shop: { [K in keyof ShopService]?: ReturnType<typeof vi.fn> };
  let queryParamMap$: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

  beforeEach(async () => {
    queryParamMap$ = new BehaviorSubject(convertToParamMap({}));
    shop = {
      categorias: vi.fn().mockReturnValue(of([])),
      productos: vi.fn().mockReturnValue(of(paginaVacia())),
      facetas: vi.fn().mockReturnValue(of({})),
      registrarEvento: vi.fn().mockReturnValue(of(undefined))
    };

    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        { provide: ShopService, useValue: shop },
        { provide: ActivatedRoute, useValue: { queryParamMap: queryParamMap$ } },
        { provide: Router, useValue: { navigate: vi.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('carga categorías y productos al iniciar', () => {
    expect(shop.categorias).toHaveBeenCalled();
    expect(shop.productos).toHaveBeenCalled();
    expect(component.cargando()).toBe(false);
  });

  it('lee categoría y atributos de los query params de la URL', () => {
    (shop.productos as ReturnType<typeof vi.fn>).mockClear();
    (shop.facetas as ReturnType<typeof vi.fn>).mockClear();

    queryParamMap$.next(convertToParamMap({ categoria: '5', forma: 'aviador', color: 'negro' }));

    expect(component.categoriaSeleccionada()).toBe(5);
    expect(component.atributosSeleccionados()).toEqual({ forma: 'aviador', color: 'negro' });
    expect(shop.productos).toHaveBeenCalledWith(
      expect.objectContaining({ categoria: 5, atributos: { forma: 'aviador', color: 'negro' } })
    );
    expect(shop.facetas).toHaveBeenCalled();
  });

  it('nunca confunde los params reservados (orden, precioMin, etc.) con atributos', () => {
    queryParamMap$.next(convertToParamMap({ orden: 'precio_asc', precioMin: '100', precioMax: '500', q: 'ray-ban' }));

    expect(component.atributosSeleccionados()).toEqual({});
    expect(component.ordenSeleccionado()).toBe('precio_asc');
    expect(component.precioMin()).toBe(100);
    expect(component.precioMax()).toBe(500);
    expect(component.textoBusqueda()).toBe('ray-ban');
  });

  it('alternarAtributo agrega el atributo si no estaba seleccionado', () => {
    const router = TestBed.inject(Router);
    queryParamMap$.next(convertToParamMap({}));

    component.alternarAtributo('color', 'negro');

    expect(router.navigate).toHaveBeenCalledWith([], expect.objectContaining({
      queryParams: expect.objectContaining({ color: 'negro' })
    }));
    expect(shop.registrarEvento).toHaveBeenCalledWith('filter_used', { clave: 'color', valor: 'negro' });
  });

  it('alternarAtributo quita el atributo si ya estaba seleccionado con el mismo valor', () => {
    const router = TestBed.inject(Router);
    queryParamMap$.next(convertToParamMap({ color: 'negro' }));
    (router.navigate as ReturnType<typeof vi.fn>).mockClear();

    component.alternarAtributo('color', 'negro');

    const llamada = (router.navigate as ReturnType<typeof vi.fn>).mock.calls[0][1];
    expect(llamada.queryParams.color).toBeUndefined();
  });

  it('dispara el evento category_view cuando cambia la categoría de la URL', () => {
    queryParamMap$.next(convertToParamMap({ categoria: '9' }));

    expect(shop.registrarEvento).toHaveBeenCalledWith('category_view', { categoriaId: 9 });
  });

  it('dispara el evento search cuando cambia el texto buscado en la URL', () => {
    queryParamMap$.next(convertToParamMap({ q: 'aviador' }));

    expect(shop.registrarEvento).toHaveBeenCalledWith('search', { texto: 'aviador' });
  });

  it('no deja el loader girando para siempre si el backend falla (tienda pausada, etc.)', () => {
    (shop.productos as ReturnType<typeof vi.fn>).mockReturnValue(throwError(() => new Error('404')));
    (shop.facetas as ReturnType<typeof vi.fn>).mockReturnValue(throwError(() => new Error('404')));

    queryParamMap$.next(convertToParamMap({ categoria: '1' }));

    expect(component.cargando()).toBe(false);
    expect(component.productos()).toEqual([]);
  });

  it('expone resultados cargados y la bandera de más páginas', () => {
    (shop.productos as ReturnType<typeof vi.fn>).mockReturnValue(
      of({ contenido: [producto(1), producto(2)], total: 50, pagina: 0, tamanio: 24 })
    );

    queryParamMap$.next(convertToParamMap({}));

    expect(component.productos().length).toBe(2);
    expect(component.total()).toBe(50);
    expect(component.hayMasPaginas).toBe(true);
  });
});

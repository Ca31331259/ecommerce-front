import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { ProductDetail } from './product-detail';
import { ShopService } from '@core/services/shop/shop-service';
import { ShopProduct, ShopProductDetail } from '@core/models/shop/shop-product.model';

function producto(id: number, slug: string): ShopProduct {
  return {
    id,
    tipoProducto: 'ARMAZON',
    titulo: `Anteojo ${id}`,
    slug,
    descripcion: null,
    categoriaId: null,
    destacado: false,
    precio: 1000,
    precioComparativo: null,
    estadoStock: 'DISPONIBLE',
    grupoVarianteId: null,
    atributosFiltro: {},
    imagenes: [],
    precioOriginal: null,
    descuentoPorcentaje: null
  };
}

describe('ProductDetail', () => {
  let fixture: ComponentFixture<ProductDetail>;
  let component: ProductDetail;
  let shop: { [K in keyof ShopService]?: ReturnType<typeof vi.fn> };
  let paramMap$: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

  beforeEach(async () => {
    paramMap$ = new BehaviorSubject(convertToParamMap({}));
    shop = {
      producto: vi.fn(),
      registrarEvento: vi.fn().mockReturnValue(of(undefined))
    };

    await TestBed.configureTestingModule({
      imports: [ProductDetail],
      providers: [
        { provide: ShopService, useValue: shop },
        { provide: ActivatedRoute, useValue: { paramMap: paramMap$ } },
        { provide: Router, useValue: { navigate: vi.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetail);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('carga el detalle a partir del slug de la ruta y registra product_view', async () => {
    const detalle: ShopProductDetail = { producto: producto(1, 'anteojo-1'), variantes: [] };
    (shop.producto as ReturnType<typeof vi.fn>).mockReturnValue(of(detalle));

    paramMap$.next(convertToParamMap({ slug: 'anteojo-1' }));
    await fixture.whenStable();

    expect(shop.producto).toHaveBeenCalledWith('anteojo-1');
    expect(component.detalle()).toEqual(detalle);
    expect(component.cargando()).toBe(false);
    expect(shop.registrarEvento).toHaveBeenCalledWith('product_view', { productId: 1 });
  });

  it('marca noEncontrado y suelta el loader si el producto no existe', async () => {
    (shop.producto as ReturnType<typeof vi.fn>).mockReturnValue(throwError(() => new Error('404')));

    paramMap$.next(convertToParamMap({ slug: 'no-existe' }));
    await fixture.whenStable();

    expect(component.noEncontrado()).toBe(true);
    expect(component.cargando()).toBe(false);
  });

  it('irAVariante navega a la ficha de la variante elegida', () => {
    const router = TestBed.inject(Router);
    component.irAVariante(producto(2, 'anteojo-2-negro'));

    expect(router.navigate).toHaveBeenCalledWith(['/tienda', 'productos', 'anteojo-2-negro']);
  });
});

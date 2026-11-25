import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { Cart } from './cart';
import { ShopCartService } from '@core/services/shop/shop-cart-service';
import { ShopService } from '@core/services/shop/shop-service';
import { ShopCart } from '@core/models/shop/shop-cart.model';

function carritoCon(items: ShopCart['items']): ShopCart {
  const total = items.reduce((acc, i) => acc + i.subtotal, 0);
  return { token: 'tok-1', items, total, cuponCodigo: null, descuentoCupon: 0, totalFinal: total };
}

describe('Cart', () => {
  let fixture: ComponentFixture<Cart>;
  let component: Cart;
  let cartServiceStub: { [K in keyof ShopCartService]?: unknown };
  let shopServiceStub: { registrarEvento: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    cartServiceStub = {
      carrito: vi.fn(),
      refrescar: vi.fn(),
      cambiarCantidad: vi.fn().mockReturnValue({ subscribe: vi.fn() }),
      quitar: vi.fn().mockReturnValue({ subscribe: vi.fn() })
    };
    (cartServiceStub.carrito as ReturnType<typeof vi.fn>).mockReturnValue(carritoCon([]));
    shopServiceStub = { registrarEvento: vi.fn().mockReturnValue(of(undefined)) };

    await TestBed.configureTestingModule({
      imports: [Cart],
      providers: [
        // Router real (vía provideRouter) en vez de un mock -- el componente usa routerLink, que
        // necesita ActivatedRoute + Router.createUrlTree funcionando de verdad, no sólo .navigate.
        provideRouter([]),
        { provide: ShopCartService, useValue: cartServiceStub },
        { provide: ShopService, useValue: shopServiceStub }
      ]
    }).compileComponents();

    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(Cart);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('pide refrescar el carrito al iniciar', () => {
    expect(cartServiceStub.refrescar).toHaveBeenCalled();
  });

  it('registra cart_view sin payload al entrar a la página', () => {
    expect(shopServiceStub.registrarEvento).toHaveBeenCalledWith('cart_view');
  });

  it('no deja bajar la cantidad de un item por debajo de 1', () => {
    component.cambiarCantidad(5, 0);
    expect(cartServiceStub.cambiarCantidad).not.toHaveBeenCalled();
  });

  it('cambiarCantidad delega en el servicio con una cantidad válida', () => {
    component.cambiarCantidad(5, 2);
    expect(cartServiceStub.cambiarCantidad).toHaveBeenCalledWith(5, 2);
  });

  it('quitar delega en el servicio', () => {
    component.quitar(5);
    expect(cartServiceStub.quitar).toHaveBeenCalledWith(5);
  });

  it('irAlCheckout navega a /tienda/checkout', () => {
    const router = TestBed.inject(Router);
    component.irAlCheckout();
    expect(router.navigate).toHaveBeenCalledWith(['/tienda/checkout']);
  });
});

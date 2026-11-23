import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { Checkout } from './checkout';
import { ShopCartService } from '@core/services/shop/shop-cart-service';
import { ShopEnvioService } from '@core/services/shop/shop-envio-service';
import { ShopOrderService } from '@core/services/shop/shop-order-service';
import { ShopService } from '@core/services/shop/shop-service';
import { ShopCart } from '@core/models/shop/shop-cart.model';
import { ShopBranch, ShopOrder } from '@core/models/shop/shop-order.model';

function carritoCon(total: number): ShopCart {
  return {
    token: 'tok-1',
    items: [{ shopProductId: 1, titulo: 'Anteojo', slug: 'anteojo', precioUnitario: total, cantidad: 1, subtotal: total, activo: true }],
    total,
    cuponCodigo: null,
    descuentoCupon: 0,
    totalFinal: total
  };
}

function orden(overrides: Partial<ShopOrder> = {}): ShopOrder {
  return {
    numero: 'WEB-000001',
    tokenPublico: 'token-pub-1',
    estado: 'PENDIENTE_PAGO',
    requiereAtencion: false,
    motivoAtencion: null,
    subtotal: 1000,
    total: 1000,
    moneda: 'ARS',
    items: [],
    urlPago: null,
    venceEn: new Date().toISOString(),
    codigoRetiro: null,
    sucursal: null,
    montoReembolsado: null,
    fechaReembolso: null,
    historial: [],
    metodoEntrega: 'RETIRO_SUCURSAL',
    envio: null,
    ...overrides
  };
}

describe('Checkout', () => {
  let fixture: ComponentFixture<Checkout>;
  let component: Checkout;
  let cartService: { carrito: ReturnType<typeof vi.fn>; refrescar: ReturnType<typeof vi.fn>; sucursalesDisponibles: ReturnType<typeof vi.fn> };
  let orderService: { checkout: ReturnType<typeof vi.fn>; pagosDisponibles: ReturnType<typeof vi.fn> };
  let envioService: { geografia: ReturnType<typeof vi.fn>; cotizar: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  const sucursal: ShopBranch = { id: 1, nombre: 'Sucursal Centro', direccion: null };

  beforeEach(async () => {
    cartService = {
      carrito: vi.fn().mockReturnValue(carritoCon(1000)),
      refrescar: vi.fn(),
      sucursalesDisponibles: vi.fn().mockReturnValue(of([sucursal]))
    };
    orderService = { checkout: vi.fn(), pagosDisponibles: vi.fn().mockReturnValue(of({ disponible: true })) };
    // Fase 7 -- sin provincias no se ofrece "Envío a domicilio" (ver cargarGeografia en checkout.ts).
    envioService = { geografia: vi.fn().mockReturnValue(of([])), cotizar: vi.fn() };
    router = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Checkout],
      providers: [
        { provide: ShopCartService, useValue: cartService },
        { provide: ShopOrderService, useValue: orderService },
        { provide: ShopEnvioService, useValue: envioService },
        { provide: ShopService, useValue: { registrarEvento: vi.fn().mockReturnValue(of(undefined)) } },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Checkout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('carga las sucursales con stock completo del carrito', () => {
    expect(cartService.sucursalesDisponibles).toHaveBeenCalled();
    expect(component.sucursalesDisponibles()).toEqual([sucursal]);
    expect(component.sinSucursalCompleta()).toBe(false);
  });

  it('marca sinSucursalCompleta cuando ninguna sucursal tiene todo el carrito (C4)', async () => {
    cartService.sucursalesDisponibles.mockReturnValue(of([]));
    fixture = TestBed.createComponent(Checkout);
    component = fixture.componentInstance;
    await fixture.whenStable();

    expect(component.sinSucursalCompleta()).toBe(true);
    expect(component.puedeConfirmar()).toBe(false);
  });

  it('no permite confirmar sin completar los datos obligatorios', () => {
    expect(component.puedeConfirmar()).toBe(false);
  });

  it('marca pagosDisponibles en false si la óptica no puede cobrar todavía (Fase 3)', async () => {
    orderService.pagosDisponibles.mockReturnValue(of({ disponible: false }));
    fixture = TestBed.createComponent(Checkout);
    component = fixture.componentInstance;
    await fixture.whenStable();

    expect(component.pagosDisponibles()).toBe(false);
    expect(component.puedeConfirmar()).toBe(false);
  });

  it('deja pagosDisponibles en true si la consulta falla (no bloquea por un error de red)', async () => {
    orderService.pagosDisponibles.mockReturnValue(throwError(() => new Error('network')));
    fixture = TestBed.createComponent(Checkout);
    component = fixture.componentInstance;
    await fixture.whenStable();

    expect(component.pagosDisponibles()).toBe(true);
  });

  it('valida el documento en vivo y bloquea la confirmación si es inválido', () => {
    component.form.numeroDocumento = '123';
    component.form.tipoDocumento = 'DNI';
    component.validarDocumentoEnVivo();

    expect(component.errorDocumento()).toBeTruthy();
    expect(component.puedeConfirmar()).toBe(false);
  });

  it('confirma el pedido y redirige a la URL de pago cuando el servidor la devuelve', () => {
    component.form = {
      nombre: 'Ana',
      apellido: 'Pérez',
      email: 'ana@test.com',
      telefono: '123456',
      tipoDocumento: 'DNI',
      numeroDocumento: '12345678',
      condicionIva: 'CONSUMIDOR_FINAL',
      sucursalRetiroId: 1
    };
    orderService.checkout.mockReturnValue(of(orden({ urlPago: '/tienda/pago-simulado/abc' })));

    const originalLocation = window.location;
    // @ts-expect-error -- redefinimos location sólo para este test
    delete window.location;
    // @ts-expect-error
    window.location = { ...originalLocation, href: '' };

    component.confirmar();

    expect(orderService.checkout).toHaveBeenCalledWith(
      expect.objectContaining({ nombre: 'Ana', sucursalRetiroId: 1 })
    );
    expect(window.location.href).toBe('/tienda/pago-simulado/abc');

    // @ts-expect-error -- restauramos el location real tras el test
    window.location = originalLocation;
  });

  it('redirige a la página de estado del pedido cuando no hay pasarela disponible', () => {
    component.form = {
      nombre: 'Ana',
      apellido: 'Pérez',
      email: 'ana@test.com',
      telefono: '123456',
      tipoDocumento: 'DNI',
      numeroDocumento: '12345678',
      condicionIva: 'CONSUMIDOR_FINAL',
      sucursalRetiroId: 1
    };
    orderService.checkout.mockReturnValue(of(orden({ urlPago: null })));

    component.confirmar();

    expect(router.navigate).toHaveBeenCalledWith(['/tienda/pedido', 'token-pub-1']);
  });

  it('muestra un error claro cuando el servidor rechaza por falta de stock (409)', () => {
    component.form = {
      nombre: 'Ana',
      apellido: 'Pérez',
      email: 'ana@test.com',
      telefono: '123456',
      tipoDocumento: 'DNI',
      numeroDocumento: '12345678',
      condicionIva: 'CONSUMIDOR_FINAL',
      sucursalRetiroId: 1
    };
    orderService.checkout.mockReturnValue(throwError(() => ({ status: 409, error: 'No hay stock suficiente' })));

    component.confirmar();

    expect(component.error()).toContain('stock');
    expect(component.enviando()).toBe(false);
  });
});

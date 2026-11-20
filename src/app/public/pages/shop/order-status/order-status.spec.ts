import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { OrderStatus } from './order-status';
import { ShopOrderService } from '@core/services/shop/shop-order-service';
import { ShopOrder } from '@core/models/shop/shop-order.model';

function orden(overrides: Partial<ShopOrder> = {}): ShopOrder {
  return {
    numero: 'WEB-000001',
    tokenPublico: 'tok-1',
    estado: 'PENDIENTE_PAGO',
    requiereAtencion: false,
    motivoAtencion: null,
    subtotal: 1000,
    total: 1000,
    moneda: 'ARS',
    items: [],
    urlPago: null,
    venceEn: new Date().toISOString(),
    ...overrides
  };
}

describe('OrderStatus', () => {
  let fixture: ComponentFixture<OrderStatus>;
  let component: OrderStatus;
  let orderService: {
    obtenerPedido: ReturnType<typeof vi.fn>;
    reintentarPago: ReturnType<typeof vi.fn>;
    cancelar: ReturnType<typeof vi.fn>;
  };

  async function montar(tokenParam = 'tok-1'): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [OrderStatus],
      providers: [
        { provide: ShopOrderService, useValue: orderService },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ token: tokenParam })) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  }

  beforeEach(() => {
    orderService = {
      obtenerPedido: vi.fn().mockReturnValue(of(orden())),
      reintentarPago: vi.fn(),
      cancelar: vi.fn()
    };
  });

  it('carga el pedido a partir del token de la ruta', async () => {
    await montar();

    expect(orderService.obtenerPedido).toHaveBeenCalledWith('tok-1');
    expect(component.orden()?.numero).toBe('WEB-000001');
    expect(component.cargando()).toBe(false);
  });

  it('marca noEncontrado si el pedido no existe (404)', async () => {
    orderService.obtenerPedido.mockReturnValue(throwError(() => new Error('404')));
    await montar();

    expect(component.noEncontrado()).toBe(true);
    expect(component.cargando()).toBe(false);
  });

  it('permite reintentar pago sólo en PENDIENTE_PAGO/PAGO_RECHAZADO', async () => {
    await montar();

    expect(component.puedeReintentar('PENDIENTE_PAGO')).toBe(true);
    expect(component.puedeReintentar('PAGO_RECHAZADO')).toBe(true);
    expect(component.puedeReintentar('PAGADO')).toBe(false);
    expect(component.puedeReintentar('VENCIDO')).toBe(false);
    expect(component.puedeReintentar('CANCELADO')).toBe(false);
  });

  it('reintentarPago redirige a la nueva URL de pago si el servidor la da', async () => {
    await montar();
    orderService.reintentarPago.mockReturnValue(of(orden({ urlPago: '/tienda/pago-simulado/xyz' })));

    const originalLocation = window.location;
    // @ts-expect-error -- redefinimos location sólo para este test
    delete window.location;
    // @ts-expect-error
    window.location = { ...originalLocation, href: '' };

    component.reintentarPago();

    expect(window.location.href).toBe('/tienda/pago-simulado/xyz');
    // @ts-expect-error -- restauramos el location real tras el test
    window.location = originalLocation;
  });

  it('cancelar pide confirmación antes de llamar al servidor (8.2.2)', async () => {
    await montar();

    component.pedirConfirmacionCancelar();
    expect(component.confirmandoCancelacion()).toBe(true);
    expect(orderService.cancelar).not.toHaveBeenCalled();

    orderService.cancelar.mockReturnValue(of(orden({ estado: 'CANCELADO' })));
    component.confirmarCancelacion();

    expect(orderService.cancelar).toHaveBeenCalledWith('tok-1');
    expect(component.orden()?.estado).toBe('CANCELADO');
  });

  it('descartarCancelacion cierra la confirmación sin llamar al servidor', async () => {
    await montar();

    component.pedirConfirmacionCancelar();
    component.descartarCancelacion();

    expect(component.confirmandoCancelacion()).toBe(false);
    expect(orderService.cancelar).not.toHaveBeenCalled();
  });
});

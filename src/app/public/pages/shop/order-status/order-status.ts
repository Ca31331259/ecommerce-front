import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { interval, take, takeWhile } from 'rxjs';
import { ShopOrderService } from '@core/services/shop/shop-order-service';
import { EstadoPedido, ShopOrder } from '@core/models/shop/shop-order.model';
import { DsSection } from '../../../../shared/design-system/layout/ds-section';
import { DsContainer } from '../../../../shared/design-system/layout/ds-container';
import { DsBadge } from '../../../../shared/design-system/atoms/ds-badge';
import { DsButton } from '../../../../shared/design-system/atoms/ds-button';
import { DsLoader } from '../../../../shared/design-system/atoms/ds-loader';

const ETIQUETAS_ESTADO: Record<EstadoPedido, string> = {
  PENDIENTE_PAGO: 'Pendiente de pago',
  PAGADO: 'Pagado',
  PAGO_RECHAZADO: 'Pago rechazado',
  VENCIDO: 'Vencido',
  CANCELADO: 'Cancelado',
  EN_PREPARACION: 'En preparación',
  LISTO_PARA_RETIRAR: 'Listo para retirar',
  // Fase 7 (ver docs/ecommerce/plan-fase-7.md en numecos-java §3.7) -- camino paralelo a
  // LISTO_PARA_RETIRAR, pero para pedidos de envío a domicilio.
  DESPACHADO: 'En camino',
  ENTREGADO: 'Entregado',
  REEMBOLSADO: 'Reembolsado'
};

const VARIANTES_ESTADO: Record<EstadoPedido, 'success' | 'warning' | 'neutral' | 'primary'> = {
  PENDIENTE_PAGO: 'warning',
  PAGADO: 'success',
  PAGO_RECHAZADO: 'warning',
  VENCIDO: 'neutral',
  CANCELADO: 'neutral',
  EN_PREPARACION: 'primary',
  LISTO_PARA_RETIRAR: 'success',
  DESPACHADO: 'primary',
  ENTREGADO: 'success',
  REEMBOLSADO: 'neutral'
};

const ESTADOS_REINTENTABLES: EstadoPedido[] = ['PENDIENTE_PAGO', 'PAGO_RECHAZADO'];

/** `/tienda/pedido/:token` -- estado del pedido, sin login (Fase 2, ver
 * docs/ecommerce/plan-fase-2.md). */
@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink, DsSection, DsContainer, DsBadge, DsButton, DsLoader],
  templateUrl: './order-status.html',
  styleUrl: './order-status.scss'
})
export class OrderStatus {
  private readonly orderService = inject(ShopOrderService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly cargando = signal(true);
  readonly orden = signal<ShopOrder | null>(null);
  readonly noEncontrado = signal(false);
  readonly procesando = signal(false);
  readonly confirmandoCancelacion = signal(false);

  private token = '';
  private pollingIniciado = false;

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const token = params.get('token');
      if (token) {
        this.token = token;
        this.cargar();
      }
    });
  }

  /** Confirmación de pago asíncrona (Fase 3, ver docs/ecommerce/plan-fase-3.md bloque 3) -- al
   * volver de Mercado Pago el pedido puede seguir PENDIENTE_PAGO un rato (la notificación todavía
   * no llegó/se procesó), así que se consulta de nuevo cada pocos segundos en vez de mostrar un
   * estado que ya puede estar desactualizado. El estado SIEMPRE sale de esta consulta al servidor,
   * nunca de un parámetro de la URL de vuelta. */
  confirmandoPago(): boolean {
    const orden = this.orden();
    return !!orden && orden.estado === 'PENDIENTE_PAGO' && !!orden.urlPago;
  }

  private empezarPollingSiCorresponde(): void {
    if (this.pollingIniciado || !this.confirmandoPago()) {
      return;
    }
    this.pollingIniciado = true;
    interval(4000)
      .pipe(
        take(30), // ~2 minutos -- después de esto, el comprador puede refrescar la página a mano
        takeWhile(() => this.confirmandoPago()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.consultarEstadoSilencioso());
  }

  private consultarEstadoSilencioso(): void {
    this.orderService.obtenerPedido(this.token).subscribe({
      next: (orden) => this.orden.set(orden)
      // Un error puntual de red durante el polling no rompe la página -- se reintenta en el
      // próximo tick, no hace falta loguear nada acá.
    });
  }

  etiqueta(estado: EstadoPedido): string {
    return ETIQUETAS_ESTADO[estado];
  }

  variante(estado: EstadoPedido): 'success' | 'warning' | 'neutral' | 'primary' {
    return VARIANTES_ESTADO[estado];
  }

  puedeReintentar(estado: EstadoPedido): boolean {
    return ESTADOS_REINTENTABLES.includes(estado);
  }

  puedeCancelar(estado: EstadoPedido): boolean {
    return ESTADOS_REINTENTABLES.includes(estado);
  }

  mostrarCodigoRetiro(orden: ShopOrder): boolean {
    return !!orden.codigoRetiro;
  }

  mostrarSucursal(orden: ShopOrder): boolean {
    return !!orden.sucursal;
  }

  /** Fase 7 (ver docs/ecommerce/plan-fase-7.md en numecos-java §3.9) -- `envio` siempre viene
   * `null` para pedidos de retiro (ver `ShopOrderService.armarRespuesta` del lado Platform), el
   * chequeo de `metodoEntrega` es sólo defensivo. */
  mostrarEnvio(orden: ShopOrder): boolean {
    return orden.metodoEntrega === 'ENVIO_DOMICILIO' && !!orden.envio;
  }

  /** El seguimiento (empresa/número/link) sólo se completa cuando la óptica despacha el pedido
   * (§3.8 del plan) -- antes de eso viene todo `null`, así que el bloque no se muestra. */
  mostrarSeguimiento(orden: ShopOrder): boolean {
    const envio = orden.envio;
    return !!envio && (!!envio.seguimientoEmpresa || !!envio.seguimientoNumero || !!envio.seguimientoLink);
  }

  mostrarReembolso(orden: ShopOrder): boolean {
    return orden.estado === 'REEMBOLSADO' || orden.montoReembolsado != null;
  }

  mostrarHistorial(orden: ShopOrder): boolean {
    return orden.historial.length > 0;
  }

  reintentarPago(): void {
    if (this.procesando()) {
      return;
    }
    this.procesando.set(true);
    this.orderService.reintentarPago(this.token).subscribe({
      next: (orden) => {
        this.procesando.set(false);
        if (orden.urlPago) {
          window.location.href = orden.urlPago;
        } else {
          this.orden.set(orden);
        }
      },
      error: () => this.procesando.set(false)
    });
  }

  pedirConfirmacionCancelar(): void {
    this.confirmandoCancelacion.set(true);
  }

  descartarCancelacion(): void {
    this.confirmandoCancelacion.set(false);
  }

  confirmarCancelacion(): void {
    if (this.procesando()) {
      return;
    }
    this.procesando.set(true);
    this.orderService.cancelar(this.token).subscribe({
      next: (orden) => {
        this.orden.set(orden);
        this.procesando.set(false);
        this.confirmandoCancelacion.set(false);
      },
      error: () => this.procesando.set(false)
    });
  }

  private cargar(): void {
    this.cargando.set(true);
    this.noEncontrado.set(false);
    this.orderService.obtenerPedido(this.token).subscribe({
      next: (orden) => {
        this.orden.set(orden);
        this.cargando.set(false);
        this.empezarPollingSiCorresponde();
      },
      error: () => {
        this.cargando.set(false);
        this.noEncontrado.set(true);
      }
    });
  }
}

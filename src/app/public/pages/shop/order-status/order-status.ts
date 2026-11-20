import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
  CANCELADO: 'Cancelado'
};

const VARIANTES_ESTADO: Record<EstadoPedido, 'success' | 'warning' | 'neutral' | 'primary'> = {
  PENDIENTE_PAGO: 'warning',
  PAGADO: 'success',
  PAGO_RECHAZADO: 'warning',
  VENCIDO: 'neutral',
  CANCELADO: 'neutral'
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

  readonly cargando = signal(true);
  readonly orden = signal<ShopOrder | null>(null);
  readonly noEncontrado = signal(false);
  readonly procesando = signal(false);
  readonly confirmandoCancelacion = signal(false);

  private token = '';

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const token = params.get('token');
      if (token) {
        this.token = token;
        this.cargar();
      }
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
      },
      error: () => {
        this.cargando.set(false);
        this.noEncontrado.set(true);
      }
    });
  }
}

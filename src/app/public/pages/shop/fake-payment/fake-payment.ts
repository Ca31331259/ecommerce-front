import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopOrderService } from '@core/services/shop/shop-order-service';
import { DsSection } from '../../../../shared/design-system/layout/ds-section';
import { DsContainer } from '../../../../shared/design-system/layout/ds-container';
import { DsButton } from '../../../../shared/design-system/atoms/ds-button';

/** Página de pago simulado -- SOLO dev/test (Fase 2, ver docs/ecommerce/plan-fase-2.md §5,
 * corrección C9). El backend ni registra esta ruta en producción (FakePaymentController está
 * `@ConditionalOnProperty`), así que esta página nunca tiene nada real que hacer ahí -- el banner
 * de abajo es la única señal visual, pero la garantía real es del lado del servidor. */
@Component({
  selector: 'app-fake-payment',
  standalone: true,
  imports: [DsSection, DsContainer, DsButton],
  templateUrl: './fake-payment.html',
  styleUrl: './fake-payment.scss'
})
export class FakePayment {
  private readonly orderService = inject(ShopOrderService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly procesando = signal(false);
  private externalReference = '';

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.externalReference = params.get('externalReference') ?? '';
    });
  }

  simular(resultado: 'APROBADO' | 'RECHAZADO'): void {
    if (this.procesando() || !this.externalReference) {
      return;
    }
    this.procesando.set(true);
    this.orderService.simularPago(this.externalReference, resultado).subscribe({
      next: (respuesta) => this.router.navigate(['/tienda/pedido', respuesta.tokenPublico]),
      error: () => this.procesando.set(false)
    });
  }

  dejarPendiente(): void {
    this.router.navigate(['/tienda']);
  }
}

import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { ShopCartService } from '@core/services/shop/shop-cart-service';
import { ShopService } from '@core/services/shop/shop-service';
import { DsSection } from '../../../../shared/design-system/layout/ds-section';
import { DsContainer } from '../../../../shared/design-system/layout/ds-container';
import { DsButton } from '../../../../shared/design-system/atoms/ds-button';
import {
  DsEmptyDescriptionDirective,
  DsEmptyIconDirective,
  DsEmptyState,
  DsEmptyTitleDirective
} from '../../../../shared/design-system/molecules/ds-empty-state';

/** `/tienda/carrito` (Fase 2, ver docs/ecommerce/plan-fase-2.md). Cupón por código: Fase 5, ver
 * docs/ecommerce/plan-fase-5.md en numecos-java §3.4. */
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CurrencyPipe,
    FormsModule,
    RouterLink,
    DsSection,
    DsContainer,
    DsButton,
    DsEmptyState,
    DsEmptyIconDirective,
    DsEmptyTitleDirective,
    DsEmptyDescriptionDirective
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart {
  readonly cartService = inject(ShopCartService);
  private readonly shop = inject(ShopService);
  private readonly router = inject(Router);

  cuponInput = '';
  readonly aplicandoCupon = signal(false);
  readonly errorCupon = signal<string | null>(null);

  constructor() {
    this.cartService.refrescar();
    // Fase 6 (ver docs/ecommerce/plan-fase-6.md §3.1) -- `cart_view` al entrar a la página de
    // carrito, sin payload (mismo criterio que `checkout_start`, que tampoco lleva uno).
    this.shop.registrarEvento('cart_view').subscribe();
  }

  cambiarCantidad(productoId: number, cantidad: number): void {
    if (cantidad < 1) {
      return;
    }
    this.cartService.cambiarCantidad(productoId, cantidad).subscribe();
  }

  quitar(productoId: number): void {
    this.cartService.quitar(productoId).subscribe();
  }

  /** Mensaje de error unificado ("Código no válido" tanto para código inexistente como para uno
   * que no aplica, §3.4 del doc) -- nunca se distingue la causa en la UI, se muestra el mensaje
   * que el backend devuelva tal cual. */
  aplicarCupon(): void {
    const codigo = this.cuponInput.trim();
    if (!codigo || this.aplicandoCupon()) {
      return;
    }
    this.aplicandoCupon.set(true);
    this.errorCupon.set(null);
    this.cartService.aplicarCupon(codigo).subscribe({
      next: () => {
        this.aplicandoCupon.set(false);
        this.cuponInput = '';
      },
      error: (err: HttpErrorResponse) => {
        this.aplicandoCupon.set(false);
        this.errorCupon.set(this.mensajeErrorCupon(err));
      }
    });
  }

  irAlCheckout(): void {
    this.router.navigate(['/tienda/checkout']);
  }

  private mensajeErrorCupon(err: HttpErrorResponse): string {
    // El body real de un 400 es el ApiErrorDTO del backend ({ status, error, message, ... }), no
    // un string plano -- el mensaje útil viaja en `message` (ex.getReason() de la
    // ResponseStatusException, siempre "Código no válido" para este endpoint).
    const mensaje = err?.error?.message;
    return typeof mensaje === 'string' && mensaje ? mensaje : 'Código no válido';
  }
}

import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ShopCartService } from '@core/services/shop/shop-cart-service';
import { DsSection } from '../../../../shared/design-system/layout/ds-section';
import { DsContainer } from '../../../../shared/design-system/layout/ds-container';
import { DsButton } from '../../../../shared/design-system/atoms/ds-button';
import {
  DsEmptyDescriptionDirective,
  DsEmptyIconDirective,
  DsEmptyState,
  DsEmptyTitleDirective
} from '../../../../shared/design-system/molecules/ds-empty-state';

/** `/tienda/carrito` (Fase 2, ver docs/ecommerce/plan-fase-2.md). */
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CurrencyPipe,
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
  private readonly router = inject(Router);

  constructor() {
    this.cartService.refrescar();
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

  irAlCheckout(): void {
    this.router.navigate(['/tienda/checkout']);
  }
}

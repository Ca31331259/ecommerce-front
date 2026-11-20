import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ShopCartService } from '@core/services/shop/shop-cart-service';
import { DsButton } from '../../../shared/design-system/atoms/ds-button';

/** Mini-cart (Fase 2, ver docs/ecommerce/plan-fase-2.md) -- se abre al agregar un producto al
 * carrito desde la ficha, visible en cualquier página pública (montado en PublicLayout). */
@Component({
  selector: 'app-mini-cart-drawer',
  standalone: true,
  imports: [CurrencyPipe, DsButton],
  templateUrl: './mini-cart-drawer.html',
  styleUrl: './mini-cart-drawer.scss'
})
export class MiniCartDrawer {
  readonly cartService = inject(ShopCartService);
  private readonly router = inject(Router);

  cerrar(): void {
    this.cartService.cerrarDrawer();
  }

  quitar(productoId: number): void {
    this.cartService.quitar(productoId).subscribe();
  }

  irAlCarrito(): void {
    this.cerrar();
    this.router.navigate(['/tienda/carrito']);
  }
}

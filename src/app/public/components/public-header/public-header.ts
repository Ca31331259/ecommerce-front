import {
  Component,
  HostListener,
  Input,
  inject,
  signal
} from '@angular/core';

import { Router } from '@angular/router';
import { DsContainer } from '../../../shared/design-system/layout/ds-container';
import { DsButton } from '../../../shared/design-system/atoms/ds-button/ds-button';
import { ShopCartService } from '@core/services/shop/shop-cart-service';


@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [
    DsContainer,
    DsButton
  ],
  templateUrl: './public-header.html',
  styleUrl: './public-header.scss'
})
export class PublicHeader {

  readonly cartService = inject(ShopCartService);

  @Input({ required: true })
  settings: any;

  @Input({ required: true })
  theme: any;

  @Input()
  sections: any[] = [];

  menuOpen =
    signal(false);

  scrolled =
    signal(false);

  constructor(
    private router: Router
  ) {
  }

  /*==========================================================
  SCROLL
  ==========================================================*/

  @HostListener('window:scroll')
  onWindowScroll(): void {

    this.scrolled.set(
      window.scrollY > 20
    );

  }

  /*==========================================================
  MENU
  ==========================================================*/

  toggleMenu(): void {

    this.menuOpen.update(
      value => !value
    );

  }

  closeMenu(): void {

    this.menuOpen.set(false);

  }

  /*==========================================================
  SECTIONS
  ==========================================================*/

  isEnabled(section: string): boolean {

    return this.sections.some(
      item =>
        item.section === section &&
        item.enabled
    );

  }

  /*==========================================================
  NAVIGATION
  ==========================================================*/

  scrollTo(id: string): void {

    this.closeMenu();

    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

  }

  /*==========================================================
  LOGIN
  ==========================================================*/

  irAlLogin(): void {

    this.closeMenu();

    this.router.navigate([
      '/login'
    ]);

  }

  /*==========================================================
  TIENDA (módulo Shop, pedido real 2026-11-19)
  ==========================================================*/

  irATienda(): void {

    this.closeMenu();

    this.router.navigate([
      '/tienda'
    ]);

  }

  irAlCarrito(): void {

    this.closeMenu();

    this.router.navigate([
      '/tienda/carrito'
    ]);

  }

}
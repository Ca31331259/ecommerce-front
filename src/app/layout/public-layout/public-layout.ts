import {
  Component,
  computed,
  effect,
  inject
} from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { TenantStore } from '../../core/store/tenant.store';

import { DsLoader } from '../../shared/design-system/atoms/ds-loader';
import { PublicHeader } from '../../public/components/public-header/public-header';
import { PublicFooter } from '../../public/components/public-footer/public-footer';
import { MiniCartDrawer } from '../../public/components/mini-cart-drawer/mini-cart-drawer';
import { ThemeService } from '../../core/services/tenant/theme-service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    PublicHeader,
    PublicFooter,
    MiniCartDrawer,
    DsLoader
  ],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss'
})
export class PublicLayout {

  private store = inject(TenantStore);

  private themeService = inject(ThemeService);

  /** environment.shopHabilitado (pedido real 2026-11-25) -- sin el módulo, no tiene sentido montar
   * el drawer del carrito (ni pegarle a ShopCartService, que consulta un endpoint que ya no existe). */
  readonly shopHabilitado = environment.shopHabilitado;

  bootstrap = computed(() =>
    this.store.site()
  );

  constructor() {

    effect(() => {

      const bootstrap =
        this.bootstrap();

      if (!bootstrap?.theme) {
        return;
      }

      this.themeService.applyTheme(
        bootstrap.theme
      );

    });

  }

}
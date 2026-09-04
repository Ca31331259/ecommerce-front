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
import { ThemeService } from '../../core/services/tenant/theme-service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    PublicHeader,
    PublicFooter,
    DsLoader
  ],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss'
})
export class PublicLayout {

  private store = inject(TenantStore);

  private themeService = inject(ThemeService);

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
import {
  Component,
  computed,
  inject
} from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import {
  SiteStore
} from '../../../core/store/site.store';

import {
  AuthService
} from '../../../core/services/auth-service';
import { AdminShellStore } from '../../store/admin-shell.store';



interface AdminNavigationItem {

  label: string;

  icon: string;

  route?: string;

  disabled?: boolean;

  badge?: string;

}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.scss'
})
export class AdminSidebar {

  private readonly router =
    inject(Router);

  private readonly auth =
    inject(AuthService);

  private readonly siteStore =
    inject(SiteStore);

  readonly shellStore =
    inject(AdminShellStore);

  readonly site =
    computed(
      () => this.siteStore.site()
    );

  readonly businessName =
    computed(
      () =>
        this.site()
          ?.settings
          ?.businessName
        ?? 'Mi comercio'
    );

  readonly businessInitial =
    computed(
      () =>
        this.businessName()
          .trim()
          .charAt(0)
          .toUpperCase()
        || 'E'
    );

  readonly logoUrl =
    computed(
      () =>
        this.site()
          ?.theme
          ?.logo_url
        ?? null
    );

  readonly navigationItems:
    readonly AdminNavigationItem[] = [

      {
        label: 'Dashboard',
        icon: 'fa-solid fa-chart-pie',
        route: '/admin/dashboard'
      },

      {
        label: 'Sitio web',
        icon: 'fa-solid fa-display',
        route: '/admin/site'
      },
      {
        label: 'Perfil',
        icon: 'fa-solid fa-user',
        route: '/admin/profile'
      },
      {
        label: 'Productos',
        icon: 'fa-solid fa-box',
        route: '/admin/products'
      },

      {
        label: 'Categorías',
        icon: 'fa-solid fa-layer-group',
        route: '/admin/categories'
      },

      /*{
        label: 'Banners',
        icon: 'fa-regular fa-images',
        disabled: true
      },*/

      {
        label: 'Pedidos',
        icon: 'fa-solid fa-cart-shopping',
        route: '/admin/orders'
      },

      {
        label: 'Clientes',
        icon: 'fa-solid fa-users',
        disabled: true,
        badge: 'Próximamente'
      }

    ];

  closeMobileSidebar(): void {

    this.shellStore
      .closeMobileSidebar();

  }

  openStore(): void {

    window.open(
      '/',
      '_blank',
      'noopener,noreferrer'
    );

  }

  logout(): void {

    this.shellStore
      .closeMobileSidebar();

    this.auth.logout();

    void this.router.navigate(['/']);

  }

}
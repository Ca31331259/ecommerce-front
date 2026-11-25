import {
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router
} from '@angular/router';

import {
  AdminBreadcrumb,
  AdminBreadcrumbItem,
  AdminButton,
  AdminCard,
  AdminCardFooterDirective,
  AdminCardHeaderDirective,
  AdminInfoItem,
  AdminInfoList,
  AdminLoader,
  AdminPage,
  AdminSection,
  AdminStatCard,
  AdminStatusBadge,
  AdminToolbar,
  AdminToolbarMetaDirective
} from '@shared/design-system-admin';

import {
  SiteConfigService
} from '../../../core/services/site-config/site-config-service';

import {
  ShopAdminService
} from '../../../core/services/shop-admin/shop-admin-service';

import {
  AdminSalesSummary
} from '../../../core/models/shop-admin';

import {
  TenantStore
} from '../../../core/store/tenant.store';
import { ProfileService } from '@core/services/profile/profile-service';
import { UserProfile } from '@core/models/profile/user-profile';


import { forkJoin } from 'rxjs';
/* ======================================================
 * Interfaces locales del Dashboard
 * ====================================================== */

interface DashboardSite {

  theme?: {

    logo_url?: string | null;

  };

  home?: {

    heroTitle?: string | null;

  };

  settings?: {

    businessName?: string | null;

  };

  banners?: unknown[];

}

interface DashboardChecklistItem {

  title: string;

  description: string;

  completed: boolean;

}

interface DashboardQuickAction {

  title: string;

  description: string;

  icon: string;

  action: () => void;

}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,

    AdminPage,
    AdminToolbar,
    AdminToolbarMetaDirective,
    AdminSection,
    AdminCard,
    AdminCardHeaderDirective,
    AdminCardFooterDirective,
    AdminLoader,
    AdminStatCard,
    AdminStatusBadge,

    AdminButton,

    AdminInfoList,
    AdminInfoItem,

    AdminBreadcrumb,
    AdminBreadcrumbItem
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  /* ======================================================
   * Services
   * ====================================================== */

  private readonly router =
    inject(Router);

  private readonly siteService =
    inject(SiteConfigService);

  private readonly tenantStore =
    inject(TenantStore);

  private readonly profileService =
    inject(ProfileService);

  private readonly shopAdminService =
    inject(ShopAdminService);

  readonly profile =
    signal<UserProfile | null>(null);

  readonly ventas =
    signal<AdminSalesSummary | null>(null);

  /* ======================================================
   * Store
   * ====================================================== */

  readonly tenant =
    this.tenantStore.tenant;

  /* ======================================================
   * State
   * ====================================================== */

  readonly loading =
    signal(true);

  readonly site =
    signal<DashboardSite | null>(null);

  /* ======================================================
   * View Models
   * ====================================================== */

  readonly businessName =
    computed(() =>
      this.site()?.settings?.businessName
      ?? this.tenant()?.name
      ?? 'Mi tienda'
    );

  readonly bannerCount =
    computed(() =>
      this.site()?.banners?.length ?? 0
    );

  readonly checklist =
    computed<DashboardChecklistItem[]>(() => {

      const site = this.site();

      return [

        {
          title: 'Logo del negocio',
          description:
            'La identidad visual principal ya fue configurada.',
          completed:
            !!site?.theme?.logo_url
        },

        {
          title: 'Hero principal',
          description:
            'El encabezado principal del sitio está configurado.',
          completed:
            !!site?.home?.heroTitle
        },

        {
          title: 'Información comercial',
          description:
            'Los datos básicos del comercio están completos.',
          completed:
            !!site?.settings?.businessName
        },

        {
          title: 'Tenant activo',
          description:
            'El ecommerce se encuentra habilitado.',
          completed:
            !!this.tenant()?.active
        }

      ];

    });

  readonly quickActions =
    computed<DashboardQuickAction[]>(() => [

      {

        title: 'Editar perfil',

        description:
          'Actualizá tu información personal.',

        icon:
          'fa-regular fa-user',

        action:
          () => this.openProfile()

      },

      {

        title:
          this.profile()?.twoFactorEnabled
            ? 'Administrar seguridad'
            : 'Activar verificación',

        description:
          this.profile()?.twoFactorEnabled
            ? 'Gestioná la autenticación en dos pasos.'
            : 'Protegé tu cuenta con autenticación en dos pasos.',

        icon:
          'fa-solid fa-shield-halved',

        action:
          () => this.openProfile()

      },

      {

        title: 'Configurar sitio',

        description:
          'Administrá el contenido y branding.',

        icon:
          'fa-solid fa-palette',

        action:
          () => this.openConfiguration()

      }

    ]);

  /* ======================================================
   * Lifecycle
   * ====================================================== */

  ngOnInit(): void {

    this.loadDashboard();

    // Independiente del forkJoin de arriba a propósito -- si el resumen de ventas falla, no tiene
    // que tumbar el resto del dashboard (site/profile), que es lo que ya andaba antes de esto.
    this.shopAdminService
      .resumenVentas()
      .subscribe({
        next: resumen => this.ventas.set(resumen),
        error: () => {}
      });

  }

  /* ======================================================
   * Private
   * ====================================================== */

private loadDashboard(): void {

  this.loading.set(true);

  forkJoin({

    site: this.siteService.get(),

    profile: this.profileService.getProfile()

  }).subscribe({

    next: ({ site, profile }) => {

      this.site.set(
        site as DashboardSite
      );

      this.profile.set(profile);

      this.loading.set(false);

    },

    error: () => {

      this.loading.set(false);

    }

  });

}
  /* ======================================================
   * Actions
   * ====================================================== */

  openConfiguration(): void {

    void this.router.navigate([
      '/admin/site'
    ]);

  }

  openPublicSite(): void {

    window.open(
      '/',
      '_blank',
      'noopener,noreferrer'
    );

  }


  openProfile(): void {

    void this.router.navigate([
      '/admin/profile'
    ]);

  }

  irAProductos(): void {

    void this.router.navigate([
      '/admin/products'
    ]);

  }

  irACategorias(): void {

    void this.router.navigate([
      '/admin/categories'
    ]);

  }

  irAPedidos(): void {

    void this.router.navigate([
      '/admin/orders'
    ]);

  }


  
}
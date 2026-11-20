import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

  /*
  |--------------------------------------------------------------------------
  | PUBLIC STORE
  |--------------------------------------------------------------------------
  */

  {
    path: '',
    loadComponent: () =>
      import('./layout/public-layout/public-layout')
        .then(m => m.PublicLayout),

    children: [

      {
        path: '',
        loadComponent: () =>
          import('./public/pages/home/home')
            .then(m => m.Home)
      },

      // Módulo Shop (pedido real 2026-11-19, ver docs/ecommerce/plan-fase-0-1.md en numecos-java)
      // -- catálogo publicado por el ERP, consumido vía /public/shop/** de Platform.
      {
        path: 'tienda',
        loadComponent: () =>
          import('./public/pages/shop/product-list/product-list')
            .then(m => m.ProductList)
      },
      {
        path: 'tienda/productos/:slug',
        loadComponent: () =>
          import('./public/pages/shop/product-detail/product-detail')
            .then(m => m.ProductDetail)
      }

    ]
  },

  /*
  |--------------------------------------------------------------------------
  | ADMIN LOGIN
  |--------------------------------------------------------------------------
  */

  {
    path: 'login',
    loadComponent: () =>
      import('./public/pages/login/login')
        .then(m => m.Login)
  },

  /*
  |--------------------------------------------------------------------------
  | ADMIN PANEL
  |--------------------------------------------------------------------------
  */

  {
    path: 'admin',
    canActivate: [authGuard],

    loadComponent: () =>
      import('./layout/admin-layout/admin-layout')
        .then(m => m.AdminLayout),

    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin/pages/dashboard/dashboard')
            .then(m => m.Dashboard)
      },
      {
        path: 'site',
        loadComponent: () =>
          import('./admin/pages/site-config/site-config')
            .then(m => m.SiteConfig)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./admin/pages/profile/profile-page')
            .then(m => m.ProfilePage)
      }

    ]
  },


  /*
  |--------------------------------------------------------------------------
  | ADMIN PLATFORM
  |--------------------------------------------------------------------------
  */

  {

    path: 'platform',

    loadChildren: () =>

        import('./platform/platform.routes')

        .then(m => m.PLATFORM_ROUTES)

},


  /*
  |--------------------------------------------------------------------------
  | FALLBACK
  |--------------------------------------------------------------------------
  */

  {
    path: '**',
    redirectTo: ''
  }
];
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
      },
      // Carrito/checkout/pedidos (Fase 2, ver docs/ecommerce/plan-fase-2.md).
      {
        path: 'tienda/carrito',
        loadComponent: () =>
          import('./public/pages/shop/cart/cart')
            .then(m => m.Cart)
      },
      {
        path: 'tienda/checkout',
        loadComponent: () =>
          import('./public/pages/shop/checkout/checkout')
            .then(m => m.Checkout)
      },
      {
        path: 'tienda/pedido/:token',
        loadComponent: () =>
          import('./public/pages/shop/order-status/order-status')
            .then(m => m.OrderStatus)
      },
      // Pago simulado -- SOLO dev/test, ver FakePaymentGateway (corrección C9). La ruta siempre
      // existe en el front; lo que la hace inofensiva en producción es que el backend nunca
      // registra /public/shop/payments/fake/** ahí, así que nadie llega a esta página con una
      // referencia real.
      {
        path: 'tienda/pago-simulado/:externalReference',
        loadComponent: () =>
          import('./public/pages/shop/fake-payment/fake-payment')
            .then(m => m.FakePayment)
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
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./admin/pages/products/products')
            .then(m => m.Products)
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./admin/pages/categories/categories')
            .then(m => m.Categories)
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./admin/pages/orders/orders')
            .then(m => m.Orders)
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import('./admin/pages/order-detail/order-detail')
            .then(m => m.OrderDetail)
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./admin/pages/customers/customers')
            .then(m => m.Customers)
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
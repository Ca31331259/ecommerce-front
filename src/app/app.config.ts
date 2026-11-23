import {
    ApplicationConfig,
    APP_INITIALIZER
} from '@angular/core';

import {
    provideRouter
} from '@angular/router';

import {
    provideHttpClient,
    withInterceptors
} from '@angular/common/http';

import {
    routes
} from './app.routes';

import {
    authInterceptor
} from './core/interceptors/auth-interceptor';

import {
    platformAuthInterceptor
} from './platform/interceptors/platform-auth.interceptor';

import {
    TenantStore
} from './core/store/tenant.store';

import {
    TenantService
} from './core/services/tenant/tenant-service';

import {
    ThemeService
} from './core/services/tenant/theme-service';

import {
    SiteStore
} from './core/store/site.store';

import {
    PublicSiteService
} from './core/services/public-site/public-site-service';

import {
    ShopService
} from './core/services/shop/shop-service';

import {
    datosVisitaActual,
    esVisitaNueva
} from './core/services/shop/shop-session';


/*
 * Fase 6 (ver docs/ecommerce/plan-fase-6.md §1.10/§3.1) -- dispara `session_start` una sola vez
 * por pestaña/visita nueva, en el punto de bootstrap más temprano razonable (antes de que se
 * monte ninguna página). Sincrónico a propósito (no `async`/`await`): no bloquea el arranque de
 * la app esperando la respuesta del POST, sólo dispara el evento y sigue. No corre en `/platform`
 * (panel de administración, sin noción de "visita" de storefront).
 */
function shopSessionInitializer(
    shopService: ShopService,
) {

    return () => {

        if (
            window.location.pathname
                .startsWith('/platform')
        ) {

            return;

        }

        if (esVisitaNueva()) {

            shopService
                .registrarEvento('session_start', { ...datosVisitaActual() })
                .subscribe();

        }

    };

}

function tenantInitializer(
    tenantService: TenantService,
    tenantStore: TenantStore,
    themeService: ThemeService,
) {

    return async () => {

        /*
         * Platform no utiliza TenantStore.
         */
        if (
            window.location.pathname
                .startsWith('/platform')
        ) {

            return;

        }


        const domain =
            window.location.hostname;


        try {

            const res =
                await tenantService
                    .loadTenant(domain)
                    .toPromise();

            console.log(res);

            tenantStore.setTenant(res);

            localStorage.setItem(
                'tenant',
                res.tenant.code
            );

            themeService.applyTheme(
                res.site.theme
            );

        } catch (e) {

            console.error(
                'Bootstrap tenant error',
                e
            );

        }

    };

}

export const appConfig: ApplicationConfig = {

    providers: [

        /*
         * ==================================================
         * ROUTER
         * ==================================================
         */

        provideRouter(
            routes
        ),


        /*
         * ==================================================
         * HTTP
         * ==================================================
         */

        provideHttpClient(

            withInterceptors([

                authInterceptor,

                platformAuthInterceptor

            ])

        ),


        /*
         * ==================================================
         * TENANT INITIALIZER
         * ==================================================
         */

        {
            provide: APP_INITIALIZER,

            useFactory:
                tenantInitializer,

            deps: [

                TenantService,

                TenantStore,

                ThemeService,

                PublicSiteService,

                SiteStore

            ],

            multi: true

        },


        /*
         * ==================================================
         * SHOP SESSION INITIALIZER (Fase 6)
         * ==================================================
         */

        {
            provide: APP_INITIALIZER,

            useFactory:
                shopSessionInitializer,

            deps: [

                ShopService

            ],

            multi: true

        }

    ]

};
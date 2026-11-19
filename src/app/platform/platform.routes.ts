import { Routes } from '@angular/router';
import { platformAuthGuard } from './guards/platform-auth.guard';

export const PLATFORM_ROUTES: Routes = [

    /*
     * ======================================================
     * PLATFORM LOGIN
     * ======================================================
     */

    {
        path: 'login',

        loadComponent: () =>
            import(
                './auth/platform-login/platform-login.component'
            ).then(
                m => m.PlatformLoginComponent
            )

    },


    /*
     * ======================================================
     * PLATFORM
     * ======================================================
     */

    {
        path: '',
        canActivate: [
            platformAuthGuard
        ],


        loadComponent: () =>
            import(
                './layouts/platform-layout/platform-layout.component'
            ).then(
                m => m.PlatformLayoutComponent
            ),

        children: [

            /*
             * ==================================================
             * DASHBOARD
             * /platform
             * ==================================================
             */

            {
                path: '',
                canActivate: [
                    platformAuthGuard
                ],


                pathMatch: 'full',

                loadComponent: () =>
                    import(
                        './pages/dashboard/platform-dashboard.component'
                    ).then(
                        m => m.PlatformDashboardComponent
                    )

            },


            /*
             * ==================================================
             * TENANTS
             * ==================================================
             */

            {
                path: 'tenants',
                canActivate: [
                    platformAuthGuard
                ],


                children: [

                    /*
                     * ------------------------------------------
                     * LISTADO
                     * /platform/tenants
                     * ------------------------------------------
                     */

                    {
                        path: '',
                        canActivate: [
                            platformAuthGuard
                        ],


                        pathMatch: 'full',

                        loadComponent: () =>
                            import(
                                './pages/tenants/platform-tenants/platform-tenants.component'
                            ).then(
                                m => m.PlatformTenantsComponent
                            )

                    },


                    /*
                     * ------------------------------------------
                     * NUEVO TENANT
                     * /platform/tenants/new
                     * ------------------------------------------
                     */

                    {
                        path: 'new',
                        canActivate: [
                            platformAuthGuard
                        ],


                        loadComponent: () =>
                            import(
                                './pages/tenant-form/platform-tenant-form.component'
                            ).then(
                                m => m.PlatformTenantFormComponent
                            )

                    },


                    /*
                     * ------------------------------------------
                     * DETALLE
                     * /platform/tenants/:id
                     * ------------------------------------------
                     */

                    {
                        path: ':id',
                        canActivate: [
                            platformAuthGuard
                        ],


                        loadComponent: () =>
                            import(
                                './pages/tenant-detail/platform-tenant-detail/platform-tenant-detail.component'
                            ).then(
                                m => m.PlatformTenantDetailComponent
                            )

                    },


                    /*
                     * ------------------------------------------
                     * EDICIÓN
                     * /platform/tenants/:id/edit
                     * ------------------------------------------
                     */

                    {
                        path: ':id/edit',
                        canActivate: [
                            platformAuthGuard
                        ],


                        loadComponent: () =>
                            import(
                                './pages/tenant-form/platform-tenant-form.component'
                            ).then(
                                m => m.PlatformTenantFormComponent
                            )

                    }

                ]

            },


            /*
             * ==================================================
             * MIGRACIÓN DE CLIENTE LEGACY
             * /platform/legacy-migration
             * ==================================================
             */

            {
                path: 'legacy-migration',
                canActivate: [
                    platformAuthGuard
                ],


                loadComponent: () =>
                    import(
                        './pages/legacy-migration/platform-legacy-migration.component'
                    ).then(
                        m => m.PlatformLegacyMigrationComponent
                    )

            }

        ]

    },


    /*
     * ======================================================
     * FALLBACK
     * ======================================================
     */

    {
        path: '**',

        redirectTo: ''

    }

];
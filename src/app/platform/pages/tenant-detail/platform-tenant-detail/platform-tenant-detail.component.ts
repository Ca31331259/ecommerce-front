import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    inject,
    signal
} from '@angular/core';

import {
    ActivatedRoute,
    Router,
    RouterLink
} from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import {
    PlatformTenant,
    SslStatus,
    TenantDeploymentStatus,
    TenantErpProvisioningStatus,
    TenantLifecycleStatus,
    TenantType
} from '../../../models/platform-tenant.model';
import { PlatformTenantService } from '../../../services/platform-tenant.service';
import { AdminConfirmDialog } from '../../../../shared/design-system-admin/feedback/admin-confirm-dialog/admin-confirm-dialog';
import { CertificateStatus } from '../../../models/certificate-status.model';
import { DeploymentStatusResponse } from '../../../models/deployment-status.model';
import { DeploymentValidation } from '../../../models/deployment-validation.model';
import { DomainStatus } from '../../../models/domain-status.model';
import { PlatformTenantUsage } from '../../../models/platform-tenant-usage.model';
import { PlatformTenantLog } from '../../../models/platform-tenant-log.model';
import { AdminStatusBadge } from '../../../../shared/design-system-admin/data/admin-status-badge/admin-status-badge';



type TenantDetailTab =
    | 'overview'
    | 'web'
    | 'ssl'
    | 'deployment'
    | 'facturacion'
    | 'logs';


@Component({

    selector: 'app-platform-tenant-detail',

    standalone: true,

    imports: [
        RouterLink,
        DatePipe,
        DecimalPipe,
        AdminStatusBadge
    ],

    templateUrl:
        './platform-tenant-detail.component.html',

    styleUrl:
        './platform-tenant-detail.component.scss',

    changeDetection:
        ChangeDetectionStrategy.OnPush

})
export class PlatformTenantDetailComponent
    implements OnInit {

    private readonly route =
        inject(ActivatedRoute);

    private readonly router =
        inject(Router);

    private readonly tenantService =
        inject(PlatformTenantService);

    private readonly dialog =
        inject(MatDialog);


    readonly tenant =
        signal<PlatformTenant | null>(null);


    readonly loading =
        signal(true);


    readonly error =
        signal(false);


    readonly activeTab =
        signal<TenantDetailTab>('overview');


    readonly deploying =
        signal(false);


    readonly deploymentSuccess =
        signal(false);


    readonly deploymentError =
        signal(false);


    readonly deploymentStatus =
        signal<DeploymentStatusResponse | null>(null);

    readonly validation =
        signal<DeploymentValidation | null>(null);

    readonly domainStatus =
        signal<DomainStatus | null>(null);

    readonly certificateStatus =
        signal<CertificateStatus | null>(null);


    readonly validating =
        signal(false);

    readonly verifyingDomain =
        signal(false);

    readonly requestingSsl =
        signal(false);

    readonly redeploying =
        signal(false);

    readonly undeploying =
        signal(false);


    readonly activating =
        signal(false);

    readonly suspending =
        signal(false);

    readonly cancelling =
        signal(false);

    readonly deleting =
        signal(false);

    readonly retryingProvisioning =
        signal(false);

    readonly activatingReverseProxy =
        signal(false);

    readonly reverseProxySuccess =
        signal(false);

    readonly resettingSoportePassword =
        signal(false);

    readonly resettingDbPassword =
        signal(false);

    /**
     * Contraseña recién reseteada (usuario "soporte" del ERP, o usuario de base de datos), para
     * mostrarla UNA sola vez al operador -- nunca se persiste ni se vuelve a pedir, así que se
     * pierde apenas se navega fuera de esta pantalla o se cierra el panel a mano.
     */
    readonly revealedPassword =
        signal<{ label: string; value: string } | null>(null);


    readonly usage =
        signal<PlatformTenantUsage | null>(null);

    readonly loadingUsage =
        signal(false);

    // Para no re-pegarle al ERP cada vez que se vuelve a abrir el tab: se carga
    // la primera vez, y después solo con el botón "Actualizar".
    private usageLoaded = false;

    readonly logs =
        signal<PlatformTenantLog[]>([]);

    readonly loadingLogs =
        signal(false);

    readonly logsError =
        signal('');

    // Mismo criterio que usageLoaded: se carga la primera vez que se entra al tab, después solo
    // con el botón "Actualizar".
    private logsLoaded = false;

    readonly lifecycleActionError =
        signal('');


    ngOnInit(): void {

        const id =
            this.route.snapshot.paramMap.get('id');

        if (!id) {

            this.error.set(true);

            this.loading.set(false);

            return;

        }

        this.loadTenant(id);

    }


    private loadTenant(
        id: string
    ): void {

        this.loading.set(true);

        this.error.set(false);

        this.tenantService
            .get(Number(id))
            .subscribe({

                next: (tenant) => {

                    this.tenant.set(
                        tenant
                    );
                    this.loadDeploymentStatus();

                    this.loadDomainStatus();

                    this.loadCertificateStatus();


                    this.loading.set(false);

                },

                error: () => {

                    this.error.set(true);

                    this.loading.set(false);

                }

            });

    }

    private loadDeploymentStatus(): void {

        const tenant = this.tenant();

        if (!tenant) {
            return;
        }

        this.tenantService
            .deploymentStatus(tenant.id)
            .subscribe({

                next: status => {

                    this.deploymentStatus.set(status);

                }

            });

    }


    private loadDomainStatus(): void {

        const tenant = this.tenant();

        if (!tenant) {
            return;
        }

        this.tenantService
            .domainStatus(tenant.id)
            .subscribe({

                next: status => {

                    this.domainStatus.set(status);

                }

            });

    }

    private loadCertificateStatus(): void {

        const tenant = this.tenant();

        if (!tenant) {
            return;
        }

        this.tenantService
            .sslStatus(tenant.id)
            .subscribe({

                next: status => {

                    this.certificateStatus.set(status);

                }

            });

    }


    validateDeployment(): void {

        const tenant = this.tenant();

        if (!tenant || this.validating()) {
            return;
        }

        this.validating.set(true);

        this.tenantService
            .validateDeployment(tenant.id)
            .subscribe({

                next: response => {

                    this.validation.set(response);

                    this.validating.set(false);

                },

                error: () => {

                    this.validating.set(false);

                }

            });

    }



    verifyDomain(): void {

        const tenant = this.tenant();

        if (!tenant || this.verifyingDomain()) {
            return;
        }

        this.verifyingDomain.set(true);

        this.tenantService
            .verifyDomain(tenant.id)
            .subscribe({

                next: () => {

                    this.loadDomainStatus();

                    this.verifyingDomain.set(false);

                },

                error: () => {

                    this.verifyingDomain.set(false);

                }

            });

    }



    requestSsl(): void {

        const tenant = this.tenant();

        if (!tenant || this.requestingSsl()) {
            return;
        }

        this.requestingSsl.set(true);

        this.tenantService
            .requestSsl(tenant.id)
            .subscribe({

                next: () => {

                    this.loadCertificateStatus();

                    this.requestingSsl.set(false);

                },

                error: () => {

                    this.requestingSsl.set(false);

                }

            });

    }

    setTab(
        tab: TenantDetailTab
    ): void {

        this.activeTab.set(tab);

        if (tab === 'facturacion' && !this.usageLoaded) {
            this.loadUsage();
        }

        if (tab === 'logs' && !this.logsLoaded) {
            this.loadLogs();
        }

    }


    /**
     * Carga el uso del tenant (backend -> ERP). El backend nunca 500ea por el
     * ERP: si está caído, viene disponible=false y lo maneja el template. Solo
     * entra al bloque de error si se cae la request al propio backend.
     */
    loadUsage(): void {

        const tenant = this.tenant();

        if (!tenant || this.loadingUsage()) {
            return;
        }

        this.loadingUsage.set(true);

        this.tenantService
            .usage(tenant.id)
            .subscribe({

                next: (result) => {

                    this.usage.set(result);
                    this.usageLoaded = true;
                    this.loadingUsage.set(false);

                },

                error: () => {

                    this.usage.set({
                        disponible: false,
                        error: 'No se pudo consultar la facturación de este tenant.',
                        uso: null,
                        sucursalesIncluidas: this.tenant()?.sucursalesIncluidas ?? 0,
                        precioPorSucursalExtra: this.tenant()?.precioPorSucursalExtra ?? 0,
                        sucursalesExtra: null,
                        montoExtraEstimado: null
                    });
                    this.usageLoaded = true;
                    this.loadingUsage.set(false);

                }

            });

    }

    /** Variant de admin-status-badge para la severidad de una fila del log. */
    nivelVariant(nivel: PlatformTenantLog['nivel']): 'info' | 'warning' | 'danger' {

        if (nivel === 'ERROR') {
            return 'danger';
        }

        if (nivel === 'WARNING') {
            return 'warning';
        }

        return 'info';

    }

    /** Ícono (Font Awesome) por tipo de evento del log -- cae a uno genérico si no matchea. */
    logIcon(tipo: string): string {

        const iconos: Record<string, string> = {
            CREATED: 'fa-solid fa-plus',
            UPDATED: 'fa-solid fa-pen',
            DELETED: 'fa-solid fa-trash',
            ACTIVATED: 'fa-solid fa-circle-check',
            SUSPENDED: 'fa-solid fa-circle-pause',
            CANCELLED: 'fa-solid fa-circle-xmark',
            ERP_PROVISIONING: 'fa-solid fa-server',
            ERP_PROVISIONING_RETRY: 'fa-solid fa-rotate-right',
            PROVISIONING: 'fa-solid fa-server',
            REVERSE_PROXY: 'fa-solid fa-globe',
            PASSWORD_SOPORTE: 'fa-solid fa-key',
            PASSWORD_DB_USER: 'fa-solid fa-key',
            DEPLOY: 'fa-solid fa-rocket',
            REDEPLOY: 'fa-solid fa-rotate',
            UNDEPLOY: 'fa-solid fa-power-off',
            CERTIFICATE_REQUEST: 'fa-solid fa-lock'
        };

        return iconos[tipo] ?? 'fa-solid fa-file-lines';

    }

    /**
     * Carga el feed combinado de logs (Plataforma + ERP). El backend nunca 500ea por el ERP (ver
     * TenantLogService.listar()); solo entra al bloque de error si se cae la request al propio
     * backend.
     */
    loadLogs(): void {

        const tenant = this.tenant();

        if (!tenant || this.loadingLogs()) {
            return;
        }

        this.loadingLogs.set(true);
        this.logsError.set('');

        this.tenantService
            .logs(tenant.id)
            .subscribe({

                next: (result) => {

                    this.logs.set(result);
                    this.logsLoaded = true;
                    this.loadingLogs.set(false);

                },

                error: () => {

                    this.logsError.set('No se pudo cargar el log de este tenant.');
                    this.logsLoaded = true;
                    this.loadingLogs.set(false);

                }

            });

    }


    deploy(): void {

        const tenant =
            this.tenant();

        if (!tenant || this.deploying()) {

            return;

        }


        this.deploying.set(true);

        this.deploymentSuccess.set(false);

        this.deploymentError.set(false);


        this.tenantService
            .deploy(Number(tenant.id))
            .subscribe({

                next: () => {

                    this.deploying.set(false);

                    this.deploymentSuccess.set(true);

                    this.loadTenant(String(tenant.id));
                },

                error: () => {

                    this.deploying.set(false);

                    this.deploymentError.set(true);

                }

            });

    }


    redeploy(): void {

        const tenant = this.tenant();

        if (!tenant || this.redeploying()) {
            return;
        }

        this.redeploying.set(true);

        this.tenantService
            .redeploy(tenant.id)
            .subscribe({

                next: () => {

                    this.loadDeploymentStatus();

                    this.redeploying.set(false);

                },

                error: () => {

                    this.redeploying.set(false);

                }

            });

    }


    undeploy(): void {

        const tenant = this.tenant();

        if (!tenant || this.undeploying()) {
            return;
        }

        this.undeploying.set(true);

        this.tenantService
            .undeploy(tenant.id)
            .subscribe({

                next: () => {

                    this.loadDeploymentStatus();

                    this.undeploying.set(false);

                },

                error: () => {

                    this.undeploying.set(false);

                }

            });

    }

    /*
     * ======================================================
     * CICLO DE VIDA (activate / suspend / cancel)
     * ======================================================
     */

    canActivate(
        status: TenantLifecycleStatus
    ): boolean {

        return status !== 'ACTIVE' && status !== 'CANCELLED';

    }


    canSuspend(
        status: TenantLifecycleStatus
    ): boolean {

        return status !== 'SUSPENDED' && status !== 'CANCELLED';

    }


    canCancel(
        status: TenantLifecycleStatus
    ): boolean {

        return status !== 'CANCELLED';

    }


    activateTenant(): void {

        const tenant = this.tenant();

        if (!tenant || this.activating()) {
            return;
        }

        this.lifecycleActionError.set('');
        this.activating.set(true);

        this.tenantService
            .activate(tenant.id)
            .subscribe({

                next: (updated) => {

                    this.tenant.set(updated);
                    this.activating.set(false);

                },

                error: (error) => {

                    this.activating.set(false);
                    this.lifecycleActionError.set(
                        this.getBackendErrorMessage(
                            error,
                            'No se pudo activar el tenant.'
                        )
                    );

                }

            });

    }


    /**
     * Baja temporal y reversible: confirmación liviana, un solo diálogo.
     */
    suspendTenant(): void {

        const tenant = this.tenant();

        if (!tenant || this.suspending()) {
            return;
        }

        const dialogRef = this.dialog.open(AdminConfirmDialog, {

            width: '480px',

            data: {
                title: 'Suspender tenant',
                description:
                    `Vas a suspender a "${tenant.name}". El sitio dejará de `
                    + 'estar disponible hasta que lo actives de nuevo. Podés '
                    + 'reactivarlo en cualquier momento.',
                confirmLabel: 'Suspender',
                variant: 'warning'
            }

        });

        dialogRef.afterClosed().subscribe((confirmed) => {

            if (!confirmed) {
                return;
            }

            this.lifecycleActionError.set('');
            this.suspending.set(true);

            this.tenantService
                .suspend(tenant.id)
                .subscribe({

                    next: (updated) => {

                        this.tenant.set(updated);
                        this.suspending.set(false);

                    },

                    error: (error) => {

                        this.suspending.set(false);
                        this.lifecycleActionError.set(
                            this.getBackendErrorMessage(
                                error,
                                'No se pudo suspender el tenant.'
                            )
                        );

                    }

                });

        });

    }


    /**
     * Baja definitiva, NO reversible: confirmación fuerte, dejando explícito
     * que no hay vuelta atrás (el backend rechaza cualquier activate()
     * posterior sobre un tenant CANCELLED).
     */
    cancelTenant(): void {

        const tenant = this.tenant();

        if (!tenant || this.cancelling()) {
            return;
        }

        const dialogRef = this.dialog.open(AdminConfirmDialog, {

            width: '480px',

            disableClose: true,

            data: {
                title: 'Cancelar tenant definitivamente',
                description:
                    `Vas a cancelar a "${tenant.name}" de forma DEFINITIVA. `
                    + 'Esta acción no se puede deshacer: el tenant no podrá '
                    + 'reactivarse nunca más desde la plataforma.',
                confirmLabel: 'Sí, cancelar definitivamente',
                variant: 'danger'
            }

        });

        dialogRef.afterClosed().subscribe((confirmed) => {

            if (!confirmed) {
                return;
            }

            this.lifecycleActionError.set('');
            this.cancelling.set(true);

            this.tenantService
                .cancel(tenant.id)
                .subscribe({

                    next: (updated) => {

                        this.tenant.set(updated);
                        this.cancelling.set(false);

                    },

                    error: (error) => {

                        this.cancelling.set(false);
                        this.lifecycleActionError.set(
                            this.getBackendErrorMessage(
                                error,
                                'No se pudo cancelar el tenant.'
                            )
                        );

                    }

                });

        });

    }


    /**
     * Baja TOTAL e IRREVERSIBLE: borra el tenant de Plataforma Y, si tiene schema de ERP, el
     * schema completo (DROP DATABASE -- ver PlatformTenantService.delete del lado del backend).
     * Pedido real (panel de Plataforma, 2026-10-22, "poder eliminar un tenant mal creado, base de
     * datos y todo eso, para volver a generarlo"). Confirmación reforzada: hay que tipear el code
     * exacto del tenant -- a diferencia de cancelTenant() (que sólo cambia un estado), esto borra
     * datos de verdad y no hay ningún camino de "reactivar" después.
     */
    deleteTenant(): void {

        const tenant = this.tenant();

        if (!tenant || this.deleting()) {
            return;
        }

        const dialogRef = this.dialog.open(AdminConfirmDialog, {

            width: '480px',

            disableClose: true,

            data: {
                title: 'Eliminar tenant definitivamente',
                description:
                    `Vas a eliminar "${tenant.name}" Y SU BASE DE DATOS COMPLETA `
                    + '(si tiene schema de ERP). Esta acción es IRREVERSIBLE: se pierden '
                    + 'todos los datos, no hay backup automático. Usala sólo para un '
                    + 'tenant mal creado que vas a volver a generar de cero.',
                confirmLabel: 'Sí, eliminar todo',
                variant: 'danger',
                confirmationText: tenant.code,
                confirmationLabel: `Escribí el código "${tenant.code}" para confirmar`
            }

        });

        dialogRef.afterClosed().subscribe((confirmed) => {

            if (!confirmed) {
                return;
            }

            this.lifecycleActionError.set('');
            this.deleting.set(true);

            this.tenantService
                .delete(tenant.id)
                .subscribe({

                    next: () => {

                        this.router.navigate(['/platform/tenants']);

                    },

                    error: (error) => {

                        this.deleting.set(false);
                        this.lifecycleActionError.set(
                            this.getBackendErrorMessage(
                                error,
                                'No se pudo eliminar el tenant.'
                            )
                        );

                    }

                });

        });

    }


    canRetryProvisioning(
        tenant: PlatformTenant
    ): boolean {

        return this.requiresErp(tenant.tenantType)
            && tenant.erpProvisioningStatus === 'ERROR';

    }


    /**
     * Reintenta el provisioning en el ERP de un tenant que quedó en ERROR
     * (ej. un problema transitorio o de config del lado de numecos-java).
     * Reusa el mismo seedBaseData que se usó en el alta original — lo decide
     * el backend, esta acción no lo vuelve a preguntar.
     */
    retryProvisioning(): void {

        const tenant = this.tenant();

        if (!tenant || !this.canRetryProvisioning(tenant) || this.retryingProvisioning()) {
            return;
        }

        this.lifecycleActionError.set('');
        this.retryingProvisioning.set(true);

        this.tenantService
            .retryProvisioning(tenant.id)
            .subscribe({

                next: (updated) => {

                    this.tenant.set(updated);
                    this.retryingProvisioning.set(false);

                },

                error: (error) => {

                    this.retryingProvisioning.set(false);

                    this.lifecycleActionError.set(
                        this.getBackendErrorMessage(
                            error,
                            'No se pudo reintentar el provisioning en el ERP.'
                        )
                    );

                }

            });

    }


    /**
     * Acción manual, equivalente a lo que antes se hacía a mano por SSH:
     * activa el reverse proxy + SSL del tenant en el stack ERP. Es seguro
     * reintentar si falla (ej. el DNS de erpDomain todavía no propagó) — no
     * cambia ningún estado persistido, así que no hace falta releer el tenant
     * al terminar.
     */
    activarReverseProxy(): void {

        const tenant = this.tenant();

        if (!tenant || !tenant.erpDomain || this.activatingReverseProxy()) {
            return;
        }

        this.lifecycleActionError.set('');
        this.reverseProxySuccess.set(false);
        this.activatingReverseProxy.set(true);

        this.tenantService
            .activarReverseProxy(tenant.id)
            .subscribe({

                next: () => {

                    this.activatingReverseProxy.set(false);
                    this.reverseProxySuccess.set(true);

                },

                error: (error) => {

                    this.activatingReverseProxy.set(false);

                    this.lifecycleActionError.set(
                        this.getBackendErrorMessage(
                            error,
                            'No se pudo activar el reverse proxy en el ERP.'
                        )
                    );

                }

            });

    }


    /**
     * Resetea la contraseña del usuario "soporte" sembrado en el ERP de este tenant (pedido real,
     * 2026-10-16: que el operador lo pueda hacer desde acá, sin entrar a la base a mano).
     * Confirmación primero (sensible, como suspendTenant) porque invalida la contraseña actual
     * sin vuelta atrás.
     */
    resetPasswordSoporte(): void {

        const tenant = this.tenant();

        if (!tenant || this.resettingSoportePassword()) {
            return;
        }

        const dialogRef = this.dialog.open(AdminConfirmDialog, {

            width: '480px',

            data: {
                title: 'Resetear contraseña de "soporte"',
                description:
                    `Vas a generar una contraseña nueva para el usuario "soporte" `
                    + `del ERP de "${tenant.name}". La contraseña actual deja de `
                    + 'funcionar inmediatamente.',
                confirmLabel: 'Resetear',
                variant: 'warning'
            }

        });

        dialogRef.afterClosed().subscribe((confirmed) => {

            if (!confirmed) {
                return;
            }

            this.lifecycleActionError.set('');
            this.revealedPassword.set(null);
            this.resettingSoportePassword.set(true);

            this.tenantService
                .resetPasswordSoporte(tenant.id)
                .subscribe({

                    next: (result) => {

                        this.resettingSoportePassword.set(false);
                        this.revealedPassword.set({
                            label: 'Nueva contraseña de "soporte" (ERP)',
                            value: result.password
                        });

                    },

                    error: (error) => {

                        this.resettingSoportePassword.set(false);
                        this.lifecycleActionError.set(
                            this.getBackendErrorMessage(
                                error,
                                'No se pudo resetear la contraseña de "soporte" en el ERP.'
                            )
                        );

                    }

                });

        });

    }


    /**
     * Rota la contraseña del usuario de base de datos del tenant (el que usa el storefront para
     * conectarse a su base). El ALTER USER real corre del lado del ERP -- ver Javadoc de
     * PlatformTenantService.resetDbPassword(). Mismo criterio de confirmación que
     * resetPasswordSoporte().
     */
    resetDbPassword(): void {

        const tenant = this.tenant();

        if (!tenant || !tenant.dbUsername || this.resettingDbPassword()) {
            return;
        }

        const dialogRef = this.dialog.open(AdminConfirmDialog, {

            width: '480px',

            data: {
                title: 'Resetear contraseña de conexión',
                description:
                    `Vas a generar una contraseña nueva para el usuario de base `
                    + `de datos "${tenant.dbUsername}" de "${tenant.name}". El `
                    + 'storefront va a usar la contraseña nueva automáticamente, '
                    + 'pero la anterior deja de funcionar de inmediato.',
                confirmLabel: 'Resetear',
                variant: 'warning'
            }

        });

        dialogRef.afterClosed().subscribe((confirmed) => {

            if (!confirmed) {
                return;
            }

            this.lifecycleActionError.set('');
            this.revealedPassword.set(null);
            this.resettingDbPassword.set(true);

            this.tenantService
                .resetDbPassword(tenant.id)
                .subscribe({

                    next: (result) => {

                        this.resettingDbPassword.set(false);
                        this.revealedPassword.set({
                            label: `Nueva contraseña de "${tenant.dbUsername}" (base de datos)`,
                            value: result.password
                        });

                    },

                    error: (error) => {

                        this.resettingDbPassword.set(false);
                        this.lifecycleActionError.set(
                            this.getBackendErrorMessage(
                                error,
                                'No se pudo resetear la contraseña del usuario de base de datos.'
                            )
                        );

                    }

                });

        });

    }


    dismissRevealedPassword(): void {

        this.revealedPassword.set(null);

    }


    private getBackendErrorMessage(
        error: any,
        fallback: string
    ): string {

        return (
            error?.error?.message
            ||
            error?.error?.error
            ||
            error?.message
            ||
            fallback
        );

    }


    getSslLabel(
        status: SslStatus
    ): string {

        switch (status) {

            case 'ACTIVE':
                return 'Activo';

            case 'PENDING':
                return 'Pendiente';

            case 'ERROR':
                return 'Error';

            case 'EXPIRED':
                return 'Vencido';

            default:
                return status;

        }

    }


    getSslClass(
        status: SslStatus
    ): string {

        switch (status) {

            case 'ACTIVE':
                return 'success';

            case 'PENDING':
                return 'warning';

            case 'ERROR':
            case 'EXPIRED':
                return 'danger';

            default:
                return 'muted';

        }

    }


    /*
     * ======================================================
     * TENANT TYPE / LIFECYCLE / DEPLOYMENT / ERP
     * ======================================================
     */

    requiresEcommerce(
        type: TenantType
    ): boolean {

        return type === 'ECOMMERCE' || type === 'ECOMMERCE_ERP';

    }


    requiresErp(
        type: TenantType
    ): boolean {

        return type === 'ERP' || type === 'ECOMMERCE_ERP';

    }


    getTenantTypeLabel(
        type: TenantType
    ): string {

        switch (type) {

            case 'ECOMMERCE':
                return 'Ecommerce';

            case 'ERP':
                return 'ERP';

            case 'ECOMMERCE_ERP':
                return 'Ecommerce + ERP';

            default:
                return type;

        }

    }


    getLifecycleLabel(
        status: TenantLifecycleStatus
    ): string {

        switch (status) {

            case 'PENDING_PROVISION':
                return 'Pendiente de provisión';

            case 'ACTIVE':
                return 'Activo';

            case 'SUSPENDED':
                return 'Suspendido';

            case 'CANCELLED':
                return 'Cancelado';

            default:
                return status;

        }

    }


    getLifecycleClass(
        status: TenantLifecycleStatus
    ): string {

        switch (status) {

            case 'PENDING_PROVISION':
                return 'warning';

            case 'ACTIVE':
                return 'success';

            case 'SUSPENDED':
                return 'danger';

            case 'CANCELLED':
                return 'muted';

            default:
                return 'muted';

        }

    }


    getDeploymentStatusLabel(
        status: TenantDeploymentStatus
    ): string {

        switch (status) {

            case 'CREATED':
                return 'Creado';

            case 'DEPLOYING':
                return 'Desplegando';

            case 'DEPLOYED':
                return 'Desplegado';

            case 'ERROR':
                return 'Error';

            default:
                return status;

        }

    }


    getDeploymentStatusClass(
        status: TenantDeploymentStatus
    ): string {

        switch (status) {

            case 'CREATED':
                return 'muted';

            case 'DEPLOYING':
                return 'warning';

            case 'DEPLOYED':
                return 'success';

            case 'ERROR':
                return 'danger';

            default:
                return 'muted';

        }

    }


    getErpProvisioningLabel(
        status: TenantErpProvisioningStatus
    ): string {

        switch (status) {

            case 'NOT_APPLICABLE':
                return 'No aplica';

            case 'PENDING':
                return 'Pendiente';

            case 'PROVISIONING':
                return 'Provisionando';

            case 'PROVISIONED':
                return 'Provisionado';

            case 'ERROR':
                return 'Error';

            default:
                return status;

        }

    }


    getErpProvisioningClass(
        status: TenantErpProvisioningStatus
    ): string {

        switch (status) {

            case 'NOT_APPLICABLE':
                return 'muted';

            case 'PENDING':
                return 'warning';

            case 'PROVISIONING':
                return 'warning';

            case 'PROVISIONED':
                return 'success';

            case 'ERROR':
                return 'danger';

            default:
                return 'muted';

        }

    }

}
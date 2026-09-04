import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    inject,
    signal
} from '@angular/core';

import {
    ActivatedRoute,
    RouterLink
} from '@angular/router';
import { PlatformTenant, SslStatus } from '../../../models/platform-tenant.model';
import { PlatformTenantService } from '../../../services/platform-tenant.service';
import { CertificateStatus } from '../../../models/certificate-status.model';
import { DeploymentStatusResponse } from '../../../models/deployment-status.model';
import { DeploymentValidation } from '../../../models/deployment-validation.model';
import { DomainStatus } from '../../../models/domain-status.model';



type TenantDetailTab =
    | 'overview'
    | 'web'
    | 'ssl'
    | 'deployment'
    | 'logs';


@Component({

    selector: 'app-platform-tenant-detail',

    standalone: true,

    imports: [
        RouterLink
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

    private readonly tenantService =
        inject(PlatformTenantService);


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

}
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    inject,
    signal
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { PlatformTenant, SslStatus } from '../../../models/platform-tenant.model';
import { PlatformTenantService } from '../../../services/platform-tenant.service';




@Component({

    selector: 'app-platform-tenants',

    standalone: true,

    imports: [
        RouterLink
    ],

    templateUrl: './platform-tenants.component.html',

    styleUrl: './platform-tenants.component.scss',

    changeDetection: ChangeDetectionStrategy.OnPush

})
export class PlatformTenantsComponent
    implements OnInit {

    private readonly tenantService =
        inject(PlatformTenantService);


    readonly tenants =
        signal<PlatformTenant[]>([]);


    readonly loading =
        signal(true);


    readonly error =
        signal(false);


    readonly search =
        signal('');


    ngOnInit(): void {

        this.loadTenants();

    }


    private loadTenants(): void {

        this.loading.set(true);

        this.error.set(false);

        this.tenantService
            .list()
            .subscribe({

                next: (tenants) => {

                    this.tenants.set(
                        tenants
                    );

                    this.loading.set(false);

                },

                error: () => {

                    this.error.set(true);

                    this.loading.set(false);

                }

            });

    }


    setSearch(
        value: string
    ): void {

        this.search.set(
            value
        );

    }


    filteredTenants(): PlatformTenant[] {

        const value =
            this.search()
                .trim()
                .toLowerCase();


        if (!value) {

            return this.tenants();

        }


        return this.tenants()
            .filter(tenant =>

                tenant.code
                    .toLowerCase()
                    .includes(value)

                ||

                tenant.name
                    .toLowerCase()
                    .includes(value)

                ||

                tenant.domain
                    .toLowerCase()
                    .includes(value)

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

}
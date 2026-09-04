import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    inject,
    signal
} from '@angular/core';

import { PlatformDashboard } from '../../models/platform-dashboard.model';
import { PlatformDashboardService } from '../../services/platform-dashboard.service';

@Component({

    selector: 'app-platform-dashboard',

    standalone: true,

    templateUrl: './platform-dashboard.component.html',

    styleUrl: './platform-dashboard.component.scss',

    changeDetection: ChangeDetectionStrategy.OnPush

})
export class PlatformDashboardComponent implements OnInit {

    private readonly dashboardService =
        inject(PlatformDashboardService);

    readonly dashboard =
        signal<PlatformDashboard | null>(null);

    readonly loading =
        signal<boolean>(true);

    readonly error =
        signal<boolean>(false);


    ngOnInit(): void {

        this.loadDashboard();

    }


    private loadDashboard(): void {

        this.loading.set(true);

        this.error.set(false);

        this.dashboardService
            .getDashboardMock()
            .subscribe({

                next: (dashboard) => {

                    this.dashboard.set(
                        dashboard
                    );

                    this.loading.set(false);

                },

                error: () => {

                    this.error.set(true);

                    this.loading.set(false);

                }

            });

    }

}
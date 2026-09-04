import {
    ChangeDetectionStrategy,
    Component,
    input
} from '@angular/core';
import { PlatformDashboard } from '../../models/platform-dashboard.model';

@Component({

    selector: 'app-platform-kpi-grid',

    standalone: true,

    templateUrl: './platform-kpi-grid.component.html',

    styleUrl: './platform-kpi-grid.component.scss',

    changeDetection: ChangeDetectionStrategy.OnPush

})
export class PlatformKpiGridComponent {

    readonly dashboard =
        input.required<PlatformDashboard>();

}
import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { PlatformAuthService } from '../../services/platform-auth.service';

interface PlatformNavigationItem {

    label: string;

    icon: string;

    route: string;

}

@Component({

    selector: 'app-platform-sidebar',

    standalone: true,

    imports: [

        RouterLink,

        RouterLinkActive

    ],

    templateUrl: './platform-sidebar.component.html',

    styleUrl: './platform-sidebar.component.scss'

})
export class PlatformSidebarComponent {

    constructor(
        private auth: PlatformAuthService,
        private router: Router
    ) { }

    logout(): void {

        this.auth.logout();

        this.router.navigate(['/platform/login']);

    }

    readonly navigationItems = signal([

        {
            label: 'Dashboard',
            icon: 'fa-solid fa-chart-line',
            route: '/platform'
        },

        {
            label: 'Tenants',
            icon: 'fa-solid fa-building',
            route: '/platform/tenants'
        },

        {
            label: 'Migrar cliente legacy',
            icon: 'fa-solid fa-file-import',
            route: '/platform/legacy-migration'
        }

    ]);


}
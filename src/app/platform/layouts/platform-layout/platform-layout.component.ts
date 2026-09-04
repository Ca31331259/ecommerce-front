import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PlatformSidebarComponent } from '../platform-sidebar/platform-sidebar.component';
import { PlatformTopbarComponent } from '../platform-topbar/platform-topbar.component';

@Component({
    selector: 'app-platform-layout',
    standalone: true,
    imports: [
        RouterOutlet,
        PlatformSidebarComponent,
        PlatformTopbarComponent
    ],
    templateUrl: './platform-layout.component.html',
    styleUrl: './platform-layout.component.scss'
})
export class PlatformLayoutComponent {

}
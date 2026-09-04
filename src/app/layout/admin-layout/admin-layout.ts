import {
  Component
} from '@angular/core';

import {
  RouterOutlet
} from '@angular/router';

import {
  AdminSidebar
} from '../../admin/components/admin-sidebar/admin-sidebar';
import { AdminTopbar } from '../../admin/components/admin-topbar/admin-topbar';
import { AdminToast } from '@shared/design-system-admin/feedback/admin-toast/admin-toast';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    AdminSidebar,
    AdminTopbar,
    AdminToast
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss'
})
export class AdminLayout {}
import {
  Component,
  computed,
  inject
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  SiteStore
} from '../../../core/store/site.store';

import {
  AuthService
} from '../../../core/services/auth-service';

import {
  AdminShellStore
} from '../../store/admin-shell.store';

@Component({
  selector: 'app-admin-topbar',
  standalone: true,
  imports: [],
  templateUrl: './admin-topbar.html',
  styleUrl: './admin-topbar.scss'
})
export class AdminTopbar {

  private readonly router =
    inject(Router);

  private readonly auth =
    inject(AuthService);

  private readonly siteStore =
    inject(SiteStore);

  readonly shellStore =
    inject(AdminShellStore);

  readonly site =
    computed(
      () => this.siteStore.site()
    );

  readonly businessName =
    computed(
      () =>
        this.site()
          ?.settings
          ?.businessName
        ?? 'Mi comercio'
    );

  readonly businessInitial =
    computed(
      () =>
        this.businessName()
          .trim()
          .charAt(0)
          .toUpperCase()
        || 'E'
    );

  openMobileSidebar(): void {

    this.shellStore
      .openMobileSidebar();

  }

  openStore(): void {

    window.open(
      '/',
      '_blank',
      'noopener,noreferrer'
    );

  }

  logout(): void {

    this.shellStore
      .closeMobileSidebar();

    this.auth.logout();

    void this.router.navigate(['/']);

  }

}
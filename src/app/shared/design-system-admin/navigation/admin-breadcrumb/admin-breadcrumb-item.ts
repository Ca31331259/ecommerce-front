import {
  Directive,
  HostBinding,
  Input
} from '@angular/core';

@Directive({
  selector: '[adminBreadcrumbItem]',
  standalone: true
})
export class AdminBreadcrumbItem {

  @Input()
  current = false;

  @HostBinding('attr.admin-breadcrumb-item')
  readonly hostAdminBreadcrumbItem = '';

  @HostBinding('attr.current')
  get hostCurrent(): '' | null {

    return this.current
      ? ''
      : null;

  }

  @HostBinding('attr.aria-current')
  get ariaCurrent(): 'page' | null {

    return this.current
      ? 'page'
      : null;

  }

}
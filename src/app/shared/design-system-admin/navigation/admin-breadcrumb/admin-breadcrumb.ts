import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input
} from '@angular/core';

export type AdminBreadcrumbSize =
  | 'sm'
  | 'md';

@Component({
  selector: 'admin-breadcrumb',
  standalone: true,
  templateUrl: './admin-breadcrumb.html',
  styleUrl: './admin-breadcrumb.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminBreadcrumb {

  @Input()
  size: AdminBreadcrumbSize = 'sm';

  @HostBinding('attr.size')
  get hostSize(): AdminBreadcrumbSize {

    return this.size;

  }

}
import {
  Component,
  ContentChildren,
  Input,
  QueryList
} from '@angular/core';

import {
  AdminTableToolbarDirective
} from './directives/admin-table-toolbar.directive';

import {
  AdminTableContentDirective
} from './directives/admin-table-content.directive';

import {
  AdminTableEmptyDirective
} from './directives/admin-table-empty.directive';

import {
  AdminTableFooterDirective
} from './directives/admin-table-footer.directive';

export type AdminTableDensity =
  | 'compact'
  | 'default'
  | 'comfortable';

@Component({
  selector: 'admin-table',
  standalone: true,
  templateUrl: './admin-table.html',
  styleUrl: './admin-table.scss',
  host: {
    '[attr.density]': 'density',
    '[attr.loading]': 'loading ? "" : null',
    '[attr.empty]': 'empty ? "" : null',
    '[attr.hoverable]': 'hoverable ? "" : null'
  }
})
export class AdminTable {

  @Input()
  density: AdminTableDensity = 'default';

  @Input()
  loading = false;

  @Input()
  empty = false;

  @Input()
  hoverable = true;

  @Input()
  loadingLabel = 'Cargando información...';

  @ContentChildren(AdminTableToolbarDirective)
  readonly toolbars!: QueryList<AdminTableToolbarDirective>;

  @ContentChildren(AdminTableContentDirective)
  readonly contents!: QueryList<AdminTableContentDirective>;

  @ContentChildren(AdminTableEmptyDirective)
  readonly emptyStates!: QueryList<AdminTableEmptyDirective>;

  @ContentChildren(AdminTableFooterDirective)
  readonly footers!: QueryList<AdminTableFooterDirective>;

}
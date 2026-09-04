import {
  Component,
  ContentChildren,
  Input,
  QueryList
} from '@angular/core';

import {
  AdminToolbarMetaDirective
} from './directives/admin-toolbar-meta.directive';

import {
  AdminToolbarActionsDirective
} from './directives/admin-toolbar-actions.directive';

export type AdminToolbarAlign =
    | 'between'
    | 'start';

@Component({
  selector: 'admin-toolbar',
  standalone: true,
  imports: [],
  templateUrl: './admin-toolbar.html',
  styleUrl: './admin-toolbar.scss',
  host: {
    '[attr.align]': 'align'
  }
})
export class AdminToolbar {

  @Input({ required: true })
  title!: string;

  @Input()
  subtitle?: string;

  @Input()
  align: AdminToolbarAlign = 'between';

  @ContentChildren(AdminToolbarMetaDirective)
  readonly meta!: QueryList<AdminToolbarMetaDirective>;

  @ContentChildren(AdminToolbarActionsDirective)
  readonly actions!: QueryList<AdminToolbarActionsDirective>;

}
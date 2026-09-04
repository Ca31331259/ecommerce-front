import {
  Component,
  ContentChildren,
  Input,
  QueryList
} from '@angular/core';

import {
  AdminCardHeaderDirective
} from './directives/admin-card-header.directive';

import {
  AdminCardActionsDirective
} from './directives/admin-card-actions.directive';

import {
  AdminCardFooterDirective
} from './directives/admin-card-footer.directive';

export type AdminCardPadding =
  | 'none'
  | 'sm'
  | 'md'
  | 'lg';

export type AdminCardElevation =
  | 'none'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg';

@Component({
  selector: 'admin-card',
  standalone: true,
  templateUrl: './admin-card.html',
  styleUrl: './admin-card.scss',
  host: {
    '[attr.padding]': 'padding',
    '[attr.elevation]': 'elevation',
    '[attr.outlined]': 'outlined ? "" : null'
  }
})
export class AdminCard {

  @Input()
  padding: AdminCardPadding = 'md';

  @Input()
  elevation: AdminCardElevation = 'sm';

  @Input()
  outlined = true;

  @ContentChildren(AdminCardHeaderDirective)
  readonly headers!: QueryList<AdminCardHeaderDirective>;

  @ContentChildren(AdminCardActionsDirective)
  readonly actions!: QueryList<AdminCardActionsDirective>;

  @ContentChildren(AdminCardFooterDirective)
  readonly footers!: QueryList<AdminCardFooterDirective>;

}
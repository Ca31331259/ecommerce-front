import {
  Component,
  ContentChildren,
  Input,
  QueryList
} from '@angular/core';

import {
  AdminFormCardActionsDirective
} from './directives/admin-form-card-actions.directive';

import {
  AdminFormCardFooterDirective
} from './directives/admin-form-card-footer.directive';

export type AdminFormCardPadding =
  | 'sm'
  | 'md'
  | 'lg';

@Component({
  selector: 'admin-form-card',
  standalone: true,
  templateUrl: './admin-form-card.html',
  styleUrl: './admin-form-card.scss',
  host: {
    '[attr.padding]': 'padding',
    '[attr.divided]': 'divided ? "" : null'
  }
})
export class AdminFormCard {

  @Input({ required: true })
  title!: string;

  @Input()
  subtitle?: string;

  @Input()
  icon?: string;

  @Input()
  padding: AdminFormCardPadding = 'md';

  @Input()
  divided = true;

  @ContentChildren(AdminFormCardActionsDirective)
  readonly actions!: QueryList<AdminFormCardActionsDirective>;

  @ContentChildren(AdminFormCardFooterDirective)
  readonly footers!: QueryList<AdminFormCardFooterDirective>;

}
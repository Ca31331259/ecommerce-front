import {
  Component,
  ContentChildren,
  Input,
  QueryList
} from '@angular/core';

import {
  AdminFieldContentDirective
} from './directives/admin-field-content.directive';

import {
  AdminFieldErrorDirective
} from './directives/admin-field-error.directive';

export type AdminFieldSpacing =
  | 'sm'
  | 'md'
  | 'lg';

@Component({
  selector: 'admin-field',
  standalone: true,
  templateUrl: './admin-field.html',
  styleUrl: './admin-field.scss',
  host: {
    '[attr.spacing]': 'spacing',
    '[attr.required]': 'required ? "" : null',
    '[attr.invalid]': 'invalid ? "" : null',
    '[attr.disabled]': 'disabled ? "" : null'
  }
})
export class AdminField {

  @Input({ required: true })
  label!: string;

  @Input()
  hint?: string;

  @Input()
  required = false;

  @Input()
  invalid = false;

  @Input()
  disabled = false;

  @Input()
  spacing: AdminFieldSpacing = 'md';

  @ContentChildren(AdminFieldContentDirective)
  readonly contents!: QueryList<AdminFieldContentDirective>;

  @ContentChildren(AdminFieldErrorDirective)
  readonly errors!: QueryList<AdminFieldErrorDirective>;

}
import {
  Component,
  ContentChildren,
  Input,
  QueryList
} from '@angular/core';

import {
  AdminEmptyStateActionsDirective
} from './directives/admin-empty-state-actions.directive';

import {
  AdminEmptyStateMetaDirective
} from './directives/admin-empty-state-meta.directive';

export type AdminEmptyStateVariant =
  | 'default'
  | 'search'
  | 'error';

export type AdminEmptyStateSize =
  | 'sm'
  | 'md'
  | 'lg';

@Component({
  selector: 'admin-empty-state',
  standalone: true,
  templateUrl: './admin-empty-state.html',
  styleUrl: './admin-empty-state.scss',
  host: {
    '[attr.variant]': 'variant',
    '[attr.size]': 'size'
  }
})
export class AdminEmptyState {

  @Input({ required: true })
  title!: string;

  @Input()
  description?: string;

  @Input()
  icon?: string;

  @Input()
  variant: AdminEmptyStateVariant = 'default';

  @Input()
  size: AdminEmptyStateSize = 'md';

  @ContentChildren(AdminEmptyStateActionsDirective)
  readonly actions!: QueryList<AdminEmptyStateActionsDirective>;

  @ContentChildren(AdminEmptyStateMetaDirective)
  readonly metadata!: QueryList<AdminEmptyStateMetaDirective>;

  get resolvedIcon(): string {

    if (this.icon) {

      return this.icon;

    }

    switch (this.variant) {

      case 'search':

        return 'fa-solid fa-magnifying-glass';

      case 'error':

        return 'fa-solid fa-triangle-exclamation';

      default:

        return 'fa-regular fa-folder-open';

    }

  }

}
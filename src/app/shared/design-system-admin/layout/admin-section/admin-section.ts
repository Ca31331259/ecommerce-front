import {
  Component,
  ContentChildren,
  Input,
  QueryList
} from '@angular/core';

import {
  AdminSectionActionsDirective
} from './directives/admin-section-actions.directive';

@Component({
  selector: 'admin-section',
  standalone: true,
  templateUrl: './admin-section.html',
  styleUrl: './admin-section.scss'
})
export class AdminSection {

  @Input()
  title?: string;

  @Input()
  subtitle?: string;

  @ContentChildren(AdminSectionActionsDirective)
  readonly actions!: QueryList<AdminSectionActionsDirective>;

}
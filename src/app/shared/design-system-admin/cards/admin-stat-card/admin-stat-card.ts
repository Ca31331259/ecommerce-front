import {
  Component,
  ContentChildren,
  Input,
  QueryList
} from '@angular/core';

import {
  AdminStatCardFooterDirective
} from './directives/admin-stat-card-footer.directive';

export type AdminStatCardVariant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

export type AdminStatCardTrend =
  | 'up'
  | 'down'
  | 'neutral';

@Component({
  selector: 'admin-stat-card',
  standalone: true,
  templateUrl: './admin-stat-card.html',
  styleUrl: './admin-stat-card.scss',
  host: {
    '[attr.variant]': 'variant',
    '[attr.trend]': 'trend'
  }
})
export class AdminStatCard {

  @Input({ required: true })
  label!: string;

  @Input({ required: true })
  value!: string | number;

  @Input()
  icon?: string;

  @Input()
  trendValue?: string;

  @Input()
  variant: AdminStatCardVariant = 'primary';

  @Input()
  trend: AdminStatCardTrend = 'neutral';

  @ContentChildren(AdminStatCardFooterDirective)
  readonly footers!: QueryList<AdminStatCardFooterDirective>;

}
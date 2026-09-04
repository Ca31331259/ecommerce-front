import {
  Component,
  Input
} from '@angular/core';

export type AdminStatusBadgeVariant =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export type AdminStatusBadgeSize =
  | 'sm'
  | 'md';

@Component({
  selector: 'admin-status-badge',
  standalone: true,
  templateUrl: './admin-status-badge.html',
  styleUrl: './admin-status-badge.scss',
  host: {
    '[attr.variant]': 'variant',
    '[attr.size]': 'size',
    '[attr.dot]': 'dot ? "" : null'
  }
})
export class AdminStatusBadge {

  @Input({ required: true })
  label!: string;

  @Input()
  icon?: string;

  @Input()
  variant: AdminStatusBadgeVariant = 'neutral';

  @Input()
  size: AdminStatusBadgeSize = 'md';

  @Input()
  dot = true;

}
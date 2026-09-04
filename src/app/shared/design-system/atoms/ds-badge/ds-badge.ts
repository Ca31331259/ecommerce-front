import {
  Component,
  HostBinding,
  Input
} from '@angular/core';

export type DsBadgeVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger';

export type DsBadgeSize =
  | 'sm'
  | 'md';

@Component({
  selector: 'ds-badge',
  standalone: true,
  templateUrl: './ds-badge.html',
  styleUrl: './ds-badge.scss'
})
export class DsBadge {

  @Input()
  variant: DsBadgeVariant = 'primary';

  @Input()
  size: DsBadgeSize = 'md';

  @Input()
  outlined = false;

  @HostBinding('class.variant-primary')
  get primary(): boolean {
    return this.variant === 'primary';
  }

  @HostBinding('class.variant-secondary')
  get secondary(): boolean {
    return this.variant === 'secondary';
  }

  @HostBinding('class.variant-accent')
  get accent(): boolean {
    return this.variant === 'accent';
  }

  @HostBinding('class.variant-neutral')
  get neutral(): boolean {
    return this.variant === 'neutral';
  }

  @HostBinding('class.variant-success')
  get success(): boolean {
    return this.variant === 'success';
  }

  @HostBinding('class.variant-warning')
  get warning(): boolean {
    return this.variant === 'warning';
  }

  @HostBinding('class.variant-danger')
  get danger(): boolean {
    return this.variant === 'danger';
  }

  @HostBinding('class.size-sm')
  get small(): boolean {
    return this.size === 'sm';
  }

  @HostBinding('class.size-md')
  get medium(): boolean {
    return this.size === 'md';
  }

  @HostBinding('class.outlined')
  get outlinedEnabled(): boolean {
    return this.outlined;
  }

}
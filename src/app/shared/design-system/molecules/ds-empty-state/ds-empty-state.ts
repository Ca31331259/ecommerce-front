import {
  Component,
  HostBinding,
  Input
} from '@angular/core';

export type DsEmptyStateSize =
  | 'sm'
  | 'md'
  | 'lg';

export type DsEmptyStateVariant =
  | 'default'
  | 'subtle';

@Component({
  selector: 'ds-empty-state',
  standalone: true,
  templateUrl: './ds-empty-state.html',
  styleUrl: './ds-empty-state.scss'
})
export class DsEmptyState {

  @Input()
  size: DsEmptyStateSize = 'md';

  @Input()
  variant: DsEmptyStateVariant = 'default';

  @HostBinding('class.size-sm')
  get small(): boolean {
    return this.size === 'sm';
  }

  @HostBinding('class.size-md')
  get medium(): boolean {
    return this.size === 'md';
  }

  @HostBinding('class.size-lg')
  get large(): boolean {
    return this.size === 'lg';
  }

  @HostBinding('class.variant-default')
  get defaultVariant(): boolean {
    return this.variant === 'default';
  }

  @HostBinding('class.variant-subtle')
  get subtleVariant(): boolean {
    return this.variant === 'subtle';
  }

}
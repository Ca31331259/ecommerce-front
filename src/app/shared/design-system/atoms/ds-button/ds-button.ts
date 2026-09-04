import {
  Component,
  HostBinding,
  Input
} from '@angular/core';

export type DsButtonVariant =
  | 'primary'
  | 'secondary'
  | 'neutral'
  | 'text';

export type DsButtonSize =
  | 'sm'
  | 'md'
  | 'lg';

export type DsButtonType =
  | 'button'
  | 'submit'
  | 'reset';

@Component({
  selector: 'ds-button',
  standalone: true,
  templateUrl: './ds-button.html',
  styleUrl: './ds-button.scss'
})
export class DsButton {

  @Input()
  variant: DsButtonVariant = 'primary';

  @Input()
  size: DsButtonSize = 'md';

  @Input()
  type: DsButtonType = 'button';

  @Input()
  disabled = false;

  @Input()
  loading = false;

  @Input()
  fullWidth = false;


  @HostBinding('class.variant-primary')
  get primary(): boolean {
    return this.variant === 'primary';
  }

  @HostBinding('class.variant-secondary')
  get secondary(): boolean {
    return this.variant === 'secondary';
  }

  @HostBinding('class.variant-neutral')
  get neutral(): boolean {
    return this.variant === 'neutral';
  }

  @HostBinding('class.variant-text')
  get text(): boolean {
    return this.variant === 'text';
  }

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

  @HostBinding('class.full-width')
  get isFullWidth(): boolean {
    return this.fullWidth;
  }

}
import {
  Component,
  HostBinding,
  Input
} from '@angular/core';

export type DsLoaderSize =
  | 'sm'
  | 'md'
  | 'lg';

export type DsLoaderVariant =
  | 'primary'
  | 'light'
  | 'dark';

export type DsLoaderLayout =
  | 'inline'
  | 'block';

@Component({
  selector: 'ds-loader',
  standalone: true,
  templateUrl: './ds-loader.html',
  styleUrl: './ds-loader.scss'
})
export class DsLoader {

  @Input()
  size: DsLoaderSize = 'md';

  @Input()
  variant: DsLoaderVariant = 'primary';

  @Input()
  layout: DsLoaderLayout = 'block';

  @Input()
  text?: string;

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

  @HostBinding('class.variant-primary')
  get primary(): boolean {
    return this.variant === 'primary';
  }

  @HostBinding('class.variant-light')
  get light(): boolean {
    return this.variant === 'light';
  }

  @HostBinding('class.variant-dark')
  get dark(): boolean {
    return this.variant === 'dark';
  }

  @HostBinding('class.layout-inline')
  get inline(): boolean {
    return this.layout === 'inline';
  }

  @HostBinding('class.layout-block')
  get block(): boolean {
    return this.layout === 'block';
  }

}
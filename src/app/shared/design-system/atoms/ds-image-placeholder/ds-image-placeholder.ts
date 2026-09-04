import {
  Component,
  HostBinding,
  Input
} from '@angular/core';

export type DsImagePlaceholderRatio =
  | 'square'
  | 'portrait'
  | 'landscape'
  | 'wide';

export type DsImagePlaceholderSize =
  | 'sm'
  | 'md'
  | 'lg';

@Component({
  selector: 'ds-image-placeholder',
  standalone: true,
  templateUrl: './ds-image-placeholder.html',
  styleUrl: './ds-image-placeholder.scss'
})
export class DsImagePlaceholder {

  @Input()
  ratio: DsImagePlaceholderRatio = 'landscape';

  @Input()
  size: DsImagePlaceholderSize = 'md';

  @Input()
  icon = 'fa-regular fa-image';

  @Input()
  text?: string;

  @HostBinding('class.ratio-square')
  get square(): boolean {
    return this.ratio === 'square';
  }

  @HostBinding('class.ratio-portrait')
  get portrait(): boolean {
    return this.ratio === 'portrait';
  }

  @HostBinding('class.ratio-landscape')
  get landscape(): boolean {
    return this.ratio === 'landscape';
  }

  @HostBinding('class.ratio-wide')
  get wide(): boolean {
    return this.ratio === 'wide';
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

}
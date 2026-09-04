import {
  Component,
  HostBinding,
  Input
} from '@angular/core';

export type DsSectionPadding =
  | 'none'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

export type DsSectionBackground =
  | 'transparent'
  | 'surface'
  | 'card'
  | 'primary'
  | 'secondary';

@Component({
  selector: 'ds-section',
  standalone: true,
  templateUrl: './ds-section.html',
  styleUrl: './ds-section.scss'
})
export class DsSection {

  @Input()
  padding: DsSectionPadding = 'lg';

  @Input() id?: string;

  @Input()
  background: DsSectionBackground = 'transparent';
  

  @HostBinding('class.padding-none')
  get paddingNone() {
    return this.padding === 'none';
  }

  @HostBinding('class.padding-sm')
  get paddingSm() {
    return this.padding === 'sm';
  }

  @HostBinding('class.padding-md')
  get paddingMd() {
    return this.padding === 'md';
  }

  @HostBinding('class.padding-lg')
  get paddingLg() {
    return this.padding === 'lg';
  }

  @HostBinding('class.bg-transparent')
  get bgTransparent() {
    return this.background === 'transparent';
  }

  @HostBinding('class.bg-surface')
  get bgSurface() {
    return this.background === 'surface';
  }

  @HostBinding('class.bg-card')
  get bgCard() {
    return this.background === 'card';
  }

  @HostBinding('class.bg-primary')
  get bgPrimary() {
    return this.background === 'primary';
  }

  @HostBinding('class.bg-secondary')
  get bgSecondary() {
    return this.background === 'secondary';
  }

}
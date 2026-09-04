import {
  Component,
  HostBinding,
  Input
} from '@angular/core';

export type DsCardPadding =
  | 'none'
  | 'sm'
  | 'md'
  | 'lg';

export type DsCardShadow =
  | 'none'
  | 'sm'
  | 'md'
  | 'lg';

@Component({
  selector: 'ds-card',
  standalone: true,
  templateUrl: './ds-card.html',
  styleUrl: './ds-card.scss'
})
export class DsCard {

  @Input()
  padding: DsCardPadding = 'md';

  @Input()
  shadow: DsCardShadow = 'md';

  @Input()
  hover = true;

  @Input()
  outlined = false;

  @HostBinding('class.padding-none')
  get paddingNone(): boolean {
    return this.padding === 'none';
  }

  @HostBinding('class.padding-sm')
  get paddingSm(): boolean {
    return this.padding === 'sm';
  }

  @HostBinding('class.padding-md')
  get paddingMd(): boolean {
    return this.padding === 'md';
  }

  @HostBinding('class.padding-lg')
  get paddingLg(): boolean {
    return this.padding === 'lg';
  }

  @HostBinding('class.shadow-none')
  get shadowNone(): boolean {
    return this.shadow === 'none';
  }

  @HostBinding('class.shadow-sm')
  get shadowSm(): boolean {
    return this.shadow === 'sm';
  }

  @HostBinding('class.shadow-md')
  get shadowMd(): boolean {
    return this.shadow === 'md';
  }

  @HostBinding('class.shadow-lg')
  get shadowLg(): boolean {
    return this.shadow === 'lg';
  }

  @HostBinding('class.hover')
  get hoverEnabled(): boolean {
    return this.hover;
  }

  @HostBinding('class.outlined')
  get outlinedEnabled(): boolean {
    return this.outlined;
  }

}
import {
  Component,
  HostBinding,
  Input
} from '@angular/core';

export type DsContainerSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

@Component({
  selector: 'ds-container',
  standalone: true,
  templateUrl: './ds-container.html',
  styleUrl: './ds-container.scss'
})
export class DsContainer {

  @Input()
  size: DsContainerSize = 'lg';

  @Input()
  fluid = false;

  @Input() id?: string;

  @HostBinding('class.fluid')
  get isFluid(): boolean {

    return this.fluid;

  }

  @HostBinding('class.xs')
  get xs(): boolean {

    return this.size === 'xs';

  }

  @HostBinding('class.sm')
  get sm(): boolean {

    return this.size === 'sm';

  }

  @HostBinding('class.md')
  get md(): boolean {

    return this.size === 'md';

  }

  @HostBinding('class.lg')
  get lg(): boolean {

    return this.size === 'lg';

  }

  @HostBinding('class.xl')
  get xl(): boolean {

    return this.size === 'xl';

  }

}
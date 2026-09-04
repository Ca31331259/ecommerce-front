import {
  Component,
  ContentChild,
  HostBinding,
  Input
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { DsHeaderBadgeDirective } from './directives/ds-header-badge.directive';
import { DsHeaderTitleDirective } from './directives/ds-header-title.directive';
import { DsHeaderSubtitleDirective } from './directives/ds-header-subtitle.directive';

export type DsHeaderAlign =
  | 'left'
  | 'center'
  | 'right';

export type DsHeaderSpacing =
  | 'none'
  | 'default';

@Component({
  selector: 'ds-section-header',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './ds-section-header.html',
  styleUrl: './ds-section-header.scss'
})
export class DsSectionHeader {



  @Input()
  badge?: string;

  @Input()
  title?: string;

  @Input()
  subtitle?: string;

  @Input()
  align: DsHeaderAlign = 'center';

  @ContentChild(DsHeaderBadgeDirective)
  projectedBadge?: DsHeaderBadgeDirective;

  @ContentChild(DsHeaderTitleDirective)
  projectedTitle?: DsHeaderTitleDirective;

  @ContentChild(DsHeaderSubtitleDirective)
  projectedSubtitle?: DsHeaderSubtitleDirective;


  @Input()
  spacing: DsHeaderSpacing = 'default';

  @HostBinding('class.spacing-none')
  get spacingNone(): boolean {
    return this.spacing === 'none';
  }

  @HostBinding('class.spacing-default')
  get spacingDefault(): boolean {
    return this.spacing === 'default';
  }

}
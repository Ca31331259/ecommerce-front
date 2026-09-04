import {
  Component,
  Input
} from '@angular/core';
import { DsSection } from '../../../shared/design-system/layout/ds-section';
import { DsContainer } from '../../../shared/design-system/layout/ds-container';
import { DsSectionHeader } from '../../../shared/design-system/layout/ds-section-header';
import { DsHeaderBadgeDirective } from '../../../shared/design-system/layout/ds-section-header/directives/ds-header-badge.directive';
import { DsBadge } from '../../../shared/design-system/atoms/ds-badge';
import { DsCard, DsCardContentDirective, DsCardTitleDirective } from '../../../shared/design-system/atoms/ds-card';
import { DsEmptyDescriptionDirective, DsEmptyIconDirective, DsEmptyState, DsEmptyTitleDirective } from '../../../shared/design-system/molecules/ds-empty-state';
import { featureIconClass } from '@shared/icons/feature-icons';



@Component({
  selector: 'app-features',
  standalone: true,
  imports: [
    DsSection,
    DsContainer,

    DsSectionHeader,
    DsHeaderBadgeDirective,

    DsBadge,

    DsCard,
    DsEmptyState,
    DsEmptyIconDirective,
    DsEmptyTitleDirective,
    DsEmptyDescriptionDirective
  ],
  templateUrl: './features.html',
  styleUrl: './features.scss'
})
export class Features {

  @Input()
  features: any[] = [];

protected readonly featureIconClass =
    featureIconClass;

  trackByFeature(
    index: number,
    feature: any
  ): any {

    return feature?.id ?? index;

  }

}
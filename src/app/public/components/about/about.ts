import {
  Component,
  Input
} from '@angular/core';

import {
  TenantHome
} from '../../../core/models/site-config';

import {
  DsSection
} from '../../../shared/design-system/layout/ds-section';

import {
  DsContainer
} from '../../../shared/design-system/layout/ds-container';

import {
  DsSectionHeader
} from '../../../shared/design-system/layout/ds-section-header';

import {
  DsHeaderBadgeDirective
} from '../../../shared/design-system/layout/ds-section-header/directives/ds-header-badge.directive';

import {
  DsBadge
} from '../../../shared/design-system/atoms/ds-badge';

import {
  DsButton
} from '../../../shared/design-system/atoms/ds-button';

import {
  DsImagePlaceholder
} from '../../../shared/design-system/atoms/ds-image-placeholder';


@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    DsSection,
    DsContainer,

    DsSectionHeader,
    DsHeaderBadgeDirective,

    DsBadge,
    DsButton,
    DsImagePlaceholder
  ],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About {

  /*==========================================================
  INPUTS
  ==========================================================*/

  @Input({
    required: true
  })
  home!: TenantHome;


  /*==========================================================
  ACTION
  ==========================================================*/

  openLink(): void {

    const link =
      this.home.aboutButtonLink;

    if (!link) {

      return;

    }

    if (
      link.startsWith('#')
    ) {

      document
        .getElementById(
          link.substring(1)
        )
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

      return;

    }

    window.open(
      link,
      '_self'
    );

  }

}
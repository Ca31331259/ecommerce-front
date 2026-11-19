import {
  Component,
  Input
} from '@angular/core';

import {
  TenantAbout,
  TenantAboutMilestone,
  TenantAboutStat,
  TenantAboutTeamMember,
  TenantAboutValue
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
  DsCard
} from '../../../shared/design-system/atoms/ds-card';

import { featureIconClass } from '@shared/icons/feature-icons';

@Component({
  selector: 'app-about-detail',
  standalone: true,
  imports: [
    DsSection,
    DsContainer,

    DsSectionHeader,
    DsHeaderBadgeDirective,

    DsBadge,
    DsCard
  ],
  templateUrl: './about-detail.html',
  styleUrl: './about-detail.scss'
})
export class AboutDetail {

  /*==========================================================
  INPUTS
  ==========================================================*/

  @Input({ required: true })
  about!: TenantAbout;

  @Input()
  values: TenantAboutValue[] = [];

  @Input()
  milestones: TenantAboutMilestone[] = [];

  @Input()
  team: TenantAboutTeamMember[] = [];

  @Input()
  stats: TenantAboutStat[] = [];


  /*==========================================================
  HELPERS
  ==========================================================*/

  protected readonly featureIconClass =
    featureIconClass;

  /**
   * true si hay al menos un bloque activado — evita renderizar la sección
   * entera (con su header) cuando ABOUT_DETAIL está "enabled" a nivel página
   * pero el admin todavía no activó ningún bloque individual.
   */
  get hasVisibleContent(): boolean {

    return !!(
      this.about?.historyEnabled ||
      this.about?.missionVisionEnabled ||
      this.about?.valuesEnabled ||
      this.about?.timelineEnabled ||
      this.about?.teamEnabled ||
      this.about?.statsEnabled
    );

  }

}

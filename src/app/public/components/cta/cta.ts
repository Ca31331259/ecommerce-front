import {
  Component,
  Input
} from '@angular/core';
import { DsSection } from '../../../shared/design-system/layout/ds-section';
import { DsContainer } from '../../../shared/design-system/layout/ds-container';
import { DsButton } from '../../../shared/design-system/atoms/ds-button';



@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [
    DsSection,
    DsContainer,
    DsButton
  ],
  templateUrl: './cta.html',
  styleUrl: './cta.scss'
})
export class Cta {

  @Input({ required: true })
  home: any;

  /*==========================================================
  ACTION
  ==========================================================*/

  openLink(): void {

    const link =
      this.home?.ctaButtonLink;

    if (!link) {
      return;
    }

    if (link.startsWith('#')) {

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
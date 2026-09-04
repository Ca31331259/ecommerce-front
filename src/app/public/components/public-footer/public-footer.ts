import {
  Component,
  Input
} from '@angular/core';
import { DsContainer } from '../../../shared/design-system/layout/ds-container';
import { DsSocialButtons } from '../../../shared/design-system/molecules/ds-social-buttons';


@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [
    DsContainer,
    DsSocialButtons
  ],
  templateUrl: './public-footer.html',
  styleUrl: './public-footer.scss'
})
export class PublicFooter {

  @Input({ required: true })
  settings: any;

  @Input({ required: true })
  home: any;
  
  @Input({ required: true })
theme: any; 

@Input()
sections: any[] = [];

isEnabled(section: string): boolean {

  return this.sections.some(
    item =>
      item.section === section &&
      item.enabled
  );

}

  readonly currentYear =
    new Date().getFullYear();

  /*==========================================================
  NAVIGATION
  ==========================================================*/

  scrollTo(id: string): void {

    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

  }

}
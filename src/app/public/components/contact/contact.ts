import {
  Component,
  Input,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';
import { DsSection } from '../../../shared/design-system/layout/ds-section';
import { DsContainer } from '../../../shared/design-system/layout/ds-container';
import { DsSectionHeader } from '../../../shared/design-system/layout/ds-section-header';
import { DsHeaderBadgeDirective } from '../../../shared/design-system/layout/ds-section-header/directives/ds-header-badge.directive';
import { DsBadge } from '../../../shared/design-system/atoms/ds-badge';
import { DsCard } from '../../../shared/design-system/atoms/ds-card';
import { DsButton } from '../../../shared/design-system/atoms/ds-button';
import { DsSocialButtons } from '../../../shared/design-system/molecules/ds-social-buttons';



@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    FormsModule,

    DsSection,
    DsContainer,

    DsSectionHeader,
    DsHeaderBadgeDirective,

    DsBadge,
    DsCard,
    DsButton,
    DsSocialButtons
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {

  @Input({ required: true })
  settings: any;

  readonly submitted =
    signal(false);

  name = '';

  email = '';

  phone = '';

  message = '';

  /*==========================================================
  CONTACT
  ==========================================================*/

  sendMessage(): void {

    this.submitted.set(true);

    if (!this.isValid()) {
      return;
    }

    const contactEmail =
      this.settings?.email;

    if (!contactEmail) {
      return;
    }

    const subject =
      encodeURIComponent(
        `Consulta web de ${this.name}`
      );

    const body =
      encodeURIComponent(
        this.buildMessage()
      );

    window.location.href =
      `mailto:${contactEmail}?subject=${subject}&body=${body}`;

  }

  /*==========================================================
  VALIDATION
  ==========================================================*/

  isValid(): boolean {

    return (
      !!this.name.trim() &&
      !!this.email.trim() &&
      this.isValidEmail(this.email) &&
      !!this.message.trim()
    );

  }

  isFieldInvalid(
    field: 'name' | 'email' | 'message'
  ): boolean {

    if (!this.submitted()) {
      return false;
    }

    switch (field) {

      case 'name':

        return !this.name.trim();

      case 'email':

        return (
          !this.email.trim() ||
          !this.isValidEmail(this.email)
        );

      case 'message':

        return !this.message.trim();

    }

  }

  private isValidEmail(
    email: string
  ): boolean {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(email);

  }

  /*==========================================================
  MESSAGE
  ==========================================================*/

  private buildMessage(): string {

    const lines = [
      'Hola,',
      '',
      this.message,
      '',
      '--------------------------------',
      `Nombre: ${this.name}`,
      `Email: ${this.email}`
    ];

    if (this.phone.trim()) {

      lines.push(
        `Teléfono: ${this.phone}`
      );

    }

    lines.push(
      '',
      'Mensaje enviado desde el sitio web.'
    );

    return lines.join('\n');

  }

}
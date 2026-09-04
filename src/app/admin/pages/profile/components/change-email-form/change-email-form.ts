import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';



import {
  AdminButton,
  AdminField,
  AdminFormCard,
  AdminFormCardFooterDirective,
  AdminFormGrid,
  AdminInputDirective
} from '@shared/design-system-admin';
import { ChangeEmailRequest } from '../../../../../core/models/profile/change-email-request';

@Component({
  selector: 'app-change-email-form',
  standalone: true,
  imports: [
    FormsModule,

    AdminFormCard,
    AdminFormCardFooterDirective,

    AdminFormGrid,
    AdminField,
    AdminInputDirective,

    AdminButton
  ],
  templateUrl: './change-email-form.html',
  styleUrl: './change-email-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeEmailForm {

  /* ======================================================
   * INPUTS
   * ====================================================== */

  @Input()
  saving = false;

  /* ======================================================
   * OUTPUTS
   * ====================================================== */

  @Output()
  readonly save =
    new EventEmitter<ChangeEmailRequest>();

  /* ======================================================
   * MODEL
   * ====================================================== */

  model: ChangeEmailRequest = {

    newEmail: '',

    currentPassword: ''

  };

  confirmEmail = '';

  /* ======================================================
   * ACTIONS
   * ====================================================== */

  saveEmail(): void {

    if (
      !this.model.newEmail ||
      this.model.newEmail !== this.confirmEmail
    ) {

      return;

    }

    this.save.emit(this.model);

  }

}
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
import { ChangePasswordRequest } from '@core/models/profile/change-password-request';



import {
  AdminButton,
  AdminField,
  AdminFormCard,
  AdminFormCardFooterDirective,
  AdminFormGrid,
  AdminInputDirective
} from '@shared/design-system-admin';




@Component({
  selector: 'app-change-password-form',
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
  templateUrl: './change-password-form.html',
  styleUrl: './change-password-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordForm {

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
    new EventEmitter<ChangePasswordRequest>();

  /* ======================================================
   * MODEL
   * ====================================================== */

  model: ChangePasswordRequest = {

    currentPassword: '',

    newPassword: '',

    confirmPassword: ''

  };

  /* ======================================================
   * ACTIONS
   * ====================================================== */

  savePassword(): void {

    if (
      !this.model.currentPassword ||
      !this.model.newPassword ||
      !this.model.confirmPassword
    ) {

      return;

    }

    if (
      this.model.newPassword !==
      this.model.confirmPassword
    ) {

      return;

    }

    this.save.emit(this.model);

  }

}
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
  UserProfile
} from '@core/models/profile/user-profile';

import {
  UpdateProfileRequest
} from '@core/models/profile/update-profile-request';

import {
  AdminButton,
  AdminField,
  AdminFormCard,
  AdminFormCardFooterDirective,
  AdminFormGrid,
  AdminInputDirective
} from '@shared/design-system-admin';

@Component({
  selector: 'app-profile-form',
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
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileForm {

  /* ======================================================
   * INPUTS
   * ====================================================== */

  @Input({
    required: true
  })
  profile!: UserProfile;

  @Input()
  saving = false;

  /* ======================================================
   * OUTPUTS
   * ====================================================== */

  @Output()
  readonly save =
    new EventEmitter<UpdateProfileRequest>();

  /* ======================================================
   * ACTIONS
   * ====================================================== */

  saveProfile(): void {

    this.save.emit({

      firstName: this.profile.firstName,

      lastName: this.profile.lastName

    });

  }

}
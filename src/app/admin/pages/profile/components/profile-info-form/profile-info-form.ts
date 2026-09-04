import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { FormsModule } from '@angular/forms';



import {
  AdminButton,
  AdminField,
  AdminFormCard,
  AdminFormCardFooterDirective,
  AdminFormGrid,
  AdminInputDirective
} from '@shared/design-system-admin';
import { UpdateProfileRequest } from '../../../../../core/models/profile/update-profile-request';
import { UserProfile } from '../../../../../core/models/profile/user-profile';

@Component({
  selector: 'app-profile-info-form',
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
  templateUrl: './profile-info-form.html',
  styleUrl: './profile-info-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileInfoForm {

  @Input({ required: true })
  profile!: UserProfile;

  @Input()
  saving = false;

  @Output()
  readonly save =
    new EventEmitter<UpdateProfileRequest>();

  saveProfile(): void {

    this.save.emit({

      firstName: this.profile.firstName,

      lastName: this.profile.lastName

    });

  }

}
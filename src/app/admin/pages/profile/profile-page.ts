import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    inject,
    signal
} from '@angular/core';

import { finalize } from 'rxjs';



import { UserProfile } from '../../../core/models/profile/user-profile';
import { ChangeEmailRequest } from '../../../core/models/profile/change-email-request';
import { ChangePasswordRequest } from '../../../core/models/profile/change-password-request';
import { UpdateProfileRequest } from '../../../core/models/profile/update-profile-request';
import { ProfileService } from '../../../core/services/profile/profile-service';
import { AdminPage } from '@shared/design-system-admin';
import { ProfileInfoForm } from './components/profile-info-form/profile-info-form';
import { ChangeEmailForm } from './components/change-email-form/change-email-form';
import { ChangePasswordForm } from './components/change-password-form/change-password-form';
import { ProfileForm } from './components/profile-form/profile-form';
import { SecurityForm } from './components/security-form/security-form';

@Component({
    selector: 'app-profile-page',
    standalone: true,
    imports: [
        AdminPage,
        //ProfileInfoForm,
        ChangeEmailForm,
        ChangePasswordForm,
        ProfileForm,
    SecurityForm
    ],
    templateUrl: './profile-page.html',
    styleUrl: './profile-page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePage implements OnInit {

    /* ======================================================
     * DEPENDENCIES
     * ====================================================== */

    private readonly profileService =
        inject(ProfileService);

    /* ======================================================
     * STATE
     * ====================================================== */

    readonly loading =
        signal(true);

    readonly saving =
        signal(false);

    readonly profile =
        signal<UserProfile | null>(null);




    /* ======================================================
     * LIFECYCLE
     * ====================================================== */

    ngOnInit(): void {

        this.loadProfile();

    }

    /* ======================================================
     * LOAD
     * ====================================================== */

    loadProfile(): void {

        this.loading.set(true);

        this.profileService
            .getProfile()
            .pipe(
                finalize(() => {

                    this.loading.set(false);

                })
            )
            .subscribe({

                next: profile => {

                    this.profile.set(profile);

                },

                error: err => {

                    console.error(err);

                }

            });

    }

    /* ======================================================
     * ACTIONS
     * ====================================================== */

    updateProfile(
        request: UpdateProfileRequest
    ): void {

        this.saving.set(true);

        this.profileService
            .updateProfile(request)
            .pipe(
                finalize(() => {

                    this.saving.set(false);

                })
            )
            .subscribe(profile => {

                this.profile.set(profile);

            });

    }

    changeEmail(
        request: ChangeEmailRequest
    ): void {

        this.saving.set(true);

        this.profileService
            .changeEmail(request)
            .pipe(
                finalize(() => {

                    this.saving.set(false);

                })
            )
            .subscribe();

    }

    changePassword(
        request: ChangePasswordRequest
    ): void {

        this.saving.set(true);

        this.profileService
            .changePassword(request)
            .pipe(
                finalize(() => {

                    this.saving.set(false);

                })
            )
            .subscribe();

    }

}
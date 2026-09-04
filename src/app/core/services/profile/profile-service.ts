import {
    HttpClient
} from '@angular/common/http';

import {
    inject,
    Injectable
} from '@angular/core';

import {
    Observable
} from 'rxjs';

import {
    UserProfile
} from '../../models/profile/user-profile';

import {
    UpdateProfileRequest
} from '../../models/profile/update-profile-request';

import {
    ChangeEmailRequest
} from '../../models/profile/change-email-request';

import {
    ChangePasswordRequest
} from '../../models/profile/change-password-request';
import { EnableTwoFactorRequest } from '@core/models/profile/enable-two-factor-request';
import { TwoFactorSetup } from '@core/models/profile/two-factor-setup';
import { ApiConfig } from '@core/config/api.config';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    /* ======================================================
     * DEPENDENCIES
     * ====================================================== */

    private readonly http =
        inject(HttpClient);

                      private readonly config =
                inject(ApiConfig);

    /* ======================================================
     * API
     * ====================================================== */

    private readonly api =
       this.config.baseUrl+ '/admin/profile';

    /* ======================================================
     * PROFILE
     * ====================================================== */

    getProfile(): Observable<UserProfile> {

        return this.http.get<UserProfile>(
            this.api
        );

    }

    updateProfile(
        request: UpdateProfileRequest
    ): Observable<UserProfile> {

        return this.http.put<UserProfile>(
            this.api,
            request
        );

    }

    changeEmail(
        request: ChangeEmailRequest
    ): Observable<void> {

        return this.http.put<void>(
            `${this.api}/email`,
            request
        );

    }

    changePassword(
        request: ChangePasswordRequest
    ): Observable<void> {

        return this.http.put<void>(
            `${this.api}/password`,
            request
        );

    }

    setupTwoFactor() {

        return this.http.get<TwoFactorSetup>(
            `${this.api}/2fa/setup`
        );

    }

    enableTwoFactor(
        request: EnableTwoFactorRequest
    ) {

        return this.http.post<void>(
            `${this.api}/2fa/enable`,
            request
        );

    }

    disableTwoFactor() {

        return this.http.delete<void>(
            `${this.api}/2fa`
        );

    }

}
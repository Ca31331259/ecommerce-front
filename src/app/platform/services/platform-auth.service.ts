import {
    Injectable,
    inject
} from '@angular/core';

import {
    HttpClient
} from '@angular/common/http';

import {
    Observable,
    tap
} from 'rxjs';

import {
    PlatformLoginRequest
} from '../models/platform-login-request.model';

import {
    PlatformLoginResponse
} from '../models/platform-login-response.model';


@Injectable({
    providedIn: 'root'
})
export class PlatformAuthService {


    private readonly http =
        inject(HttpClient);


private readonly endpoint =
    '/api/platform/auth/login';


    private readonly tokenKey =
        'platform_token';


    private readonly userKey =
        'platform_user';


    /*
     * ======================================================
     * LOGIN
     * ======================================================
     */

    login(
        request: PlatformLoginRequest
    ): Observable<PlatformLoginResponse> {

        return this.http
            .post<PlatformLoginResponse>(
                this.endpoint,
                request
            )
            .pipe(

                tap(
                    response => {

                        this.saveSession(
                            response
                        );

                    }
                )

            );

    }


    /*
     * ======================================================
     * SESSION
     * ======================================================
     */

    private saveSession(
        response: PlatformLoginResponse
    ): void {

        localStorage.setItem(
            this.tokenKey,
            response.token
        );

        localStorage.setItem(
            this.userKey,
            JSON.stringify({
                email: response.email,
                fullName: response.fullName
            })
        );

    }


    /*
     * ======================================================
     * TOKEN
     * ======================================================
     */

    getToken(): string | null {

        return localStorage.getItem(
            this.tokenKey
        );

    }


    /*
     * ======================================================
     * AUTHENTICATED
     * ======================================================
     */

    isAuthenticated(): boolean {

        return !!this.getToken();

    }


    /*
     * ======================================================
     * USER
     * ======================================================
     */

    getCurrentUser(): {
        email: string;
        fullName: string;
    } | null {

        const value =
            localStorage.getItem(
                this.userKey
            );


        if (!value) {

            return null;

        }


        try {

            return JSON.parse(value);

        } catch {

            return null;

        }

    }


    /*
     * ======================================================
     * LOGOUT
     * ======================================================
     */

    logout(): void {

        localStorage.removeItem(
            this.tokenKey
        );

        localStorage.removeItem(
            this.userKey
        );

    }

}
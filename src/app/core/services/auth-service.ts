import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginResponse } from '@core/models/login-response.model';
import { VerifyLoginTwoFactorRequest } from '@core/models/profile/verify-login-two-factor-request';
import { Observable } from 'rxjs';
import { ChangeExpiredPasswordRequest } from '@core/models/profile/change-expired-password-request';
import { ApiConfig } from '@core/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly config =
    inject(ApiConfig);

  //private api = 'http://localhost:8080';

  private http = inject(HttpClient);

  private router = inject(Router);

  login(data: {
    email: string;
    password: string;
    tenant: string;
  }) {

    return this.http.post<any>(
      `${this.config.baseUrl}/auth/login`,
      data
    );

  }

  saveSession(
    response: any
  ) {

    localStorage.setItem(
      'token',
      response.token
    );

    localStorage.setItem(
      'tenant',
      response.tenant.code
    );

    localStorage.setItem(
      'roles',
      JSON.stringify(
        response.roles
      )
    );

  }

  logout() {

    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'roles'
    );

    this.router.navigate([
      '/'
    ]);

  }

  isAuthenticated() {

    return !!localStorage.getItem(
      'token'
    );

  }

  getToken() {

    return localStorage.getItem(
      'token'
    );

  }

  getTenant() {

    return localStorage.getItem(
      'tenant'
    );

  }

  verifyTwoFactor(
    request: VerifyLoginTwoFactorRequest
){

    return this.http.post<LoginResponse>(

        this.config.baseUrl + '/auth/verify-2fa',

        request

    );

}


changeExpiredPassword(
    request: ChangeExpiredPasswordRequest
): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
        `${this.config.baseUrl}/auth/change-expired-password`,
        request
    );

}
}
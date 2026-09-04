import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { TwoFactorForm } from './components/two-factor-form/two-factor-form';
import { ExpiredPasswordForm } from './components/expired-password-form/expired-password-form';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TwoFactorForm,
    ExpiredPasswordForm,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly requiresTwoFactor =
    signal(false);

  challengeToken = '';

  loading = false;
  error = '';


  readonly requiresPasswordChange = signal(false);



  form = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  submit() {

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const tenant = localStorage.getItem('tenant');

    if (!tenant) {

      this.error = 'Tenant no detectado';
      this.loading = false;

      return;
    }

    this.authService.login({
      email: this.form.value.email!,
      password: this.form.value.password!,
      tenant
    })
      .subscribe({

        next: (res) => {

          if (res.status === 'TWO_FACTOR_REQUIRED') {

            this.challengeToken =
              res.challengeToken!;

            this.requiresTwoFactor.set(true);

            this.loading = false;

            return;

          }

          if (res.status === 'PASSWORD_EXPIRED') {

            this.challengeToken = res.challengeToken!;

            this.requiresPasswordChange.set(true);

            this.loading = false;

            return;

          }

          this.authService.saveSession(res);

          this.router.navigate([
            '/admin/dashboard'
          ]);

        },

        error: () => {

          this.error = 'Usuario o contraseña inválidos';
          this.loading = false;
        }
      });
  }


  verifyTwoFactor(
    code: string
  ): void {

    this.loading = true;

    this.error = '';

    this.authService
      .verifyTwoFactor({

        challengeToken:
          this.challengeToken,

        code

      })
      .subscribe({

        next: (res: any) => {
          if (res.status === 'PASSWORD_EXPIRED') {

            this.requiresTwoFactor.set(false);

            this.requiresPasswordChange.set(true);

            this.challengeToken = res.challengeToken!;

            this.loading = false;

            return;

          }

          this.authService.saveSession(res);

          this.router.navigate([
            '/admin/dashboard'
          ]);
        },

        error: (error: any) => {
          console.error(error)
          this.error =
            'El código ingresado es incorrecto.';

          this.loading = false;

        }

      });

  }


  cancelTwoFactor(): void {

    this.requiresTwoFactor.set(false);

    this.challengeToken = '';

    this.error = '';

  }

  changeExpiredPassword(
    request: {
      newPassword: string;
    }
  ): void {

    this.authService.changeExpiredPassword({

      challengeToken: this.challengeToken,

      newPassword: request.newPassword

    }).subscribe({

      next: res => {

        this.authService.saveSession(res);

        this.router.navigate([
          '/admin/dashboard'
        ]);

      },

      error: err => {

        this.loading = false;

        this.error = err.error?.message
          ?? 'No fue posible cambiar la contraseña.';

      }

    });

  }
}
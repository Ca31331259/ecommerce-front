import {
    ChangeDetectionStrategy,
    Component,
    inject
} from '@angular/core';

import {
    FormBuilder,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';

import {
    Router
} from '@angular/router';

import {
    PlatformAuthService
} from '../../services/platform-auth.service';
import { PlatformLoginRequest } from '../../models/platform-login-request.model';


@Component({

    selector: 'app-platform-login',

    standalone: true,

    imports: [
        ReactiveFormsModule
    ],

    templateUrl:
        './platform-login.component.html',

    styleUrl:
        './platform-login.component.scss',

    changeDetection:
        ChangeDetectionStrategy.OnPush

})
export class PlatformLoginComponent {


    private readonly fb =
        inject(FormBuilder);

    private readonly router =
        inject(Router);

    private readonly authService =
        inject(PlatformAuthService);


    /*
     * ======================================================
     * ESTADO
     * ======================================================
     */

    loading = false;

    submitted = false;

    errorMessage = '';

    showPassword = false;


    /*
     * ======================================================
     * FORM
     * ======================================================
     */

    readonly form =
        this.fb.nonNullable.group({

            email: [
                '',
                [
                    Validators.required,
                    Validators.email
                ]
            ],

            password: [
                '',
                [
                    Validators.required
                ]
            ]

        });


    /*
     * ======================================================
     * SUBMIT
     * ======================================================
     */

    submit(): void {

        this.submitted = true;

        this.errorMessage = '';


        if (this.form.invalid) {

            this.form.markAllAsTouched();

            return;

        }


        this.loading = true;


const request: PlatformLoginRequest =
    this.form.getRawValue();


this.authService
    .login(request)
            .subscribe({

                next: () => {

                    this.loading = false;

                    this.router.navigate([
                        '/platform'
                    ]);

                },

                error: (
                    error
                ) => {

                    this.loading = false;

                    this.errorMessage =
                        this.getErrorMessage(
                            error
                        );

                }

            });

    }


    /*
     * ======================================================
     * PASSWORD
     * ======================================================
     */

    togglePassword(): void {

        this.showPassword =
            !this.showPassword;

    }


    /*
     * ======================================================
     * VALIDATION
     * ======================================================
     */

    hasError(
        controlName: string
    ): boolean {

        const control =
            this.form.get(controlName);

        return !!control &&
            control.invalid &&
            (
                control.touched ||
                this.submitted
            );

    }


    getError(
        controlName: string
    ): string {

        const control =
            this.form.get(controlName);


        if (!control) {

            return '';

        }


        if (
            control.hasError('required')
        ) {

            return 'Este campo es obligatorio.';

        }


        if (
            control.hasError('email')
        ) {

            return 'Ingresá un email válido.';

        }


        return 'Valor inválido.';

    }


    /*
     * ======================================================
     * BACKEND ERROR
     * ======================================================
     */

    private getErrorMessage(
        error: any
    ): string {

        if (
            error?.status === 401 ||
            error?.status === 403
        ) {

            return 'Email o contraseña incorrectos.';

        }


        return (
            error?.error?.message
            ||
            error?.error?.error
            ||
            'No se pudo iniciar sesión. Intentá nuevamente.'
        );

    }

}
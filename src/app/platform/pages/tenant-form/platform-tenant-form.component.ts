import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    inject
} from '@angular/core';

import {
    FormBuilder,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';

import {
    ActivatedRoute,
    Router,
    RouterLink
} from '@angular/router';



import {
    PlatformTenantService
} from '../../services/platform-tenant.service';
import { PlatformTenantRequest } from '../../models/platform-tenant-request.model';
import { PlatformTenant } from '../../models/platform-tenant.model';


@Component({

    selector: 'app-platform-tenant-form',

    standalone: true,

    imports: [
        ReactiveFormsModule,
        RouterLink
    ],

    templateUrl:
        './platform-tenant-form.component.html',

    styleUrl:
        './platform-tenant-form.component.scss',

    changeDetection:
        ChangeDetectionStrategy.OnPush

})
export class PlatformTenantFormComponent
    implements OnInit {


    private readonly fb =
        inject(FormBuilder);

    private readonly route =
        inject(ActivatedRoute);

    private readonly router =
        inject(Router);

    private readonly tenantService =
        inject(PlatformTenantService);


    /*
     * ======================================================
     * ESTADO
     * ======================================================
     */

    readonly isEdit =
        this.route.snapshot.paramMap.has('id');


    readonly tenantId =
        this.route.snapshot.paramMap.get('id');


    loading = false;

    saving = false;

    submitted = false;

    errorMessage = '';


    /*
     * ======================================================
     * FORM
     * ======================================================
     */

    readonly form =
        this.fb.nonNullable.group({

            code: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(50)
                ]
            ],

            name: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(150)
                ]
            ],

            domain: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(255)
                ]
            ],

            active: [
                true
            ],

            webEnabled: [
                true
            ],

            monthlyPrice: [
                0,
                [
                    Validators.required,
                    Validators.min(0)
                ]
            ],

            dbHost: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(255)
                ]
            ],

            dbPort: [
                3306,
                [
                    Validators.required,
                    Validators.min(1),
                    Validators.max(65535)
                ]
            ],

            dbSchema: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(100)
                ]
            ],

            dbUsername: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(100)
                ]
            ],

            dbPassword: [
                '',
                [
                    Validators.required
                ]
            ]

        });


    /*
     * ======================================================
     * INIT
     * ======================================================
     */

    ngOnInit(): void {

        if (this.isEdit && this.tenantId) {

            this.loadTenant(
                Number(this.tenantId)
            );

        }

    }


    /*
     * ======================================================
     * LOAD
     * ======================================================
     */

    private loadTenant(
        id: number
    ): void {

        this.loading = true;

        this.errorMessage = '';


        this.tenantService
            .get(id)
            .subscribe({

                next: (
                    tenant: PlatformTenant
                ) => {

                    this.form.patchValue({

                        code: tenant.code,

                        name: tenant.name,

                        domain: tenant.domain,

                        active: tenant.active,

                        webEnabled: tenant.webEnabled,

                        monthlyPrice:
                            tenant.monthlyPrice

                    });


                    /*
                     * En edición no queremos
                     * obligar a cambiar la password
                     * de la base de datos.
                     */
                    this.form.controls.dbPassword
                        .clearValidators();

                    this.form.controls.dbPassword
                        .updateValueAndValidity();


                    this.loading = false;

                },

                error: (error: any) => {

                    this.loading = false;
                    console.log(error)
                    this.errorMessage =
                        'No se pudo cargar el tenant.';

                }

            });

    }


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


        const request =
            this.buildRequest();


        this.saving = true;


        if (this.isEdit && this.tenantId) {

            this.updateTenant(
                Number(this.tenantId),
                request
            );

            return;

        }


        this.createTenant(
            request
        );

    }


    /*
     * ======================================================
     * CREATE
     * ======================================================
     */

    private createTenant(
        request: PlatformTenantRequest
    ): void {

        this.tenantService
            .create(request)
            .subscribe({

                next: (
                    tenant: PlatformTenant
                ) => {

                    this.saving = false;

                    this.router.navigate([
                        '/platform/tenants',
                        tenant.id
                    ]);

                },

                error: (
                    error
                ) => {

                    this.saving = false;

                    this.errorMessage =
                        this.getBackendErrorMessage(
                            error,
                            'No se pudo crear el tenant.'
                        );

                }

            });

    }


    /*
     * ======================================================
     * UPDATE
     * ======================================================
     */

    private updateTenant(
        id: number,
        request: PlatformTenantRequest
    ): void {

        this.tenantService
            .update(
                id,
                request
            )
            .subscribe({

                next: (
                    tenant: PlatformTenant
                ) => {

                    this.saving = false;

                    this.router.navigate([
                        '/platform/tenants',
                        tenant.id
                    ]);

                },

                error: (
                    error
                ) => {

                    this.saving = false;

                    this.errorMessage =
                        this.getBackendErrorMessage(
                            error,
                            'No se pudo actualizar el tenant.'
                        );

                }

            });

    }


    /*
     * ======================================================
     * REQUEST
     * ======================================================
     */

    private buildRequest(): PlatformTenantRequest {

        const value =
            this.form.getRawValue();


        return {

            code:
                value.code.trim(),

            name:
                value.name.trim(),

            domain:
                value.domain.trim(),

            active:
                value.active,

            webEnabled:
                value.webEnabled,

            monthlyPrice:
                Number(value.monthlyPrice),

            dbHost:
                value.dbHost.trim(),

            dbPort:
                Number(value.dbPort),

            dbSchema:
                value.dbSchema.trim(),

            dbUsername:
                value.dbUsername.trim(),

            dbPassword:
                value.dbPassword

        };

    }


    /*
     * ======================================================
     * ERRORS
     * ======================================================
     */

    private getBackendErrorMessage(
        error: any,
        fallback: string
    ): string {

        return (
            error?.error?.message
            ||
            error?.error?.error
            ||
            error?.message
            ||
            fallback
        );

    }


    /*
     * ======================================================
     * HELPERS
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


    fieldError(
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
            control.hasError('maxlength')
        ) {

            return 'El valor ingresado es demasiado largo.';

        }


        if (
            control.hasError('min')
        ) {

            return 'El valor debe ser mayor o igual a 0.';

        }


        return 'Valor inválido.';

    }


    get title(): string {

        return this.isEdit
            ? 'Editar tenant'
            : 'Nuevo tenant';

    }


    get description(): string {

        return this.isEdit
            ? 'Modificá la configuración del tenant.'
            : 'Configurá los datos del nuevo tenant.';

    }

}
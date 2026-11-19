import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
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
import { PlatformTenant, TenantPais, TenantType } from '../../models/platform-tenant.model';


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

    // OnPush + campos planos (no signals) mutados dentro de callbacks de subscribe(): sin esto,
    // Angular nunca se entera de los cambios de loading/saving/errorMessage hechos ahí (no son un
    // @Input, no son el pipe async) y la vista se queda pegada en el skeleton de carga para
    // siempre, aunque el dato ya haya llegado -- bug real reportado 2026-11-10 ("no funciona la
    // edición de tenants": en realidad SÍ cargaba, pero nunca se veía).
    private readonly cdr =
        inject(ChangeDetectorRef);


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

            /*
             * Dominio del storefront (Ecommerce) -- obligatorio sólo si tenantType requiere
             * Ecommerce (ver applyTenantTypeRules), igual criterio que dbHost/erpSchema: un
             * tenant ERP puro no tiene storefront.
             */
            domain: [
                '',
                [
                    Validators.maxLength(255)
                ]
            ],

            /*
             * Inmutable después del alta (ver Javadoc de TenantPais) -- el control se
             * deshabilita en edición (ver ngOnInit) así que ni siquiera se puede intentar
             * cambiarlo desde esta pantalla.
             */
            pais: this.fb.nonNullable.control<TenantPais>(
                'ARGENTINA',
                [
                    Validators.required
                ]
            ),

            tenantType: this.fb.nonNullable.control<TenantType>(
                'ECOMMERCE',
                [
                    Validators.required
                ]
            ),

            erpSchema: [
                '',
                []
            ],

            /*
             * Distinto de `domain` (storefront): dominio con el que este
             * tenant está dado de alta del lado del ERP, usado por el botón
             * "Activar reverse proxy". Opcional en ambos casos (alta y
             * edición) — en esta etapa de testing no siempre se conoce todavía
             * al crear el tenant.
             */
            erpDomain: [
                '',
                [
                    Validators.maxLength(255)
                ]
            ],

            /*
             * Solo tiene efecto en el alta (el backend no lo usa en update():
             * el provisioning en el ERP es un paso único, al crear). Default
             * true: cliente nuevo normal, necesita los catálogos precargados.
             */
            seedBaseData: [
                true
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

            /*
             * Facturación por sucursal (plan negociado). Defaults para un tenant
             * nuevo: 1 sucursal incluida (la principal), precio extra 0 hasta
             * que el operador cargue el valor negociado real.
             */
            sucursalesIncluidas: [
                1,
                [
                    Validators.required,
                    Validators.min(0)
                ]
            ],

            precioPorSucursalExtra: [
                0,
                [
                    Validators.required,
                    Validators.min(0)
                ]
            ],

            /*
             * Costo adicional por activar la facturación electrónica AFIP (plan
             * negociado). Mismo criterio que precioPorSucursalExtra: 0 por default
             * hasta que el operador cargue el valor real.
             */
            precioFacturacionElectronica: [
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

        this.form.controls.tenantType
            .valueChanges
            .subscribe((type) => {

                this.applyTenantTypeRules(type);

            });


        this.applyTenantTypeRules(
            this.form.controls.tenantType.value
        );


        if (this.isEdit && this.tenantId) {

            // Inmutable después del alta -- deshabilitado (no solo de sólo lectura en la
            // plantilla) para que ni getRawValue() lo deje mandar por error.
            this.form.controls.pais.disable({
                emitEvent: false
            });

            this.loadTenant(
                Number(this.tenantId)
            );

        }

    }


    /*
     * ======================================================
     * TENANT TYPE
     * ======================================================
     */

    get requiresErpSchema(): boolean {

        const type =
            this.form.controls.tenantType.value;

        return type === 'ERP' || type === 'ECOMMERCE_ERP';

    }


    get requiresEcommerceConnection(): boolean {

        const type =
            this.form.controls.tenantType.value;

        return type === 'ECOMMERCE' || type === 'ECOMMERCE_ERP';

    }


    /**
     * El toggle de "sembrar datos base" solo tiene sentido al crear un
     * tenant con ERP: en edición el provisioning en el ERP ya pasó (es un
     * paso único), el backend lo ignora.
     */
    get showSeedBaseDataOption(): boolean {

        return !this.isEdit && this.requiresErpSchema;

    }


    /*
     * Habilita/deshabilita los campos que dependen del tenantType, siguiendo
     * el mismo criterio que valida PlatformTenantRequest en el backend:
     * erpSchema obligatorio solo si ERP/ECOMMERCE_ERP, datos de conexión de
     * Ecommerce obligatorios solo si ECOMMERCE/ECOMMERCE_ERP, y en ambos casos
     * el campo que no aplica se vacía (no solo se oculta).
     */
    private applyTenantTypeRules(
        type: TenantType
    ): void {

        const requiresErp =
            type === 'ERP' || type === 'ECOMMERCE_ERP';

        const requiresEcommerce =
            type === 'ECOMMERCE' || type === 'ECOMMERCE_ERP';


        const erpSchemaControl =
            this.form.controls.erpSchema;

        if (requiresErp) {

            erpSchemaControl.setValidators([
                Validators.required,
                Validators.maxLength(150)
            ]);

        } else {

            erpSchemaControl.clearValidators();

            erpSchemaControl.setValue('');

        }

        erpSchemaControl.updateValueAndValidity({
            emitEvent: false
        });

        // erpDomain es siempre opcional (a diferencia de erpSchema), pero
        // solo aplica si el tenant requiere ERP — se vacía igual que el resto
        // de los campos que no aplican al tipo elegido.
        if (!requiresErp) {

            this.form.controls.erpDomain.setValue('', {
                emitEvent: false
            });

        }


        this.form.controls.domain.setValidators(
            requiresEcommerce
                ? [Validators.required, Validators.maxLength(255)]
                : [Validators.maxLength(255)]
        );

        this.form.controls.dbHost.setValidators(
            requiresEcommerce
                ? [Validators.required, Validators.maxLength(255)]
                : []
        );

        this.form.controls.dbPort.setValidators(
            requiresEcommerce
                ? [Validators.required, Validators.min(1), Validators.max(65535)]
                : []
        );

        this.form.controls.dbSchema.setValidators(
            requiresEcommerce
                ? [Validators.required, Validators.maxLength(100)]
                : []
        );

        this.form.controls.dbUsername.setValidators(
            requiresEcommerce
                ? [Validators.required, Validators.maxLength(100)]
                : []
        );

        this.form.controls.dbPassword.setValidators(
            (requiresEcommerce && !this.isEdit)
                ? [Validators.required]
                : []
        );


        if (!requiresEcommerce) {

            this.form.patchValue({

                domain: '',

                dbHost: '',

                dbSchema: '',

                dbUsername: '',

                dbPassword: ''

            }, {
                emitEvent: false
            });

        }


        for (const control of [
            this.form.controls.domain,
            this.form.controls.dbHost,
            this.form.controls.dbPort,
            this.form.controls.dbSchema,
            this.form.controls.dbUsername,
            this.form.controls.dbPassword
        ]) {

            control.updateValueAndValidity({
                emitEvent: false
            });

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

                        domain: tenant.domain ?? '',

                        pais: tenant.pais,

                        tenantType: tenant.tenantType,

                        erpSchema: tenant.erpSchema ?? '',

                        erpDomain: tenant.erpDomain ?? '',

                        active: tenant.active,

                        webEnabled: tenant.webEnabled,

                        monthlyPrice:
                            tenant.monthlyPrice,

                        sucursalesIncluidas:
                            tenant.sucursalesIncluidas,

                        precioPorSucursalExtra:
                            tenant.precioPorSucursalExtra,

                        precioFacturacionElectronica:
                            tenant.precioFacturacionElectronica,

                        // Antes no se precargaban -- el backend no los devolvía (ver
                        // PlatformTenantSafeDataDTO) y acá tampoco se leían, así que "Editar
                        // tenant" siempre arrancaba con estos 3 campos vacíos y bloqueados por
                        // Validators.required, impidiendo guardar cualquier cambio sin
                        // re-escribirlos de memoria. dbPassword queda afuera a propósito (ver
                        // placeholder del campo): vacío en edición significa "conservar la actual".
                        dbHost:
                            tenant.dbHost ?? '',

                        dbPort:
                            tenant.dbPort ?? 3306,

                        dbSchema:
                            tenant.dbSchema ?? '',

                        dbUsername:
                            tenant.dbUsername ?? ''

                    });

                    /*
                     * El patchValue de arriba dispara valueChanges de
                     * tenantType, que ya vuelve a aplicar las reglas de
                     * campos obligatorios/opcionales según corresponda
                     * (incluida la password de BD, opcional en edición).
                     */

                    this.loading = false;

                    this.cdr.markForCheck();

                },

                error: (error: any) => {

                    this.loading = false;
                    console.log(error)
                    this.errorMessage =
                        'No se pudo cargar el tenant.';

                    this.cdr.markForCheck();

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

                    this.cdr.markForCheck();

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

                    this.cdr.markForCheck();

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

                    this.cdr.markForCheck();

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

                    this.cdr.markForCheck();

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

        const requiresErp =
            value.tenantType === 'ERP' ||
            value.tenantType === 'ECOMMERCE_ERP';

        const requiresEcommerce =
            value.tenantType === 'ECOMMERCE' ||
            value.tenantType === 'ECOMMERCE_ERP';


        return {

            code:
                value.code.trim(),

            name:
                value.name.trim(),

            domain:
                requiresEcommerce
                    ? value.domain.trim()
                    : null,

            /*
             * Sólo en alta -- en edición el control está disabled, pero igual se omite
             * explícitamente acá para no depender de ese detalle de la plantilla (ver Javadoc
             * de TenantPais: el backend lo ignora en update(), esto evita mandarlo sin razón).
             */
            pais:
                this.isEdit
                    ? undefined
                    : value.pais,

            active:
                value.active,

            webEnabled:
                value.webEnabled,

            monthlyPrice:
                Number(value.monthlyPrice),

            sucursalesIncluidas:
                Number(value.sucursalesIncluidas),

            precioPorSucursalExtra:
                Number(value.precioPorSucursalExtra),

            precioFacturacionElectronica:
                Number(value.precioFacturacionElectronica),

            tenantType:
                value.tenantType,

            erpSchema:
                requiresErp
                    ? value.erpSchema.trim()
                    : null,

            erpDomain:
                (requiresErp && value.erpDomain.trim())
                    ? value.erpDomain.trim()
                    : null,

            /*
             * Solo importa en alta y solo si requiere ERP; en edición o si no
             * requiere ERP, el backend lo ignora, así que no hace falta
             * complicarse mandando otra cosa.
             */
            seedBaseData:
                (!this.isEdit && requiresErp)
                    ? value.seedBaseData
                    : undefined,

            dbHost:
                requiresEcommerce
                    ? value.dbHost.trim()
                    : null,

            dbPort:
                requiresEcommerce
                    ? Number(value.dbPort)
                    : null,

            dbSchema:
                requiresEcommerce
                    ? value.dbSchema.trim()
                    : null,

            dbUsername:
                requiresEcommerce
                    ? value.dbUsername.trim()
                    : null,

            /*
             * En edición, dejar la password vacía significa "conservar la
             * actual" (el backend no la pisa si viene null/vacía). Fuera de
             * ese caso, si no aplica Ecommerce directamente no se manda.
             */
            dbPassword:
                requiresEcommerce
                    ? (value.dbPassword || null)
                    : null

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
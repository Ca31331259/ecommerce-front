import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    signal
} from '@angular/core';

import {
    FormBuilder,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';

import { PlatformLegacyMigrationService } from '../../services/platform-legacy-migration.service';
import { LegacyMigrationResult } from '../../models/legacy-migration.model';


interface ReportSection {

    key: string;

    title: string;

    rows: Record<string, unknown>[];

    columns: string[];

    isEmpty: boolean;

    /** true si esta sección debería venir vacía y no lo está (ej. FKs huérfanas). */
    unexpectedNonEmpty: boolean;

}


/**
 * Metadata de presentación para las secciones de reporte conocidas del
 * dry-run. Cualquier clave que devuelva el ERP y no esté acá igual se
 * renderiza (con su nombre tal cual), esto solo le pone un título legible y
 * marca cuál "debe dar vacío".
 */
const KNOWN_REPORT_SECTIONS: Record<string, { title: string; expectEmpty?: boolean }> = {

    catalogosTecnicosSinMatch: {
        title: 'Catálogos técnicos sin match'
    },

    localidadesSinMatch: {
        title: 'Localidades sin match'
    },

    cristalesNoMigrados: {
        title: 'Cristales no migrados'
    },

    codigosDuplicadosResueltos: {
        title: 'Códigos duplicados resueltos'
    },

    fkHuerfanosFinal: {
        title: 'FKs huérfanas finales',
        expectEmpty: true
    },

    comprobantesRenumerados: {
        title: 'Comprobantes renumerados'
    }

};


@Component({

    selector: 'app-platform-legacy-migration',

    standalone: true,

    imports: [
        ReactiveFormsModule
    ],

    templateUrl:
        './platform-legacy-migration.component.html',

    styleUrl:
        './platform-legacy-migration.component.scss',

    changeDetection:
        ChangeDetectionStrategy.OnPush

})
export class PlatformLegacyMigrationComponent {

    private readonly fb =
        inject(FormBuilder);

    private readonly migrationService =
        inject(PlatformLegacyMigrationService);


    readonly form =
        this.fb.nonNullable.group({

            code: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(50)
                ]
            ],

            sourceSchema: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(150)
                ]
            ]

        });


    readonly analyzing = signal(false);

    readonly committing = signal(false);

    readonly reimporting = signal(false);

    readonly analyzeResult = signal<LegacyMigrationResult | null>(null);

    readonly dryRunResult = signal<LegacyMigrationResult | null>(null);

    readonly commitResult = signal<LegacyMigrationResult | null>(null);

    readonly errorMessage = signal('');


    /**
     * Solo true si el último dry-run fue exitoso Y code/sourceSchema no
     * cambiaron desde entonces. El backend igual rechazaría un commit con un
     * fingerprint desactualizado, pero no tiene sentido dejar que la UI
     * ofrezca ese botón como si todavía correspondiera.
     */
    readonly dryRunSucceeded = signal(false);

    private lastDryRunParams: { code: string; sourceSchema: string } | null = null;


    readonly reportSections = computed(() =>
        this.buildSections(this.dryRunResult()?.report)
    );


    constructor() {

        this.form.valueChanges.subscribe(() => {

            const current = this.form.getRawValue();

            const stillMatchesLastDryRun =
                !!this.lastDryRunParams &&
                this.lastDryRunParams.code === current.code.trim() &&
                this.lastDryRunParams.sourceSchema === current.sourceSchema.trim();

            if (!stillMatchesLastDryRun) {
                this.dryRunSucceeded.set(false);
            }

        });

    }


    /*
     * ======================================================
     * ANALYZE + DRY-RUN
     * ======================================================
     */

    runAnalyzeAndDryRun(): void {

        if (this.form.invalid || this.analyzing()) {

            this.form.markAllAsTouched();

            return;

        }

        const { code, sourceSchema } =
            this.form.getRawValue();

        const trimmedCode = code.trim();
        const trimmedSchema = sourceSchema.trim();

        this.errorMessage.set('');
        this.analyzeResult.set(null);
        this.dryRunResult.set(null);
        this.commitResult.set(null);
        this.dryRunSucceeded.set(false);

        this.analyzing.set(true);

        this.migrationService
            .analyze(trimmedCode, trimmedSchema)
            .subscribe({

                next: (analyzeResult) => {

                    this.analyzeResult.set(analyzeResult);

                    this.runDryRun(trimmedCode, trimmedSchema);

                },

                error: (error) => {

                    this.analyzing.set(false);

                    this.errorMessage.set(
                        this.getBackendErrorMessage(
                            error,
                            'No se pudo analizar el schema legacy.'
                        )
                    );

                }

            });

    }


    private runDryRun(
        code: string,
        sourceSchema: string
    ): void {

        this.migrationService
            .dryRun(code, sourceSchema)
            .subscribe({

                next: (dryRunResult) => {

                    this.dryRunResult.set(dryRunResult);

                    this.lastDryRunParams = { code, sourceSchema };
                    this.dryRunSucceeded.set(true);

                    this.analyzing.set(false);

                },

                error: (error) => {

                    this.analyzing.set(false);

                    this.errorMessage.set(
                        this.getBackendErrorMessage(
                            error,
                            'No se pudo simular la migración (dry-run).'
                        )
                    );

                }

            });

    }


    /*
     * ======================================================
     * REIMPORTAR
     * ======================================================
     */

    /**
     * Vacía el `_ng` real del tenant y encadena directo a un dry-run nuevo (mismo patrón que
     * runAnalyzeAndDryRun) -- pedido real 2026-11-10: sincronizar un tenant cuyo legacy siguió
     * recibiendo carga después de su propia migración. Pide confirmación nativa dos veces a
     * propósito (texto distinto cada vez, no el mismo mensaje repetido): esto BORRA sin vuelta
     * atrás todo lo que haya en el `_ng` real, y es más destructivo que un commit normal (que al
     * menos exige un dry-run previo sobre el mismo fingerprint).
     */
    reimportar(): void {

        if (this.form.invalid || this.analyzing() || this.reimporting()) {

            this.form.markAllAsTouched();

            return;

        }

        const { code, sourceSchema } =
            this.form.getRawValue();

        const trimmedCode = code.trim();
        const trimmedSchema = sourceSchema.trim();

        const confirmado = window.confirm(
            `Esto BORRA todos los datos ya migrados en el schema del tenant '${trimmedCode}' `
            + `(usuarios, clientes, órdenes, ventas... todo lo que haya cargado la migración, `
            + `nunca los catálogos globales) para volver a traerlos desde cero con el estado `
            + `actual de '${trimmedSchema}'. Confirmá que nadie cargó nada real directamente en `
            + `el sistema nuevo todavía -- si lo hizo, cancelá esto y rescatalo aparte primero. `
            + `¿Continuar?`
        );

        if (!confirmado) {
            return;
        }

        this.errorMessage.set('');
        this.analyzeResult.set(null);
        this.dryRunResult.set(null);
        this.commitResult.set(null);
        this.dryRunSucceeded.set(false);

        this.reimporting.set(true);

        this.migrationService
            .reimport(trimmedCode, trimmedSchema, true)
            .subscribe({

                next: (analyzeResult) => {

                    this.reimporting.set(false);
                    this.analyzeResult.set(analyzeResult);
                    this.analyzing.set(true);

                    this.runDryRun(trimmedCode, trimmedSchema);

                },

                error: (error) => {

                    this.reimporting.set(false);

                    this.errorMessage.set(
                        this.getBackendErrorMessage(
                            error,
                            'No se pudo reimportar el tenant.'
                        )
                    );

                }

            });

    }


    /*
     * ======================================================
     * COMMIT
     * ======================================================
     */

    confirmMigration(): void {

        if (!this.dryRunSucceeded() || this.committing()) {
            return;
        }

        const { code, sourceSchema } =
            this.form.getRawValue();

        this.errorMessage.set('');
        this.committing.set(true);

        this.migrationService
            .commit(code.trim(), sourceSchema.trim())
            .subscribe({

                next: (result) => {

                    this.commitResult.set(result);
                    this.committing.set(false);

                    /*
                     * Un commit no es repetible sobre el mismo dry-run: si
                     * hiciera falta correr otro, va a hacer falta un dry-run
                     * nuevo (el backend lo exige por fingerprint de todas
                     * formas). Se deshabilita el botón para no invitar a
                     * un doble click aunque ya haya terminado.
                     */
                    this.dryRunSucceeded.set(false);

                },

                error: (error) => {

                    this.committing.set(false);

                    this.errorMessage.set(
                        this.getBackendErrorMessage(
                            error,
                            'No se pudo confirmar la migración.'
                        )
                    );

                }

            });

    }


    /*
     * ======================================================
     * REPORTES (genérico)
     * ======================================================
     */

    private buildSections(
        report: Record<string, unknown> | undefined | null
    ): ReportSection[] {

        if (!report) {
            return [];
        }

        const knownKeys = Object.keys(KNOWN_REPORT_SECTIONS);

        const otherKeys = Object.keys(report)
            .filter(key => !knownKeys.includes(key));

        const orderedKeys = [...knownKeys, ...otherKeys]
            .filter(key => key in report);

        return orderedKeys.map((key) => {

            const meta = KNOWN_REPORT_SECTIONS[key];
            const rows = this.asRows(report[key]);
            const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
            const isEmpty = rows.length === 0;

            return {
                key,
                title: meta?.title ?? key,
                rows,
                columns,
                isEmpty,
                unexpectedNonEmpty: !!meta?.expectEmpty && !isEmpty
            };

        });

    }


    /**
     * Normaliza cualquier forma que pueda venir en report[key] (lista de
     * objetos, lista de primitivos, un objeto suelto, un escalar) a filas de
     * tabla, sin asumir un tipo fijo por campo.
     */
    private asRows(
        value: unknown
    ): Record<string, unknown>[] {

        if (value === null || value === undefined) {
            return [];
        }

        if (Array.isArray(value)) {

            return value.map((item) =>
                (item !== null && typeof item === 'object' && !Array.isArray(item))
                    ? item as Record<string, unknown>
                    : { valor: item }
            );

        }

        if (typeof value === 'object') {
            return [value as Record<string, unknown>];
        }

        return [{ valor: value }];

    }


    objectEntries(
        value: Record<string, string> | null | undefined
    ): [string, string][] {

        return value ? Object.entries(value) : [];

    }


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

}

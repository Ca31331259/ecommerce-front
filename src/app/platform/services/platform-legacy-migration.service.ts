import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LegacyMigrationResult } from '../models/legacy-migration.model';

@Injectable({
    providedIn: 'root'
})
export class PlatformLegacyMigrationService {

    private readonly http = inject(HttpClient);

    private endpoint(
        code: string
    ): string {

        return `/api/platform/tenants/${code}/legacy-migration`;

    }


    analyze(
        code: string,
        sourceSchema: string
    ): Observable<LegacyMigrationResult> {

        return this.http.post<LegacyMigrationResult>(
            `${this.endpoint(code)}/analyze`,
            { sourceSchema }
        );

    }


    dryRun(
        code: string,
        sourceSchema: string
    ): Observable<LegacyMigrationResult> {

        return this.http.post<LegacyMigrationResult>(
            `${this.endpoint(code)}/dry-run`,
            { sourceSchema }
        );

    }


    /**
     * Baja definitiva de la simulación: ejecuta la migración real contra el
     * tenant. Nunca se debe llamar automáticamente después de un dry-run
     * exitoso — es responsabilidad del componente que consume este servicio
     * dispararlo solo ante una acción explícita del operador.
     */
    commit(
        code: string,
        sourceSchema: string
    ): Observable<LegacyMigrationResult> {

        return this.http.post<LegacyMigrationResult>(
            `${this.endpoint(code)}/commit`,
            { sourceSchema }
        );

    }


    /**
     * Vacía el `_ng` real del tenant y vuelve a analizarlo contra el legacy tal como está HOY --
     * pedido real 2026-11-10 (Contini): sincronizar un tenant cuyo legacy siguió recibiendo carga
     * después de su propia migración, repitiendo el ciclo completo en vez de migrar "la diferencia"
     * a mano. BORRA todo lo que haya en el `_ng` real -- el componente que llama esto tiene que
     * pedir confirmación explícita al operador antes, nunca mandar confirmarBorradoDeDatos=true
     * por defecto.
     */
    reimport(
        code: string,
        sourceSchema: string,
        confirmarBorradoDeDatos: boolean
    ): Observable<LegacyMigrationResult> {

        return this.http.post<LegacyMigrationResult>(
            `${this.endpoint(code)}/reimport`,
            { sourceSchema, confirmarBorradoDeDatos }
        );

    }

}

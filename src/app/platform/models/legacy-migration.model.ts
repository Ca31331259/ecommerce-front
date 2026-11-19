export interface LegacyMigrationRequest {

    sourceSchema: string;

}

/**
 * `report` es deliberadamente genérico: su forma exacta la define numecos-java
 * (catalogosTecnicosSinMatch, localidadesSinMatch, cristalesNoMigrados,
 * codigosDuplicadosResueltos, fkHuerfanosFinal, comprobantesRenumerados, y
 * posibles claves futuras) y el front la renderiza dinámicamente, sin
 * hardcodear tipos por campo.
 */
export interface LegacyMigrationResult {

    runId: string;

    status: string;

    report: Record<string, unknown>;

    /**
     * Solo viene poblado en la respuesta de commit(). Se muestra una única
     * vez al operador y nunca se persiste (ni en localStorage, ni se loguea).
     */
    passwordsTemporales?: Record<string, string> | null;

}

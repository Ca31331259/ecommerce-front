/**
 * Una fila del feed combinado de la sección "Logs" del detalle de tenant (pedido real,
 * 2026-10-17): mergea las mutaciones de Plataforma con el log de infraestructura del ERP.
 */
export type PlatformTenantLogOrigen = 'PLATAFORMA' | 'ERP';

export type PlatformTenantLogNivel = 'INFO' | 'WARNING' | 'ERROR';

export interface PlatformTenantLog {

    origen: PlatformTenantLogOrigen;

    tipo: string;

    nivel: PlatformTenantLogNivel;

    mensaje: string;

    /** Email del superadmin que ejecutó la acción -- null si fue el sistema, o si origen es ERP. */
    actor: string | null;

    creadoEn: string;

}

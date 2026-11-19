/**
 * Uso de un tenant tal como lo reporta el ERP en
 * GET /internal/tenants/{code}/usage. El backend lo reenvía dentro de
 * PlatformTenantUsage.uso sin transformarlo.
 */

export type ModuloErp =
    | 'IDENTIDAD'
    | 'CATALOGO'
    | 'ARMAZONES'
    | 'CRISTALES'
    | 'CONTACTOLOGIA'
    | 'PEDIDOS'
    | 'VENTAS'
    | 'FISCAL'
    | 'TESORERIA'
    | 'CONTABILIDAD'
    | 'REPORTES';

export interface TenantUsage {

    tenant: string;

    generadoEn: string;               // ISO-8601 instant

    sucursalesActivas: number;

    facturacionAfipHabilitada: boolean;

    estructura: {
        sucursalesTotales: number;
        puntosVentaActivos: number;
        puntosVentaConFacturaElectronica: number;
    };

    usuarios: {
        activos: number;
        conLoginUltimos90Dias: number;
        rolesActivos: number;
    };

    facturacion: {
        afipProduccion: boolean;
        certificadoValidoHasta: string | null;   // "yyyy-MM-dd"
        certificadoCuit: string | null;
        comprobantesMesActual: number;
        comprobantesElectronicosMesActual: number;
        comprobantesUltimos12Meses: number;
    };

    operacion: {
        ordenesTrabajoMesActual: number;
        ordenesTrabajoContactologiaMesActual: number;
        presupuestosMesActual: number;
    };

    datos: {
        clientesActivos: number;
        productosActivos: number;
        articulosActivos: number;
        registrosStock: number;
    };

    modulos: {
        enUso: ModuloErp[];
        contabilidadConAsientos: boolean;
    };

}

/**
 * Lo que devuelve GET /platform/tenants/{id}/usage: el uso del ERP (o el estado
 * de que no se pudo obtener) + la config de plan local + el monto extra
 * estimado (informativo, no hay cobro automático).
 */
export interface PlatformTenantUsage {

    disponible: boolean;

    error: string | null;

    uso: TenantUsage | null;

    sucursalesIncluidas: number;

    precioPorSucursalExtra: number;

    /** max(0, sucursalesActivas - sucursalesIncluidas). null si no hay uso. */
    sucursalesExtra: number | null;

    /** sucursalesExtra * precioPorSucursalExtra. null si no hay uso. */
    montoExtraEstimado: number | null;

}

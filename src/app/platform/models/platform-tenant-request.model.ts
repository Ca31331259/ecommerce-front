import { TenantPais, TenantType } from './platform-tenant.model';

export interface PlatformTenantRequest {

    code: string;

    name: string;

    /**
     * Dominio del storefront (Ecommerce): obligatorio si tenantType es ECOMMERCE o
     * ECOMMERCE_ERP, debe ir null/vacío si tenantType es ERP puro (mismo criterio que
     * dbHost/erpSchema).
     */
    domain: string | null;

    /**
     * Sólo tiene efecto en el alta -- el backend lo ignora en update() a propósito (ver Javadoc
     * de TenantPais). undefined en edición: no tiene sentido mandarlo.
     */
    pais?: TenantPais;

    active: boolean;

    webEnabled: boolean;

    monthlyPrice: number;

    /**
     * Facturación por sucursal (plan negociado por tenant). sucursalesIncluidas:
     * cuántas entran sin costo extra; precioPorSucursalExtra: precio de cada una
     * por encima de ese número.
     */
    sucursalesIncluidas: number;

    precioPorSucursalExtra: number;

    /** Costo adicional por activar la facturación electrónica AFIP de este tenant. */
    precioFacturacionElectronica: number;

    tenantType: TenantType;

    /**
     * Obligatorio si tenantType es ERP o ECOMMERCE_ERP; debe ir null/vacío
     * si tenantType es ECOMMERCE puro (mismo criterio que valida el backend).
     */
    erpSchema: string | null;

    /**
     * Solo aplica si tenantType requiere ERP. true (default si se omite) para
     * un alta normal, que necesita los catálogos precargados. false para un
     * cliente legacy que se va a migrar después con la pantalla "Migrar
     * cliente legacy": el schema tiene que quedar vacío, si no el commit de
     * la migración rechaza por "schema destino no vacío".
     */
    seedBaseData?: boolean;

    /**
     * Dominio con el que este tenant está dado de alta del lado del ERP
     * (reverse proxy + SSL en numecos-back/numecos-front) — distinto de
     * `domain` (storefront). Opcional: no todos los tenants ERP lo tienen
     * cargado todavía en esta etapa de testing.
     */
    erpDomain: string | null;

    /**
     * Datos de conexión de Ecommerce: obligatorios si tenantType es ECOMMERCE
     * o ECOMMERCE_ERP, deben ir null/vacíos si tenantType es ERP puro.
     */
    dbHost: string | null;

    dbPort: number | null;

    dbSchema: string | null;

    dbUsername: string | null;

    dbPassword: string | null;

}

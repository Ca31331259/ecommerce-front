export type SslStatus =
    | 'PENDING'
    | 'ACTIVE'
    | 'ERROR'
    | 'EXPIRED';

export type TenantType =
    | 'ECOMMERCE'
    | 'ERP'
    | 'ECOMMERCE_ERP';

/**
 * Se fija UNA sola vez al crear el tenant y nunca se edita después (pedido real, 2026-10-16: "no
 * quiero que se pueda cambiar dinámicamente... un tenant que se levanta como Paraguay después no
 * puede pasar a Argentina ni viceversa") -- determina, del lado del ERP, el catálogo geográfico y
 * fiscal que se muestra. Ver PlatformTenantFormComponent.
 */
export type TenantPais =
    | 'ARGENTINA'
    | 'PARAGUAY';

export type TenantLifecycleStatus =
    | 'PENDING_PROVISION'
    | 'ACTIVE'
    | 'SUSPENDED'
    | 'CANCELLED';

export type TenantDeploymentStatus =
    | 'CREATED'
    | 'DEPLOYING'
    | 'DEPLOYED'
    | 'ERROR';

export type TenantErpProvisioningStatus =
    | 'NOT_APPLICABLE'
    | 'PENDING'
    | 'PROVISIONING'
    | 'PROVISIONED'
    | 'ERROR';

export interface PlatformTenant {

    id: number;

    uuid: string;

    code: string;

    name: string;

    /** null para un tenant ERP puro (sin storefront) -- ver Javadoc de Tenant.domain. */
    domain: string | null;

    /** Inmutable después del alta -- ver Javadoc de TenantPais. */
    pais: TenantPais;

    active: boolean;

    webEnabled: boolean;

    monthlyPrice: number;

    /**
     * Facturación por sucursal (plan negociado por tenant). El ERP los consulta
     * vía /internal/tenants/{code}/billing-config para calcular cuánto facturar
     * de más — cálculo informativo, no hay motor de cobro.
     */
    sucursalesIncluidas: number;

    precioPorSucursalExtra: number;

    /**
     * Costo adicional por activar la facturación electrónica AFIP de este tenant (plan
     * negociado). Mismo criterio que precioPorSucursalExtra: el ERP lo consulta vía
     * /internal/tenants/{code}/billing-config antes de que el usuario active el certificado.
     */
    precioFacturacionElectronica: number;

    tenantType: TenantType;

    erpSchema: string | null;

    sslStatus: SslStatus;

    sslExpiresAt: string;

    lifecycleStatus: TenantLifecycleStatus;

    deploymentStatus: TenantDeploymentStatus;

    erpProvisioningStatus: TenantErpProvisioningStatus;

    /**
     * Solo aplica si tenantType requiere ERP: qué se usó (y se reusaría en un
     * reintento) para seedBaseData al provisionar. null si no aplica.
     */
    erpSeedBaseData: boolean | null;

    /**
     * Dominio con el que este tenant está dado de alta del lado del ERP
     * (reverse proxy + SSL en numecos-back/numecos-front) — distinto de
     * `domain` (storefront). Lo usa el botón "Activar reverse proxy". null si
     * todavía no se cargó.
     */
    erpDomain: string | null;

    /** No es secreto -- sólo el nombre del usuario de MySQL del storefront. null si el tenant no
     * requiere Ecommerce o no lo tiene cargado (ver botón "Resetear contraseña de conexión"). */
    dbUsername: string | null;

    /** Tampoco son secretos -- necesarios para precargar "Editar tenant" sin forzar al operador a
     * re-escribirlos de memoria (bug real 2026-11-10: antes el backend no los mandaba acá). */
    dbHost: string | null;

    dbPort: number | null;

    dbSchema: string | null;

    /**
     * true si el dato de conexión (dbPassword) de este tenant no se pudo
     * leer/descifrar en el backend. El resto de los campos igual están
     * disponibles; requiere revisión manual del lado del backend.
     */
    connectionDataCorrupted: boolean;

}

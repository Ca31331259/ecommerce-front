import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PlatformTenant } from '../models/platform-tenant.model';
import { PlatformTenantRequest } from '../models/platform-tenant-request.model';
import { PlatformTenantUsage } from '../models/platform-tenant-usage.model';
import { DeploymentResult, DeploymentStatus } from '../models/deployment-result.model';
import { DomainVerificationResult } from '../models/domain-verification-result.model';
import { CertificateStatus } from '../models/certificate-status.model';
import { DeploymentValidation } from '../models/deployment-validation.model';
import { DomainStatus } from '../models/domain-status.model';
import { DeploymentStatusResponse } from '../models/deployment-status.model';
import { PlatformPasswordReset } from '../models/platform-password-reset.model';
import { PlatformTenantLog } from '../models/platform-tenant-log.model';
@Injectable({
    providedIn: 'root'
})
export class PlatformTenantService {

    private readonly http = inject(HttpClient);

    private readonly endpoint =
        '/api/platform/tenants';

    /*
     * ======================================================
     * CRUD
     * ======================================================
     */

    list(): Observable<PlatformTenant[]> {

        return this.http.get<PlatformTenant[]>(
            this.endpoint
        );

    }

    get(
        id: number
    ): Observable<PlatformTenant> {

        return this.http.get<PlatformTenant>(
            `${this.endpoint}/${id}`
        );

    }

    create(
        request: PlatformTenantRequest
    ): Observable<PlatformTenant> {

        return this.http.post<PlatformTenant>(
            this.endpoint,
            request
        );

    }

    update(
        id: number,
        request: PlatformTenantRequest
    ): Observable<PlatformTenant> {

        return this.http.put<PlatformTenant>(
            `${this.endpoint}/${id}`,
            request
        );

    }

    delete(
        id: number
    ): Observable<void> {

        return this.http.delete<void>(
            `${this.endpoint}/${id}`
        );

    }

    /*
     * ======================================================
     * CICLO DE VIDA (activate / suspend / cancel)
     * ======================================================
     */

    activate(
        id: number
    ): Observable<PlatformTenant> {

        return this.http.post<PlatformTenant>(
            `${this.endpoint}/${id}/activate`,
            {}
        );

    }

    /**
     * Baja temporal y reversible (ej. falta de pago). Reemplaza al viejo
     * deactivate(): el backend ya no expone esa ruta.
     */
    suspend(
        id: number
    ): Observable<PlatformTenant> {

        return this.http.post<PlatformTenant>(
            `${this.endpoint}/${id}/suspend`,
            {}
        );

    }

    /**
     * Baja definitiva y NO reversible: el backend rechaza cualquier intento
     * posterior de activate() sobre un tenant CANCELLED.
     */
    cancel(
        id: number
    ): Observable<PlatformTenant> {

        return this.http.post<PlatformTenant>(
            `${this.endpoint}/${id}/cancel`,
            {}
        );

    }

    /**
     * Reintenta el provisioning en el ERP de un tenant en erpProvisioningStatus
     * ERROR. Reusa el mismo seedBaseData que se usó en el alta (lo decide el
     * backend, no se manda desde acá).
     */
    retryProvisioning(
        id: number
    ): Observable<PlatformTenant> {

        return this.http.post<PlatformTenant>(
            `${this.endpoint}/${id}/retry-provisioning`,
            {}
        );

    }

    /**
     * Activa el reverse proxy + SSL del tenant en el stack ERP, usando
     * erpDomain (no domain). Es seguro reintentar: si el DNS todavía no
     * propagó, el backend devuelve error pero no rompe nada — se puede volver
     * a llamar más tarde.
     */
    activarReverseProxy(
        id: number
    ): Observable<void> {

        return this.http.post<void>(
            `${this.endpoint}/${id}/activar-reverse-proxy`,
            {}
        );

    }

    /**
     * Resetea la contraseña del usuario "soporte" del ERP de este tenant (pedido real,
     * 2026-10-16). La contraseña nueva viaja en texto plano UNA sola vez en la respuesta.
     */
    resetPasswordSoporte(
        id: number
    ): Observable<PlatformPasswordReset> {

        return this.http.post<PlatformPasswordReset>(
            `${this.endpoint}/${id}/reset-password-soporte`,
            {}
        );

    }

    /**
     * Rota la contraseña del usuario de base de datos del tenant (storefront). El ALTER USER real
     * corre del lado del ERP -- ver Javadoc de PlatformTenantService.resetDbPassword(). La
     * contraseña nueva viaja en texto plano UNA sola vez en la respuesta.
     */
    resetDbPassword(
        id: number
    ): Observable<PlatformPasswordReset> {

        return this.http.post<PlatformPasswordReset>(
            `${this.endpoint}/${id}/reset-db-password`,
            {}
        );

    }

    /**
     * Vista de facturación: uso del ERP + config de plan local + monto extra
     * estimado. Nunca falla por el ERP — si está caído, `disponible` viene en
     * false con `error` seteado (el HTTP igual es 200).
     */
    usage(
        id: number
    ): Observable<PlatformTenantUsage> {

        return this.http.get<PlatformTenantUsage>(
            `${this.endpoint}/${id}/usage`
        );

    }

    /**
     * Sección "Logs" del detalle de tenant: feed combinado de mutaciones de Plataforma + eventos
     * de infraestructura del ERP, más recientes primero.
     */
    logs(
        id: number
    ): Observable<PlatformTenantLog[]> {

        return this.http.get<PlatformTenantLog[]>(
            `${this.endpoint}/${id}/logs`
        );

    }

    /*
     * ======================================================
     * DEPLOY
     * ======================================================
     */

    deploy(
        id: number
    ): Observable<DeploymentResult> {

        return this.http.post<DeploymentResult>(
            `${this.endpoint}/${id}/deploy`,
            {}
        );

    }

    redeploy(
        id: number
    ): Observable<void> {

        return this.http.post<void>(
            `${this.endpoint}/${id}/redeploy`,
            {}
        );

    }

    undeploy(
        id: number
    ): Observable<void> {

        return this.http.post<void>(
            `${this.endpoint}/${id}/undeploy`,
            {}
        );

    }

    /*
     * ======================================================
     * VALIDACIONES
     * ======================================================
     */

    validateDeployment(
        id: number
    ): Observable<DeploymentValidation> {

        return this.http.get<DeploymentValidation>(
            `${this.endpoint}/${id}/deployment/validate`
        );

    }

    deploymentStatus(
        id: number
    ): Observable<DeploymentStatusResponse> {

        return this.http.get<DeploymentStatusResponse>(
            `${this.endpoint}/${id}/deployment/status`
        );

    }

    /*
     * ======================================================
     * DOMINIO
     * ======================================================
     */

    verifyDomain(
        id: number
    ): Observable<DomainVerificationResult> {

        return this.http.post<DomainVerificationResult>(
            `${this.endpoint}/${id}/domain/verify`,
            {}
        );

    }

    domainStatus(
        id: number
    ): Observable<DomainStatus> {

        return this.http.get<DomainStatus>(
            `${this.endpoint}/${id}/domain/status`
        );

    }

    /*
     * ======================================================
     * SSL
     * ======================================================
     */

    requestSsl(
        id: number
    ): Observable<DeploymentResult> {

        return this.http.post<DeploymentResult>(
            `${this.endpoint}/${id}/ssl/request`,
            {}
        );

    }

    sslStatus(
        id: number
    ): Observable<CertificateStatus> {

        return this.http.get<CertificateStatus>(
            `${this.endpoint}/${id}/ssl/status`
        );

    }





}
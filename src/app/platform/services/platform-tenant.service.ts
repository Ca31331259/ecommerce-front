import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PlatformTenant } from '../models/platform-tenant.model';
import { PlatformTenantRequest } from '../models/platform-tenant-request.model';
import { DeploymentResult, DeploymentStatus } from '../models/deployment-result.model';
import { DomainVerificationResult } from '../models/domain-verification-result.model';
import { CertificateStatus } from '../models/certificate-status.model';
import { DeploymentValidation } from '../models/deployment-validation.model';
import { DomainStatus } from '../models/domain-status.model';
import { DeploymentStatusResponse } from '../models/deployment-status.model';
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
     * ACTIVAR / DESACTIVAR
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

    deactivate(
        id: number
    ): Observable<PlatformTenant> {

        return this.http.post<PlatformTenant>(
            `${this.endpoint}/${id}/deactivate`,
            {}
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
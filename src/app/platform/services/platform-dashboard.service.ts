import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { PlatformDashboard } from '../models/platform-dashboard.model';
import { PLATFORM_DASHBOARD_MOCK } from '../mock/platform-dashboard.mock';

@Injectable({
    providedIn: 'root'
})
export class PlatformDashboardService {

    private readonly http = inject(HttpClient);

private readonly endpoint =
    '/api/platform/dashboard';


    /**
     * Datos mock para desarrollo local.
     */
    getDashboardMock(): Observable<PlatformDashboard> {

        return of(
            PLATFORM_DASHBOARD_MOCK
        );

    }


    /**
     * Datos reales del backend.
     *
     * GET /platform/dashboard
     */
    getDashboard(): Observable<PlatformDashboard> {

        return this.http.get<PlatformDashboard>(
            this.endpoint
        );

    }

}
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfig } from '@core/config/api.config';

@Injectable({ providedIn: 'root' })
export class TenantService {

  private http = inject(HttpClient);

    private readonly config =
      inject(ApiConfig);

  loadTenant(domain: string) {
    return this.http.get<any>(
      `${this.config.baseUrl}/public/bootstrap?domain=${domain}`
    );
  }
}
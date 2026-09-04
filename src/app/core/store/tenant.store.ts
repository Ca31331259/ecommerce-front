import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TenantStore {

  tenant = signal<any>(null);

  site = signal<any>(null);

  setTenant(data: any) {

    this.tenant.set(
      data.tenant
    );

    this.site.set(
      data.site
    );

  }

  clear() {

    this.tenant.set(null);
    this.site.set(null);

  }

}
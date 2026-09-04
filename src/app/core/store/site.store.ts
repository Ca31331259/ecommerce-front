import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class SiteStore {

  private siteSignal =
    signal<any>(null);

  site =
    this.siteSignal.asReadonly();

  setSite(data: any) {

    this.siteSignal.set(data);

  }

}
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfig } from '@core/config/api.config';



@Injectable({
  providedIn: 'root'
})
export class PublicSiteService {

              private readonly config =
        inject(ApiConfig);

   //private api = 'http://localhost:8080';

  private http = inject(HttpClient);

  get() {

    return this.http.get<any>(
      this.config.baseUrl + '/site'
    );

  }
}
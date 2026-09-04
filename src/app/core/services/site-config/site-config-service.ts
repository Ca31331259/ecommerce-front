import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  GallerySize,
  SiteConfig,
  TenantBanner,
  TenantFeature,
  TenantGallery,
  TenantHome,
  TenantSection,
  TenantSettings,
  TenantTheme,
  UploadResponse,
  UploadType
} from '../../models/site-config';
import { ApiConfig } from '@core/config/api.config';


@Injectable({
  providedIn: 'root'
})
export class SiteConfigService {

  /* ======================================================
   * DEPENDENCIES
   * ====================================================== */

  private readonly http =
    inject(HttpClient);

            private readonly config =
      inject(ApiConfig);

  /* ======================================================
   * API
   * ====================================================== */

  private readonly api =
    this.config.baseUrl +'/admin/site';


  /* ======================================================
   * SITE
   * ====================================================== */

  get(): Observable<SiteConfig> {

    return this.http.get<SiteConfig>(
      this.api
    );

  }


  /* ======================================================
   * SETTINGS
   * ====================================================== */

  saveSettings(
    settings: TenantSettings
  ): Observable<TenantSettings> {

        console.log("ESTA ACA EN EL SERVICE SETTINGS",settings)
    return this.http.put<TenantSettings>(
      `${this.api}/settings`,
      settings
    );

  }


  /* ======================================================
   * HOME
   * ====================================================== */

  saveHome(
    home: TenantHome
  ): Observable<TenantHome> {
        console.log("ESTA ACA EN EL SERVICE HOME",home)
    return this.http.put<TenantHome>(
      `${this.api}/home`,
      home
    );
  }


  /* ======================================================
   * THEME
   * ====================================================== */

  saveTheme(
    theme: TenantTheme
  ): Observable<TenantTheme> {
    
    return this.http.put<TenantTheme>(
      `${this.api}/theme`,
      theme
    );

  }


  /* ======================================================
   * BANNERS
   * ====================================================== */

  getBanners(): Observable<TenantBanner[]> {

    return this.http.get<TenantBanner[]>(
      `${this.api}/banners`
    );

  }


  createBanner(): Observable<TenantBanner> {

    return this.http.post<TenantBanner>(
      `${this.api}/banners`,
      {}
    );

  }


  updateBanner(
    id: number,
    banner: TenantBanner
  ): Observable<TenantBanner> {

    return this.http.put<TenantBanner>(
      `${this.api}/banners/${id}`,
      banner
    );

  }


  deleteBanner(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.api}/banners/${id}`
    );

  }


  /* ======================================================
   * FEATURES
   * ====================================================== */

  getFeatures(): Observable<TenantFeature[]> {

    return this.http.get<TenantFeature[]>(
      `${this.api}/features`
    );

  }


  createFeature(): Observable<TenantFeature> {

    return this.http.post<TenantFeature>(
      `${this.api}/features`,
      {}
    );

  }


  updateFeature(
    id: number,
    feature: TenantFeature
  ): Observable<TenantFeature> {

    return this.http.put<TenantFeature>(
      `${this.api}/features/${id}`,
      feature
    );

  }


  deleteFeature(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.api}/features/${id}`
    );

  }


  /* ======================================================
   * GALLERY
   * ====================================================== */

  getGallery(): Observable<TenantGallery[]> {

    return this.http.get<TenantGallery[]>(
      `${this.api}/gallery`
    );

  }


  createGallery(): Observable<TenantGallery> {

    return this.http.post<TenantGallery>(
      `${this.api}/gallery`,
      {}
    );

  }


  updateGallery(
    id: number,
    gallery: TenantGallery
  ): Observable<TenantGallery> {

    return this.http.put<TenantGallery>(
      `${this.api}/gallery/${id}`,
      gallery
    );

  }


  deleteGallery(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.api}/gallery/${id}`
    );

  }


  /* ======================================================
   * SECTIONS
   * ====================================================== */

  getSections(): Observable<TenantSection[]> {

    return this.http.get<TenantSection[]>(
      `${this.api}/sections`
    );

  }


  updateSection(
    id: number,
    section: TenantSection
  ): Observable<TenantSection> {

    return this.http.put<TenantSection>(
      `${this.api}/sections/${id}`,
      section
    );

  }


  /* ======================================================
   * UPLOADS
   * ====================================================== */

  upload(
    file: File,
    type: UploadType
  ): Observable<UploadResponse> {

    const form =
      new FormData();

    form.append(
      'file',
      file
    );

    form.append(
      'type',
      type
    );
    let resp = this.http.post<UploadResponse>(
      `${this.api}/upload`,
      form
    );
    
 return resp;
  }


  updateSectionsOrder(
  sections: TenantSection[]
): Observable<void> {

  const order = sections.map(section => ({
    id: section.id,
    sortOrder: section.sortOrden
  }));

  console.log(
    'ORDEN A ENVIAR:',
    order
  );

  return this.http.put<void>(
    `${this.api}/sections/order`,
    order
  );

}
}
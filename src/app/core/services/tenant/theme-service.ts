import {

  Injectable,
  signal
} from '@angular/core';
import { TenantTheme } from '../../models/site-config/site-config.model';





@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly _theme =
    signal<TenantTheme | null>(null);



  readonly theme =
    this._theme.asReadonly();


  /*==========================================================
  APPLY THEME
  ==========================================================*/

  applyTheme(
    theme: TenantTheme
  ): void {

    if (!theme) {

      return;

    }

    this._theme.set(
      theme
    );


    const root =
      document.documentElement;


    root.style.setProperty(
      '--tenant-primary',
      theme.primary_color || '#1565C0'
    );


    root.style.setProperty(
      '--tenant-secondary',
      theme.secondary_color || '#0D47A1'
    );


    root.style.setProperty(
      '--tenant-accent',
      theme.accent_color ||
      theme.primary_color ||
      '#42A5F5'
    );


    root.style.setProperty(
      '--tenant-bg',
      '#ffffff'
    );


    root.style.setProperty(
      '--tenant-card',
      theme.cardBackground ||
      '#ffffff'
    );


    root.style.setProperty(
      '--tenant-text',
      theme.text_color ||
      '#333333'
    );


    root.style.setProperty(
      '--tenant-title',
      theme.title_color ||
      theme.text_color ||
      '#111111'
    );


    root.style.setProperty(
      '--tenant-button-text',
      theme.buttonTextColor ||
      '#ffffff'
    );


    root.style.setProperty(
      '--tenant-header',
      theme.headerBackground ||
      '#ffffff'
    );


    root.style.setProperty(
      '--tenant-footer',
      theme.footerBackground ||
      '#f7f7f7'
    );


    root.style.setProperty(
      '--tenant-font',
      theme.fontFamily ||
      'Roboto, sans-serif'
    );


    root.style.setProperty(
      '--tenant-radius',
      `${theme.borderRadius ?? 12}px`
    );


    this.applyFavicon(
      theme.favicon_url
    );

  }


  /*==========================================================
  FAVICON
  ==========================================================*/

  private applyFavicon(
    faviconUrl?: string | null
  ): void {

    if (!faviconUrl) {

      return;

    }


    let favicon =
      document.querySelector<HTMLLinkElement>(
        'link[rel="icon"]'
      );


    if (!favicon) {

      favicon =
        document.createElement(
          'link'
        );

      favicon.rel =
        'icon';

      document.head.appendChild(
        favicon
      );

    }


    favicon.href =
      faviconUrl;

  }

}
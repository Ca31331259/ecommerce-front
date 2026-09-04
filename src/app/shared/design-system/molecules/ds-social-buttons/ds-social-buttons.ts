import {
  Component,
  HostBinding,
  Input
} from '@angular/core';

export type DsSocialButtonSize =
  | 'sm'
  | 'md'
  | 'lg';

export type DsSocialButtonVariant =
  | 'default'
  | 'light'
  | 'dark';

@Component({
  selector: 'ds-social-buttons',
  standalone: true,
  templateUrl: './ds-social-buttons.html',
  styleUrl: './ds-social-buttons.scss'
})
export class DsSocialButtons {

  @Input()
  facebook?: string;

  @Input()
  instagram?: string;

  @Input()
  youtube?: string;

  @Input()
  linkedin?: string;

  @Input()
  tiktok?: string;

  @Input()
  whatsapp?: string;

  @Input()
  whatsappMessage?: string;

  @Input()
  size: DsSocialButtonSize = 'md';

  @Input()
  variant: DsSocialButtonVariant = 'default';

  @HostBinding('class.size-sm')
  get small(): boolean {
    return this.size === 'sm';
  }

  @HostBinding('class.size-md')
  get medium(): boolean {
    return this.size === 'md';
  }

  @HostBinding('class.size-lg')
  get large(): boolean {
    return this.size === 'lg';
  }

  @HostBinding('class.variant-default')
  get defaultVariant(): boolean {
    return this.variant === 'default';
  }

  @HostBinding('class.variant-light')
  get lightVariant(): boolean {
    return this.variant === 'light';
  }

  @HostBinding('class.variant-dark')
  get darkVariant(): boolean {
    return this.variant === 'dark';
  }

  abrir(url?: string): void {

    if (!url) {
      return;
    }

    window.open(
      url,
      '_blank',
      'noopener,noreferrer'
    );

  }

  abrirWhatsapp(): void {

    if (!this.whatsapp) {
      return;
    }

    const numero =
      this.whatsapp.replace(/\D/g, '');

    const mensaje =
      encodeURIComponent(
        this.whatsappMessage ??
        'Hola, quisiera realizar una consulta.'
      );

    this.abrir(
      `https://wa.me/${numero}?text=${mensaje}`
    );

  }

}
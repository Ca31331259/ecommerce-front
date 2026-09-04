import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  TenantHome
} from '../../../core/models/site-config';

import {
  AdminButton,
  AdminField,
  AdminFormCard,
  AdminFormCardFooterDirective,
  AdminFormGrid,
  AdminFormPreview,
  AdminInputDirective,
  AdminUpload,
  AdminUploadMetaDirective
} from '@shared/design-system-admin';
import { AdminSelect, AdminSelectOption } from '@shared/design-system-admin/forms/admin-select/admin-select';


import {

  PLACEHOLDER_IMAGES,
  resolveImage,

} from '@shared/placeholders';
import { AdminTextareaDirective } from '@shared/design-system-admin/forms/admin-textarea';

@Component({
  selector: 'app-home-form',
  standalone: true,
  imports: [
    FormsModule,

    AdminFormCard,
    AdminFormCardFooterDirective,
    AdminFormPreview,
    AdminFormGrid,
    AdminField,
    AdminInputDirective,
    AdminTextareaDirective,
    AdminUpload,
    AdminUploadMetaDirective,
    AdminSelect,
    AdminButton
  ],
  templateUrl: './home-form.html',
  styleUrl: './home-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeForm implements OnChanges {

  readonly placeholder =
    PLACEHOLDER_IMAGES;

  readonly CUSTOM_LINK = '__CUSTOM__';

  heroLinkType = '#contact';

  aboutLinkType = '#about';

ctaLinkType = '#contact';

  resolveImage =
    resolveImage;

  heroCustomUrl = false;

  aboutCustomUrl = false;

  ctaCustomUrl = false;

  /* ======================================================
   * INPUTS
   * ====================================================== */

  @Input({
    required: true
  })
  home!: TenantHome;


  /* ======================================================
   * OUTPUTS
   * ====================================================== */

  @Output()
  readonly save =
    new EventEmitter<TenantHome>();


  @Output()
  readonly heroUpload =
    new EventEmitter<File>();


  @Output()
  readonly aboutUpload =
    new EventEmitter<File>();


  @Output()
  readonly heroBackgroundUpload =
    new EventEmitter<File>();


  @Output()
  readonly heroVideoUpload =
    new EventEmitter<File>();




  readonly heroAlignmentOptions: AdminSelectOption[] = [

    {
      value: 'LEFT',
      label: 'Izquierda'
    },

    {
      value: 'CENTER',
      label: 'Centro'
    },

    {
      value: 'RIGHT',
      label: 'Derecha'
    }

  ];

  readonly heroHeightOptions: AdminSelectOption[] = [

    {
      value: 'SMALL',
      label: 'Compacto'
    },

    {
      value: 'MEDIUM',
      label: 'Mediano'
    },

    {
      value: 'FULLSCREEN',
      label: 'Pantalla completa'
    }

  ];

  readonly heroBackgroundOptions: AdminSelectOption[] = [

    {
      value: 'GRADIENT',
      label: 'Gradiente'
    },

    {
      value: 'IMAGE',
      label: 'Imagen'
    },

    {
      value: 'VIDEO',
      label: 'Video'
    }

  ];

  readonly heroImageStyleOptions: AdminSelectOption[] = [

    {
      value: 'NONE',
      label: 'Sin estilo'
    },

    {
      value: 'NORMAL',
      label: 'Normal'
    },

    {
      value: 'ROUNDED',
      label: 'Bordes redondeados'
    },

    {
      value: 'CIRCLE',
      label: 'Circular'
    },

    {
      value: 'FLOATING',
      label: 'Flotante'
    },

    {
      value: 'DEVICE_FRAME',
      label: 'Marco de dispositivo'
    }

  ];


  readonly anchorOptions: AdminSelectOption[] = [

    {
      value: '#hero',
      label: 'Hero'
    },

    {
      value: '#about',
      label: 'Nosotros'
    },

    {
      value: '#benefits',
      label: 'Beneficios'
    },

    {
      value: '#gallery',
      label: 'Galería'
    },

    {
      value: '#products',
      label: 'Productos'
    },

    {
      value: '#contact',
      label: 'Contacto'
    },

    {
      value: '__CUSTOM__',
      label: 'URL personalizada...'
    }

  ];


  /* ======================================================
   * ACTIONS
   * ====================================================== */

  saveHome(): void {

    if (
      this.heroLinkType === this.CUSTOM_LINK &&
      !this.home.heroButtonLink
    ) {

      return;

    }

    this.save.emit(this.home);

  }


ngOnChanges(): void {

  this.heroLinkType =
    this.resolveLinkType(this.home.heroButtonLink);

  this.aboutLinkType =
    this.resolveLinkType(this.home.aboutButtonLink);

  this.ctaLinkType =
    this.resolveLinkType(this.home.ctaButtonLink);

}

private resolveLinkType(
  value?: string | null
): string {

  return value?.startsWith('#')
    ? value
    : this.CUSTOM_LINK;

}

  /* ======================================================
   * UPLOADS
   * ====================================================== */

  uploadHero(
    file: File
  ): void {

    this.heroUpload.emit(
      file
    );

  }


  uploadAbout(
    file: File
  ): void {

    this.aboutUpload.emit(
      file
    );

  }


  uploadHeroBackground(
    file: File
  ): void {

    this.heroBackgroundUpload.emit(
      file
    );

  }


  uploadHeroVideo(
    file: File
  ): void {

    this.heroVideoUpload.emit(
      file
    );

  }



  isCustomLink(
    value: string | null | undefined
  ): boolean {

    if (!value) {

      return false;

    }

    return !value.startsWith('#');

  }

  selectLink(
    value: string,
    setter: (value: string) => void
  ): void {

    if (value === '__CUSTOM__') {

      setter('');

      return;

    }

    setter(value);

  }


onHeroLinkChange(value: string): void {

  console.log('Seleccionado:', value);

  this.heroLinkType = value;

  if (value === this.CUSTOM_LINK) {

    this.home.heroButtonLink = '';

    return;

  }

  this.home.heroButtonLink = value;

}

onAboutLinkChange(value: string): void {

  this.aboutLinkType = value;

  if (value === this.CUSTOM_LINK) {

    this.home.aboutButtonLink = '';

    return;

  }

  this.home.aboutButtonLink = value;

}

onCtaLinkChange(value: string): void {

  this.ctaLinkType = value;

  if (value === this.CUSTOM_LINK) {

    this.home.ctaButtonLink = '';

    return;

  }

  this.home.ctaButtonLink = value;

}
}
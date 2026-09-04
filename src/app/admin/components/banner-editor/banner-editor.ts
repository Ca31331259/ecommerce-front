import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { AdminSection, AdminSectionActionsDirective } from '../../../shared/design-system-admin/layout/admin-section';

import { AdminFormGrid } from '../../../shared/design-system-admin/forms/admin-form-grid';
import { AdminField } from '../../../shared/design-system-admin/forms/admin-field';


import { AdminUpload } from '../../../shared/design-system-admin/forms/admin-upload';
import { AdminColorPicker } from '../../../shared/design-system-admin/forms/admin-color-picker';

import { AdminInputDirective } from '../../../shared/design-system-admin/forms/admin-input';
import { AdminTextareaDirective } from '../../../shared/design-system-admin/forms/admin-textarea';

import { AdminButton } from '@shared/design-system-admin/actions';
import { AdminSwitch } from '@shared/design-system-admin/forms/admin-switch/admin-switch';
import { AdminFormCard, AdminFormCardActionsDirective, AdminFormPreview, AdminSaveBar } from '@shared/design-system-admin';
import { TenantBanner } from '../../../core/models/site-config';

import {
  AdminSelect,
  AdminSelectOption
} from '@shared/design-system-admin/forms/admin-select/admin-select';

import {

  PLACEHOLDER_IMAGES,
  resolveImage,

} from '@shared/placeholders';



@Component({
  selector: 'app-banner-editor',
  standalone: true,
  imports: [

    CommonModule,
    FormsModule,
    AdminSelect,
    AdminSection,
    AdminFormCard,
    AdminFormGrid,
    AdminField,
    AdminSaveBar,
    AdminButton,
    AdminUpload,
    AdminColorPicker,
    AdminSwitch,
     AdminFormPreview,
    AdminFormCardActionsDirective,
    AdminSectionActionsDirective,
    AdminInputDirective,
    AdminTextareaDirective

  ],
  templateUrl: './banner-editor.html',
  styleUrl: './banner-editor.scss'
})
export class BannerEditor {

  readonly placeholder =
    PLACEHOLDER_IMAGES;

     resolveImage =
    resolveImage;


    readonly CUSTOM_LINK = '__CUSTOM__';

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
    value: this.CUSTOM_LINK,
    label: 'URL personalizada...'
  }

];

linkTypes: Record<number, string> = {};

 

  @Input({ required: true })
  banners: TenantBanner[] = [];

  @Output()
  readonly create =
    new EventEmitter<void>();

  @Output()
  readonly save =
    new EventEmitter<TenantBanner>();

    @Output()
    dirtyChange =
    new EventEmitter<boolean>();
    
  @Output()
  readonly delete =
    new EventEmitter<TenantBanner>();

  @Output()
  readonly upload =
    new EventEmitter<{
      banner: TenantBanner;
      file: File;
    }>();

  /*======================================================
  CREATE
  ======================================================*/

  createBanner(): void {

    this.create.emit();

  }

  /*======================================================
  SAVE
  ======================================================*/

  saveBanner(
    banner: TenantBanner
  ): void {

    this.save.emit(
      banner
    );

  }

  /*======================================================
  DELETE
  ======================================================*/

  deleteBanner(
    banner: TenantBanner
  ): void {

    this.delete.emit(
      banner
    );

  }

  /*======================================================
  UPLOAD
  ======================================================*/

  uploadBanner(
    banner: TenantBanner,
    file: File
  ): void {

    this.upload.emit({

      banner,

      file

    });

  }

  markDirty(): void {

    this.dirtyChange.emit(true);

}


resolveLinkType(
  banner: TenantBanner
): string {

  if (!this.linkTypes[banner.id]) {

    this.linkTypes[banner.id] =
      banner.buttonLink?.startsWith('#')
        ? banner.buttonLink
        : this.CUSTOM_LINK;

  }

  return this.linkTypes[banner.id];

}


onBannerLinkChange(
  banner: TenantBanner,
  value: string
): void {

  this.linkTypes[banner.id] = value;

  if (value === this.CUSTOM_LINK) {

    banner.buttonLink = '';

  } else {

    banner.buttonLink = value;

  }

  this.markDirty();

}
}
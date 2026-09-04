import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  TenantHome,
  TenantSettings,
  TenantTheme
} from '../../../core/models/site-config';

import {
  AdminButton,
  AdminColorPicker,
  AdminField,
  AdminFormCard,
  AdminFormCardFooterDirective,
  AdminFormGrid,
  AdminFormPreview,
  AdminSelect,
  AdminUpload,
  AdminUploadMetaDirective
} from '@shared/design-system-admin';


import {

  FONT_FAMILY_OPTIONS,

  BORDER_RADIUS_OPTIONS

} from '@shared/design-system-admin';


import {

  PLACEHOLDER_IMAGES,
  resolveImage,

} from '@shared/placeholders';

@Component({
  selector: 'app-theme-form',
  standalone: true,
  imports: [
    FormsModule,

    AdminFormCard,
    AdminFormCardFooterDirective,
    AdminFormPreview,
    AdminFormGrid,
    AdminField,

    AdminColorPicker,
    AdminSelect,
    AdminUpload,
    AdminUploadMetaDirective,

    AdminButton
  ],
  templateUrl: './theme-form.html',
  styleUrl: './theme-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeForm {

  readonly fontFamilyOptions =
    FONT_FAMILY_OPTIONS;

  readonly borderRadiusOptions =
    BORDER_RADIUS_OPTIONS;


  readonly placeholder =
    PLACEHOLDER_IMAGES;

  resolveImage =
    resolveImage;

  /* ======================================================
   * INPUTS
   * ====================================================== */

  @Input({
    required: true
  })
  theme!: TenantTheme;


  @Input({
    required: true
  })
  settings!: TenantSettings;


  @Input({
    required: true
  })
  home!: TenantHome;


  /* ======================================================
   * OUTPUTS
   * ====================================================== */

  @Output()
  readonly save =
    new EventEmitter<TenantTheme>();


  @Output()
  readonly logoUpload =
    new EventEmitter<File>();


  @Output()
  readonly faviconUpload =
    new EventEmitter<File>();


  /* ======================================================
   * ACTIONS
   * ====================================================== */

  saveTheme(): void {
    console.log(this.theme)
    this.save.emit(
      this.theme
    );

  }


  /* ======================================================
   * UPLOADS
   * ====================================================== */

  uploadLogo(
    file: File
  ): void {

    this.logoUpload.emit(
      file
    );

  }


  uploadFavicon(
    file: File
  ): void {

    this.faviconUpload.emit(
      file
    );

  }

}
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


import { AdminUpload, AdminUploadMetaDirective } from '../../../shared/design-system-admin/forms/admin-upload';

import { AdminInputDirective } from '../../../shared/design-system-admin/forms/admin-input';
import { AdminButton, AdminFormCard, AdminFormCardActionsDirective, AdminFormPreview, AdminSaveBar } from '@shared/design-system-admin';
import { AdminSwitch } from '@shared/design-system-admin/forms/admin-switch/admin-switch';
import { TenantGallery } from '../../../core/models/site-config';

import {
  AdminSelect,
  AdminSelectOption
} from '@shared/design-system-admin/forms/admin-select/admin-select';


import {

  PLACEHOLDER_IMAGES,
  resolveImage,

} from '@shared/placeholders';
import { AdminImageCropper } from '@shared/design-system-admin/media/admin-image-cropper/admin-image-cropper';



@Component({
  selector: 'app-gallery-editor',
  standalone: true,
  imports: [

    CommonModule,
    FormsModule,
    AdminSection,
    AdminFormCard,
    AdminFormGrid,
    AdminField,
    AdminFormCardActionsDirective,
    AdminButton,
    AdminSwitch,
    AdminSaveBar,
    AdminSelect,
    AdminSectionActionsDirective,
    AdminUpload,
    AdminImageCropper,
    AdminInputDirective,
     AdminFormPreview,
    AdminUploadMetaDirective


  ],
  templateUrl: './gallery-editor.html',
  styleUrl: './gallery-editor.scss'
})
export class GalleryEditor {

  readonly placeholder =
    PLACEHOLDER_IMAGES;

  resolveImage =
    resolveImage;

  readonly sizeOptions: AdminSelectOption[] = [

    {
      value: 'SMALL',
      label: 'Pequeña'
    },

    {
      value: 'MEDIUM',
      label: 'Mediana'
    },

    {
      value: 'LARGE',
      label: 'Grande'
    }

  ];

  @Input({ required: true })
  gallery: TenantGallery[] = [];

  @Output()
  readonly create =
    new EventEmitter<void>();

  @Output()
  readonly save =
    new EventEmitter<TenantGallery>();

  @Output()
  readonly delete =
    new EventEmitter<TenantGallery>();

  @Output()
  readonly upload =
    new EventEmitter<{
      gallery: TenantGallery;
      file: File;
    }>();


  @Output()
  readonly thumbnailUpload =
    new EventEmitter<{
      gallery: TenantGallery;
      file: File;
    }>();

    @Output()
readonly saveThumbnailRequested =
  new EventEmitter<{
    gallery: TenantGallery;
    image: File;
    thumbnail: File;
  }>();

  thumbnailMode: Record<number, boolean> = {};


  cropperVisible = false;

  imageChangedEvent: any;

  galleryEditing?: TenantGallery;

  originalImage?: File;

  /*======================================================
  CREATE
  ======================================================*/

  createGallery(): void {

    this.create.emit();

  }

  /*======================================================
  SAVE
  ======================================================*/

  saveGallery(
    gallery: TenantGallery
  ): void {

    this.save.emit(gallery);

  }

  /*======================================================
  DELETE
  ======================================================*/

  deleteGallery(
    gallery: TenantGallery
  ): void {

    this.delete.emit(gallery);

  }

  /*======================================================
  UPLOAD
  ======================================================*/

uploadImage(
  gallery: TenantGallery,
  file: File
): void {

  this.galleryEditing = gallery;

  this.originalImage = file;

  const dt = new DataTransfer();

  dt.items.add(file);

  this.imageChangedEvent = {

    target: {

      files: dt.files

    }

  };

  this.cropperVisible = true;

}

  resolveThumbnailMode(
    gallery: TenantGallery
  ): boolean {

    if (this.thumbnailMode[gallery.id] == null) {

      this.thumbnailMode[gallery.id] =
        !gallery.thumbnailUrl;

    }

    return this.thumbnailMode[gallery.id];

  }

  onThumbnailModeChange(
    gallery: TenantGallery,
    useMain: boolean
  ): void {

    this.thumbnailMode[gallery.id] = useMain;

    if (useMain) {

      gallery.thumbnailUrl =
        gallery.imageUrl;

    }

  }


  uploadThumbnail(
    gallery: TenantGallery,
    file: File
  ): void {

    this.thumbnailUpload.emit({

      gallery,

      file

    });

  }

saveThumbnail(
  thumbnail: File
): void {

  if (!this.galleryEditing || !this.originalImage) {

    return;

  }

  this.saveThumbnailRequested.emit({

    gallery: this.galleryEditing,

    image: this.originalImage,

    thumbnail

  });

  this.cropperVisible = false;

}

  closeCropper(): void {

    this.cropperVisible = false;

    this.galleryEditing = undefined;

  }
}
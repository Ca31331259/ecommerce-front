import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ImageCropperComponent,
  ImageCroppedEvent
} from 'ngx-image-cropper';
import { AdminButton } from '@shared/design-system-admin/actions';
import { AdminFormCard } from '@shared/design-system-admin/cards';

@Component({
  selector: 'admin-image-cropper',
  standalone: true,
  imports: [
    CommonModule,
    ImageCropperComponent,
    AdminButton,
    AdminFormCard
  ],
  templateUrl: './admin-image-cropper.html',
  styleUrl: './admin-image-cropper.scss'
})
export class AdminImageCropper {

  @Input()
  imageChangedEvent: any;

  @Input()
  aspectRatio = 1;

  @Output()
  cancel =
    new EventEmitter<void>();

  @Output()
  save =
    new EventEmitter<File>();

  croppedBlob?: Blob;

  imageCropped(
    event: ImageCroppedEvent
  ): void {

    this.croppedBlob =
      event.blob ?? undefined;

  }

saveCrop(): void {

  console.log('saveCrop');

  if (!this.croppedBlob) {

    console.log('NO HAY BLOB');
    return;

  }

  console.log('EMITIENDO SAVE');

  this.save.emit(
    new File(
      [this.croppedBlob],
      'thumbnail.webp',
      {
        type: this.croppedBlob.type
      }
    )
  );

}

}
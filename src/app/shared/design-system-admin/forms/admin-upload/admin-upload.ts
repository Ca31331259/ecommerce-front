import {
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild
} from '@angular/core';

import {
  AdminUploadMetaDirective
} from './directives/admin-upload-meta.directive';

export type AdminUploadVariant =
  | 'image'
  | 'file';

export type AdminUploadSize =
  | 'sm'
  | 'md'
  | 'lg';

@Component({
  selector: 'admin-upload',
  standalone: true,
  templateUrl: './admin-upload.html',
  styleUrl: './admin-upload.scss',
  host: {
    '[attr.variant]': 'variant',
    '[attr.size]': 'size',
    '[attr.loading]': 'loading ? "" : null',
    '[attr.invalid]': 'error ? "" : null',
    '[attr.disabled]': 'disabled ? "" : null',
    '[attr.dragging]': 'dragging ? "" : null'
  }
})
export class AdminUpload {

  @Input()
  accept = 'image/*';

  @Input()
  previewUrl?: string | null;

  @Input()
  fileName?: string | null;

  @Input()
  error?: string | null;

  @Input()
  loading = false;

  @Input()
  disabled = false;

  @Input()
  multiple = false;

  @Input()
  variant: AdminUploadVariant = 'image';

  @Input()
  size: AdminUploadSize = 'md';

  @Output()
  readonly fileSelected = new EventEmitter<File>();

  @Output()
  readonly filesSelected = new EventEmitter<File[]>();

  @Output()
  readonly remove = new EventEmitter<void>();

  @ViewChild('fileInput')
  private fileInput?: ElementRef<HTMLInputElement>;

  @ContentChildren(AdminUploadMetaDirective)
  readonly metadata!: QueryList<AdminUploadMetaDirective>;

  dragging = false;

  openFileDialog(): void {

    if (
      this.disabled ||
      this.loading
    ) {

      return;

    }

    this.fileInput
      ?.nativeElement
      .click();

  }

  onFileInputChange(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    const files =
      Array.from(input.files ?? []);

    this.emitFiles(files);

    input.value = '';

  }

  onDragOver(
    event: DragEvent
  ): void {

    event.preventDefault();

    if (
      this.disabled ||
      this.loading
    ) {

      return;

    }

    this.dragging = true;

  }

  onDragLeave(
    event: DragEvent
  ): void {

    event.preventDefault();

    this.dragging = false;

  }

  onDrop(
    event: DragEvent
  ): void {

    event.preventDefault();

    this.dragging = false;

    if (
      this.disabled ||
      this.loading
    ) {

      return;

    }

    const files =
      Array.from(
        event.dataTransfer?.files ?? []
      );

    this.emitFiles(files);

  }

  onRemove(
    event: MouseEvent
  ): void {

    event.stopPropagation();

    if (
      this.disabled ||
      this.loading
    ) {

      return;

    }

    this.remove.emit();

  }

  private emitFiles(
    files: File[]
  ): void {

    if (!files.length) {

      return;

    }

    if (this.multiple) {

      this.filesSelected.emit(files);

      return;

    }

    this.fileSelected.emit(files[0]);

  }

}
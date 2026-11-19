import {
  Component,
  Inject
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import {
  AdminConfirmDialogData,
  AdminConfirmDialogVariant
} from './admin-confirm-dialog.types';

@Component({
  selector: 'admin-confirm-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-confirm-dialog.html',
  styleUrl: './admin-confirm-dialog.scss',
  host: {
    '[attr.variant]': 'variant'
  }
})
export class AdminConfirmDialog {

  readonly variant: AdminConfirmDialogVariant;

  readonly title: string;

  readonly description?: string;

  readonly icon: string;

  readonly confirmLabel: string;

  readonly cancelLabel: string;

  readonly confirmationText?: string;

  readonly confirmationLabel?: string;

  typed = '';

  constructor(
    private readonly dialogRef:
      MatDialogRef<
        AdminConfirmDialog,
        boolean
      >,

    @Inject(MAT_DIALOG_DATA)
    readonly data: AdminConfirmDialogData
  ) {

    this.variant =
      data.variant ?? 'primary';

    this.title =
      data.title;

    this.description =
      data.description;

    this.icon =
      data.icon ??
      this.resolveIcon(this.variant);

    this.confirmLabel =
      data.confirmLabel ?? 'Confirmar';

    this.cancelLabel =
      data.cancelLabel ?? 'Cancelar';

    this.confirmationText =
      data.confirmationText;

    this.confirmationLabel =
      data.confirmationLabel;

  }

  get confirmDisabled(): boolean {

    return !!this.confirmationText
      && this.typed !== this.confirmationText;

  }

  confirm(): void {

    if (this.confirmDisabled) {
      return;
    }

    this.dialogRef.close(true);

  }

  cancel(): void {

    this.dialogRef.close(false);

  }

  private resolveIcon(
    variant: AdminConfirmDialogVariant
  ): string {

    switch (variant) {

      case 'danger':

        return 'fa-solid fa-trash';

      case 'warning':

        return 'fa-solid fa-triangle-exclamation';

      default:

        return 'fa-solid fa-circle-question';

    }

  }

}
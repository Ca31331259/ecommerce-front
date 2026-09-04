import {
  Component,
  Inject
} from '@angular/core';

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

  }

  confirm(): void {

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
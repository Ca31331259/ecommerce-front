export type AdminConfirmDialogVariant =
  | 'primary'
  | 'warning'
  | 'danger';

export interface AdminConfirmDialogData {

  title: string;

  description?: string;

  icon?: string;

  confirmLabel?: string;

  cancelLabel?: string;

  variant?: AdminConfirmDialogVariant;

}
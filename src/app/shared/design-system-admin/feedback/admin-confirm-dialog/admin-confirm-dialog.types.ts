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

  /**
   * Para acciones MUY destructivas (ej. borrar un tenant con su base): el botón de confirmar
   * queda deshabilitado hasta que el usuario tipee exactamente este texto (normalmente el code
   * del tenant). Pedido real (panel de Plataforma, 2026-10-22, "poder eliminar un tenant mal
   * creado, base de datos y todo eso"). Si no se manda, el diálogo funciona como siempre (sin
   * campo de texto).
   */
  confirmationText?: string;

  /** Label del campo de texto cuando confirmationText está presente. */
  confirmationLabel?: string;

}
export type AdminToastType =
    | 'success'
    | 'error'
    | 'warning'
    | 'info';

export interface AdminToast {

    id: number;

    type: AdminToastType;

    message: string;

    duration?: number;

}
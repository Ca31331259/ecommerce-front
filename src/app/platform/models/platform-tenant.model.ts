export type SslStatus =
    | 'PENDING'
    | 'ACTIVE'
    | 'ERROR'
    | 'EXPIRED';

export interface PlatformTenant {

    id: number;

    uuid: string;

    code: string;

    name: string;

    domain: string;

    active: boolean;

    webEnabled: boolean;

    monthlyPrice: number;

    sslStatus: SslStatus;

    sslExpiresAt: string;

}
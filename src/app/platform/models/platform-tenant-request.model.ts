export interface PlatformTenantRequest {

    code: string;

    name: string;

    domain: string;

    active: boolean;

    webEnabled: boolean;

    monthlyPrice: number;

    dbHost: string;

    dbPort: number;

    dbSchema: string;

    dbUsername: string;

    dbPassword: string;

}
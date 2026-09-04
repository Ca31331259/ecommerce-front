import { SslStatus } from "./platform-tenant.model";


export interface CertificateStatus {

  sslStatus: SslStatus;

  valid: boolean;

  expirationDate?: string;

}
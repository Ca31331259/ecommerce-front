import { SslStatus } from './platform-tenant.model';

export type DeploymentStatus =
    | 'SUCCESS'
    | 'ERROR'
    | 'PARTIAL';
export interface DeploymentResult {

  status: DeploymentStatus;

  message: string;

  domain: string;

  sslStatus: SslStatus;

}
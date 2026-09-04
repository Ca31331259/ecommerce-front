import { SslStatus } from "./platform-tenant.model";

export interface DeploymentStatusResponse {

  deployed: boolean;

  sslStatus: SslStatus;

  websiteEnabled: boolean;

}
export interface LoginResponse {
  token: string;

  tenant: {
    code: string;
    name: string;
    active: boolean;
  };

  roles: string[];
}
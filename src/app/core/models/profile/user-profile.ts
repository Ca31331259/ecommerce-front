export interface UserProfile {

    id: number;

    username: string;

    firstName: string;

    lastName: string;

    email: string;

    tenant: string;

    roles: string[];

    twoFactorEnabled: boolean;

    passwordExpired: boolean;

}
export interface VerifyLoginTwoFactorRequest {

    /**
     * Token temporal del LoginChallenge.
     */
    challengeToken: string;

    /**
     * Código TOTP generado por la aplicación autenticadora.
     */
    code: string;

}
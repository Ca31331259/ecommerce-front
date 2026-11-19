/**
 * Respuesta de un reset de contraseña (usuario "soporte" del ERP, o usuario de base de datos del
 * tenant). `password` viaja en texto plano UNA sola vez -- el componente la muestra y no la
 * persiste en ningún signal que sobreviva a la navegación.
 */
export interface PlatformPasswordReset {
    password: string;
}

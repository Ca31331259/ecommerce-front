import {
    HttpErrorResponse,
    HttpInterceptorFn
} from '@angular/common/http';

import {
    inject
} from '@angular/core';

import {
    Router
} from '@angular/router';

import {
    catchError,
    throwError
} from 'rxjs';

import {
    PlatformAuthService
} from '../services/platform-auth.service';


/**
 * Pedido real 2026-11-10: "cuando se vence el token" la app se quedaba en la pantalla donde
 * estuviera, mostrando errores genéricos ("No se pudo cargar/actualizar el tenant") sin ninguna
 * pista de que en realidad había que volver a loguearse -- este interceptor atrapaba el 401
 * SOLO para agregar el header Authorization, nunca reaccionaba a la respuesta. Mismo patrón de
 * redirect que platformAuthGuard (login + returnUrl), para no duplicar lógica de a dónde mandar
 * al volver a entrar.
 */
export const platformAuthInterceptor: HttpInterceptorFn =
    (req, next) => {

        if (!req.url.includes('/platform/')) {

            return next(req);

        }

        const authService =
            inject(PlatformAuthService);

        const router =
            inject(Router);

        const token =
            authService.getToken();

        const authReq =
            token
                ? req.clone({
                    setHeaders: {
                        Authorization:
                            `Bearer ${token}`
                    }
                })
                : req;

        return next(authReq).pipe(

            catchError((error: unknown) => {

                // 403, no 401: PlatformSecurityConfig deshabilita httpBasic/formLogin y no define
                // un AuthenticationEntryPoint propio, así que Spring Security cae al default
                // (Http403ForbiddenEntryPoint) tanto para "sin token" como para "token vencido" --
                // confirmado real contra este mismo backend (PlatformJwtFilter simplemente no
                // autentica si jwtService.isValid() da false, nunca escribe 401 él mismo). Se
                // revisan los dos por si el backend cambia a futuro, pero en este panel un 401/403
                // en /platform/** SIEMPRE significa "sesión inválida", nunca "autenticado pero sin
                // permiso" -- no hay ningún otro nivel de autorización en este panel hoy.
                if (
                    error instanceof HttpErrorResponse
                    && (error.status === 401 || error.status === 403)
                ) {

                    authService.logout();

                    router.navigate(
                        ['/platform/login'],
                        {
                            queryParams: {
                                returnUrl: router.url
                            }
                        }
                    );

                }

                return throwError(() => error);

            })

        );

    };
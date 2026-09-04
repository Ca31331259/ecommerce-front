import {
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


export const platformAuthInterceptor: HttpInterceptorFn =
    (req, next) => {

        if (!req.url.includes('/platform/')) {

            return next(req);

        }

        const token =
            localStorage.getItem(
                'platform_token'
            );

        if (!token) {

            return next(req);

        }

        return next(
            req.clone({
                setHeaders: {
                    Authorization:
                        `Bearer ${token}`
                }
            })
        );

    };
import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

   if (req.url.includes('/platform/')) {

            return next(req);

        }


  const router = inject(Router);

  const token = localStorage.getItem('token');
  const tenant = localStorage.getItem('tenant');

  let authReq = req;

  if (token) {

    authReq = authReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

  }

  if (tenant) {

    authReq = authReq.clone({
      setHeaders: {
        'X-Tenant-ID': tenant
      }
    });

  }

  return next(authReq).pipe(

    catchError((error: HttpErrorResponse) => {

      if (error.status === 401 || error.status === 403) {

        localStorage.removeItem('token');
        localStorage.removeItem('roles');

        router.navigate(['/']);

      }

      return throwError(() => error);

    })

  );

};
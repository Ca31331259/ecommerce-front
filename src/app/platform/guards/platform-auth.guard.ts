import {
    inject
} from '@angular/core';

import {
    CanActivateFn,
    Router
} from '@angular/router';

import {
    PlatformAuthService
} from '../services/platform-auth.service';


export const platformAuthGuard: CanActivateFn = (
    route,
    state
) => {

    const authService =
        inject(PlatformAuthService);

    const router =
        inject(Router);


    if (
        authService.isAuthenticated()
    ) {

        return true;

    }


    return router.createUrlTree(
        ['/platform/login'],
        {
            queryParams: {
                returnUrl: state.url
            }
        }
    );

};
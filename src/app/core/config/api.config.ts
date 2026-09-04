import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ApiConfig {

    /**
     * Base de la API.
     *
     * Desarrollo:
     *      http://localhost:8080
     *
     * Producción:
     *      /api
     */

    /* readonly baseUrl =
         window.location.hostname === 'localhost'
             ? 'http://localhost:8080'
             : '/api';*/

    readonly baseUrl =
        window.location.hostname === 'localhost'
            ? 'http://localhost:8080'
            : '/api';
}
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ApiConfig {

    /**
     * Base de la API.
     *
     * Desarrollo:
     *      http://localhost:8081  (backend "ecommerce"/Platform -- NO el ERP, que es 8090)
     *
     * Producción:
     *      /api
     */

    readonly baseUrl =
        window.location.hostname === 'localhost'
            ? 'http://localhost:8081'
            : '/api';
}
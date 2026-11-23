// Espejo de ShopEnvioService (Platform) -- Fase 7, ver docs/ecommerce/plan-fase-7.md en
// numecos-java §3.1/§3.2.

/** `POST /public/shop/envio/cotizar` -- al menos uno de los dos campos (validado en el backend). */
export interface CotizarEnvioRequest {
  localidadId: number | null;
  codigoPostal: string | null;
}

/** Response SIEMPRE con esta forma -- nunca un costo sin `disponible=true` (contrato fijado,
 * ver `ShopEnvioController`). `disponible=false` cubre tanto "sin cobertura para esa dirección"
 * como "el envío a domicilio no está activado para esta óptica" -- el checkout no distingue
 * ambos casos en la UI (mismo mensaje y mismo fallback a retiro en sucursal, §4.10 del doc). */
export interface CotizarEnvioResponse {
  disponible: boolean;
  costoEnvio: number | null;
  zonaNombre: string | null;
  plazoEstimado: string | null;
}

export interface LocalidadGeografia {
  id: number;
  nombre: string;
  codigoPostal: string | null;
}

export interface ProvinciaGeografia {
  id: number;
  nombre: string;
  localidades: LocalidadGeografia[];
}

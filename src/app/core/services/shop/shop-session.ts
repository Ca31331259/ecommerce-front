const SESSION_ID_KEY = 'shop_session_id';
const VISIT_MARKER_KEY = 'shop_visit_started';

/** Cookie anónima propia (sin ningún dato personal, ver shop_event) -- persistida en
 * localStorage, nunca enviada como identificador de usuario real. Compartida por ShopService
 * (eventos) y ShopOrderService (checkout/reintentar-pago/cancelar, que la mandan como header
 * X-Session-Id) para que ambos usen siempre el mismo id por navegador. */
export function shopSessionId(): string {
  let id = localStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    localStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
}

export interface ShopVisitInfo {
  referrerDominio: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  dispositivo: 'MOBILE' | 'DESKTOP';
}

/** Marcador nuevo y separado de `shopSessionId()` (§1.10/§3.1 del plan de Fase 6) -- vive en
 * `sessionStorage`, que a diferencia de `localStorage` se resetea por pestaña/visita nueva, para
 * poder disparar `session_start` una sola vez por visita sin tocar el id permanente que usan
 * carrito/checkout. Devuelve `true` sólo la primera vez que se llama en esta pestaña (lee y
 * escribe el marcador en el mismo paso para que una sola llamada baste como guard). */
export function esVisitaNueva(): boolean {
  if (sessionStorage.getItem(VISIT_MARKER_KEY)) {
    return false;
  }
  sessionStorage.setItem(VISIT_MARKER_KEY, '1');
  return true;
}

/** Referrer/utm/dispositivo de la visita actual, para el payload de `session_start`.
 * `referrerDominio` es SIEMPRE sólo el hostname (nunca la URL completa, para no filtrar
 * parámetros de terceros) -- `document.referrer` puede venir vacío o malformado, de ahí el
 * try/catch. `dispositivo` usa una heurística simple sobre `navigator.userAgent`, suficiente para
 * el dashboard de métricas (no hace falta una librería de device-detection). */
export function datosVisitaActual(): ShopVisitInfo {
  let referrerDominio: string | null = null;
  try {
    referrerDominio = document.referrer ? new URL(document.referrer).hostname : null;
  } catch {
    referrerDominio = null;
  }
  const params = new URLSearchParams(window.location.search);
  const dispositivo: ShopVisitInfo['dispositivo'] =
    /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'MOBILE' : 'DESKTOP';
  return {
    referrerDominio,
    utmSource: params.get('utm_source'),
    utmMedium: params.get('utm_medium'),
    utmCampaign: params.get('utm_campaign'),
    dispositivo
  };
}

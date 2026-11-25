import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Subject, catchError, debounceTime, of, switchMap } from 'rxjs';
import { ShopCartService } from '@core/services/shop/shop-cart-service';
import { ShopEnvioService } from '@core/services/shop/shop-envio-service';
import { ShopOrderService } from '@core/services/shop/shop-order-service';
import { ShopService } from '@core/services/shop/shop-service';
import { CheckoutRequest, MetodoEntrega, ShopBranch } from '@core/models/shop/shop-order.model';
import { CotizarEnvioResponse, ProvinciaGeografia } from '@core/models/shop/shop-envio.model';
import { validarDocumento } from '@core/validacion/documento-numero-validator';
import { DsSection } from '../../../../shared/design-system/layout/ds-section';
import { DsContainer } from '../../../../shared/design-system/layout/ds-container';
import { DsButton } from '../../../../shared/design-system/atoms/ds-button';

const TIPOS_DOCUMENTO = ['DNI', 'CUIT'] as const;
const CONDICIONES_IVA = ['CONSUMIDOR_FINAL', 'RESPONSABLE_INSCRIPTO', 'MONOTRIBUTO'] as const;

interface FormularioComprador {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  tipoDocumento: (typeof TIPOS_DOCUMENTO)[number];
  numeroDocumento: string;
  condicionIva: (typeof CONDICIONES_IVA)[number];
  sucursalRetiroId: number | null;
}

function formularioVacio(): FormularioComprador {
  return {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    condicionIva: 'CONSUMIDOR_FINAL',
    sucursalRetiroId: null
  };
}

/** Fase 7 (ver docs/ecommerce/plan-fase-7.md en numecos-java §3.1/§4.8) -- `pisoDepto`/
 * `entreCalles` son los únicos campos opcionales (mismo criterio que
 * `ShopOrderService.validarDireccionEnvio` del lado Platform). `codigoPostal` se autocompleta al
 * elegir la localidad pero queda editable. */
interface FormularioEnvio {
  destinatarioNombre: string;
  telefonoContacto: string;
  calle: string;
  numero: string;
  pisoDepto: string;
  entreCalles: string;
  provinciaId: number | null;
  localidadId: number | null;
  codigoPostal: string;
}

function formularioEnvioVacio(): FormularioEnvio {
  return {
    destinatarioNombre: '',
    telefonoContacto: '',
    calle: '',
    numero: '',
    pisoDepto: '',
    entreCalles: '',
    provinciaId: null,
    localidadId: null,
    codigoPostal: ''
  };
}

/** `/tienda/checkout` -- una sola página con los pasos (datos, entrega, confirmar), Fase 2 (ver
 * docs/ecommerce/plan-fase-2.md), extendida en Fase 7 (ver docs/ecommerce/plan-fase-7.md en
 * numecos-java) con la opción de envío a domicilio además de retiro en sucursal. */
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, RouterLink, DsSection, DsContainer, DsButton],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout {
  readonly cartService = inject(ShopCartService);
  private readonly orderService = inject(ShopOrderService);
  private readonly envioService = inject(ShopEnvioService);
  private readonly shop = inject(ShopService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly tiposDocumento = TIPOS_DOCUMENTO;
  readonly condicionesIva = CONDICIONES_IVA;

  readonly sucursalesDisponibles = signal<ShopBranch[]>([]);
  readonly cargandoSucursales = signal(true);
  readonly sinSucursalCompleta = signal(false);
  readonly enviando = signal(false);
  readonly error = signal<string | null>(null);
  readonly errorDocumento = signal<string | null>(null);

  readonly pagosDisponibles = signal(true);
  readonly cargandoPagosDisponibles = signal(true);

  // ---- Fase 7: método de entrega (retiro en sucursal / envío a domicilio) ----

  /** Dos opciones, mismo criterio que cualquier otro radio del checkout -- "Envío a domicilio"
   * sólo se muestra si hay catálogo de Provincia/Localidad sincronizado (ver `geografiaDisponible`
   * más abajo; no existe ningún endpoint público "¿envío habilitado?" separado -- ver el comentario
   * largo en `cargarGeografia`). */
  readonly tipoEntrega = signal<MetodoEntrega>('RETIRO_SUCURSAL');
  readonly provincias = signal<ProvinciaGeografia[]>([]);
  readonly cargandoGeografia = signal(true);
  readonly geografiaDisponible = computed(() => this.provincias().length > 0);

  /** Espejo en signal de `envio.provinciaId` (bug real encontrado en vivo, 2026-11-23): un
   * `computed()` sólo se invalida por las signals que lee -- leer `envio.provinciaId` directamente
   * (propiedad plana del objeto `envio`) nunca lo invalidaba, así que `localidadesDeProvincia`
   * quedaba cacheado para siempre en `[]` desde la primera evaluación y el combo de Localidad
   * nunca mostraba opciones. `cambioProvincia()` lo actualiza explícitamente. */
  private readonly provinciaIdSeleccionada = signal<number | null>(null);

  readonly localidadesDeProvincia = computed(() => {
    const provinciaId = this.provinciaIdSeleccionada();
    if (provinciaId == null) {
      return [];
    }
    return this.provincias().find((p) => p.id === provinciaId)?.localidades ?? [];
  });

  readonly cotizacion = signal<CotizarEnvioResponse | null>(null);
  readonly verificandoCobertura = signal(false);

  envio: FormularioEnvio = formularioEnvioVacio();
  private readonly verificarCobertura$ = new Subject<void>();

  form: FormularioComprador = formularioVacio();
  private readonly idempotencyKey = crypto.randomUUID();

  constructor() {
    this.cartService.refrescar();
    this.shop.registrarEvento('checkout_start').subscribe();
    this.cargarSucursales();
    this.verificarPagosDisponibles();
    this.cargarGeografia();
    this.suscribirVerificacionCobertura();
  }

  /** No existe en el backend un endpoint público "¿envío habilitado?" (confirmado leyendo
   * `ShopEnvioController`/`ShopEnvioService` reales: `envioActivo` es un chequeo interno que sólo
   * usa `cotizar`, nunca expuesto como flag propio) ni viaja en ningún bootstrap/config general que
   * este front ya cargue (`TenantService.loadTenant` es la config del sitio -- hero/tema/secciones
   * --, sin nada de envío). Llamar a `/envio/cotizar` de forma anticipada sin una dirección real
   * tampoco es correcto (ver Javadoc del backend). Por eso la decisión es: el catálogo de
   * Provincia→Localidad (`/envio/geografia`) hace de gate funcional -- si está vacío, la óptica
   * nunca sincronizó/activó envío y ni tiene sentido mostrar el formulario de dirección; si tiene
   * datos, se ofrece la opción, y "sin cobertura" (ver `verificarCobertura`) es el único mecanismo
   * real de rechazo, exactamente como pide el punto 4.10 del plan: nunca se cobra un envío sin
   * costo confirmado, pero eso nunca bloquea seguir con retiro en sucursal. */
  private cargarGeografia(): void {
    this.cargandoGeografia.set(true);
    this.envioService.geografia().subscribe({
      next: (provincias) => {
        this.provincias.set([...provincias].sort((a, b) => a.nombre.localeCompare(b.nombre)));
        this.cargandoGeografia.set(false);
      },
      error: () => {
        this.provincias.set([]);
        this.cargandoGeografia.set(false);
      }
    });
  }

  private suscribirVerificacionCobertura(): void {
    this.verificarCobertura$
      .pipe(
        debounceTime(600),
        switchMap(() => {
          this.verificandoCobertura.set(true);
          return this.envioService
            .cotizar({ localidadId: this.envio.localidadId, codigoPostal: this.envio.codigoPostal || null })
            .pipe(catchError(() => of(null)));
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((respuesta) => {
        this.verificandoCobertura.set(false);
        this.cotizacion.set(respuesta);
      });
  }

  elegirTipoEntrega(tipo: MetodoEntrega): void {
    this.tipoEntrega.set(tipo);
    this.error.set(null);
  }

  /** Volver a retiro en sucursal desde el aviso de "sin cobertura" (§4.10 del plan) -- nunca
   * bloquea la compra, sólo cambia de método. */
  volverARetiro(): void {
    this.elegirTipoEntrega('RETIRO_SUCURSAL');
  }

  cambioProvincia(): void {
    this.provinciaIdSeleccionada.set(this.envio.provinciaId);
    this.envio.localidadId = null;
    this.envio.codigoPostal = '';
    this.cotizacion.set(null);
  }

  /** Autocompleta el código postal de la localidad elegida, pero queda editable (§3.1/§4.8 del
   * plan: el comprador puede tener un CP más específico que el de su localidad general). */
  cambioLocalidad(): void {
    const localidad = this.localidadesDeProvincia().find((l) => l.id === this.envio.localidadId);
    this.envio.codigoPostal = localidad?.codigoPostal ?? this.envio.codigoPostal;
    this.dispararVerificacionCobertura();
  }

  cambioCodigoPostal(): void {
    this.dispararVerificacionCobertura();
  }

  /** Botón explícito "Verificar cobertura" -- mismo disparador que el automático al completar el
   * formulario (con debounce), ver `suscribirVerificacionCobertura`. */
  verificarCobertura(): void {
    this.dispararVerificacionCobertura();
  }

  private dispararVerificacionCobertura(): void {
    if (this.envio.localidadId == null && !this.envio.codigoPostal.trim()) {
      this.cotizacion.set(null);
      return;
    }
    this.verificarCobertura$.next();
  }

  /** Costo de envío ya confirmado por `/envio/cotizar` -- `null` mientras no haya cobertura
   * confirmada (nunca se asume un costo antes de la respuesta del backend). */
  costoEnvioConfirmado(): number | null {
    const cotizacion = this.cotizacion();
    return this.tipoEntrega() === 'ENVIO_DOMICILIO' && cotizacion?.disponible ? cotizacion.costoEnvio ?? 0 : null;
  }

  totalConEnvio(totalCarrito: number): number {
    return totalCarrito + (this.costoEnvioConfirmado() ?? 0);
  }

  /** Fase 3 (ver docs/ecommerce/plan-fase-3.md bloque 3) -- se avisa ANTES de que el comprador
   * cargue sus datos si la óptica no puede cobrar todavía (ej. Mercado Pago desconectado). Si la
   * consulta falla, se deja pasar (puedeConfirmar() de todas formas depende de esto sólo para
   * bloquear, nunca para asumir que SÍ hay pago disponible por un error de red). */
  private verificarPagosDisponibles(): void {
    this.cargandoPagosDisponibles.set(true);
    this.orderService.pagosDisponibles().subscribe({
      next: (respuesta) => {
        this.pagosDisponibles.set(respuesta.disponible);
        this.cargandoPagosDisponibles.set(false);
      },
      error: () => {
        this.pagosDisponibles.set(true);
        this.cargandoPagosDisponibles.set(false);
      }
    });
  }

  private cargarSucursales(): void {
    this.cargandoSucursales.set(true);
    this.cartService.sucursalesDisponibles().subscribe({
      next: (sucursales) => {
        this.sucursalesDisponibles.set(sucursales);
        this.sinSucursalCompleta.set(sucursales.length === 0);
        this.cargandoSucursales.set(false);
      },
      error: () => {
        this.sucursalesDisponibles.set([]);
        this.sinSucursalCompleta.set(true);
        this.cargandoSucursales.set(false);
      }
    });
  }

  validarDocumentoEnVivo(): void {
    const resultado = validarDocumento(this.form.tipoDocumento, this.form.numeroDocumento, this.form.condicionIva);
    this.errorDocumento.set(resultado.valido ? null : resultado.error);
  }

  private datosCompradorCompletos(): boolean {
    return !!this.form.nombre && !!this.form.apellido && !!this.form.email && !!this.form.telefono && !this.errorDocumento();
  }

  private direccionEnvioCompleta(): boolean {
    return (
      !!this.envio.destinatarioNombre &&
      !!this.envio.telefonoContacto &&
      !!this.envio.calle &&
      !!this.envio.numero &&
      this.envio.provinciaId != null &&
      this.envio.localidadId != null &&
      !!this.envio.codigoPostal.trim()
    );
  }

  puedeConfirmar(): boolean {
    if (!this.datosCompradorCompletos() || !this.pagosDisponibles()) {
      return false;
    }
    if (this.tipoEntrega() === 'RETIRO_SUCURSAL') {
      return !!this.form.sucursalRetiroId && !this.sinSucursalCompleta();
    }
    // Envío a domicilio: nunca se puede confirmar sin una cobertura ya confirmada por el backend
    // (§4.10 del plan) -- "sin cobertura" sólo ofrece volver a retiro, no bloquea la compra en sí.
    return this.direccionEnvioCompleta() && this.cotizacion()?.disponible === true;
  }

  confirmar(): void {
    this.validarDocumentoEnVivo();
    if (!this.puedeConfirmar() || this.enviando()) {
      return;
    }
    this.enviando.set(true);
    this.error.set(null);
    this.shop.registrarEvento('checkout_step', { paso: 'confirmar' }).subscribe();
    const esEnvio = this.tipoEntrega() === 'ENVIO_DOMICILIO';
    const request: CheckoutRequest = {
      nombre: this.form.nombre,
      apellido: this.form.apellido,
      email: this.form.email,
      telefono: this.form.telefono,
      tipoDocumento: this.form.tipoDocumento,
      numeroDocumento: this.form.numeroDocumento,
      condicionIva: this.form.condicionIva,
      sucursalRetiroId: esEnvio ? null : this.form.sucursalRetiroId,
      idempotencyKey: this.idempotencyKey,
      metodoEntrega: this.tipoEntrega(),
      envioDestinatarioNombre: esEnvio ? this.envio.destinatarioNombre : null,
      envioTelefonoContacto: esEnvio ? this.envio.telefonoContacto : null,
      envioCalle: esEnvio ? this.envio.calle : null,
      envioNumero: esEnvio ? this.envio.numero : null,
      envioPisoDepto: esEnvio ? this.envio.pisoDepto || null : null,
      envioEntreCalles: esEnvio ? this.envio.entreCalles || null : null,
      envioLocalidadId: esEnvio ? this.envio.localidadId : null,
      envioProvinciaId: esEnvio ? this.envio.provinciaId : null,
      envioCodigoPostal: esEnvio ? this.envio.codigoPostal : null
    };
    this.orderService
      .checkout(request)
      .subscribe({
        next: (orden) => {
          this.cartService.refrescar();
          if (orden.urlPago) {
            window.location.href = orden.urlPago;
          } else {
            this.router.navigate(['/tienda/pedido', orden.tokenPublico]);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.enviando.set(false);
          this.error.set(this.mensajeError(err));
        }
      });
  }

  private mensajeError(err: HttpErrorResponse): string {
    if (err.status === 409) {
      return typeof err.error === 'string' ? err.error : 'No hay stock suficiente para completar el pedido.';
    }
    if (err.status === 503) {
      return 'No pudimos procesar tu pedido, intentá de nuevo en un momento.';
    }
    return typeof err.error === 'string' ? err.error : 'Ocurrió un error inesperado.';
  }
}

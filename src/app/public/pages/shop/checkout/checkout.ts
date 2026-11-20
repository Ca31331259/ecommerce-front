import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { ShopCartService } from '@core/services/shop/shop-cart-service';
import { ShopOrderService } from '@core/services/shop/shop-order-service';
import { ShopService } from '@core/services/shop/shop-service';
import { ShopBranch } from '@core/models/shop/shop-order.model';
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

/** `/tienda/checkout` -- una sola página con los 3 pasos (datos, retiro, confirmar), Fase 2 (ver
 * docs/ecommerce/plan-fase-2.md). */
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
  private readonly shop = inject(ShopService);
  private readonly router = inject(Router);

  readonly tiposDocumento = TIPOS_DOCUMENTO;
  readonly condicionesIva = CONDICIONES_IVA;

  readonly sucursalesDisponibles = signal<ShopBranch[]>([]);
  readonly cargandoSucursales = signal(true);
  readonly sinSucursalCompleta = signal(false);
  readonly enviando = signal(false);
  readonly error = signal<string | null>(null);
  readonly errorDocumento = signal<string | null>(null);

  form: FormularioComprador = formularioVacio();
  private readonly idempotencyKey = crypto.randomUUID();

  constructor() {
    this.cartService.refrescar();
    this.shop.registrarEvento('checkout_start').subscribe();
    this.cargarSucursales();
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

  puedeConfirmar(): boolean {
    return (
      !!this.form.nombre &&
      !!this.form.apellido &&
      !!this.form.email &&
      !!this.form.telefono &&
      !!this.form.sucursalRetiroId &&
      !this.errorDocumento() &&
      !this.sinSucursalCompleta()
    );
  }

  confirmar(): void {
    this.validarDocumentoEnVivo();
    if (!this.puedeConfirmar() || this.enviando()) {
      return;
    }
    this.enviando.set(true);
    this.error.set(null);
    this.shop.registrarEvento('checkout_step', { paso: 'confirmar' }).subscribe();
    this.orderService
      .checkout({
        nombre: this.form.nombre,
        apellido: this.form.apellido,
        email: this.form.email,
        telefono: this.form.telefono,
        tipoDocumento: this.form.tipoDocumento,
        numeroDocumento: this.form.numeroDocumento,
        condicionIva: this.form.condicionIva,
        sucursalRetiroId: this.form.sucursalRetiroId!,
        idempotencyKey: this.idempotencyKey
      })
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

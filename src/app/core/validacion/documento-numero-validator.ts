// DNI: 7 u 8 dígitos. CUIT/CUIL/CDI: 11 dígitos con dígito verificador módulo 11. Fase 2 (ver
// docs/ecommerce/plan-fase-2.md, corrección C10) -- puerto a TypeScript de
// com.numecos.ecommerce.platform.shop.validacion.DocumentoNumeroValidator (Platform), que a su vez
// es un duplicado intencional de com.numecos.backend.catalogo.DocumentoNumeroValidator (ERP). Esto
// es sólo para feedback instantáneo en el formulario -- el servidor (Platform) es siempre la
// validación que manda, nunca se confía únicamente en esto.

export interface ResultadoValidacion {
  valido: boolean;
  error: string | null;
}

export function validarDocumento(tipo: string, numero: string, condicionIva: string | null): ResultadoValidacion {
  if (!numero || !numero.trim() || !tipo) {
    return { valido: false, error: 'El documento es obligatorio' };
  }
  if (condicionIva && condicionIva.trim().toUpperCase().includes('CONSUMIDOR FINAL')) {
    return { valido: true, error: null };
  }
  const tipoNormalizado = tipo.trim().toUpperCase();
  const digitos = numero.replace(/[^0-9]/g, '');
  if (tipoNormalizado === 'DNI') {
    if (digitos.length < 7 || digitos.length > 8) {
      return { valido: false, error: 'El DNI debe tener 7 u 8 dígitos' };
    }
  } else if (tipoNormalizado === 'CUIT' || tipoNormalizado === 'CUIL' || tipoNormalizado === 'CDI') {
    if (!cuitValido(digitos)) {
      return { valido: false, error: `El ${tipoNormalizado} debe tener 11 dígitos con dígito verificador válido` };
    }
  }
  return { valido: true, error: null };
}

/** CUIT/CUIL de 11 dígitos con dígito verificador módulo 11 (pesos 5,4,3,2,7,6,5,4,3,2). */
export function cuitValido(digitos: string): boolean {
  if (!digitos || digitos.length !== 11) {
    return false;
  }
  const pesos = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let suma = 0;
  for (let i = 0; i < 10; i++) {
    suma += Number(digitos.charAt(i)) * pesos[i];
  }
  let verificador = 11 - (suma % 11);
  if (verificador === 11) {
    verificador = 0;
  }
  if (verificador === 10) {
    return false;
  }
  return verificador === Number(digitos.charAt(10));
}

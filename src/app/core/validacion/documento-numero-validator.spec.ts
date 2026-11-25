import { cuitValido, validarDocumento } from './documento-numero-validator';

describe('validarDocumento', () => {
  it('rechaza un documento vacío', () => {
    expect(validarDocumento('DNI', '', null).valido).toBe(false);
  });

  it('acepta un DNI de 7 u 8 dígitos', () => {
    expect(validarDocumento('DNI', '1234567', null).valido).toBe(true);
    expect(validarDocumento('DNI', '12345678', null).valido).toBe(true);
  });

  it('rechaza un DNI que no tiene 7 u 8 dígitos', () => {
    const resultado = validarDocumento('DNI', '123456', null);
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toContain('7 u 8 dígitos');
  });

  it('acepta un CUIT válido (con dígito verificador correcto)', () => {
    expect(validarDocumento('CUIT', '20111111112', null).valido).toBe(true);
  });

  it('rechaza un CUIT con dígito verificador inválido', () => {
    const resultado = validarDocumento('CUIT', '20111111113', null);
    expect(resultado.valido).toBe(false);
  });

  it('no valida por formato si la condición IVA es Consumidor Final', () => {
    expect(validarDocumento('DNI', '0', 'Consumidor Final').valido).toBe(true);
    expect(validarDocumento('CUIT', 'x', 'CONSUMIDOR FINAL').valido).toBe(true);
  });

  it('ignora caracteres no numéricos al contar dígitos', () => {
    expect(validarDocumento('DNI', '12.345.678', null).valido).toBe(true);
  });
});

describe('cuitValido', () => {
  it('rechaza una cadena que no tiene 11 dígitos', () => {
    expect(cuitValido('123')).toBe(false);
  });

  it('calcula el dígito verificador módulo 11 correctamente', () => {
    expect(cuitValido('20111111112')).toBe(true);
    expect(cuitValido('20111111111')).toBe(false);
  });
});

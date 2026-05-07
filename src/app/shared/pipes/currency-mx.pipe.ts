import { Pipe, PipeTransform } from '@angular/core';

/**
 * CurrencyMxPipe
 * Formatea un número en pesos mexicanos: 18000 → "$18,000 MXN"
 *
 * Uso: {{ 18000 | currencyMx }}
 */
@Pipe({
  name: 'currencyMx',
  standalone: true
})
export class CurrencyMxPipe implements PipeTransform {
  private readonly formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0
  });

  transform(value: number | null | undefined): string {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return '';
    }
    return `${this.formatter.format(value)} MXN`;
  }
}

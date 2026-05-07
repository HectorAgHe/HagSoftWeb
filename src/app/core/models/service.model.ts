/**
 * Modelos del catálogo de servicios HagSoft.
 */

export enum ServiceCategory {
  Web = 'web',
  POS = 'pos',
  ERP = 'erp',
  Mobile = 'mobile',
  Consulting = 'consulting'
}

export interface Price {
  readonly amount: number;
  readonly currency: 'MXN' | 'USD';
  readonly suffix?: string;
}

export interface Service {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly category: ServiceCategory;
  readonly summary: string;
  readonly description: string;
  readonly features: readonly string[];
  readonly price: Price;
  readonly icon?: string;
  readonly featured?: boolean;
}

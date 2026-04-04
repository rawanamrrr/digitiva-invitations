import type { SiteCurrencyCode } from "./site-currencies"

export type PriceRates = {
  standard: number;
  premium: number;
  custom_package: number;
  extraSection: number;
  language: number;
  customSection: number;
  customDomain: number;
  extraMonth: number;
}

export const PRICING_MAP: Record<string, PriceRates> = {
  egp: { standard: 800, premium: 1000, custom_package: 1600, extraSection: 100, language: 100, customSection: 150, customDomain: 600, extraMonth: 200 },
  usd: { standard: 15, premium: 20, custom_package: 30, extraSection: 2, language: 2, customSection: 3, customDomain: 12, extraMonth: 4 },
  eur: { standard: 13, premium: 16, custom_package: 26, extraSection: 1.5, language: 1.5, customSection: 2.5, customDomain: 10, extraMonth: 3 },
  aed: { standard: 55, premium: 68, custom_package: 110, extraSection: 7, language: 7, customSection: 10, customDomain: 45, extraMonth: 15 },
  kwd: { standard: 4.5, premium: 5.7, custom_package: 10, extraSection: 0.6, language: 0.6, customSection: 0.85, customDomain: 3.5, extraMonth: 1.2 },
  sar: { standard: 55, premium: 70, custom_package: 110, extraSection: 7, language: 7, customSection: 11, customDomain: 45, extraMonth: 15 },
}

export function getPricingRates(currency: string): PriceRates {
  return PRICING_MAP[currency] || PRICING_MAP.egp
}

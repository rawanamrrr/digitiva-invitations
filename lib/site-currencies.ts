export const SITE_CURRENCIES = [
  { code: "egp", emoji: "🇪🇬", short: "EGP" },
  { code: "usd", emoji: "🇺🇸", short: "USD" },
  { code: "eur", emoji: "🇪🇺", short: "EUR" },
  { code: "aed", emoji: "🇦🇪", short: "AED" },
  { code: "iqd", emoji: "🇮🇶", short: "IQD" },
  { code: "sar", emoji: "🇸🇦", short: "SAR" },
  { code: "lbp", emoji: "🇱🇧", short: "LBP" },
] as const

export type SiteCurrencyCode = (typeof SITE_CURRENCIES)[number]["code"]

export const DEFAULT_SITE_CURRENCY: SiteCurrencyCode = "egp"

export const SITE_CURRENCY_COOKIE = "digitiva-site-currency" as const

export function isSiteCurrency(code: string): code is SiteCurrencyCode {
  return SITE_CURRENCIES.some((c) => c.code === code)
}

export function getCurrencyMeta(code: SiteCurrencyCode) {
  return SITE_CURRENCIES.find((c) => c.code === code) ?? SITE_CURRENCIES[0]
}

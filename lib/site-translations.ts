import type { SiteLocale } from "./site-locales"
import { LOCALES } from "./site-translations-data"

export function siteT(locale: SiteLocale, key: string): string {
  const dict = LOCALES[locale]
  if (dict?.[key]) return dict[key]
  return LOCALES.en[key] ?? key
}

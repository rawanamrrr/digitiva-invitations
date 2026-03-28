export const SITE_LOCALES = [
  { code: "en", label: "English", short: "EN", dir: "ltr" as const },
  { code: "ar", label: "العربية", short: "AR", dir: "rtl" as const },
  { code: "es", label: "Español", short: "ES", dir: "ltr" as const },
  { code: "fr", label: "Français", short: "FR", dir: "ltr" as const },
  { code: "de", label: "Deutsch", short: "DE", dir: "ltr" as const },
  { code: "pt", label: "Português", short: "PT", dir: "ltr" as const },
  { code: "it", label: "Italiano", short: "IT", dir: "ltr" as const },
  { code: "ru", label: "Русский", short: "RU", dir: "ltr" as const },
  { code: "zh", label: "中文", short: "ZH", dir: "ltr" as const },
  { code: "hi", label: "हिन्दी", short: "HI", dir: "ltr" as const },
] as const

export type SiteLocale = (typeof SITE_LOCALES)[number]["code"]

export const DEFAULT_LOCALE: SiteLocale = "en"

/** Synced from the client so server components (e.g. invite metadata) can use the site language */
export const SITE_LOCALE_COOKIE = "digitiva-site-locale" as const

export function isSiteLocale(code: string): code is SiteLocale {
  return SITE_LOCALES.some((l) => l.code === code)
}

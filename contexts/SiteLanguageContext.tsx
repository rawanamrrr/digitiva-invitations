"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  DEFAULT_LOCALE,
  SITE_LOCALE_COOKIE,
  SITE_LOCALES,
  isSiteLocale,
  type SiteLocale,
} from "@/lib/site-locales"
import { siteT } from "@/lib/site-translations"

const STORAGE_KEY = SITE_LOCALE_COOKIE

type SiteLanguageContextValue = {
  locale: SiteLocale
  setLocale: (locale: SiteLocale) => void
  t: (key: string) => string
  isRTL: boolean
}

const SiteLanguageContext = createContext<SiteLanguageContextValue | null>(null)

export function SiteLanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SiteLocale>(DEFAULT_LOCALE)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && isSiteLocale(saved)) {
      setLocaleState(saved)
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem(STORAGE_KEY, locale)
    document.cookie = `${SITE_LOCALE_COOKIE}=${locale};path=/;max-age=31536000;SameSite=Lax`
    const meta = SITE_LOCALES.find((l) => l.code === locale)
    document.documentElement.lang = locale === "zh" ? "zh-Hans" : locale
    document.documentElement.dir = meta?.dir ?? "ltr"
  }, [locale, ready])

  const setLocale = useCallback((next: SiteLocale) => {
    setLocaleState(next)
  }, [])

  const t = useCallback((key: string) => siteT(locale, key), [locale])

  const isRTL = locale === "ar"

  const value = useMemo(
    () => ({ locale, setLocale, t, isRTL }),
    [locale, setLocale, t, isRTL],
  )

  return (
    <SiteLanguageContext.Provider value={value}>
      <div
        className={isRTL ? "font-arabic" : ""}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {children}
      </div>
    </SiteLanguageContext.Provider>
  )
}

export function useSiteLanguage() {
  const ctx = useContext(SiteLanguageContext)
  if (!ctx) {
    throw new Error("useSiteLanguage must be used within SiteLanguageProvider")
  }
  return ctx
}

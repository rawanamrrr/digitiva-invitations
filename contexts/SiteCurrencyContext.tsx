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
  DEFAULT_SITE_CURRENCY,
  SITE_CURRENCY_COOKIE,
  getCurrencyMeta,
  isSiteCurrency,
  type SiteCurrencyCode,
} from "@/lib/site-currencies"

const STORAGE_KEY = SITE_CURRENCY_COOKIE

type SiteCurrencyContextValue = {
  currency: SiteCurrencyCode
  setCurrency: (c: SiteCurrencyCode) => void
  currencyShort: string
  currencyEmoji: string
}

const SiteCurrencyContext = createContext<SiteCurrencyContextValue | null>(null)

export function SiteCurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<SiteCurrencyCode>(
    DEFAULT_SITE_CURRENCY,
  )
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && isSiteCurrency(saved)) {
      setCurrencyState(saved)
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem(STORAGE_KEY, currency)
    document.cookie = `${SITE_CURRENCY_COOKIE}=${currency};path=/;max-age=31536000;SameSite=Lax`
  }, [currency, ready])

  const setCurrency = useCallback((next: SiteCurrencyCode) => {
    setCurrencyState(next)
  }, [])

  const { short, emoji } = useMemo(
    () => getCurrencyMeta(currency),
    [currency],
  )

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      currencyShort: short,
      currencyEmoji: emoji,
    }),
    [currency, setCurrency, short, emoji],
  )

  return (
    <SiteCurrencyContext.Provider value={value}>
      {children}
    </SiteCurrencyContext.Provider>
  )
}

export function useSiteCurrency() {
  const ctx = useContext(SiteCurrencyContext)
  if (!ctx) {
    throw new Error("useSiteCurrency must be used within SiteCurrencyProvider")
  }
  return ctx
}

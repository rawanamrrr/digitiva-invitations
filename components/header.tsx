"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { Menu, X, ChevronRight, ChevronDown } from "lucide-react"
import { useSiteCurrency } from "@/contexts/SiteCurrencyContext"
import { useSiteLanguage } from "@/contexts/SiteLanguageContext"
import { SITE_CURRENCIES, type SiteCurrencyCode } from "@/lib/site-currencies"
import { SITE_LOCALES, type SiteLocale } from "@/lib/site-locales"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [currencyOpen, setCurrencyOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { data: session, status } = useSession()
  const { t, locale, setLocale, isRTL } = useSiteLanguage()
  const { currency, setCurrency, currencyShort, currencyEmoji } = useSiteCurrency()
  const langRef = useRef<HTMLDivElement>(null)
  const currencyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const target = e.target as Node
      if (langRef.current && !langRef.current.contains(target)) {
        setLangOpen(false)
      }
      if (currencyRef.current && !currencyRef.current.contains(target)) {
        setCurrencyOpen(false)
      }
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [])

  const currentLang = SITE_LOCALES.find((l) => l.code === locale) ?? SITE_LOCALES[0]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-background/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-b border-border/10 py-3 md:py-1.5"
          : "bg-transparent py-4 md:py-2"
      }`}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <style>{`
          @keyframes glass-sweep {
            0% { left: -150%; }
            15% { left: 150%; }
            100% { left: 150%; }
          }
          .animate-glass-sweep::after {
            content: '';
            position: absolute;
            top: 0;
            left: -150%;
            width: 40%;
            height: 100%;
            background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
            transform: skewX(-20deg);
            animation: glass-sweep 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            z-index: 20;
            pointer-events: none;
          }
        `}</style>
        <div className="w-full flex items-center justify-between">
          <Link href="/" className="flex items-center group relative overflow-hidden animate-glass-sweep rounded-md shrink-0">
            <Image
              src="/logo.png"
              alt="Digitiva"
              width={280}
              height={100}
              className="h-20 md:h-16 lg:h-20 w-auto object-contain transition-transform duration-500 group-hover:scale-105 animate-in fade-in slide-in-from-left-4 duration-1000 ease-out"
              priority
              quality={100}
            />
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="relative" ref={currencyRef}>
              <button
                type="button"
                onClick={() => setCurrencyOpen((v) => !v)}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-foreground/5 hover:bg-foreground/10 backdrop-blur-sm rounded-full border border-transparent hover:border-border/10 transition-all duration-300 text-xs sm:text-sm font-medium hover:scale-[1.03] hover:shadow-sm active:scale-[0.97]"
                aria-expanded={currencyOpen}
                aria-haspopup="listbox"
                aria-label={t("header.currency")}
              >
                <span
                  className="text-sm sm:text-base leading-none"
                  style={{ position: "relative", top: "-1px" }}
                >
                  {currencyEmoji}
                </span>
                <span className="tracking-wide">{currencyShort}</span>
                <ChevronDown
                  className={`w-3 h-3 opacity-70 transition-transform ${currencyOpen ? "rotate-180" : ""}`}
                />
              </button>
              {currencyOpen && (
                <div
                  className="absolute end-0 top-full mt-2 w-56 max-h-72 overflow-y-auto rounded-xl border border-border/10 shadow-lg bg-background/95 backdrop-blur-xl z-[60] py-1"
                  role="listbox"
                >
                  {SITE_CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      role="option"
                      aria-selected={currency === c.code}
                      onClick={() => {
                        setCurrency(c.code as SiteCurrencyCode)
                        setCurrencyOpen(false)
                      }}
                      className={`w-full text-start px-3 py-2.5 text-sm flex items-center justify-between gap-2 hover:bg-foreground/5 ${currency === c.code ? "bg-primary/10 font-medium" : ""}`}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="shrink-0">{c.emoji}</span>
                        <span className="truncate">{t(`currency.${c.code}`)}</span>
                      </span>
                      <span className="text-muted-foreground text-xs shrink-0">{c.short}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangOpen((v) => !v)}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-foreground/5 hover:bg-foreground/10 backdrop-blur-sm rounded-full border border-transparent hover:border-border/10 transition-all duration-300 text-xs sm:text-sm font-medium hover:scale-[1.03] hover:shadow-sm active:scale-[0.97]"
                aria-expanded={langOpen}
                aria-haspopup="listbox"
                aria-label={t("header.lang")}
              >
                <span className="tracking-wide">{currentLang.short}</span>
                <ChevronDown className={`w-3 h-3 opacity-70 transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>
              {langOpen && (
                <div
                  className="absolute end-0 top-full mt-2 w-48 max-h-72 overflow-y-auto rounded-xl border border-border/10 shadow-lg bg-background/95 backdrop-blur-xl z-[60] py-1"
                  role="listbox"
                >
                  {SITE_LOCALES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      role="option"
                      aria-selected={locale === l.code}
                      onClick={() => {
                        setLocale(l.code as SiteLocale)
                        setLangOpen(false)
                      }}
                      className={`w-full text-start px-3 py-2.5 text-sm flex items-center justify-between hover:bg-foreground/5 ${locale === l.code ? "bg-primary/10 font-medium" : ""}`}
                    >
                      <span>{l.label}</span>
                      <span className="text-muted-foreground text-xs">{l.short}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              className="p-1.5 sm:p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 backdrop-blur-sm border border-transparent hover:border-border/10 transition-all duration-300 hover:scale-[1.03] hover:shadow-sm active:scale-[0.97] ml-1"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div
            className={`absolute ${isRTL ? "start-4" : "end-4"} sm:end-6 lg:end-8 top-full mt-3 w-64 md:w-72 rounded-2xl border border-border/10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-50 overflow-hidden backdrop-blur-xl bg-background/80 animate-in fade-in zoom-in-95 duration-200`}
          >
            <div className="p-2">
              <nav className="flex flex-col gap-1">
                {/* Main Navigation */}
                <Link
                  href="#templates"
                  className="text-foreground/80 hover:text-foreground transition-all duration-300 font-medium py-3 px-4 rounded-xl hover:bg-foreground/5 hover:translate-x-1 active:scale-[0.98]"
                  onClick={() => setIsOpen(false)}
                >
                  {t("foot.portfolio")}
                </Link>
                <Link
                  href="#packages"
                  className="text-foreground/80 hover:text-foreground transition-all duration-300 font-medium py-3 px-4 rounded-xl hover:bg-foreground/5 hover:translate-x-1 active:scale-[0.98]"
                  onClick={() => setIsOpen(false)}
                >
                  {t("foot.packages")}
                </Link>
                <Link
                  href="#process"
                  className="text-foreground/80 hover:text-foreground transition-all duration-300 font-medium py-3 px-4 rounded-xl hover:bg-foreground/5 hover:translate-x-1 active:scale-[0.98]"
                  onClick={() => setIsOpen(false)}
                >
                  {t("nav.howItWorks")}
                </Link>
                <Link
                  href="#faqs"
                  className="text-foreground/80 hover:text-foreground transition-all duration-300 font-medium py-3 px-4 rounded-xl hover:bg-foreground/5 hover:translate-x-1 active:scale-[0.98]"
                  onClick={() => setIsOpen(false)}
                >
                  {t("foot.faqs")}
                </Link>

                <div className="h-px bg-border/40 my-2 mx-2" />

                {/* CTA Button */}
                {status !== "loading" && (
                  <div className="flex flex-col gap-1 mt-1">
                    {session ? (
                      (session.user as { role?: string })?.role === "admin" ? (
                        <Link
                          href="/admin"
                          className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 font-medium text-sm active:scale-[0.98] hover:shadow-[0_4px_10px_-2px_rgba(0,0,0,0.15)]"
                          onClick={() => setIsOpen(false)}
                        >
                          {t("nav.adminDashboard")}
                          <ChevronRight className="w-4 h-4 opacity-80 rtl:rotate-180" />
                        </Link>
                      ) : (
                        <Link
                          href="/create"
                          className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 font-medium text-sm active:scale-[0.98] hover:shadow-[0_4px_10px_-2px_rgba(0,0,0,0.15)]"
                          onClick={() => setIsOpen(false)}
                        >
                          {t("nav.createInvitation")}
                          <ChevronRight className="w-4 h-4 opacity-80 rtl:rotate-180" />
                        </Link>
                      )
                    ) : (
                      <Link
                        href="/create"
                        className="flex items-center justify-between mt-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 font-medium text-sm active:scale-[0.98] hover:shadow-[0_4px_10px_-2px_rgba(0,0,0,0.15)]"
                        onClick={() => setIsOpen(false)}
                      >
                        {t("nav.getStarted")}
                        <ChevronRight className="w-4 h-4 opacity-80 rtl:rotate-180" />
                      </Link>
                    )}
                  </div>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

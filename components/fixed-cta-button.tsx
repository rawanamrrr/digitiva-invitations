"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSiteLanguage } from "@/contexts/SiteLanguageContext"
import { useSiteCurrency } from "@/contexts/SiteCurrencyContext"
import { getPricingRates } from "@/lib/pricing"

export function FixedCTAButton() {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useSiteLanguage()
  const { currencyShort, currency } = useSiteCurrency()
  const pricingRates = getPricingRates(currency)
  const lowestPrice = pricingRates.standard

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const subtext = t("fixedCta.subtext")
    .replace("{price}", lowestPrice.toString())
    .replace("{currency}", currencyShort)

  return (
    <div
      className={`fixed bottom-4 sm:bottom-6 left-0 right-0 px-4 sm:px-0 flex justify-center z-50 transition-all duration-500 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <Link
        href="/create"
        className="flex flex-col items-center justify-center w-full sm:w-auto px-6 py-4 bg-primary text-primary-foreground rounded-full shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
      >
        <span className="text-sm sm:text-base font-semibold whitespace-nowrap">{t("fixedCta.createInvitation")}</span>
        <span className="text-xs opacity-90 mt-0.5 whitespace-nowrap">{subtext}</span>
      </Link>
    </div>
  )
}

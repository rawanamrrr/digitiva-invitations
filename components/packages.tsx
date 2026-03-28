"use client"

import { Check, Star, Crown, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useSiteCurrency } from "@/contexts/SiteCurrencyContext"
import { useSiteLanguage } from "@/contexts/SiteLanguageContext"

const packageDefs = [
  {
    id: "std",
    price: "500",
    icon: Star,
    popular: false,
    featureKeys: [
      "pkg.std.f0",
      "pkg.std.f1",
      "pkg.std.f2",
      "pkg.std.f3",
      "pkg.std.f4",
      "pkg.std.f5",
      "pkg.std.f6",
      "pkg.std.f7",
    ] as const,
  },
  {
    id: "prem",
    price: "600",
    icon: Crown,
    popular: true,
    featureKeys: [
      "pkg.prem.f0",
      "pkg.prem.f1",
      "pkg.prem.f2",
      "pkg.prem.f3",
      "pkg.prem.f4",
      "pkg.prem.f5",
      "pkg.prem.f6",
      "pkg.prem.f7",
      "pkg.prem.f8",
    ] as const,
  },
  {
    id: "cust",
    price: "900",
    icon: Sparkles,
    popular: false,
    featureKeys: ["pkg.cust.f0", "pkg.cust.f1", "pkg.cust.f2", "pkg.cust.f3"] as const,
  },
] as const

export function Packages() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const { t, isRTL } = useSiteLanguage()
  const { currencyShort } = useSiteCurrency()

  return (
    <section id="packages" className="py-16 sm:py-32 lg:py-40 relative overflow-hidden px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16 sm:mb-28">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md glass border border-border/40 mb-6 sm:mb-8">
            <Sparkles className="w-3.5 h-3.5 text-teal" />
            <span className="text-xs sm:text-sm font-medium text-foreground/75">{t("pkg.badge")}</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4 sm:mb-6">
            {t("pkg.h2a")}
            <span className="block font-script text-3xl sm:text-5xl lg:text-6xl text-teal font-normal mt-2 sm:mt-3">
              {t("pkg.h2b")}
            </span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t("pkg.sub")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10 lg:gap-10">
          {packageDefs.map((pkg, index) => {
            const Icon = pkg.icon
            const isHovered = hoveredIndex === index
            const nameKey = `pkg.${pkg.id}.name` as const
            const subKey = `pkg.${pkg.id}.sub` as const

            return (
              <div
                key={pkg.id}
                className={`relative group transition-all duration-300 ${
                  pkg.popular ? "md:scale-105 md:-my-4" : ""
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <div className="inline-flex items-center gap-1 px-3.5 py-1 bg-gradient-to-r from-teal to-emerald text-white text-xs font-semibold rounded-md shadow-md">
                      <Crown className="w-3.5 h-3.5" />
                      {t("pkg.popular")}
                    </div>
                  </div>
                )}

                <div
                  className={`relative h-full rounded-md overflow-hidden transition-all duration-300 ${
                    pkg.popular
                      ? "bg-gradient-to-br from-primary via-teal to-primary/80 text-primary-foreground shadow-lg border border-teal/30"
                      : "bg-card border border-border/70 hover:border-primary/40 shadow-md hover:shadow-lg"
                  } ${isHovered && !pkg.popular ? "shadow-lg" : ""}`}
                >
                  <div className="relative p-6 sm:p-10 flex flex-col h-full">
                    <div className="mb-6 sm:mb-10">
                      <div
                        className={`inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-md mb-3 sm:mb-4 transition-transform duration-300 ${
                          pkg.popular ? "bg-primary-foreground/15" : "bg-teal/8"
                        }`}
                      >
                        <Icon
                          className={`w-5.5 h-5.5 sm:w-6 sm:h-6 ${
                            pkg.popular ? "text-primary-foreground" : "text-teal"
                          }`}
                        />
                      </div>

                      <h3
                        className={`font-serif text-base sm:text-xl font-semibold mb-1 ${
                          pkg.popular ? "text-primary-foreground" : "text-foreground"
                        }`}
                      >
                        {t(nameKey)}
                      </h3>
                      <p
                        className={`text-xs sm:text-sm font-medium ${
                          pkg.popular ? "text-primary-foreground/80" : "text-muted-foreground"
                        }`}
                      >
                        {t(subKey)}
                      </p>

                      <div
                        className={`mt-6 pt-6 border-t ${
                          pkg.popular ? "border-primary-foreground/20" : "border-border/50"
                        }`}
                      >
                        <div className="flex items-baseline gap-1 justify-center">
                          <span
                            className={`text-4xl sm:text-5xl font-bold ${
                              pkg.popular ? "text-primary-foreground" : "text-teal"
                            }`}
                          >
                            {pkg.price}
                          </span>
                          <span
                            className={`text-base font-medium ${
                              pkg.popular ? "text-primary-foreground/80" : "text-muted-foreground"
                            }`}
                          >
                            {currencyShort}
                          </span>
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8 flex-grow" dir={isRTL ? "rtl" : "ltr"}>
                      {pkg.featureKeys.map((key) => (
                        <li key={key} className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 w-5 h-5 rounded-sm flex items-center justify-center mt-0.5 ${
                              pkg.popular ? "bg-primary-foreground/20" : "bg-teal/8"
                            }`}
                          >
                            <Check
                              className={`w-3.5 h-3.5 ${
                                pkg.popular ? "text-primary-foreground" : "text-teal"
                              }`}
                            />
                          </div>
                          <span
                            className={`text-sm leading-relaxed ${
                              pkg.popular ? "text-primary-foreground/95" : "text-muted-foreground"
                            }`}
                          >
                            {t(key)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/create"
                      className={`flex items-center justify-center gap-2 w-full py-3 font-medium rounded-md transition-all duration-300 active:scale-95 ${
                        pkg.popular
                          ? "bg-primary-foreground text-primary hover:bg-primary-foreground/95 shadow-md"
                          : "bg-primary text-primary-foreground hover:bg-navy-deep shadow-sm hover:shadow-md"
                      }`}
                    >
                      <span>{t("pkg.cta")}</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-20 sm:mt-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md glass border border-border/40">
            <Sparkles className="w-4 h-4 text-teal" />
            <p className="text-xs sm:text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{t("pkg.footer1")}</span>
              {" • "}
              {t("pkg.footer2")}
            </p>
            <Sparkles className="w-4 h-4 text-teal" />
          </div>
        </div>
      </div>
    </section>
  )
}

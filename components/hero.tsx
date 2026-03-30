"use client"

import { ArrowRight, Sparkles, Star } from "lucide-react"
import Link from "next/link"
import { DeviceMockup } from "./device-mockup"
import { useSiteLanguage } from "@/contexts/SiteLanguageContext"

export function Hero() {
  const { t } = useSiteLanguage()
  return (
    <section className="relative min-h-screen pt-28 md:pt-20 pb-0 overflow-hidden bg-background">
      {/* Subtle animated background elements */}
      <div className="absolute top-20 left-[5%] w-40 h-40 bg-teal/5 rounded-full blur-3xl animate-float opacity-50" />
      <div className="absolute bottom-40 right-[8%] w-52 h-52 bg-emerald/4 rounded-full blur-3xl animate-float-delayed opacity-40" />
      <div className="absolute top-1/3 right-[10%] w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-sparkle opacity-50" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto pt-6 sm:pt-12 lg:pt-16">
          {/* Floating badge */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md glass border border-border/40 mb-6 sm:mb-8 animate-fade-in-down text-center"
            style={{ animationDelay: "0.05s" }}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal flex-shrink-0" />
            <span className="text-xs font-medium text-foreground/75">{t("hero.badge")}</span>
          </div>

          {/* Main heading - Larger for minimalist impact */}
          <h1
            className="text-4xl sm:text-6xl lg:text-7xl font-serif font-semibold leading-tight tracking-tight text-foreground animate-fade-in-up mb-4 sm:mb-6"
            style={{ animationDelay: "0.1s" }}
          >
            {t("hero.title1")}
            <span className="block mt-2 sm:mt-4">
              <span className="font-script text-5xl sm:text-7xl lg:text-8xl text-teal font-normal tracking-wide">
                {t("hero.title2")}
              </span>
            </span>
          </h1>

          {/* Subheading */}
          <p
            className="mt-4 sm:mt-8 text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.15s" }}
          >
            {t("hero.sub")}
          </p>

          {/* CTA Buttons */}
          <div
            className="mt-10 sm:mt-14 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Link
              href="#packages"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-medium bg-primary hover:bg-navy-deep text-primary-foreground rounded-md transition-colors duration-300 active:scale-95"
            >
              {t("hero.startCreating")}
              <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 rtl:rotate-180" />
            </Link>
            <Link
              href="#templates"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-medium text-foreground rounded-md hover:bg-secondary/60 transition-colors duration-300 border border-border/50 active:scale-95"
            >
              {t("hero.seeWork")}
              <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </Link>
          </div>

          {/* Social Proof */}
          <div
            className="mt-16 sm:mt-20 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 text-muted-foreground animate-fade-in-up"
            style={{ animationDelay: "0.25s" }}
          >
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/15 to-teal/15 border-2 border-background flex items-center justify-center text-xs font-medium text-primary"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div>
                <p className="font-medium text-foreground">{t("hero.events")}</p>
                <p className="text-sm text-muted-foreground">{t("hero.eventsSub")}</p>
              </div>
            </div>
            <div className="w-px h-12 bg-border/30 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 text-teal fill-teal" />
                ))}
              </div>
              <div>
                <p className="font-medium text-foreground">{t("hero.rating")}</p>
                <p className="text-sm text-muted-foreground">{t("hero.ratingSub")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Device mockups */}
        <div className="relative mt-20 sm:mt-28 lg:mt-32 flex justify-center items-end gap-4 lg:gap-8 pb-0">
          <div className="animate-float z-10">
            <DeviceMockup type="phone" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />
    </section>
  )
}

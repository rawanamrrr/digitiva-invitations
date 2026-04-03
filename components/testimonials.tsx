"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import Image from "next/image"
import { useSiteLanguage } from "@/contexts/SiteLanguageContext"

const COUNT = 3

export function Testimonials() {
  const { t } = useSiteLanguage()
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const next = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrent((prev) => (prev + 1) % COUNT)
    }
  }

  const prev = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrent((prev) => (prev - 1 + COUNT) % COUNT)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 500)
    return () => clearTimeout(timer)
  }, [current])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % COUNT)
      setIsAnimating(true)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const i = current

  return (
    <section className="py-16 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-28">
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4 sm:mb-6">
            {t("test.title1")}
            <span className="block font-script text-3xl sm:text-5xl lg:text-6xl text-teal font-normal mt-2 sm:mt-3">
              {t("test.title2")}
            </span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t("test.sub")}
          </p>
        </div>

        <div className="relative bg-card border border-border/60 rounded-md p-6 sm:p-10 lg:p-12 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <div className="absolute top-6 right-6 opacity-8">
            <Quote className="w-16 h-16 sm:w-20 sm:h-20 text-primary" />
          </div>

          <div className="relative z-10">
            <div className="flex justify-center gap-1 mb-8">
              {[...Array(5)].map((_, starI) => (
                <Star key={starI} className="w-5 h-5 fill-teal text-teal" />
              ))}
            </div>

            <blockquote className="font-serif text-lg sm:text-xl lg:text-2xl text-center text-foreground leading-relaxed mb-10 min-h-24 flex items-center justify-center">
              &ldquo;{t(`test.q${i}`)}&rdquo;
            </blockquote>

            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-3 ring-teal/20">
                <Image
                  src="/placeholder.svg?height=80&width=80"
                  alt={t(`test.a${i}`)}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-base sm:text-lg">{t(`test.a${i}`)}</p>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {t(`test.r${i}`)} • {t(`test.e${i}`)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-10 sm:mt-12">
            <button
              type="button"
              onClick={prev}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-border bg-secondary/50 hover:bg-secondary hover:border-primary/30 flex items-center justify-center transition-all duration-200 active:scale-95"
              aria-label={t("test.prev")}
            >
              <ChevronLeft className="w-5 h-5 text-foreground rtl:rotate-180" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: COUNT }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    if (!isAnimating) {
                      setIsAnimating(true)
                      setCurrent(index)
                    }
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    current === index ? "bg-teal w-8 h-2.5" : "bg-border h-2 w-2 hover:bg-primary/50"
                  }`}
                  aria-label={`${t("test.goTo")} ${index + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-border bg-secondary/50 hover:bg-secondary hover:border-primary/30 flex items-center justify-center transition-all duration-200 active:scale-95"
              aria-label={t("test.next")}
            >
              <ChevronRight className="w-5 h-5 text-foreground rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

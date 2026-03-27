"use client"

import { Check, Star, Crown, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const packages = [
  {
    name: "Standard Package",
    nameAr: "الباقة الأساسية",
    price: "500",
    icon: Star,
    popular: false,
    features: [
      { ar: "تصميم الدعوة بتمبليت جاهز", en: "Ready template invitation design" },
      { ar: "عداد تنازلي لموعد المناسبة", en: "Countdown timer for the event" },
      { ar: "موقع المناسبة + جوجل مابس", en: "Event location + Google Maps" },
      { ar: "قسم لاستقبال الرسائل", en: "Messages section" },
      { ar: "لغة واحدة", en: "One language" },
      { ar: "صلاحية 2 شهور", en: "Valid for 2 months" },
      { ar: "رابط مخصص", en: "Custom link" },
      { ar: "3 تعديلات", en: "3 revisions" },
    ],
  },
  {
    name: "Premium Package",
    nameAr: "الباقة المميزة",
    price: "600",
    icon: Crown,
    popular: true,
    features: [
      { ar: "جميع مميزات Standard", en: "All Standard features" },
      { ar: "رسائل بخط اليد ملونة", en: "Handwritten colored messages" },
      { ar: 'قسم "قصتنا"', en: '"Our Story" section' },
      { ar: "رفع الصور", en: "Photo upload" },
      { ar: "RSVP متقدم", en: "Advanced RSVP" },
      { ar: "تصميم فريد", en: "Unique design" },
      { ar: "موسيقى خلفية", en: "Background music" },
      { ar: "لغتين (عربي/انجليزي)", en: "2 languages (AR/EN)" },
      { ar: "5 تعديلات", en: "5 revisions" },
    ],
  },
  {
    name: "Customized Package",
    nameAr: "الباقة المخصصة",
    price: "900",
    icon: Sparkles,
    popular: false,
    features: [
      { ar: "تصميم خاص بالكامل", en: "Fully custom design" },
      { ar: "اختيار الألوان بحرية", en: "Free color choice" },
      { ar: "إضافة أقسام خاصة", en: "Custom sections" },
      { ar: "جميع مميزات Premium", en: "All Premium features" },
    ],
  },
]

export function Packages() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="packages" className="py-16 sm:py-32 lg:py-40 relative overflow-hidden px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16 sm:mb-28">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md glass border border-border/40 mb-6 sm:mb-8">
            <Sparkles className="w-3.5 h-3.5 text-teal" />
            <span className="text-xs sm:text-sm font-medium text-foreground/75">Choose Your Plan</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4 sm:mb-6">
            Simple, Transparent
            <span className="block font-script text-3xl sm:text-5xl lg:text-6xl text-teal font-normal mt-2 sm:mt-3">
              Pricing
            </span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Choose the perfect plan for your celebration. All packages include free consultation and 100% satisfaction guarantee.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10 lg:gap-10">
          {packages.map((pkg, index) => {
            const Icon = pkg.icon
            const isHovered = hoveredIndex === index

            return (
              <div
                key={pkg.name}
                className={`relative group transition-all duration-300 ${
                  pkg.popular ? "md:scale-105 md:-my-4" : ""
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Popular badge */}
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <div className="inline-flex items-center gap-1 px-3.5 py-1 bg-gradient-to-r from-teal to-emerald text-white text-xs font-semibold rounded-md shadow-md">
                      <Crown className="w-3.5 h-3.5" />
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Package Card */}
                <div
                  className={`relative h-full rounded-md overflow-hidden transition-all duration-300 ${
                    pkg.popular
                      ? "bg-gradient-to-br from-primary via-teal to-primary/80 text-primary-foreground shadow-lg border border-teal/30"
                      : "bg-card border border-border/70 hover:border-primary/40 shadow-md hover:shadow-lg"
                  } ${
                    isHovered && !pkg.popular ? "shadow-lg" : ""
                  }`}
                >
                  <div className="relative p-6 sm:p-10 flex flex-col h-full">
                    {/* Header */}
                    <div className="mb-6 sm:mb-10">
                      <div
                        className={`inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-md mb-3 sm:mb-4 transition-transform duration-300 ${
                          pkg.popular
                            ? "bg-primary-foreground/15"
                            : "bg-teal/8"
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
                        {pkg.name}
                      </h3>
                      <p
                        className={`text-xs sm:text-sm font-medium ${
                          pkg.popular ? "text-primary-foreground/80" : "text-muted-foreground"
                        }`}
                      >
                        {pkg.nameAr}
                      </p>

                      {/* Price */}
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
                            LE
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-3 mb-8 flex-grow" dir="rtl">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
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
                            {feature.ar}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Link
                      href="/create"
                      className={`flex items-center justify-center gap-2 w-full py-3 font-medium rounded-md transition-all duration-300 active:scale-95 ${
                        pkg.popular
                          ? "bg-primary-foreground text-primary hover:bg-primary-foreground/95 shadow-md"
                          : "bg-primary text-primary-foreground hover:bg-navy-deep shadow-sm hover:shadow-md"
                      }`}
                    >
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer note */}
        <div className="mt-20 sm:mt-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md glass border border-border/40">
            <Sparkles className="w-4 h-4 text-teal" />
            <p className="text-xs sm:text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Free consultation</span> • 100% satisfaction guaranteed
            </p>
            <Sparkles className="w-4 h-4 text-teal" />
          </div>
        </div>
      </div>
    </section>
  )
}

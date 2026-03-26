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
    gradient: "from-rose-light/50 to-cream",
    features: [
      { ar: "تصميم الدعوة بتمبليت جاهز", en: "Ready template invitation design" },
      { ar: "عداد تنازلي لموعد المناسبة", en: "Countdown timer for the event" },
      { ar: "موقع المناسبة + جوجل مابس لمكان المناسبة", en: "Event location + Google Maps" },
      { ar: "قسم لاستقبال الرسائل", en: "Messages section" },
      { ar: "متاحه بلغه واحده فقط", en: "Available in one language only" },
      { ar: "صلاحية لمدة 2 شهور", en: "Valid for 2 months" },
      { ar: "لينك مخصوص باسامي العروسين", en: "Custom link with couple names" },
      { ar: "امكانية تعديل 3 مرات", en: "3 revisions allowed" },
    ],
  },
  {
    name: "Premium Package",
    nameAr: "الباقة المميزة",
    price: "600",
    icon: Crown,
    popular: true,
    gradient: "from-primary to-rose-deep",
    features: [
      { ar: "تشمل كل مميزات الباقة Standard", en: "Includes all Standard features" },
      { ar: "قسم رسائل بخط اليد بعدة الوان", en: "Handwritten messages in multiple colors" },
      { ar: 'قسم "قصتنا" لعرض قصة العروسين', en: '"Our Story" section' },
      { ar: "قسم لرفع الصور على الدرايف الخاص بالعروسين", en: "Photo upload to couple's drive" },
      { ar: "قسم RSVP لتاكيد الحضور", en: "RSVP confirmation section" },
      { ar: "تصميم مميز يناسب الفرح", en: "Unique design for the celebration" },
      { ar: "اضافة اغنية للويب سايت", en: "Background music for website" },
      { ar: "متاحة بلغتين(عربي/انجليزي)", en: "Available in 2 languages (AR/EN)" },
      { ar: "امكانية تعديل 5 مرات", en: "5 revisions allowed" },
    ],
  },
  {
    name: "Customized Package",
    nameAr: "الباقة المخصصة",
    price: "900",
    icon: Sparkles,
    popular: false,
    gradient: "from-gold/30 to-cream",
    features: [
      { ar: "تصميم خاص بالكامل حسب ذوقك و طلبك", en: "Fully custom design per your taste" },
      { ar: "اختيار الالوان والتفاصيل بحرية", en: "Free choice of colors and details" },
      { ar: "امكانية اضافة اي اقسام او افكار خاصة", en: "Add any sections or special ideas" },
      { ar: "كل مميزات الباقة Premium", en: "All Premium package features" },

    ],
  },
]

export function Packages() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="packages" className="py-12 sm:py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card via-teal-light/15 to-card" />

      {/* Decorative elements */}
      <div className="hidden sm:block absolute top-16 -left-10 w-72 h-72 bg-teal/10 rounded-full blur-3xl" />
      <div className="hidden sm:block absolute bottom-16 -right-8 w-64 h-64 bg-emerald/10 rounded-full blur-3xl" />
      <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-10 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-4 sm:mb-6 border border-teal/20">
            <Sparkles className="w-4 h-4 text-teal animate-sparkle" />
            <span className="text-sm font-medium text-primary">Choose Your Perfect Package</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-6xl font-semibold text-foreground mb-3 sm:mb-4">
            Investment in
            <span className="font-script text-3xl sm:text-5xl lg:text-7xl text-teal font-normal block mt-2">
              Unforgettable Memories
            </span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Every package is crafted with love and attention to detail
          </p>
        </div>

        <div className="flex flex-col gap-6 sm:gap-8 lg:grid lg:grid-cols-3 lg:gap-6 xl:gap-8">
          {packages.map((pkg, index) => {
            const Icon = pkg.icon
            const isHovered = hoveredIndex === index

            return (
              <div
                key={pkg.name}
                className={`relative group ${pkg.popular ? "lg:-mt-6 lg:mb-6" : ""}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Popular badge */}
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <div className="px-5 py-1.5 bg-gradient-to-r from-emerald to-teal text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5" />
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Card */}
                <div
                  className={`relative rounded-3xl overflow-hidden transition-all duration-500 ${
                    pkg.popular
                      ? "bg-gradient-to-b from-primary via-teal to-navy-deep text-primary-foreground shadow-2xl shadow-teal/40"
                      : "bg-card border border-border/50 shadow-xl hover:shadow-2xl"
                  } ${isHovered && !pkg.popular ? "scale-[1.02] border-teal/30" : ""}`}
                >
                  {/* Shimmer effect on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full transition-transform duration-700 ${isHovered ? "translate-x-full" : ""}`}
                  />

                  <div className="relative p-4 sm:p-6 lg:p-8">
                    {/* Icon and Header */}
                    <div className="text-center mb-4 sm:mb-6 lg:mb-8">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl mb-3 sm:mb-4 lg:mb-5 transition-transform duration-300 ${
                          isHovered ? "scale-110 rotate-3" : ""
                        } ${
                          pkg.popular
                            ? "bg-primary-foreground/20 backdrop-blur-sm"
                            : "bg-gradient-to-br from-teal/10 to-emerald/10"
                        }`}
                      >
                        <Icon
                          className={`w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 ${
                            pkg.popular ? "text-primary-foreground" : "text-teal"
                          }`}
                        />
                      </div>

                      <h3
                        className={`font-serif text-lg sm:text-xl lg:text-2xl font-semibold mb-1 ${
                          pkg.popular ? "text-primary-foreground" : "text-foreground"
                        }`}
                      >
                        {pkg.name}
                      </h3>
                      <p
                        className={`font-serif text-sm sm:text-base lg:text-lg ${
                          pkg.popular ? "text-primary-foreground/80" : "text-muted-foreground"
                        }`}
                      >
                        {pkg.nameAr}
                      </p>

                      {/* Price with enhanced styling */}
                      <div
                        className={`mt-4 sm:mt-5 lg:mt-6 pt-4 sm:pt-5 lg:pt-6 border-t ${
                          pkg.popular ? "border-primary-foreground/20" : "border-border"
                        }`}
                      >
                        <div className="flex items-baseline justify-center gap-1">
                          <span
                            className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${
                              pkg.popular ? "text-primary-foreground" : "text-teal"
                            }`}
                          >
                            {pkg.price}
                          </span>
                          <span
                            className={`text-base sm:text-lg font-medium ${
                              pkg.popular ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}
                          >
                            LE
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-2 sm:space-y-3 lg:space-y-4 mb-4 sm:mb-6 lg:mb-8" dir="rtl">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center mt-0.5 ${
                              pkg.popular ? "bg-primary-foreground/20" : "bg-teal/10"
                            }`}
                          >
                            <Check
                              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                                pkg.popular ? "text-primary-foreground" : "text-teal"
                              }`}
                            />
                          </div>
                          <span
                            className={`text-xs sm:text-sm lg:text-base leading-snug sm:leading-relaxed ${
                              pkg.popular ? "text-primary-foreground/90" : "text-muted-foreground"
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
                      className={`group/btn flex items-center justify-center gap-2 w-full py-3 sm:py-3.5 lg:py-4 text-center font-medium rounded-2xl transition-all duration-300 ${
                        pkg.popular
                          ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg"
                          : "bg-gradient-to-r from-primary to-teal text-primary-foreground hover:from-navy-deep hover:to-primary shadow-lg shadow-teal/20"
                      } hover:scale-[1.02]`}
                    >
                      <span>Create Your Invitation</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover/btn:-translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-muted-foreground text-sm sm:text-base flex items-center justify-center gap-2 flex-wrap">
            <Sparkles className="w-4 h-4 text-teal" />
            <span>جميع الباقات تشمل استشارة مجانية و ضمان رضا 100%</span>
            <Sparkles className="w-4 h-4 text-teal" />
          </p>
        </div>
      </div>
    </section>
  )
}

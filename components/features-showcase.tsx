"use client"

import { Smartphone, Palette, Zap, Heart, Share2, BarChart3 } from "lucide-react"
import { useSiteLanguage } from "@/contexts/SiteLanguageContext"

const features = [
  { icon: Smartphone, titleKey: "feat.mobile.title", descKey: "feat.mobile.desc", color: "bg-teal/8 text-teal" },
  { icon: Palette, titleKey: "feat.custom.title", descKey: "feat.custom.desc", color: "bg-primary/8 text-primary" },
  { icon: Zap, titleKey: "feat.share.title", descKey: "feat.share.desc", color: "bg-emerald/8 text-emerald" },
  { icon: Heart, titleKey: "feat.anim.title", descKey: "feat.anim.desc", color: "bg-rose/8 text-rose" },
  { icon: Share2, titleKey: "feat.rsvp.title", descKey: "feat.rsvp.desc", color: "bg-sky/8 text-sky" },
  { icon: BarChart3, titleKey: "feat.analytics.title", descKey: "feat.analytics.desc", color: "bg-orange/8 text-orange" },
] as const

export function FeaturesShowcase() {
  const { t } = useSiteLanguage()
  return (
    <section className="py-16 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-28">
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4 sm:mb-6">
            {t("features.title1")}
            <span className="block font-script text-3xl sm:text-5xl lg:text-6xl text-teal font-normal mt-2 sm:mt-3">
              {t("features.title2")}
            </span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t("features.sub")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
          {features.map((feature, index) => (
            <div
              key={feature.titleKey}
              className="group relative bg-card rounded-md p-8 border border-border/60 hover:border-primary/30 transition-all duration-300 hover:shadow-md overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Subtle hover effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-primary/3 to-transparent transition-opacity duration-300" />
              
              <div className="relative">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 ${feature.color} rounded-md flex items-center justify-center mb-4 sm:mb-5 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                
                <h3 className="font-serif text-base sm:text-lg font-semibold text-foreground mb-2.5 sm:mb-3">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {t(feature.descKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

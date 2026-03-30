"use client"

import { useState } from "react"
import { ArrowRight, Heart, Gem, BookHeart, Cake, Baby, PartyPopper, Sparkles } from "lucide-react"
import { useSiteLanguage } from "@/contexts/SiteLanguageContext"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

const categories = [
  {
    id: "wedding",
    title: "Wedding",
    subtitle: "Elegant & Romantic",
    icon: Heart,
    color: "bg-rose-50",
    accentColor: "text-rose-500"
  },
  {
    id: "engagement",
    title: "Engagement",
    subtitle: "Sweet & Special",
    icon: Gem,
    color: "bg-violet-50",
    accentColor: "text-violet-500"
  },
  {
    id: "katb-ketab",
    title: "Katb Ketab",
    subtitle: "Sacred & Blessed",
    icon: BookHeart,
    color: "bg-emerald-50",
    accentColor: "text-emerald-500"
  },
  {
    id: "birthday",
    title: "Birthday",
    subtitle: "Fun & Vibrant",
    icon: Cake,
    color: "bg-amber-50",
    accentColor: "text-amber-500"
  },
  {
    id: "baby-shower",
    title: "Baby Shower",
    subtitle: "Joyful & Adorable",
    icon: Baby,
    color: "bg-sky-50",
    accentColor: "text-sky-500"
  },
  {
    id: "bachelorette",
    title: "Bachelorette",
    subtitle: "Fun & Memorable",
    icon: PartyPopper,
    color: "bg-fuchsia-50",
    accentColor: "text-fuchsia-500"
  },
]

export function EventCategories() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const { t, isRTL } = useSiteLanguage()

  return (
    <section id="weddings" className="py-16 lg:py-24 px-6 lg:px-8 bg-card scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl lg:text-5xl font-semibold text-card-foreground mb-4">
            {t("categories.title1")}{" "}
            <span className="font-script text-4xl lg:text-6xl text-primary font-normal">
              {t("categories.title2")}
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("categories.sub")}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 categories-grid">
          {categories.map((category) => {
            const Icon = category.icon
            const anchorId = category.id === "birthday" ? "birthdays" : undefined
            return (
              <div
                key={category.id}
                id={anchorId}
                className="group relative scroll-mt-24 h-full"
                onMouseEnter={() => setHoveredId(category.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Card
                  className={`h-full min-w-0 overflow-hidden border-none shadow-none bg-transparent transition-all duration-500 hover:scale-[1.02]`}
                >
                  <CardContent className="p-0 flex flex-col items-center text-center">
                    <div className={`mb-3 p-3 rounded-xl ${category.color} ${category.accentColor} transition-colors duration-300 group-hover:bg-primary/5 group-hover:text-primary relative`}>
                      <Icon className="w-6 h-6 sm:w-8 h-8" />
                    </div>
                    <CardTitle className="text-xs sm:text-sm font-medium mb-1 text-foreground/80 group-hover:text-primary transition-colors">
                      {t(`cat.${category.id === "katb-ketab" ? "katb" : category.id === "baby-shower" ? "baby" : category.id}.title`)}
                    </CardTitle>
                    <p className="text-[10px] sm:text-xs text-muted-foreground/60 px-2">
                      {t(`cat.${category.id === "katb-ketab" ? "katb" : category.id === "baby-shower" ? "baby" : category.id}.sub`)}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground/60 tracking-tight">
            {t("categories.footer")}
          </p>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useState } from "react"
import { ArrowRight, Heart, Gem, BookHeart, Cake, Baby, PartyPopper } from "lucide-react"
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
  const { t } = useSiteLanguage()

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
                className="group relative scroll-mt-24"
                onMouseEnter={() => setHoveredId(category.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Card className={`h-full transition-all duration-300 hover:shadow-md ${category.color} hover:shadow-primary/10`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-lg ${category.accentColor}/10`}>
                        <Icon className={`w-5 h-5 ${category.accentColor}`} />
                      </div>
                      <ArrowRight
                        className={`w-4 h-4 transition-transform duration-300 ${hoveredId === category.id ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'}`}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-lg font-medium mb-1">
                      {t(`cat.${category.id === "katb-ketab" ? "katb" : category.id === "baby-shower" ? "baby" : category.id}.title`)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {t(`cat.${category.id === "katb-ketab" ? "katb" : category.id === "baby-shower" ? "baby" : category.id}.sub`)}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

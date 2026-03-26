"use client"

import { useState } from "react"
import { ArrowRight, Heart, Cake, PartyPopper, Building2, Sparkles, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

const categories = [
  {
    id: "weddings",
    title: "Weddings",
    subtitle: "Elegant & Romantic",
    icon: Heart,
    color: "bg-rose-50",
    accentColor: "text-rose-500"
  },
  {
    id: "birthdays",
    title: "Birthdays",
    subtitle: "Fun & Vibrant",
    icon: Cake,
    color: "bg-amber-50",
    accentColor: "text-amber-500"
  },
  {
    id: "celebrations",
    title: "Celebrations",
    subtitle: "Joyful & Memorable",
    icon: PartyPopper,
    color: "bg-violet-50",
    accentColor: "text-violet-500"
  },
  {
    id: "corporate",
    title: "Corporate",
    subtitle: "Professional & Sleek",
    icon: Building2,
    color: "bg-slate-50",
    accentColor: "text-slate-500"
  },
  {
    id: "baby",
    title: "Baby Showers",
    subtitle: "Sweet & Adorable",
    icon: Sparkles,
    color: "bg-sky-50",
    accentColor: "text-sky-500"
  },
  {
    id: "gatherings",
    title: "Social Events",
    subtitle: "Casual & Stylish",
    icon: Users,
    color: "bg-emerald-50",
    accentColor: "text-emerald-500"
  },
]

export function EventCategories() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <section className="py-16 lg:py-24 px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl lg:text-5xl font-semibold text-card-foreground mb-4">
            Invitations for{" "}
            <span className="font-script text-4xl lg:text-6xl text-primary font-normal">every occasion</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From intimate gatherings to grand celebrations, find the perfect invitation style for your special moment.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 categories-grid">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <div
                key={category.id}
                className="group relative"
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
                    <CardTitle className="text-lg font-medium mb-1">{category.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{category.subtitle}</p>
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

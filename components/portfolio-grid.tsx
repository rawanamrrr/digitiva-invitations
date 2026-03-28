"use client"

import { useState, useRef } from "react"
import { templates, Template } from "@/lib/templates"
import { PortfolioCard } from "./portfolio-card"
import { PortfolioModal } from "./portfolio-modal"
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import { useSiteLanguage } from "@/contexts/SiteLanguageContext"

export function PortfolioGrid() {
  const { t } = useSiteLanguage()
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" })
    }
  }

  return (
    <section id="templates" className="py-24 lg:py-32 bg-[#FAFAFA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-4">
            <Sparkles className="w-3 h-3" />
            <span>{t("portfolio.badge")}</span>
          </div>
          <h2 className="font-serif text-4xl lg:text-7xl font-medium text-foreground mb-6">
            {t("portfolio.title1")} <span className="italic font-light">{t("portfolio.title2")}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-light leading-relaxed">
            {t("portfolio.sub")}
          </p>
        </div>
      </div>

      <div className="relative max-w-[100vw]">
        {/* Navigation Arrows on sides */}
        <div className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 hidden md:block">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border-primary/20 hover:border-primary hover:bg-white shadow-lg"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </Button>
        </div>
        
        <div className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 hidden md:block">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border-primary/20 hover:border-primary hover:bg-white shadow-lg"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </Button>
        </div>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto pb-12 px-6 lg:px-[calc((100vw-80rem)/2+2rem)] snap-x snap-mandatory no-scrollbar gap-6 lg:gap-8"
        >
          {templates.map((item, index) => (
            <div key={item.id} className="flex-none w-[75vw] sm:w-[350px] snap-center">
              <PortfolioCard 
                item={item} 
                index={index} 
                onClick={() => setSelectedTemplate(item)} 
              />
            </div>
          ))}
          <div className="flex-none w-12 sm:w-24" />
        </div>
      </div>

      {selectedTemplate && <PortfolioModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />}
    </section>
  )
}

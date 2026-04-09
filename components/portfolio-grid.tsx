"use client"

import { useState, useRef, useEffect } from "react"
import { templates, Template } from "@/lib/templates"
import { PortfolioCard } from "./portfolio-card"
import { PortfolioModal } from "./portfolio-modal"
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import { useSiteLanguage } from "@/contexts/SiteLanguageContext"

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

export function PortfolioGrid() {
  const { t } = useSiteLanguage()
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { ref: sectionRef, isInView } = useInView(0.1)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" })
    }
  }

  return (
    <section id="templates" ref={sectionRef} className="py-24 lg:py-32 bg-[#FAFAFA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`text-center mb-16 lg:mb-24 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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
            <div 
              key={item.id} 
              className={`flex-none w-[75vw] sm:w-[350px] snap-center transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
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

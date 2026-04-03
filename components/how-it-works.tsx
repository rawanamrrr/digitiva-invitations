"use client"

import { Palette, FileText, Link } from "lucide-react"

const steps = [
  {
    icon: Palette,
    title: "Choose your style",
    desc: "Pick a design that matches your wedding aesthetic.",
  },
  {
    icon: FileText,
    title: "Send us the details",
    desc: "Date, venue, schedule and key info.",
  },
  {
    icon: Link,
    title: "Get your link",
    desc: "Your online invitation, ready to share and update.",
  },
] as const

export function HowItWorks() {
  return (
    <section id="process" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-16 sm:mb-24 text-center tracking-wide">
          How It Works
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-12 md:gap-16 lg:gap-24">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center max-w-xs group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 sm:mb-8 transition-transform duration-300 group-hover:scale-105">
                <step.icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" strokeWidth={1.5} />
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

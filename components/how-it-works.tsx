"use client"

import { MessageSquare, Paintbrush, Rocket, PartyPopper } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Tell Us Your Vision",
    description: "Share your event details, preferred style, and any inspiration you have in mind.",
    color: "bg-teal/8 text-teal",
  },
  {
    number: "02",
    icon: Paintbrush,
    title: "We Design Magic",
    description: "Our designers craft a stunning, personalized invitation that captures your celebration's essence.",
    color: "bg-primary/8 text-primary",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Review & Launch",
    description: "Approve your design, and we'll launch your beautiful invitation website within days.",
    color: "bg-emerald/8 text-emerald",
  },
  {
    number: "04",
    icon: PartyPopper,
    title: "Celebrate!",
    description: "Share with your guests and watch the RSVPs roll in. Time to party!",
    color: "bg-rose/8 text-rose",
  },
]

export function HowItWorks() {
  return (
    <section id="process" className="py-16 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16 sm:mb-28">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md glass border border-border/40 mb-6 sm:mb-8">
            <Rocket className="w-3.5 h-3.5 text-teal" />
            <span className="text-xs sm:text-sm font-medium text-foreground/75">Simple Process</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4 sm:mb-6">
            How it
            <span className="block font-script text-3xl sm:text-5xl lg:text-6xl text-teal font-normal mt-2 sm:mt-3">Works</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            From your idea to a stunning invitation in just four simple steps.
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="bg-card rounded-md border border-border/60 p-8 sm:p-10 h-full hover:border-primary/30 hover:shadow-md transition-all duration-300 relative group">
                  {/* Icon and number */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-md ${step.color} flex items-center justify-center flex-shrink-0 transition-transform duration-300`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-semibold text-primary/25">{step.number}</span>
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

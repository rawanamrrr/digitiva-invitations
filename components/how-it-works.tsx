"use client"

import { MessageSquare, Paintbrush, Rocket, PartyPopper } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Tell Us Your Vision",
    description: "Share your event details, preferred style, and any inspiration you have in mind.",
    color: "bg-rose-500",
  },
  {
    number: "02",
    icon: Paintbrush,
    title: "We Design Magic",
    description: "Our designers craft a stunning, personalized invitation that captures your celebration's essence.",
    color: "bg-violet-500",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Review & Launch",
    description: "Approve your design, and we'll launch your beautiful invitation website within days.",
    color: "bg-amber-500",
  },
  {
    number: "04",
    icon: PartyPopper,
    title: "Celebrate!",
    description: "Share with your guests and watch the RSVPs roll in. Time to party!",
    color: "bg-emerald-500",
  },
]

export function HowItWorks() {
  return (
    <section id="process" className="py-24 lg:py-32 px-6 lg:px-8 bg-primary text-primary-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl lg:text-5xl font-semibold mb-4">
            How it <span className="font-script text-4xl lg:text-6xl font-normal opacity-90">works</span>
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            From your idea to a stunning invitation in just a few simple steps.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-primary-foreground/20 -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center">
                {/* Step circle */}
                <div className="relative z-10 w-20 h-20 mx-auto mb-6">
                  <div
                    className={`w-full h-full ${step.color} rounded-full flex items-center justify-center shadow-lg`}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary-foreground text-primary rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-primary-foreground/70 leading-relaxed text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

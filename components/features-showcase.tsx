"use client"

import { Smartphone, Palette, Zap, Heart, Share2, BarChart3 } from "lucide-react"

const features = [
  {
    icon: Smartphone,
    title: "Mobile Perfect",
    description: "Stunning responsive design that looks beautiful on every device.",
    color: "bg-teal/8 text-teal",
  },
  {
    icon: Palette,
    title: "Fully Customizable",
    description: "Complete creative freedom with unlimited color and design options.",
    color: "bg-primary/8 text-primary",
  },
  {
    icon: Zap,
    title: "Instant Sharing",
    description: "Share instantly across WhatsApp, email, social media, and more.",
    color: "bg-emerald/8 text-emerald",
  },
  {
    icon: Heart,
    title: "Animations & Effects",
    description: "Delightful interactions and smooth animations that wow your guests.",
    color: "bg-rose/8 text-rose",
  },
  {
    icon: Share2,
    title: "Easy RSVP",
    description: "Simple one-click responses with instant guest confirmations.",
    color: "bg-sky/8 text-sky",
  },
  {
    icon: BarChart3,
    title: "Analytics & Tracking",
    description: "Real-time insights on guest responses, attendance, and more.",
    color: "bg-orange/8 text-orange",
  },
]

export function FeaturesShowcase() {
  return (
    <section className="py-16 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 sm:mb-28">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md glass border border-border/40 mb-6 sm:mb-8">
            <Zap className="w-3.5 h-3.5 text-teal" />
            <span className="text-xs sm:text-sm font-medium text-foreground/75">Powerful Features</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4 sm:mb-6">
            Everything You Need to Create
            <span className="block font-script text-3xl sm:text-5xl lg:text-6xl text-teal font-normal mt-2 sm:mt-3">
              Perfect Invitations
            </span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Combine beautiful design with powerful features to create invitations that truly impress your guests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
          {features.map((feature, index) => (
            <div
              key={feature.title}
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
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

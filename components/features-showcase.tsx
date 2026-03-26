"use client"

import { Smartphone, Palette, Zap, Heart, Share2, BarChart3 } from "lucide-react"

const features = [
  {
    icon: Smartphone,
    title: "Mobile Perfect",
    description: "Your invitation looks stunning on any device - phones, tablets, or desktops.",
    color: "bg-rose-100 text-rose-600",
  },
  {
    icon: Palette,
    title: "Fully Customizable",
    description: "Colors, fonts, images - everything can be tailored to match your vision.",
    color: "bg-violet-100 text-violet-600",
  },
  {
    icon: Zap,
    title: "Instant Delivery",
    description: "Share your invitation link instantly via WhatsApp, email, or social media.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: Heart,
    title: "Beautiful Animations",
    description: "Delightful micro-interactions that make your invitation feel alive.",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: Share2,
    title: "Easy RSVP",
    description: "Guests can respond in seconds. You get organized responses instantly.",
    color: "bg-sky-100 text-sky-600",
  },
  {
    icon: BarChart3,
    title: "Track Responses",
    description: "Real-time dashboard to see who's coming, dietary needs, and more.",
    color: "bg-orange-100 text-orange-600",
  },
]

export function FeaturesShowcase() {
  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl lg:text-5xl font-semibold text-foreground mb-4">
            Why choose <span className="font-script text-4xl lg:text-6xl text-primary font-normal">Digitiva?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We combine beautiful design with powerful features to create invitations that wow your guests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-card rounded-2xl p-8 border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-card-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

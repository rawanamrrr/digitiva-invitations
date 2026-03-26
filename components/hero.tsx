"use client"

import { ArrowRight, Sparkles, Zap, Star } from "lucide-react"
import Link from "next/link"
import { DeviceMockup } from "./device-mockup"

export function Hero() {
  return (
    <section className="relative min-h-screen pt-28 md:pt-20 pb-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-light/30 via-background to-emerald-light/20" />

      {/* Animated decorative orbs with new colors */}
      <div className="absolute top-20 left-[5%] w-40 h-40 bg-teal/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-40 right-[10%] w-56 h-56 bg-emerald/15 rounded-full blur-3xl animate-float" />
      <div className="absolute top-1/3 right-[5%] w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-float-delayed" />
      <div className="absolute top-1/2 left-[15%] w-24 h-24 bg-teal/15 rounded-full blur-2xl animate-sparkle" />

      {/* Floating decorative elements */}
      <div className="absolute top-32 right-[20%] hidden lg:block">
        <Zap className="w-6 h-6 text-emerald/30 animate-float" />
      </div>
      <div className="absolute top-48 left-[25%] hidden lg:block">
        <Star className="w-5 h-5 text-teal/40 animate-float-delayed" />
      </div>
      <div className="absolute bottom-60 left-[10%] hidden lg:block">
        <Sparkles className="w-7 h-7 text-primary/25 animate-sparkle" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto pt-8 sm:pt-12 lg:pt-20">

          <h1
            className="font-serif text-5xl sm:text-7xl lg:text-9xl font-semibold leading-tight tracking-tight text-foreground animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            Where Every
            <span className="block mt-6 sm:mt-8">
              <span className="font-script text-6xl sm:text-8xl lg:text-[10rem] text-teal font-normal">Celebration</span>
            </span>
            <span className="block text-3xl sm:text-5xl lg:text-6xl mt-4 sm:mt-6 text-muted-foreground font-normal">
              Becomes a Masterpiece
            </span>
          </h1>

          <p
            className="mt-6 sm:mt-8 text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            We don't just create invitations — we craft unforgettable first impressions that set the tone for your most
            precious moments.
          </p>

          <div
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href="#packages"
              className="group inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-4 sm:py-5 text-base sm:text-lg font-semibold bg-gradient-to-r from-primary via-teal to-emerald text-primary-foreground rounded-full hover:from-navy-deep hover:via-primary hover:to-teal transition-all hover:scale-105 shadow-xl shadow-teal/30 animate-pulse-glow"
            >
              Explore Packages
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#work"
              className="inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-4 sm:py-5 text-base sm:text-lg font-semibold glass text-foreground rounded-full hover:bg-card/90 transition-all border border-border/50 shadow-lg hover:shadow-xl"
            >
              View Our Invitations
            </Link>
          </div>

          <div
            className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-muted-foreground animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-teal/30 to-emerald/30 border-2 border-background flex items-center justify-center"
                  >
                    <Zap className="w-3 h-3 text-primary" />
                  </div>
                ))}
              </div>
              <span className="text-base font-semibold">50+ Happy Couples</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 text-emerald fill-emerald" />
                ))}
              </div>
              <span className="text-base font-semibold">5.0 Rating</span>
            </div>
          </div>
        </div>

        {/* Device mockups */}
        <div className="relative mt-12 sm:mt-16 lg:mt-20 flex justify-center items-end gap-4 lg:gap-8 pb-0">
          <div className="hidden lg:block animate-float-delayed">
            <DeviceMockup type="laptop" />
          </div>
          <div className="animate-float z-10">
            <DeviceMockup type="phone" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-card to-transparent" />
    </section>
  )
}

import Link from "next/link"
import { ArrowRight, Zap, Sparkles, Star } from "lucide-react"

export function CTABanner() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-light/30 via-cream to-emerald-light/30" />

      {/* Decorative elements with new colors */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-teal/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-emerald/20 rounded-full blur-3xl animate-float" />
      <div className="absolute top-1/2 left-1/4 hidden lg:block">
        <Zap className="w-8 h-8 text-teal/20 animate-float" />
      </div>
      <div className="absolute bottom-1/3 right-1/4 hidden lg:block">
        <Star className="w-6 h-6 text-emerald/30 animate-float-delayed" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 glass rounded-full text-primary text-sm font-medium mb-6 border border-teal/20 shadow-lg">
          <Zap className="w-4 h-4 text-teal animate-pulse" />
          Make Your Invitation Now
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl lg:text-5xl font-semibold text-foreground mb-4 leading-tight">
          Your
          <span className="font-script text-3xl sm:text-4xl lg:text-6xl text-teal font-normal mx-2">
            dream invitation
          </span>
          <br className="hidden sm:block" />
          is just one step away
        </h2>

        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4">
          Join hundreds of happy couples who have wowed their guests with stunning Digitiva invitations. Let's create
          something extraordinary together.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
          <Link
            href="/create"
            className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 text-sm font-medium bg-gradient-to-r from-primary via-teal to-emerald text-primary-foreground rounded-full hover:from-navy-deep hover:via-primary hover:to-teal transition-all hover:scale-105 shadow-xl shadow-teal/30"
          >
            Make Your Invitation Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#work"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 text-sm font-medium glass text-foreground rounded-full hover:bg-card/80 transition-all border border-border/50 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-teal" />
            View Examples
          </Link>
        </div>
      </div>
    </section>
  )
}

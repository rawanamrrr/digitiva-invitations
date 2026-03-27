import Link from "next/link"
import { ArrowRight, Zap, Sparkles } from "lucide-react"

export function CTABanner() {
  return (
    <section className="py-16 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-background">
      <div className="relative max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 glass rounded-md text-primary text-sm font-medium mb-6 sm:mb-8 border border-border/40">
          <Zap className="w-3.5 h-3.5 text-teal" />
          Ready to Impress Your Guests?
        </div>

        <h2 className="font-serif text-2xl sm:text-4xl lg:text-6xl font-semibold text-foreground mb-4 sm:mb-6 leading-tight">
          Create Your
          <span className="block font-script text-3xl sm:text-5xl lg:text-7xl text-teal font-normal mt-2.5">
            Perfect Invitation
          </span>
        </h2>

        <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto mb-10 sm:mb-14 leading-relaxed">
          Join hundreds of happy couples and event organizers who have wowed their guests with stunning Digitiva invitations.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            href="/create"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-medium bg-primary hover:bg-navy-deep text-primary-foreground rounded-md transition-all duration-300 active:scale-95"
          >
            Start Creating Now
            <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </Link>
          <Link
            href="#work"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-medium text-foreground rounded-md hover:bg-secondary/60 transition-all duration-300 border border-border/50 active:scale-95"
          >
            <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-teal" />
            View Examples
          </Link>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground mt-7 sm:mt-8">
          <span className="font-medium text-foreground">Free consultation included</span> • No credit card required
        </p>
      </div>
    </section>
  )
}

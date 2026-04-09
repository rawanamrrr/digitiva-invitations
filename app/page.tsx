import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { EventCategories } from "@/components/event-categories"
import { PortfolioGrid } from "@/components/portfolio-grid"
import { FeaturesShowcase } from "@/components/features-showcase"
import { HowItWorks } from "@/components/how-it-works"
import { Packages } from "@/components/packages"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"
import { CTABanner } from "@/components/cta-banner"
import { Footer } from "@/components/footer"
import { FixedCTAButton } from "@/components/fixed-cta-button"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <EventCategories />
      <PortfolioGrid />
      <Packages />
      <FeaturesShowcase />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CTABanner />
      <Footer />
      <FixedCTAButton />
    </main>
  )
}

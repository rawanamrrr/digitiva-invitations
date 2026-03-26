import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary via-teal to-navy-deep text-primary-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-12">
          <div className="sm:col-span-2">
            <Link href="/" className="inline-block mb-2 group transform scale-240 origin-left">
              <Image
                src="/logo.png"
                alt="Digitiva"
                width={280}
                height={84}
                className="h-20 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
                priority
              />
            </Link>
            <p className="opacity-80 max-w-md leading-relaxed text-sm sm:text-base">
              Creating stunning, custom event invitation websites that capture the essence of your celebration. Every
              design tells a unique story.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-all hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-base">Quick Links</h3>
            <nav className="space-y-3 text-sm">
              <Link href="#work" className="block opacity-70 hover:opacity-100 transition-opacity">
                Portfolio
              </Link>
              <Link href="#packages" className="block opacity-70 hover:opacity-100 transition-opacity">
                Packages
              </Link>
              <Link href="#faqs" className="block opacity-70 hover:opacity-100 transition-opacity">
                FAQs
              </Link>
              <Link href="#contact" className="block opacity-70 hover:opacity-100 transition-opacity">
                Contact
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-base">Event Types</h3>
            <nav className="space-y-3 text-sm">
              <Link href="#" className="block opacity-70 hover:opacity-100 transition-opacity">
                Weddings
              </Link>
              <Link href="#" className="block opacity-70 hover:opacity-100 transition-opacity">
                Birthdays
              </Link>
              <Link href="#" className="block opacity-70 hover:opacity-100 transition-opacity">
                Corporate Events
              </Link>
              <Link href="#" className="block opacity-70 hover:opacity-100 transition-opacity">
                Baby Showers
              </Link>
            </nav>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-primary-foreground/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs sm:text-sm opacity-70">© {new Date().getFullYear()} Digitiva. All rights reserved.</p>
          <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm opacity-70">
            <Link href="#" className="hover:opacity-100 transition-opacity">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:opacity-100 transition-opacity">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

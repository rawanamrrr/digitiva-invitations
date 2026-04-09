"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook } from "lucide-react"
import { useSiteLanguage } from "@/contexts/SiteLanguageContext"

export function Footer() {
  const { t, isRTL } = useSiteLanguage()

  return (
    <footer className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary via-teal to-navy-deep text-primary-foreground relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-12">
          <div className="sm:col-span-2">
            <Link
              href="/"
              className={`inline-block mb-2 group ${isRTL ? "origin-right" : "origin-left"}`}
            >
              <Image
                src="/logo.png"
                alt="Digitiva"
                width={280}
                height={84}
                className="h-20 sm:h-16 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
                priority
              />
            </Link>
            <p className="opacity-80 max-w-md leading-relaxed text-sm sm:text-base">{t("foot.tagline")}</p>
            <div className="flex gap-3 mt-6">
              <a
                href="https://www.instagram.com/digitiva.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/share/1DtZmvmT5F/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@digitiva.co"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-all hover:scale-110"
                aria-label="TikTok"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="w-5 h-5 fill-current"
                >
                  <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.999v13.51a2.886 2.886 0 0 1-5.772 0 2.886 2.886 0 0 1 2.886-2.886c.287 0 .566.043.833.123V8.64a6.87 6.87 0 0 0-.833-.051A6.923 6.923 0 0 0 2 15.51a6.923 6.923 0 0 0 13.846 0V9.933a8.736 8.736 0 0 0 3.743.84V6.845c-.001 0-.001-.159-.001-.159z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-base">{t("foot.quick")}</h3>
            <nav className="space-y-3 text-sm">
              <Link href="#templates" className="block opacity-70 hover:opacity-100 transition-opacity">
                {t("foot.portfolio")}
              </Link>
              <Link href="#packages" className="block opacity-70 hover:opacity-100 transition-opacity">
                {t("foot.packages")}
              </Link>
              <Link href="#faqs" className="block opacity-70 hover:opacity-100 transition-opacity">
                {t("foot.faqs")}
              </Link>
              <Link href="#contact" className="block opacity-70 hover:opacity-100 transition-opacity">
                {t("foot.contact")}
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-base">{t("foot.events")}</h3>
            <nav className="space-y-3 text-sm">
              <Link href="#weddings" className="block opacity-70 hover:opacity-100 transition-opacity">
                {t("cat.wedding.title")}
              </Link>
              <Link href="#weddings" className="block opacity-70 hover:opacity-100 transition-opacity">
                {t("cat.engagement.title")}
              </Link>
              <Link href="#weddings" className="block opacity-70 hover:opacity-100 transition-opacity">
                {t("cat.katb.title")}
              </Link>
              <Link href="#birthdays" className="block opacity-70 hover:opacity-100 transition-opacity">
                {t("cat.birthday.title")}
              </Link>
              <Link href="#weddings" className="block opacity-70 hover:opacity-100 transition-opacity">
                {t("cat.baby.title")}
              </Link>
              <Link href="#weddings" className="block opacity-70 hover:opacity-100 transition-opacity">
                {t("cat.bachelorette.title")}
              </Link>
            </nav>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-primary-foreground/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs sm:text-sm opacity-70">
            © {new Date().getFullYear()} Digitiva. {t("foot.rights")}
          </p>
          <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm opacity-70">
            <Link href="#" className="hover:opacity-100 transition-opacity">
              {t("foot.privacy")}
            </Link>
            <Link href="#" className="hover:opacity-100 transition-opacity">
              {t("foot.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

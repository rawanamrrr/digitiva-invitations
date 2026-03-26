"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass shadow-lg border-b border-primary/10" : "bg-transparent"
      }`}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mobile-header-row w-full flex items-center justify-between py-2 md:hidden pl-0 pr-4">
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo.png"
              alt="Digitiva"
              width={120}
              height={34}
              className="h-10 sm:h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Mobile menu button */}
          <button
            className="ml-3 md:hidden p-2 rounded-full hover:bg-primary/10 transition-colors flex-shrink-0"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-8 h-8 text-foreground" /> : <Menu className="w-8 h-8 text-foreground" />}
          </button>
        </div>

        <div className="desktop-header-row hidden md:flex items-center justify-between h-16 sm:h-20 lg:h-24">
          <nav className="flex items-center gap-6 lg:gap-10 text-base lg:text-lg">
            <Link
              href="#weddings"
              className="tracking-wide text-foreground/80 hover:text-primary transition-colors font-semibold"
            >
              Weddings
            </Link>
            <Link
              href="#birthdays"
              className="tracking-wide text-foreground/80 hover:text-primary transition-colors font-semibold"
            >
              Birthdays
            </Link>
          </nav>

          <Link href="/" className="flex items-center group translate-y-2">
            <Image
              src="/logo.png"
              alt="Digitiva"
              width={160}
              height={45}
              className="h-38 sm:h-30 lg:h-30 w-auto object-contain transition-transform group-hover:scale-105"
              priority
            />
          </Link>

          <nav className="flex items-center gap-6 lg:gap-10 text-base lg:text-lg">
            <Link
              href="#packages"
              className="tracking-wide text-foreground/80 hover:text-primary transition-colors font-semibold"
            >
              Packages
            </Link>
            <Link
              href="#faqs"
              className="tracking-wide text-foreground/80 hover:text-primary transition-colors font-semibold"
            >
              FAQs
            </Link>
            {status !== "loading" && (
              <>
                {session ? (
                  (session.user as { role?: string })?.role === "admin" ? (
                    <Link
                      href="/admin"
                      className="tracking-wide px-6 py-3 bg-gradient-to-r from-primary to-teal text-primary-foreground rounded-full hover:from-navy-deep hover:to-primary transition-all hover:scale-105 shadow-md font-semibold text-base lg:text-lg"
                    >
                      Admin
                    </Link>
                  ) : (
                    <Link
                      href="/create"
                      className="tracking-wide px-6 py-3 bg-gradient-to-r from-primary to-teal text-primary-foreground rounded-full hover:from-navy-deep hover:to-primary transition-all hover:scale-105 shadow-md font-semibold text-base lg:text-lg"
                    >
                      Create Invitation
                    </Link>
                  )
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="tracking-wide text-foreground/80 hover:text-primary transition-colors font-semibold"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="tracking-wide px-6 py-3 bg-gradient-to-r from-primary to-teal text-primary-foreground rounded-full hover:from-navy-deep hover:to-primary transition-all hover:scale-105 shadow-md font-semibold text-base lg:text-lg"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </>
            )}
            <Link
              href="#contact"
              className="tracking-wide text-foreground/80 hover:text-primary transition-colors font-semibold"
            >
              Contact
            </Link>
          </nav>
        </div>

        {isOpen && (
          <div className="mobile-header-menu md:hidden absolute left-0 right-0 top-full mt-2 py-6 glass rounded-2xl mb-4 border border-primary/10 shadow-xl animate-fade-in-up z-50">
            <nav className="flex flex-col items-center gap-5 text-lg">
              <Link
                href="#weddings"
                className="text-foreground/80 hover:text-primary transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Weddings
              </Link>
              <Link
                href="#birthdays"
                className="text-foreground/80 hover:text-primary transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Birthdays
              </Link>
              <Link
                href="#packages"
                className="text-foreground/80 hover:text-primary transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Packages
              </Link>
              <Link
                href="#faqs"
                className="text-foreground/80 hover:text-primary transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                FAQs
              </Link>
              {status !== "loading" && (
                <>
                  {session ? (
                    (session.user as { role?: string })?.role === "admin" ? (
                      <Link
                        href="/admin"
                        className="mt-2 px-7 py-3.5 bg-gradient-to-r from-primary to-teal text-primary-foreground rounded-full hover:from-navy-deep hover:to-primary transition-all font-semibold shadow-lg"
                        onClick={() => setIsOpen(false)}
                      >
                        Admin
                      </Link>
                    ) : (
                      <Link
                        href="/create"
                        className="mt-2 px-7 py-3.5 bg-gradient-to-r from-primary to-teal text-primary-foreground rounded-full hover:from-navy-deep hover:to-primary transition-all font-semibold shadow-lg"
                        onClick={() => setIsOpen(false)}
                      >
                        Create Invitation
                      </Link>
                    )
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="text-foreground/80 hover:text-primary transition-colors font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="mt-2 px-7 py-3.5 bg-gradient-to-r from-primary to-teal text-primary-foreground rounded-full hover:from-navy-deep hover:to-primary transition-all font-semibold shadow-lg text-xl"
                        onClick={() => setIsOpen(false)}
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </>
              )}
              <Link
                href="#contact"
                className="text-foreground/80 hover:text-primary transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Contact Us
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

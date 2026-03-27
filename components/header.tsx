"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { Menu, X, ChevronRight } from "lucide-react"

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "glass shadow-md border-b border-border/30 py-4" 
          : "bg-transparent border-b border-transparent py-6"
      }`}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Header */}
        <div className="mobile-header-row w-full flex items-center justify-between md:hidden">
          <Link href="/" className="flex items-center hover:opacity-75 transition-opacity duration-300">
            <Image
              src="/logo.png"
              alt="Digitiva"
              width={120}
              height={34}
              className="h-12 sm:h-14 w-auto object-contain"
              priority
            />
          </Link>

          <button
            className="p-2 rounded-md hover:bg-primary/6 transition-colors duration-300 active:scale-95"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>

        {/* Desktop Header */}
        <div className="desktop-header-row hidden md:flex items-center justify-between gap-8">
          <nav className="flex items-center gap-8 text-sm">
            <Link
              href="#weddings"
              className="text-foreground/70 hover:text-foreground transition-colors duration-300 font-medium py-2"
            >
              Weddings
            </Link>
            <Link
              href="#birthdays"
              className="text-foreground/70 hover:text-foreground transition-colors duration-300 font-medium py-2"
            >
              Birthdays
            </Link>
          </nav>

          <Link href="/" className="flex items-center flex-shrink-0 hover:opacity-75 transition-opacity duration-300">
            <Image
              src="/logo.png"
              alt="Digitiva"
              width={160}
              height={45}
              className="h-16 w-auto object-contain"
              priority
            />
          </Link>

          <nav className="flex items-center gap-8 text-sm">
            <Link
              href="#packages"
              className="text-foreground/70 hover:text-foreground transition-colors duration-300 font-medium py-2"
            >
              Packages
            </Link>
            <Link
              href="#faqs"
              className="text-foreground/70 hover:text-foreground transition-colors duration-300 font-medium py-2"
            >
              FAQs
            </Link>
            <div className="w-px h-5 bg-border/40" />
            {status !== "loading" && (
              <>
                {session ? (
                  (session.user as { role?: string })?.role === "admin" ? (
                    <Link
                      href="/admin"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-navy-deep transition-colors duration-300 font-medium text-sm"
                    >
                      Admin
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <Link
                      href="/create"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-navy-deep transition-colors duration-300 font-medium text-sm"
                    >
                      Create
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  )
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-foreground/70 hover:text-foreground transition-colors duration-300 font-medium py-2"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-navy-deep transition-colors duration-300 font-medium text-sm"
                    >
                      Get Started
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </>
                )}
              </>
            )}
            <Link
              href="#contact"
              className="text-foreground/70 hover:text-foreground transition-colors duration-300 font-medium py-2"
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="mobile-header-menu md:hidden absolute left-4 right-4 top-full mt-3 py-4 glass rounded-md border border-border/30 shadow-md animate-fade-in-down z-50">
            <nav className="flex flex-col gap-1">
              {[
                { label: "Weddings", href: "#weddings" },
                { label: "Birthdays", href: "#birthdays" },
                { label: "Packages", href: "#packages" },
                { label: "FAQs", href: "#faqs" },
                { label: "Contact", href: "#contact" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-foreground/70 hover:text-foreground transition-colors duration-300 font-medium py-2.5 px-3 rounded-md hover:bg-primary/5 active:scale-95"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="h-px bg-border/40 my-3" />
              {status !== "loading" && (
                <>
                  {session ? (
                    (session.user as { role?: string })?.role === "admin" ? (
                      <Link
                        href="/admin"
                        className="flex items-center justify-between px-3 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-navy-deep transition-colors duration-300 font-medium text-sm active:scale-95"
                        onClick={() => setIsOpen(false)}
                      >
                        Admin Dashboard
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <Link
                        href="/create"
                        className="flex items-center justify-between px-3 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-navy-deep transition-colors duration-300 font-medium text-sm active:scale-95"
                        onClick={() => setIsOpen(false)}
                      >
                        Create Invitation
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    )
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="text-foreground/70 hover:text-foreground transition-colors duration-300 font-medium py-2.5 px-3 rounded-md hover:bg-primary/5 active:scale-95"
                        onClick={() => setIsOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="flex items-center justify-between px-3 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-navy-deep transition-colors duration-300 font-medium text-sm active:scale-95"
                        onClick={() => setIsOpen(false)}
                      >
                        Get Started
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </>
                  )}
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

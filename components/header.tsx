"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { Menu, X, ChevronRight, ChevronDown } from "lucide-react"

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
          ? "backdrop-blur-md bg-background/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-b border-border/10 py-3 md:py-1.5"
          : "bg-transparent py-4 md:py-2"
      }`}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <style>{`
          @keyframes glass-sweep {
            0% { left: -150%; }
            15% { left: 150%; }
            100% { left: 150%; }
          }
          .animate-glass-sweep::after {
            content: '';
            position: absolute;
            top: 0;
            left: -150%;
            width: 40%;
            height: 100%;
            background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
            transform: skewX(-20deg);
            animation: glass-sweep 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            z-index: 20;
            pointer-events: none;
          }
        `}</style>
        {/* Header Content */}
        <div className="w-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group relative overflow-hidden animate-glass-sweep rounded-md">
            <Image
              src="/logo.png"
              alt="Digitiva"
              width={280}
              height={100}
              className="h-20 md:h-16 lg:h-20 w-auto object-contain transition-transform duration-500 group-hover:scale-105 animate-in fade-in slide-in-from-left-4 duration-1000 ease-out"
              priority
              quality={100}
            />
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Currency */}
            <button className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-foreground/5 hover:bg-foreground/10 backdrop-blur-sm rounded-full border border-transparent hover:border-border/10 transition-all duration-300 text-xs sm:text-sm font-medium hover:scale-[1.03] hover:shadow-sm active:scale-[0.97]">
              <span className="text-sm sm:text-base leading-none" style={{ position: 'relative', top: '-1px' }}>🇪🇬</span>
              <span className="tracking-wide">EGP</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {/* Language */}
            <button className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-foreground/5 hover:bg-foreground/10 backdrop-blur-sm rounded-full border border-transparent hover:border-border/10 transition-all duration-300 text-xs sm:text-sm font-medium hover:scale-[1.03] hover:shadow-sm active:scale-[0.97]">
              <span className="tracking-wide">EN</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {/* Menu Button */}
            <button
              className="p-1.5 sm:p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 backdrop-blur-sm border border-transparent hover:border-border/10 transition-all duration-300 hover:scale-[1.03] hover:shadow-sm active:scale-[0.97] ml-1"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-4 sm:right-6 lg:right-8 top-full mt-3 w-64 md:w-72 rounded-2xl border border-border/10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-50 overflow-hidden backdrop-blur-xl bg-background/80 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-2">
              <nav className="flex flex-col gap-1">
                {[
                  { label: "Weddings", href: "#weddings" },
                  { label: "Birthdays", href: "#birthdays" },
                  { label: "Packages", href: "#packages" },
                  { label: "FAQs", href: "#faqs" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-foreground/80 hover:text-foreground transition-all duration-300 font-medium py-3 px-4 rounded-xl hover:bg-foreground/5 hover:translate-x-1 active:scale-[0.98]"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="h-px bg-border/40 my-2 mx-2" />

                {status !== "loading" && (
                  <div className="flex flex-col gap-1 mt-1">
                    {session ? (
                      (session.user as { role?: string })?.role === "admin" ? (
                        <Link
                          href="/admin"
                          className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 font-medium text-sm active:scale-[0.98] hover:shadow-[0_4px_10px_-2px_rgba(0,0,0,0.15)]"
                          onClick={() => setIsOpen(false)}
                        >
                          Admin Dashboard
                          <ChevronRight className="w-4 h-4 opacity-80" />
                        </Link>
                      ) : (
                        <Link
                          href="/create"
                          className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 font-medium text-sm active:scale-[0.98] hover:shadow-[0_4px_10px_-2px_rgba(0,0,0,0.15)]"
                          onClick={() => setIsOpen(false)}
                        >
                          Create Invitation
                          <ChevronRight className="w-4 h-4 opacity-80" />
                        </Link>
                      )
                    ) : (
                      <>
                        <Link
                          href="/create"
                          className="flex items-center justify-between mt-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 font-medium text-sm active:scale-[0.98] hover:shadow-[0_4px_10px_-2px_rgba(0,0,0,0.15)]"
                          onClick={() => setIsOpen(false)}
                        >
                          Get Started
                          <ChevronRight className="w-4 h-4 opacity-80" />
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
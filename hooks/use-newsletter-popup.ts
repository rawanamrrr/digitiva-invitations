"use client"

import { useState, useEffect } from "react"

interface UseNewsletterPopupOptions {
  delaySeconds?: number
  scrollThreshold?: number
  enabled?: boolean
}

export function useNewsletterPopup({
  delaySeconds = 30,
  scrollThreshold = 100,
  enabled = true,
}: UseNewsletterPopupOptions = {}) {
  const [shouldShow, setShouldShow] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    if (!enabled) return

    // Check if user has already subscribed
    const hasSubscribed = localStorage.getItem("newsletter_subscribed")
    const wasDismissed = sessionStorage.getItem("newsletter_dismissed")
    
    if (hasSubscribed || wasDismissed) {
      return
    }

    // Track scroll
    const handleScroll = () => {
      if (window.scrollY > scrollThreshold) {
        setHasScrolled(true)
      }
    }

    window.addEventListener("scroll", handleScroll)

    // Show popup after delay if user has scrolled
    const timer = setTimeout(() => {
      if (hasScrolled) {
        setShouldShow(true)
      }
    }, delaySeconds * 1000)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
    }
  }, [hasScrolled, delaySeconds, scrollThreshold, enabled])

  return { shouldShow, setShouldShow }
}

import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Cormorant_Garamond, Great_Vibes, Cinzel, Noto_Naskh_Arabic } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SessionProvider } from "@/components/providers/session-provider"
import { SiteCurrencyProvider } from "@/contexts/SiteCurrencyContext"
import { SiteLanguageProvider } from "@/contexts/SiteLanguageContext"
import "./globals.css"
import "@/styles/lazy-video.css"

const _inter = Inter({ subsets: ["latin"] })
const _cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})
const _greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
})
const _cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})
const _notoNaskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-naskh-arabic",
})

export const metadata: Metadata = {
  title: "Digitiva | Beautiful Digital Invitations",
  description:
    "Customizable e-invitations for your special occasions. Stunning wedding, birthday, and event invitation websites that wow your guests.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${_notoNaskh.variable} font-sans antialiased`}>
        <SessionProvider>
          <SiteLanguageProvider>
            <SiteCurrencyProvider>{children}</SiteCurrencyProvider>
          </SiteLanguageProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}

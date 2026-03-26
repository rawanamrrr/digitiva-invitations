"use client"

import { useState } from "react"
import Image from "next/image"
import { useTranslation } from "@/lib/template-translations"
import { useLanguage } from "@/contexts/LanguageContext"
import { useInvitation } from "@/contexts/InvitationContext"

interface VenueMapProps {
  embedded?: boolean
  assetsPrefix?: string
}

export default function VenueMap({
  embedded = false,
  assetsPrefix = "/templates/lamis",
}: VenueMapProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { isRTL } = useLanguage()
  const t = useTranslation()
  const invitation = useInvitation()
  const mapUrl = invitation?.venue_map_url || "https://www.google.com/maps"
  const customMapImage = invitation?.venue_map_image?.trim()
  const staticMapUrl = `${assetsPrefix}/map-venue.png`
  const imageSrc = customMapImage && /^https?:\/\//i.test(customMapImage) ? customMapImage : staticMapUrl
  const venueName = invitation?.venue || "Venue"
  const query = [invitation?.venue, invitation?.venue_address].filter(Boolean).join(" ").trim()
  const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(query || venueName)}&output=embed`
  const shouldEmbedLiveMap = !customMapImage

  return (
    <div className={embedded ? "w-full" : "w-full px-4 sm:px-6 py-8"}>
      <div className="relative group max-w-4xl mx-auto">
        <div
          className="relative w-full aspect-video min-h-[250px] rounded-2xl overflow-hidden border-2 border-accent/20 shadow-2xl cursor-pointer bg-card"
          onClick={() => window.open(mapUrl, "_blank")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              window.open(mapUrl, "_blank")
            }
          }}
        >
          {shouldEmbedLiveMap ? (
            <iframe
              src={embedSrc}
              className="absolute inset-0 w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageLoaded(true)
                setImageError(true)
              }}
            />
          ) : !imageError ? (
            <Image
              src={imageSrc}
              alt={t("venueMapTitle")}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageLoaded(true)
                setImageError(true)
              }}
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <span className="text-muted-foreground">{t("venueMapTitle")} — Tap to open</span>
            </div>
          )}

          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">{t("venueMapLoading")}</span>
            </div>
          )}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded-full">
            {isRTL ? "👆 اضغط لفتح الخريطة" : "👆 Tap to open map"}
          </div>
        </div>
      </div>
      <div className="mt-6 text-center px-4">
        <h3 className="text-xl sm:text-2xl font-serif font-medium text-foreground mb-2">
          {venueName}
        </h3>
        {invitation?.venue_address && (
          <p className="text-sm text-muted-foreground">
            {invitation.venue_address}
          </p>
        )}
      </div>
    </div>
  )
}

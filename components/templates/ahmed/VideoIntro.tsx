"use client"

import { useEffect, useRef } from "react"

interface VideoIntroProps {
  onComplete: () => void
  onSkip: () => void
}

export default function VideoIntro({ onComplete, onSkip }: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const play = () => video.play().catch(() => {})
    if (video.readyState >= 3) play()
    else video.addEventListener("canplay", play, { once: true })
  }, [])

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center z-[9999]"
      onClick={onSkip}
    >
      <video
        ref={videoRef}
        className="h-auto max-h-full w-auto max-w-full object-contain"
        playsInline
        muted
        autoPlay
        onEnded={onComplete}
        preload="auto"
        poster="/templates/ahmed/invitation-design.png"
      >
        <source src="/templates/ahmed/engagement-video.mp4" type="video/mp4" />
      </video>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onSkip()
        }}
        className="absolute top-4 right-4 md:top-8 md:right-8 z-50 px-4 py-2 bg-black/60 text-white rounded-full text-sm font-medium hover:bg-black/80"
      >
        Skip
      </button>
    </div>
  )
}

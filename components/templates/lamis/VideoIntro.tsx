"use client"

import { useEffect, useRef, useCallback } from "react"

interface VideoIntroProps {
  onComplete: () => void
  onSkip: () => void
}

export default function VideoIntro({ onComplete, onSkip }: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const preload = document.createElement("video")
    preload.preload = "auto"
    preload.muted = true
    preload.playsInline = true
    preload.src = "/templates/lamis/invitation-design.mp4"
    preload.load()

    const video = videoRef.current
    if (!video) return
    const play = () => video.play().catch(() => {})
    if (video.readyState >= 3) play()
    else video.addEventListener("canplay", play, { once: true })
    return () => video.removeEventListener("canplay", play)
  }, [])

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center z-[9999] cursor-pointer"
      onClick={(e) => {
        e.stopPropagation()
        videoRef.current?.pause()
        onSkip()
      }}
    >
      <video
        ref={videoRef}
        className="h-auto max-h-full w-auto max-w-full object-contain"
        playsInline
        muted
        autoPlay
        onEnded={onComplete}
        preload="auto"
      >
        <source src="/templates/lamis/engagement-video.mp4" type="video/mp4" />
      </video>
    </div>
  )
}

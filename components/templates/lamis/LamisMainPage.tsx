"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import CountdownTimer from "../shared/CountdownTimer"
import VenueMap from "../shared/VenueMap"
import HandwrittenMessage from "../shared/HandwrittenMessage"
import RSVPSection from "../shared/RSVPSection"
import PhotoUploadSection from "../shared/PhotoUploadSection"
import { useTranslation } from "@/lib/template-translations"
import { useInvitation } from "@/contexts/InvitationContext"
import { useLanguage } from "@/contexts/LanguageContext"

const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.8 } } }
const scaleIn = { hidden: { scale: 0.98, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { duration: 0.8 } } }
const flyFromLeft = { hidden: { x: -200, opacity: 0, scale: 0.8 }, visible: { x: 0, opacity: 1, scale: 1, transition: { duration: 1.2 } } }
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }

const FALLBACK_MUSIC_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"

export default function LamisMainPage({ introFinished }: { introFinished: boolean }) {
  const t = useTranslation()
  const { language } = useLanguage()
  const invitation = useInvitation()
  const [mounted, setMounted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [musicStarted, setMusicStarted] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const heroVideoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [audioSrc, setAudioSrc] = useState<string>(FALLBACK_MUSIC_URL)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)
  const [youTubeTitle, setYouTubeTitle] = useState<string>("")

  // Determine song type from invitation
  const isYouTubeSong = Boolean(invitation?.song_url?.startsWith("youtube:"))
  const youTubeVideoId = isYouTubeSong
    ? invitation?.song_url?.split("youtube:")[1]?.trim()
    : null
  const hasUserMp3 = Boolean(invitation?.song_url && !isYouTubeSong && invitation.song_url.startsWith('http'))
  const hasUserYouTube = Boolean(isYouTubeSong && youTubeVideoId)

  // Set initial audio source (MP3 or fallback)
  useEffect(() => {
    if (hasUserMp3 && invitation?.song_url) {
      console.log("[Music] Using user MP3:", invitation.song_url)
      setAudioSrc(invitation.song_url)
    } else {
      console.log("[Music] Using fallback music initially")
      setAudioSrc(FALLBACK_MUSIC_URL)
    }
  }, [hasUserMp3, invitation?.song_url])

  // Fetch YouTube audio on demand (URLs expire quickly)
  const fetchYouTubeAudio = useCallback(async () => {
    if (!youTubeVideoId) return null
    console.log("[Music] Fetching YouTube audio for:", youTubeVideoId)
    setIsLoadingAudio(true)
    try {
      const res = await fetch(`/api/youtube/audio?videoId=${youTubeVideoId}`)
      const data = await res.json()
      if (data.audioUrl) {
        console.log("[Music] Got YouTube audio:", data.title)
        setYouTubeTitle(data.title)
        setAudioSrc(data.audioUrl)
        return data.audioUrl
      } else {
        console.error("[Music] Failed to get YouTube audio:", data.error)
        // YouTube extraction failed - user can still click the video player
        return null
      }
    } catch (err) {
      console.error("[Music] Error fetching YouTube audio:", err)
      return null
    } finally {
      setIsLoadingAudio(false)
    }
  }, [youTubeVideoId])

  const hasMusic = Boolean(audioSrc || hasUserYouTube)

  const startMusic = useCallback(async () => {
    if (musicStarted || !hasMusic) return
    
    // If YouTube song, fetch fresh audio URL first
    let currentAudioSrc = audioSrc
    if (hasUserYouTube && youTubeVideoId) {
      const ytAudio = await fetchYouTubeAudio()
      if (ytAudio) {
        currentAudioSrc = ytAudio
      }
    }
    
    const audio = new Audio(currentAudioSrc)
    audio.loop = true
    audio.volume = 1
    audioRef.current = audio
    audio.play().then(() => {
      setMusicStarted(true)
      setIsMuted(false)
    }).catch(() => {
      audio.muted = true
      audio.play().then(() => {
        setMusicStarted(true)
        setTimeout(() => { audio.muted = false; setIsMuted(false) }, 100)
      }).catch(() => {})
    })
  }, [audioSrc, hasMusic, musicStarted, hasUserYouTube, youTubeVideoId, fetchYouTubeAudio])

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return
    const newMuted = !audioRef.current.muted
    audioRef.current.muted = newMuted
    setIsMuted(newMuted)
  }, [])

  const { scrollYProgress } = useScroll()
  const pathY1 = useTransform(scrollYProgress, [0, 0.5], [0, 20])
  const pathY2 = useTransform(scrollYProgress, [0, 0.5], [0, 40])

  const rawSections = invitation?.sections
  const sections: string[] | null =
    rawSections == null
      ? null
      : Array.isArray(rawSections)
        ? rawSections
        : typeof rawSections === "string"
          ? (() => { try { const parsed = JSON.parse(rawSections); return Array.isArray(parsed) ? parsed : null } catch { return null } })()
          : null

  const hasSection = (id: string) => sections === null || (sections.length > 0 && sections.includes(id))

  const eventDate = invitation ? new Date(invitation.event_date + "T12:00:00") : new Date()

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (introFinished && heroVideoRef.current) {
      heroVideoRef.current.currentTime = 0
      heroVideoRef.current.play().catch(() => {})
    }
  }, [introFinished])
  useEffect(() => () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null } }, [])

  if (!mounted || !invitation) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-transparent overflow-x-hidden pt-0">
      {!musicStarted && hasMusic && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm cursor-pointer" onClick={startMusic}>
          <div className="bg-white/90 dark:bg-black/80 px-8 py-6 rounded-2xl shadow-2xl border border-white/20 flex flex-col items-center gap-4 animate-pulse max-w-md text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-foreground">{language === "ar" ? "اضغط لتشغيل الموسيقى" : "Tap to Play Music"}</p>
            {isLoadingAudio && (
              <p className="text-sm text-muted-foreground">{language === "ar" ? "جاري تحميل الصوت..." : "Loading audio..."}</p>
            )}
            {hasUserYouTube && !isLoadingAudio && youTubeTitle && (
              <p className="text-xs text-muted-foreground truncate max-w-[200px]">{youTubeTitle}</p>
            )}
            {hasUserMp3 && (
              <p className="text-xs text-muted-foreground truncate max-w-[200px]">{audioSrc?.split('/').pop()?.slice(0, 30)}</p>
            )}
          </div>
        </div>
      )}
      {musicStarted && (
        <button onClick={toggleMute} className="fixed top-6 right-6 z-[9999] w-14 h-14 rounded-full bg-black/60 backdrop-blur-xl flex items-center justify-center text-white shadow-2xl hover:bg-black/80 transition-all active:scale-90 border border-white/20" aria-label={isMuted ? "Play Music" : "Mute Music"}>
          {isMuted ? (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-7 h-7 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      )}
      {isYouTubeSong && youTubeVideoId && (
        <div className="fixed bottom-4 left-4 z-50 w-[200px] h-[120px] shadow-2xl rounded-lg overflow-hidden border-2 border-white/20">
          <div className="absolute top-2 left-2 z-10 bg-black/60 text-white text-xs px-2 py-1 rounded">
            Click for audio
          </div>
          <iframe 
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(youTubeVideoId)}?autoplay=0&mute=0&enablejsapi=1&playsinline=1`}
            title="YouTube player" 
            allow="autoplay; encrypted-media" 
            className="w-full h-full"
          />
        </div>
      )}
      <motion.section className="relative w-full overflow-hidden pt-0 -mt-4" initial="hidden" animate="visible" variants={stagger}>
        <motion.div className="relative w-full z-10 pt-0" variants={scaleIn}>
          <div className={`relative w-full pt-0 ${introFinished ? "opacity-100" : "opacity-0"}`}>
            <video ref={heroVideoRef} className="w-full h-auto object-contain" playsInline muted preload="auto" loop={false} onLoadedData={() => setImageLoaded(true)} onEnded={() => heroVideoRef.current?.pause()}>
              <source src="/templates/lamis/invitation-design.mp4" type="video/mp4" />
            </video>
            {!imageLoaded && <div className="absolute inset-0 bg-muted flex items-center justify-center"><span className="text-muted-foreground">{t("loading")}</span></div>}
          </div>
        </motion.div>
        <motion.button onClick={() => document.querySelector("section")?.scrollIntoView({ behavior: "smooth" })} className="absolute bottom-16 left-8 flex flex-col items-center gap-2 z-20 cursor-pointer" variants={flyFromLeft} transition={{ delay: 0.8 }}>
          <div className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border border-accent/30"><span className="text-sm font-medium">{language === "ar" ? "مرر للأسفل" : "Scroll Down"}</span></div>
        </motion.button>
        <motion.div className="absolute -left-20 top-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" style={{ y: pathY1 }} />
        <motion.div className="absolute -right-20 bottom-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl" style={{ y: pathY2 }} />
      </motion.section>
      {hasSection("countdown") && (
        <section className="relative py-12 px-4 md:py-16 overflow-hidden" style={{ clipPath: "polygon(0 5%, 100% 0%, 100% 95%, 0% 100%)" }}>
          <div className="relative max-w-6xl mx-auto text-center">
            <div className="inline-flex flex-col items-center mb-16">
              <h2 className="font-luxury text-5xl md:text-7xl text-foreground leading-tight mb-6">{t("ourSpecialDay")}</h2>
              <p className="font-luxury text-3xl font-bold italic bg-clip-text text-transparent bg-gradient-to-br from-primary via-accent to-primary/60">{t("countingMoments")}</p>
            </div>
            <CountdownTimer targetDate={eventDate} />
          </div>
        </section>
      )}
      {hasSection("venueMap") && (
        <motion.section className="relative py-20 px-4 md:py-32 bg-gradient-to-b from-transparent via-accent/5 to-transparent" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} style={{ clipPath: "polygon(0 0%, 100% 5%, 100% 100%, 0% 95%)" }}>
          <div className="max-w-6xl mx-auto">
            <motion.div className="text-center mb-20" variants={fadeIn}><h2 className="font-luxury text-5xl md:text-7xl text-foreground mb-6">{t("joinUsAt")}</h2></motion.div>
            <motion.div className="max-w-4xl mx-auto" variants={scaleIn}>
              <div className="bg-card/80 backdrop-blur-sm border border-accent/20 rounded-3xl p-10 md:p-12 shadow-2xl">
                <div className="space-y-6">
                  <h3 className="text-3xl md:text-4xl font-serif text-accent">{t("location")}</h3>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-4 border-t border-accent/10">
                    <span className="text-xl font-medium">{t("date")}</span>
                    <span className="text-xl font-medium">{t("time")}</span>
                  </div>
                  <div className="mt-8"><VenueMap embedded assetsPrefix="/templates/lamis" /></div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}
      {hasSection("handwrittenMessage") && <HandwrittenMessage />}
      {hasSection("rsvp") && <RSVPSection />}
      {hasSection("photoUpload") && <PhotoUploadSection />}
      <motion.footer className="relative py-24 text-center bg-gradient-to-t from-accent/10 to-transparent" variants={fadeIn}>
        <p className="font-luxury text-3xl text-foreground italic">{t("footerMessage")}</p>
      </motion.footer>
    </div>
  )
}

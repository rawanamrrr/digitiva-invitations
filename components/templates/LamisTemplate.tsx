"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { InvitationProvider } from "@/contexts/InvitationContext"
import { LanguageProvider } from "@/contexts/LanguageContext"
import type { InvitationData } from "@/contexts/InvitationContext"

const VideoIntro = dynamic(
  () => import("./lamis/VideoIntro"),
  { ssr: false, loading: () => <div className="fixed inset-0 bg-black flex items-center justify-center text-white">Loading...</div> }
)

const LamisMainPage = dynamic(
  () => import("./lamis/LamisMainPage"),
  { ssr: false, loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div> }
)

export function LamisTemplate({ data }: { data: InvitationData }) {
  const [introFinished, setIntroFinished] = useState(false)

  return (
    <InvitationProvider data={data}>
      <LanguageProvider>
        <div className="min-h-screen relative overflow-x-hidden">
          {!introFinished && (
            <div className="fixed inset-0 z-[9999] bg-black">
              <VideoIntro
                onComplete={() => setIntroFinished(true)}
                onSkip={() => setIntroFinished(true)}
              />
            </div>
          )}
          <div
            className={`w-full transition-opacity duration-500 ${
              introFinished ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <LamisMainPage introFinished={introFinished} />
          </div>
        </div>
      </LanguageProvider>
    </InvitationProvider>
  )
}

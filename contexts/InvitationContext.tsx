"use client"

import { createContext, useContext, ReactNode } from "react"

export type InvitationData = {
  template_id?: string | null
  bride_name: string
  groom_name: string
  event_date: string
  event_time: string
  venue: string
  venue_address?: string
  venue_map_url?: string
  venue_map_image?: string | null
  couple_image?: string
  song_url?: string
  package_name?: string | null
  sections?: string[] | null
  custom_theme_color?: string | null
}

const InvitationContext = createContext<InvitationData | undefined>(undefined)

export function InvitationProvider({
  data,
  children,
}: {
  data: InvitationData
  children: ReactNode
}) {
  return (
    <InvitationContext.Provider value={data}>
      {children}
    </InvitationContext.Provider>
  )
}

export function useInvitation() {
  const context = useContext(InvitationContext)
  return context
}


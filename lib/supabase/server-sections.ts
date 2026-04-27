/**
 * Server-side helpers for invitation sections
 * Use these in API routes
 */

import { createAdminClient } from "@/lib/supabase/server"

export interface InvitationSection {
  id: string
  invitation_id: string
  section_key: string
  content: Record<string, any>
  created_at: string
  updated_at: string
}

/**
 * Save multiple sections (server-side)
 */
export async function saveSectionsDataServer(
  invitationId: string,
  sectionsData: Record<string, Record<string, any>>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient()

    const records = Object.entries(sectionsData).map(([sectionKey, content]) => ({
      invitation_id: invitationId,
      section_key: sectionKey,
      content,
    }))

    const { error } = await supabase
      .from("invitation_sections")
      .upsert(records, {
        onConflict: "invitation_id,section_key",
      })

    if (error) {
      console.error("Error saving sections data:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Exception saving sections data:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Get all sections for an invitation (server-side)
 */
export async function getInvitationSectionsServer(
  invitationId: string
): Promise<{ success: boolean; data?: InvitationSection[]; error?: string }> {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("invitation_sections")
      .select("*")
      .eq("invitation_id", invitationId)

    if (error) {
      console.error("Error fetching sections:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data as InvitationSection[] }
  } catch (error) {
    console.error("Exception fetching sections:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Delete sections for an invitation (server-side)
 */
export async function deleteInvitationSectionsServer(
  invitationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient()

    const { error } = await supabase
      .from("invitation_sections")
      .delete()
      .eq("invitation_id", invitationId)

    if (error) {
      console.error("Error deleting sections:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Exception deleting sections:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Invitation Sections Database Helpers
 * 
 * Functions for saving and retrieving dynamic section data
 */

import { createClient } from "@/lib/supabase/client"

export interface InvitationSection {
  id: string
  invitation_id: string
  section_key: string
  content: Record<string, any>
  created_at: string
  updated_at: string
}

/**
 * Save section data for an invitation
 * Upserts (insert or update) section data
 */
export async function saveSectionData(
  invitationId: string,
  sectionKey: string,
  content: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from("invitation_sections")
      .upsert(
        {
          invitation_id: invitationId,
          section_key: sectionKey,
          content,
        },
        {
          onConflict: "invitation_id,section_key",
        }
      )

    if (error) {
      console.error("Error saving section data:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Exception saving section data:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Save multiple sections at once
 */
export async function saveSectionsData(
  invitationId: string,
  sectionsData: Record<string, Record<string, any>>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

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
 * Get all sections for an invitation
 */
export async function getInvitationSections(
  invitationId: string
): Promise<{ success: boolean; data?: InvitationSection[]; error?: string }> {
  try {
    const supabase = createClient()

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
 * Get a specific section for an invitation
 */
export async function getInvitationSection(
  invitationId: string,
  sectionKey: string
): Promise<{ success: boolean; data?: InvitationSection; error?: string }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("invitation_sections")
      .select("*")
      .eq("invitation_id", invitationId)
      .eq("section_key", sectionKey)
      .single()

    if (error) {
      console.error("Error fetching section:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data as InvitationSection }
  } catch (error) {
    console.error("Exception fetching section:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Delete a section
 */
export async function deleteInvitationSection(
  invitationId: string,
  sectionKey: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from("invitation_sections")
      .delete()
      .eq("invitation_id", invitationId)
      .eq("section_key", sectionKey)

    if (error) {
      console.error("Error deleting section:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Exception deleting section:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Convert sections array to structured data object
 */
export function sectionsArrayToObject(
  sections: InvitationSection[]
): Record<string, Record<string, any>> {
  return sections.reduce((acc, section) => {
    acc[section.section_key] = section.content
    return acc
  }, {} as Record<string, Record<string, any>>)
}

/**
 * Prepare sections data for file uploads
 * Extracts File objects and returns URLs after upload
 */
export async function prepareSectionsForUpload(
  sectionsData: Record<string, Record<string, any>>,
  uploadCallback: (file: File, path: string) => Promise<string>
): Promise<Record<string, Record<string, any>>> {
  const prepared: Record<string, Record<string, any>> = {}

  for (const [sectionKey, sectionContent] of Object.entries(sectionsData)) {
    const preparedContent: Record<string, any> = {}

    for (const [key, value] of Object.entries(sectionContent)) {
      // Handle File objects
      if (value instanceof File) {
        const path = `sections/${sectionKey}/${Date.now()}_${value.name}`
        const url = await uploadCallback(value, path)
        preparedContent[key] = url
      }
      // Handle File arrays
      else if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
        const urls = await Promise.all(
          value.map(async (file: File, index: number) => {
            const path = `sections/${sectionKey}/${Date.now()}_${index}_${file.name}`
            return await uploadCallback(file, path)
          })
        )
        preparedContent[key] = urls
      }
      // Regular values
      else {
        preparedContent[key] = value
      }
    }

    prepared[sectionKey] = preparedContent
  }

  return prepared
}

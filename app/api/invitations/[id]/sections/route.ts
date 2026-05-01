import { NextRequest, NextResponse } from "next/server"
import { saveSectionsDataServer, getInvitationSectionsServer } from "@/lib/supabase/server-sections"

/**
 * GET /api/invitations/[id]/sections
 * Fetch all sections for an invitation
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: invitationId } = await params
    console.log(`GET /api/invitations/${invitationId}/sections - Fetching...`)
    const result = await getInvitationSectionsServer(invitationId)

    console.log(`GET /api/invitations/${invitationId}/sections - Result success:`, result.success)
    if (result.success) {
      console.log(`GET /api/invitations/${invitationId}/sections - Found ${result.data?.length || 0} sections`)
    }

    if (!result.success) {
      console.error(`GET /api/invitations/${invitationId}/sections - Error:`, result.error)
      return NextResponse.json(
        { error: result.error || "Failed to fetch sections" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      sections: result.data || [],
    })
  } catch (error) {
    console.error("Error in GET /api/invitations/[id]/sections:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/invitations/[id]/sections
 * Save/update sections for an invitation
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: invitationId } = await params
    const body = await request.json()
    const { sectionsData } = body

    console.log("POST /api/invitations/[id]/sections - Received data:", {
      invitationId,
      sectionsData,
      sectionsCount: Object.keys(sectionsData || {}).length
    })

    if (!sectionsData || typeof sectionsData !== "object") {
      return NextResponse.json(
        { error: "Invalid sections data" },
        { status: 400 }
      )
    }

    const result = await saveSectionsDataServer(invitationId, sectionsData)

    console.log("POST /api/invitations/[id]/sections - Save result:", result)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to save sections" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Sections saved successfully",
    })
  } catch (error) {
    console.error("Error in POST /api/invitations/[id]/sections:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/invitations/[id]/sections
 * Update sections (alias for POST)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return POST(request, { params })
}

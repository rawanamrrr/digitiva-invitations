import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"
import { z } from "zod"

function buildGoogleMapsSearchUrl(venue: string, venueAddress?: string) {
  const query = [venue, venueAddress].filter(Boolean).join(" ").trim()
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || venue)}`
}

const updateSchema = z.object({
  brideName: z.string().min(1).max(100).optional(),
  groomName: z.string().min(1).max(100).optional(),
  eventDate: z.string().optional(),
  eventTime: z.string().min(1).max(50).optional(),
  venue: z.string().min(1).max(200).optional(),
  venueAddress: z.string().optional(),
  venueMapUrl: z.string().url().optional().nullable(),
  templateId: z.string().min(1).optional(),
  coupleImage: z.string().optional().nullable(),
  songUrl: z.string().url().optional().nullable(),
  songType: z.enum(["mp3", "youtube"]).optional(),
  youtubeVideoId: z.string().min(1).max(50).optional(),
  subdomain: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
  paymentStatus: z.enum(["pending", "paid"]).optional(),
  isFinished: z.boolean().optional(),
})

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const isAdmin = (session.user as { role?: string })?.role === "admin"
  if (data.user_id !== (session.user as { id: string }).id && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json(data)
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const supabase = createAdminClient()
  const { data: existing } = await supabase
    .from("invitations")
    .select("user_id")
    .eq("id", id)
    .single()

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const isAdmin = (session.user as { role?: string })?.role === "admin"
  if (existing.user_id !== (session.user as { id: string }).id && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const update: Record<string, unknown> = {}
    if (parsed.data.brideName != null) update.bride_name = parsed.data.brideName
    if (parsed.data.groomName != null) update.groom_name = parsed.data.groomName
    if (parsed.data.eventDate != null) update.event_date = parsed.data.eventDate
    if (parsed.data.eventTime != null) update.event_time = parsed.data.eventTime
    if (parsed.data.venue != null) update.venue = parsed.data.venue
    if (parsed.data.venueAddress != null) update.venue_address = parsed.data.venueAddress
    if (parsed.data.venueMapUrl != null) {
      update.venue_map_url = parsed.data.venueMapUrl
    } else if (parsed.data.venue != null || parsed.data.venueAddress != null) {
      const venue = (parsed.data.venue ?? "").trim()
      if (venue) {
        update.venue_map_url = buildGoogleMapsSearchUrl(venue, parsed.data.venueAddress)
      }
    }
    if (parsed.data.templateId != null) update.template_id = parsed.data.templateId
    if (parsed.data.coupleImage != null) update.couple_image = parsed.data.coupleImage
    if (parsed.data.songType === "youtube" && parsed.data.youtubeVideoId?.trim()) {
      update.song_url = `youtube:${parsed.data.youtubeVideoId.trim()}`
    } else if (parsed.data.songUrl != null) {
      update.song_url = parsed.data.songUrl
    }
    if (parsed.data.subdomain != null) update.subdomain = parsed.data.subdomain
    if (parsed.data.isPublished != null) update.is_published = parsed.data.isPublished
    if (parsed.data.paymentStatus != null) update.payment_status = parsed.data.paymentStatus
    if (parsed.data.isFinished != null) update.is_finished = parsed.data.isFinished

    const { data, error } = await supabase
      .from("invitations")
      .update(update)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error(error)
      return NextResponse.json({ error: "Failed to update" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const supabase = createAdminClient()
  const { data: existing } = await supabase
    .from("invitations")
    .select("user_id")
    .eq("id", id)
    .single()

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const isAdmin = (session.user as { role?: string })?.role === "admin"
  if (existing.user_id !== (session.user as { id: string }).id && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { error } = await supabase.from("invitations").delete().eq("id", id)
  if (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

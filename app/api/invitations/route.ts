import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"
import { generateSlug } from "@/utils/generateSlug"
import { z } from "zod"

function buildGoogleMapsSearchUrl(venue: string, venueAddress?: string) {
  const query = [venue, venueAddress].filter(Boolean).join(" ").trim()
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || venue)}`
}

const createSchema = z.object({
  brideName: z.string().min(1).max(100),
  groomName: z.string().min(1).max(100),
  eventDate: z.string().min(1),
  eventTime: z.string().min(1).max(50),
  venue: z.string().min(1).max(200),
  venueAddress: z.string().optional().nullable(),
  venueMapUrl: z.string().url().optional().or(z.literal("")).nullable(),
  venueMapImage: z.string().url().optional().or(z.literal("")).nullable(),
  templateId: z.string().min(1),
  coupleImage: z.string().optional().nullable(),
  songUrl: z.string().url().optional().or(z.literal("")).nullable(),
  songType: z.enum(["mp3", "youtube"]).optional().nullable(),
  youtubeVideoId: z.string().min(1).max(50).optional().nullable(),
  packageName: z.enum(["standard", "premium", "custom"]),
  sections: z.array(z.string()).optional().nullable(),
  extras: z.array(z.string()).optional().nullable(),
  customThemeColor: z.string().optional().nullable(),
  email: z.string().email().optional().or(z.literal("")).nullable(),
  whatsapp: z.string().optional().nullable(),
  paymentMethod: z.enum(["instapay", "bank"]).optional().nullable(),
  paymentScreenshot: z.string().optional().nullable(),
});

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("user_id", (session.user as { id: string }).id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const slug = generateSlug()
    const supabase = createAdminClient()
    const d = parsed.data

    const venueMapUrl = d.venueMapUrl?.trim()
      ? d.venueMapUrl.trim()
      : buildGoogleMapsSearchUrl(d.venue, d.venueAddress ?? undefined)

    const songUrl = d.songType === "youtube" && d.youtubeVideoId?.trim()
      ? `youtube:${d.youtubeVideoId.trim()}`
      : (d.songUrl?.trim() ? d.songUrl.trim() : null)

    const { data, error } = await supabase
      .from("invitations")
      .insert({
        user_id: (session.user as { id: string }).id,
        bride_name: d.brideName,
        groom_name: d.groomName,
        event_date: d.eventDate,
        event_time: d.eventTime,
        venue: d.venue,
        venue_address: d.venueAddress || null,
        venue_map_url: venueMapUrl || null,
        venue_map_image: d.venueMapImage || null,
        template_id: d.templateId,
        couple_image: d.coupleImage || null,
        song_url: songUrl,
        package_name: d.packageName,
        sections: d.sections?.length ? d.sections : null,
        extras: d.extras?.length ? d.extras : null,
        custom_theme_color: d.customThemeColor || null,
        email: d.email || null,
        whatsapp: d.whatsapp || null,
        payment_method: d.paymentMethod || null,
        payment_screenshot: d.paymentScreenshot || null,
        slug,
        payment_status: "pending",
        is_published: false,
      })
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        return POST(req)
      }
      console.error(error)
      return NextResponse.json({ error: "Failed to create" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

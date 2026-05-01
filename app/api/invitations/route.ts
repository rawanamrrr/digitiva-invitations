import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"
import { generateSlug } from "@/utils/generateSlug"
import { z } from "zod"
import { isSiteCurrency } from "@/lib/site-currencies"
import { sendOrderNotification } from "@/lib/email"


function buildGoogleMapsSearchUrl(venue: string, venueAddress?: string) {
  const query = [venue, venueAddress].filter(Boolean).join(" ").trim()
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || venue)}`
}

const createSchema = z.object({
  brideName: z.string().min(1).max(100),
  groomName: z.string().min(1).max(100),
  eventType: z.string().optional().nullable(),
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
  paymentMethod: z.enum(["instapay", "bank", "vodafone_cash"]).optional().nullable(),
  paymentScreenshot: z.string().optional().nullable(),
  orderCurrency: z
    .string()
    .refine((v) => isSiteCurrency(v), { message: "Invalid order currency" }),
  orderTotal: z.number().finite().nonnegative().optional(),
  discountCode: z.string().optional().nullable(),
  discountPercentage: z.number().optional().nullable(),
  backgroundImage: z.string().optional().nullable(),
  smallInvitationImage: z.string().optional().nullable(),
  personalImages: z.array(z.string()).optional().nullable(),
  colorPaletteText: z.string().optional().nullable(),
  colorPaletteImage: z.string().optional().nullable(),
});

// Pre-computed bcrypt hash for guest user — avoids expensive bcrypt.hash() on every request
// This is safe because the guest user is an internal dummy account, never used for login.
const GUEST_PASSWORD_HASH = "$2a$04$N9qo8uLOickgx2ZMRZoMye.TS7ABjObkXBqWKyLAIuML07Gc6Oi.W"

async function getOrCreateGuestUserId(supabase: ReturnType<typeof createAdminClient>) {
  const email = "guest@digitiva.local"

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single()

  if (existing?.id) return existing.id as string

  const { data: created, error } = await supabase
    .from("users")
    .insert({ name: "Guest", email, password_hash: GUEST_PASSWORD_HASH, role: "user" })
    .select("id")
    .single()

  if (!error && created?.id) return created.id as string

  // Race condition: another request may have created it in parallel
  const { data: existingAfter } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single()

  if (!existingAfter?.id) {
    throw new Error("Failed to create guest user")
  }

  return existingAfter.id as string
}

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
  try {
    const session = await auth()
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

    const userId = session?.user?.id
      ? ((session.user as { id: string }).id as string)
      : await getOrCreateGuestUserId(supabase)

    const venueMapUrl = d.venueMapUrl?.trim()
      ? d.venueMapUrl.trim()
      : buildGoogleMapsSearchUrl(d.venue, d.venueAddress ?? undefined)

    const songUrl = d.songType === "youtube" && d.youtubeVideoId?.trim()
      ? `youtube:${d.youtubeVideoId.trim()}`
      : (d.songUrl?.trim() ? d.songUrl.trim() : null)

    const { data, error } = await supabase
      .from("invitations")
      .insert({
        user_id: userId,
        bride_name: d.brideName,
        groom_name: d.groomName,
        event_type: d.eventType || null,
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
        order_currency: d.orderCurrency,
        order_total: d.orderTotal ?? null,
        discount_code: d.discountCode || null,
        discount_percentage: d.discountPercentage || null,
        background_image: d.backgroundImage || null,
        small_invitation_image: d.smallInvitationImage || null,
        personal_images: d.personalImages || null,
        color_palette_text: d.colorPaletteText || null,
        color_palette_image: d.colorPaletteImage || null,
        slug,
        payment_status: "pending",
        is_published: false,
      })
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        // Retry with a new slug manually instead of recursive call
        const retrySlug = generateSlug()
        const { data: retryData, error: retryError } = await supabase
          .from("invitations")
          .insert({
            user_id: userId,
            bride_name: d.brideName,
            groom_name: d.groomName,
            event_type: d.eventType || null,
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
            order_currency: d.orderCurrency,
            order_total: d.orderTotal ?? null,
            discount_code: d.discountCode || null,
            discount_percentage: d.discountPercentage || null,
            background_image: d.backgroundImage || null,
            small_invitation_image: d.smallInvitationImage || null,
            personal_images: d.personalImages || null,
            color_palette_text: d.colorPaletteText || null,
            color_palette_image: d.colorPaletteImage || null,
            slug: retrySlug,
            payment_status: "pending",
            is_published: false,
          })
          .select()
          .single()

        if (retryError) {
          console.error("Retry insert error:", retryError)
          return NextResponse.json({ error: "Failed to create after retry" }, { status: 500 })
        }
        return NextResponse.json(retryData)
      }
      console.error("Insert error:", error)
      return NextResponse.json({ error: "Failed to create" }, { status: 500 })
    }

    if (d.discountCode) {
      // Increment usages asynchronously
      const dCode = d.discountCode as string;
      supabase.from("discount_codes").select("current_uses").ilike("code", dCode).single().then(({ data: dc }) => {
        if (dc) {
          supabase.from("discount_codes").update({ current_uses: dc.current_uses + 1 }).ilike("code", dCode).then();
        }
      });
    }

    // Send admin notification email (fire-and-forget, don't block response)
    sendOrderNotification({
      brideName: d.brideName,
      groomName: d.groomName,
      eventType: d.eventType,
      eventDate: d.eventDate,
      eventTime: d.eventTime,
      venue: d.venue,
      packageName: d.packageName,
      sections: d.sections,
      extras: d.extras,
      email: d.email,
      whatsapp: d.whatsapp,
      paymentMethod: d.paymentMethod,
      orderCurrency: d.orderCurrency,
      orderTotal: d.orderTotal,
      discountCode: d.discountCode,
      discountPercentage: d.discountPercentage,
    })

    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

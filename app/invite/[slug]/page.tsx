import { notFound } from "next/navigation"
import { Metadata } from "next"
import { createAdminClient } from "@/lib/supabase/server"
import { InviteClient } from "./invite-client"

type Props = {
  params: Promise<{ slug: string }>
}

async function getInvitation(slug: string, incrementView = false) {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from("invitations")
    .select("*")
    .eq("slug", slug)
    .single()
  if (!data || !data.is_published || data.payment_status !== "paid") return null

  if (incrementView) {
    await supabase
      .from("invitations")
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq("id", data.id)
  }

  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const inv = await getInvitation(slug, false)
  if (!inv) return { title: "Invitation Not Found" }

  return {
    title: `${inv.bride_name} & ${inv.groom_name} | Wedding Invitation`,
    description: `Join ${inv.bride_name} and ${inv.groom_name} on ${inv.event_date} at ${inv.venue}`,
    openGraph: {
      title: `${inv.bride_name} & ${inv.groom_name}`,
      description: `Wedding Invitation - ${inv.event_date} at ${inv.venue}`,
      images: inv.couple_image ? [inv.couple_image] : [],
    },
  }
}

export default async function InvitePage({ params }: Props) {
  const { slug } = await params
  const inv = await getInvitation(slug, true)
  if (!inv) notFound()

  return <InviteClient invitation={inv} slug={slug} />
}

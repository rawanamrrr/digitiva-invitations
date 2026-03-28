import { notFound } from "next/navigation"
import { Metadata } from "next"
import { cookies } from "next/headers"
import { createAdminClient } from "@/lib/supabase/server"
import {
  DEFAULT_LOCALE,
  SITE_LOCALE_COOKIE,
  isSiteLocale,
  type SiteLocale,
} from "@/lib/site-locales"
import { siteT } from "@/lib/site-translations"
import { InviteClient } from "./invite-client"

async function requestLocale(): Promise<SiteLocale> {
  const jar = await cookies()
  const raw = jar.get(SITE_LOCALE_COOKIE)?.value
  if (raw && isSiteLocale(raw)) return raw
  return DEFAULT_LOCALE
}

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
  const locale = await requestLocale()
  const inv = await getInvitation(slug, false)
  if (!inv) {
    return { title: siteT(locale, "invite.meta.notFoundTitle") }
  }

  const bride = String(inv.bride_name ?? "")
  const groom = String(inv.groom_name ?? "")
  const date = String(inv.event_date ?? "")
  const venue = String(inv.venue ?? "")

  const title = siteT(locale, "invite.meta.title")
    .replace("{bride}", bride)
    .replace("{groom}", groom)
  const description = siteT(locale, "invite.meta.description")
    .replace("{bride}", bride)
    .replace("{groom}", groom)
    .replace("{date}", date)
    .replace("{venue}", venue)
  const ogDescription = siteT(locale, "invite.meta.ogDescription")
    .replace("{date}", date)
    .replace("{venue}", venue)

  return {
    title,
    description,
    openGraph: {
      title: `${bride} & ${groom}`,
      description: ogDescription,
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

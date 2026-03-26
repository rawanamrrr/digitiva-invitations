import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (!data.is_published || data.payment_status !== "paid") {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await supabase
    .from("invitations")
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq("id", data.id)

  return NextResponse.json(data)
}

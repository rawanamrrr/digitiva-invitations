import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"
import { isSiteCurrency } from "@/lib/site-currencies"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { invitationId, orderCurrency } = await req.json()
  if (!invitationId) {
    return NextResponse.json(
      { error: "invitationId required" },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()
  const { data: inv } = await supabase
    .from("invitations")
    .select("id, user_id")
    .eq("id", invitationId)
    .single()

  if (!inv || inv.user_id !== (session.user as { id: string }).id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const updatePayload: Record<string, unknown> = {
    payment_status: "paid",
    is_published: true,
  }
  if (typeof orderCurrency === "string" && isSiteCurrency(orderCurrency)) {
    updatePayload.order_currency = orderCurrency
  }

  const { data, error } = await supabase
    .from("invitations")
    .update(updatePayload)
    .eq("id", invitationId)
    .select()
    .single()

  if (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to complete" }, { status: 500 })
  }

  return NextResponse.json(data)
}

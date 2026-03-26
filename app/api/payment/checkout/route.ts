import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { invitationId } = await req.json()
  if (!invitationId) {
    return NextResponse.json(
      { error: "invitationId required" },
      { status: 400 }
    )
  }

  return NextResponse.json({
    checkoutUrl: `/payment/checkout?invitationId=${invitationId}`,
    message: "UI-only payment - redirect to checkout",
  })
}

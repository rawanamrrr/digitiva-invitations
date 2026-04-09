import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get("code")

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data: discountCode, error } = await supabase
      .from("discount_codes")
      .select("*")
      .ilike("code", code)
      .single()

    if (error || !discountCode) {
      return NextResponse.json({ error: "Invalid discount code" }, { status: 404 })
    }

    if (!discountCode.active) {
      return NextResponse.json({ error: "This discount code is inactive" }, { status: 400 })
    }

    if (discountCode.max_uses !== null && discountCode.current_uses >= discountCode.max_uses) {
      return NextResponse.json({ error: "This discount code has reached its usage limit" }, { status: 400 })
    }

    return NextResponse.json({
      valid: true,
      code: discountCode.code,
      percentage: Number(discountCode.percentage)
    })
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

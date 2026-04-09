import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id || (session.user as any).role !== "admin") {
    // Note: Assuming a way to check if user is admin. The easiest is session.user.role if it's there.
    // Else, we must fetch the user from the DB to check role.
    const supabase = createAdminClient()
    const { data: user } = await supabase
      .from("users")
      .select("role")
      .eq("id", session?.user?.id || "")
      .single()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("discount_codes")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: "Failed to fetch discount codes" }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createAdminClient()
    const { data: user } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { code, percentage, maxUses } = body

    if (!code || !percentage || percentage <= 0 || percentage > 100) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("discount_codes")
      .insert({
        code: code.toUpperCase().trim(),
        percentage: Number(percentage),
        max_uses: maxUses ? Number(maxUses) : null,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: "Code already exists" }, { status: 400 })
      }
      return NextResponse.json({ error: "Failed to create discount code" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

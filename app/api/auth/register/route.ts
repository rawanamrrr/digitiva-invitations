import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { createAdminClient } from "@/lib/supabase/server"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, password } = parsed.data
    const supabase = createAdminClient()

    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      )
    }

    const password_hash = await bcrypt.hash(password, 12)
    const { data: user, error } = await supabase
      .from("users")
      .insert({ name, email, password_hash, role: "user" })
      .select("id, name, email, role")
      .single()

    if (error) {
      console.error("Register error:", error)
      return NextResponse.json({ error: "Registration failed" }, { status: 500 })
    }

    return NextResponse.json({ user })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

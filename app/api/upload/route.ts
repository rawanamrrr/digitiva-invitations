import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

const BUCKET = "uploads"

export async function POST(req: Request) {
  try {
    const { filename, contentType } = await req.json()
    if (!filename) {
      return NextResponse.json(
        { error: "No filename provided" },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Generate a unique filename
    const ext = filename.split(".").pop() || "png"
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const filePath = `public/${fileName}`

    // Create a signed upload URL (valid for 60 seconds)
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUploadUrl(filePath)

    if (error) {
      console.error("Signed URL error:", error)
      return NextResponse.json({ error: "Failed to create upload URL" }, { status: 500 })
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath)

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: filePath,
      url: urlData.publicUrl,
      message: "Signed URL generated",
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Upload preparation failed" }, { status: 500 })
  }
}

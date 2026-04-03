import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

const BUCKET = "uploads"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Ensure bucket exists (no-op if already created)
    await supabase.storage.createBucket(BUCKET, { public: true }).catch(() => {})

    // Generate a unique filename
    const ext = file.name.split(".").pop() || "png"
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const filePath = `public/${fileName}`

    const bytes = await file.arrayBuffer()
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, bytes, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error("Storage upload error:", error)
      return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath)

    return NextResponse.json({
      url: urlData.publicUrl,
      message: "Upload successful",
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

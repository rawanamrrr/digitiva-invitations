import { NextRequest, NextResponse } from "next/server"
import ytdl from "@distube/ytdl-core"

export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get("videoId")

  if (!videoId) {
    return NextResponse.json({ error: "Missing videoId parameter" }, { status: 400 })
  }

  // Validate videoId format (11 characters, alphanumeric)
  if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return NextResponse.json({ error: "Invalid videoId format" }, { status: 400 })
  }

  try {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`
    
    // Check if video is accessible
    if (!ytdl.validateURL(videoUrl)) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 })
    }

    // Get audio info with options to work around parsing issues
    const info = await ytdl.getInfo(videoUrl, {
      playerClients: ['WEB_EMBEDDED'],
    })
    
    // Find the best audio format
    const audioFormat = ytdl.chooseFormat(info.formats, { 
      quality: "highestaudio",
      filter: "audioonly"
    })

    if (!audioFormat) {
      return NextResponse.json({ error: "No audio format available" }, { status: 404 })
    }

    // Get title safely
    const title = info.videoDetails?.title ?? "Unknown"

    // Return the audio stream URL
    return NextResponse.json({
      videoId,
      title,
      audioUrl: audioFormat.url,
      mimeType: audioFormat.mimeType,
      bitrate: audioFormat.bitrate,
    })

  } catch (error) {
    console.error("YouTube audio extraction error:", error)
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes("Video unavailable")) {
        return NextResponse.json({ error: "Video unavailable or private" }, { status: 404 })
      }
      if (error.message.includes("copyright")) {
        return NextResponse.json({ error: "Video blocked due to copyright" }, { status: 403 })
      }
      if (error.message.includes("age-restricted")) {
        return NextResponse.json({ error: "Age-restricted video" }, { status: 403 })
      }
      if (error.message.includes("parse") || error.message.includes("decipher")) {
        return NextResponse.json({ error: "YouTube parsing failed. Try a different video or use MP3 instead." }, { status: 500 })
      }
    }
    
    return NextResponse.json({ error: "Failed to extract audio" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"

type YouTubeSearchItem = {
  videoId: string
  title: string
  channelTitle: string
  thumbnailUrl?: string
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get("q") || "").trim()

  if (!q) {
    return NextResponse.json({ items: [] })
  }

  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing YOUTUBE_API_KEY" },
      { status: 500 },
    )
  }

  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/search")
    url.searchParams.set("part", "snippet")
    url.searchParams.set("q", q)
    url.searchParams.set("key", apiKey)
    url.searchParams.set("type", "video")
    url.searchParams.set("maxResults", "8")
    url.searchParams.set("safeSearch", "moderate")
    url.searchParams.set("regionCode", "US")

    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        "Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "Accept": "application/json"
      }
    })
    const data = await res.json()

    if (!res.ok) {
      console.error("YouTube API error", {
        status: res.status,
        statusText: res.statusText,
        error: data?.error,
      })
      return NextResponse.json(
        {
          error: data?.error?.message || "YouTube API error",
          details: data?.error || null,
        },
        { status: res.status },
      )
    }

    const items: YouTubeSearchItem[] = Array.isArray(data?.items)
      ? data.items
          .map((it: any) => {
            const videoId = it?.id?.videoId
            const title = it?.snippet?.title
            const channelTitle = it?.snippet?.channelTitle
            const thumbnailUrl =
              it?.snippet?.thumbnails?.medium?.url ||
              it?.snippet?.thumbnails?.default?.url

            if (!videoId || !title || !channelTitle) return null

            return {
              videoId,
              title,
              channelTitle,
              thumbnailUrl,
            }
          })
          .filter(Boolean)
      : []

    return NextResponse.json({ items })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
